import React, { useEffect, useState } from 'react';
import { passwordService } from '../../services/PasswordService/PasswordService';
import { storageService } from '../../services/StorageService/StorageService';

const useLoignPageHook = ({navigation})=> {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // TODO: Loader
        (async function checkJwtToken() {
            const jwt_token = await storageService.get("jwt_token");
            if (jwt_token) {
                passwordService.setToken(jwt_token);
                navigation.replace("Home");
            }
          })();
    }, [])

    const login = ()=> {
        try {
            passwordService.generateToken(username, password)
            .then(async (data) => {
                if (data.status != "UNAUTHORIZED") {
                    setUsername("");
                    setPassword("");
                    await storageService.set("jwt_token", data.data);
                    navigation.replace("Home");
                } else {
                    // message.error("Wrong credentials, retry", 2);
                    console.log("Wrong credentials, retry");
                    setUsername("");
                    setPassword("");
                }
            })
        } catch(error) {
            console.log("Error. " + error);
        }
    }

    return {setUsername, setPassword, login};
}

export default useLoignPageHook;