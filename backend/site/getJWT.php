<?php
  include_once("DatabaseService.php");
  include_once("security.php");
  include_once("JwtService.php");
  include_once("cors.php");

  if ('GET' != $_SERVER['REQUEST_METHOD'] && 'POST' != $_SERVER['REQUEST_METHOD'] ) {
    header('Allow: GET, POST');
    header('HTTP/1.1 405 Method Not Allowed');
    header('Content-Type: text/plain');
    echo "only allow get and post";
    exit;
  }

  header('Content-Type: application/json'); 
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Methods: GET, POST');
  header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
  
  $jwtService = new JwtService();
  $data = json_decode(file_get_contents('php://input'), true);
  
  if (isset($_SERVER['PHP_AUTH_PW']) && CheckCredentials($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) {
    //If we get here, username was provided. Check password.
  	echo $jwtService -> create_new_session($_SERVER['PHP_AUTH_USER']);
  } else if ($data && isset($data["refresh_token"])) {
    echo refresh_token($jwtService, $data);
  } else {
      unauthorized(403);
  }

  function create_new_token() {

  }

  function refresh_token($jwtService, $data) {
    try {
      return $jwtService -> refresh_jwt($data["refresh_token"]);
    } catch(Exception $e) {
      unauthorized(401);
    }
  }

  function unauthorized($code) {
    header('WWW-Authenticate: Basic realm="mariooffertucci"');
    header('HTTP/1.0 ' . $code . ' Unauthorized');
    exit;
  }


?>