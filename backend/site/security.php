<?php

function searchApiToken($token) {
    $connessione = getConnection();
    $stmt = $connessione -> prepare("SELECT * FROM `user` WHERE token = ?;");
    $stmt -> bind_param("s", $token);
    $stmt -> execute();

    $result = $stmt -> get_result();
    $utente = null;

    if ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
      $utente -> name = $row['name'];
      $utente -> surname = $row['surname'];
      $utente -> username = $row['username'];
    }

    $stmt -> close();
    $connessione -> close();
    if ($utente != null)
      return json_encode($utente);
    return null;
}

function CheckCredentials($username, $password) {
    $connessione = getConnection();
    $stmt = $connessione -> prepare("SELECT * FROM `user` WHERE username = ? and password = MD5(?);");
    $stmt -> bind_param("ss", $username, $password);
    $stmt -> execute();

    $result = $stmt -> get_result();
    $stmt -> close();
    $connessione -> close();
    
    if (mysqli_num_rows($result) == 1) {
    	return true;
    }
    return false;
}

function getHeader($header) {
  foreach (getallheaders() as $name => $value) {
  	if (strtolower($name) == strtolower($header))
      return $value;
  }
}

function getAuthorizationHeader() {
	return substr(getHeader("Authorization"), 7);
}
?>