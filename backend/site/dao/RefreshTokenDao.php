<?php

class RefreshTokenDao {
	function put($session_id, $refresh_token) {
        $connection = getConnection();
        $stmt = $connection -> prepare("INSERT INTO `refresh_token_ids` VALUES (?, ?);");
        $stmt -> bind_param("ss", $session_id, $refresh_token);
        $result = $stmt -> execute();

        $stmt -> close();
        $connection -> close();
        
        if ($result) {
            return true;
        }
        return false;
    }

    function refreshTokenIdExist($refresh_token) {
        $connection = getConnection();
        $stmt = $connection -> prepare("SELECT * FROM `refresh_token_ids` WHERE refresh_token = ?;");
        $stmt -> bind_param("s", $refresh_token);
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

    function deleteByRefreshTokenId($refresh_token) {
        $connection = getConnection();
        $stmt = $connection -> prepare("DELETE FROM `refresh_token_ids` WHERE refresh_token = ?;");
        $stmt -> bind_param("s", $refresh_token);
        $result = $stmt -> execute();    
        
        $stmt -> close();
        $connection -> close();
        
        if ($result) {
            return true;
        }
        return false;
    }

    function deleteBySessionId($session_id) {
        $connection = getConnection();
        $stmt = $connection -> prepare("DELETE FROM `refresh_token_ids` WHERE session_id = ?;");
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