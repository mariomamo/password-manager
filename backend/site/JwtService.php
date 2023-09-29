<?php
include_once("config.php");
include_once("dao/ActiveSessionDao.php");
include_once("dao/RefreshTokenDao.php");

class JwtService {
    private $activeSessionDao;
    private $refreshTokenDao;

    function __construct() {
        $this -> activeSessionDao = new ActiveSessionDao();
        $this -> refreshTokenDao = new RefreshTokenDao();
    }

    function create_new_session($username) {
        $session_id = $this -> generateUUIDv4();
        $this -> activeSessionDao -> put($session_id, $username);
        return $this -> create_jwt_and_refresh_token($username, $session_id);
    }

    function refresh_jwt($refresh_token) {
        $session_id = $this -> get_session_id_from_refresh_token($refresh_token);
        $refresh_token_id = $this -> get_refresh_token_id_from_refresh_token($refresh_token);
        $username = $this -> get_username_from_refresh_token($refresh_token);
        if ($this -> is_jwt_sign_and_exp_valid($refresh_token) && $this -> refreshTokenDao -> refreshTokenIdExist($refresh_token_id)) {
            $this -> refreshTokenDao -> deleteByRefreshTokenId($refresh_token_id);
            return $this -> create_jwt_and_refresh_token($username, $session_id);
        } else {
            $this -> activeSessionDao -> delete($session_id);
        }
        throw new Exception('Unauthorized');
    }

    function is_jwt_valid($jwt) {
        return $this -> is_jwt_sign_and_exp_valid($jwt) && !$this -> is_refresh_token($jwt);
    }

    function getPayload($token) {
        $tokenParts = explode('.', $token);
        return json_decode($this -> base64url_decode($tokenParts[1]), true);
    }

    private function is_jwt_sign_and_exp_valid($jwt) {
        $tokenParts = explode('.', $jwt);
        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signature = $this -> base64url_decode($tokenParts[2]);
        
        $valid = openssl_verify($header.".".$payload, $signature, getPublicKey(), OPENSSL_ALGO_SHA512);
        if ($valid) {
            $p = json_decode($this -> base64url_decode($payload), true);
            if (time() > $p["exp"]) {
                return false;
            }
        }
         if ($valid == 0) {
            // echo "error: ".openssl_error_string();
        }
        return $valid;
    }

    private function is_refresh_token($jwt) {
        $payload = $this -> getPayload($jwt);
        return isset($payload["refresh_token_id"]) ? true : false;
    }

    private function create_jwt_and_refresh_token($username, $session_id) {
        $jwt_token = $this -> generate_jwt($username, $session_id);
        $refresh_token = $this -> generate_refresh_token($username, $session_id);
        return json_encode(["token" => $jwt_token, "refresh_token" => $refresh_token]);
    }

    private function generate_jwt($username, $session_id) {
        $tenMinute = time() + 60*10;
        $jwt_body = json_encode(["user" => $username, "exp" => $tenMinute, "session_id" => $session_id]);
        return $this -> craft_jwt_token($username, $jwt_body);
    }

    private function generate_refresh_token($username, $session_id) {
        $refresh_token_id = $this -> generateUUIDv4();
        $oneMonth = (60*60*24)*30;
        $refresh_token_body = json_encode(["user" => $username, "exp" => time() + $oneMonth, "session_id" => $session_id, "refresh_token_id" => $refresh_token_id]);
        $refresh_token = $this -> craft_jwt_token($username, $refresh_token_body);
        $this -> refreshTokenDao -> put($session_id, $refresh_token_id);
        return $refresh_token;
    }

    private function base64url_encode($data) { 
    	return rtrim(strtr(base64_encode($data), '+/', '-_'), '='); 
    }

    private function base64url_decode($data) {
    	return base64_decode(strtr($data, '-_', '+/'));
    }

    private function craft_jwt_token($username, $body) {
        //Google's Documentation of Creating a JWT: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests
        $jwtHeader = $this -> base64url_encode(json_encode(array("alg" => "RS512", "typ" => "JWT")));
        $jwtBody = $this -> base64url_encode($body);
        openssl_sign($jwtHeader.".".$jwtBody, $jwtSig, getPrivateKey(), OPENSSL_ALGO_SHA512);
        $jwtSign = $this -> base64url_encode($jwtSig);
        return $jwtHeader.".".$jwtBody.".".$jwtSign;
    }

    private function get_session_id_from_refresh_token($refresh_token) {
        $payload = $this -> getPayload($refresh_token);
        if (isset($payload["session_id"])) {
            return $payload["session_id"];
        }
        throw new Exception('Unauthorized');
    }

    private function get_refresh_token_id_from_refresh_token($refresh_token) {
        $payload = $this -> getPayload($refresh_token);
        if (isset($payload["refresh_token_id"])) {
            return $payload["refresh_token_id"];
        }
        throw new Exception('Unauthorized');
    }

    private function get_username_from_refresh_token($refresh_token) {
        $payload = $this -> getPayload($refresh_token);
        if (isset($payload["user"])) {
            return $payload["user"];
        }
        throw new Exception('Unauthorized');
    }

    private function generateUUIDv4() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
          // 32 bits for the time_low
          mt_rand(0, 0xffff), mt_rand(0, 0xffff),
          // 16 bits for the time_mid
          mt_rand(0, 0xffff),
          // 16 bits for the time_hi,
          mt_rand(0, 0x0fff) | 0x4000,

          // 8 bits and 16 bits for the clk_seq_hi_res,
          // 8 bits for the clk_seq_low,
          mt_rand(0, 0x3fff) | 0x8000,
          // 48 bits for the node
          mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}

?>
