<?php
#include_once("DatabaseService.php");

class ActiveSessionDao {
    function put($session_id, $username) {
        $connection = getConnection();
        $stmt = $connection -> prepare("INSERT INTO `active_sessions` VALUES (?, ?);");
        $stmt -> bind_param("ss", $session_id, $username);
        $result = $stmt -> execute();

        $stmt -> close();
        $connection -> close();
        
        if ($result) {
            return true;
        }
        return false;
    }

    function get($session_id, $username) {
        $connection = getConnection();
        $stmt = $connection -> prepare("SELECT * FROM `active_sessions` WHERE session_id = ? AND username = ?;");
        $stmt -> bind_param("ss", $session_id, $username);
        $stmt -> execute();
        
        $result = $stmt -> get_result();
        
        $stmt -> close();
        $connection -> close();

        if ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
            return true;
        } else {
            return false;
        }
    }

    function delete($session_id) {
        $connection = getConnection();
        $stmt = $connection -> prepare("DELETE FROM `active_sessions` WHERE session_id = ?;");
        $stmt -> bind_param("s", $session_id);
        $result = $stmt -> execute();    
        
        $stmt -> close();
        $connection -> close();
        
        if ($result) {
            return true;
        }
        return false;
    }
}

?>