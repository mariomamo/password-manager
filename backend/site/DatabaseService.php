<?php
include_once("config.php");

function getConnection() {
    $host = getDbHost();
    $user = getDbUser();
    $password = getDbPassword();
    $database = getDbName();

    $conn = new mysqli($host, $user, $password, $database) or die ("Error while connecting to db server");

    return $conn;
}

?>
