<?php
    include_once("../security.php");
    include_once("../JwtService.php");
    include_once("database.php");
    include_once("../DatabaseService.php");
    include_once("../cors.php");

    if ( 'POST' != $_SERVER['REQUEST_METHOD'] ) {
      header('Allow: POST');
      header('HTTP/1.1 405 Method Not Allowed');
      header('Content-Type: text/plain');
      echo "only allow get";
      exit;
    }

    header('Content-Type: application/json'); 
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $jwtService = new JwtService();
    $jwt = getAuthorizationHeader("Authorization");

    if ($jwtService -> is_jwt_valid($jwt) == 0) {
    	header("HTTP/1.1 401 Unauthorized");
        return;
    }

    $payload = $jwtService -> getPayload($jwt);

    $data = json_decode(file_get_contents('php://input'), true);
    $secret = getCredential($payload["user"], $data["name"]);
    if ($secret != -1) {
    	header("HTTP/1.1 200 OK");
        echo $secret;
    } else {
    	header('HTTP/1.0 404 Not Found');
    }
?>