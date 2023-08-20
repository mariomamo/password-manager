<?php

function putCredential($username, $name, $secret) {
    try {
        $connessione = getConnection();
        $stmt = $connessione -> prepare("INSERT INTO `credential` VALUES (?, ?, ?);");
        $stmt -> bind_param("sss", $username, $name, $secret);
        $result = $stmt -> execute();

        $stmt -> close();
        $connessione -> close();
        
        if ($result) {
            return true;
        } else {
            return false;
        }
    } catch (Exception $ex) {
        return false;
    }
}

function getCredential($username, $name) {
	$connessione = getConnection();
    $stmt = $connessione -> prepare("SELECT * FROM `credential` WHERE username = ? AND name = ?;");
    $stmt -> bind_param("ss", $username, $name);
    $stmt -> execute();
    
    $result = $stmt -> get_result();
    
    $stmt -> close();
    $connessione -> close();
    
    if ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
    	return $row['secret'];
    } else {
        return true;
    }
}

function getCredentialsList($username) {
	$connessione = getConnection();
    $stmt = $connessione -> prepare("SELECT * FROM `credential` WHERE username = ?;");
    $stmt -> bind_param("s", $username);
    $stmt -> execute();    
    $result = $stmt -> get_result();
    
    $credentials = array();
    
    $stmt -> close();
    $connessione -> close();
    
    while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
    	array_push($credentials, $row["name"]);
    }

    return $credentials;
}

function getAllCredentials($username) {
	$connessione = getConnection();
    $stmt = $connessione -> prepare("SELECT name, secret FROM `credential` WHERE username = ?;");
    $stmt -> bind_param("s", $username);
    $stmt -> execute();    
    $result = $stmt -> get_result();
    
    $credentials = array();
    
    $stmt -> close();
    $connessione -> close();
    
    while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
    	array_push($credentials, $row);
    }
    
    return $credentials;
}

function deleteCredential($username, $name) {
	$connessione = getConnection();
    $stmt = $connessione -> prepare("DELETE FROM `credential` WHERE username = ? AND name = ?;");
    $stmt -> bind_param("ss", $username, $name);
    $result = $stmt -> execute();

    $stmt -> close();
    $connessione -> close();
    
    return $result;
}

?>