import React, { useEffect, useState } from 'react';
import { passwordService } from '../../services/PasswordService/PasswordService';
import { storageService } from '../../services/StorageService/StorageService';

const useLoginPageHook = ({route, navigation})=> {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // TODO: Loader + demanda il controllo al RemotePasswordService
        (async function checkJwtToken() {
            if (route.params && route.params.isLogout) {
                passwordService.logOut();
                navigation.replace("Login");
            } else if (await passwordService.isLogged()) {
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
                    //TODO: Use constants
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

export default useLoginPageHook;