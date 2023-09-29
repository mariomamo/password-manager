import { useEffect, useState } from 'react';
import { passwordService } from '../../services/PasswordService/PasswordService';
import FingerprintScanner from 'react-native-fingerprint-scanner';

const useLoginPageHook = ({route, navigation})=> {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        (async function checkJwtToken() {
            if (route.params && route.params.isLogout) {
                await passwordService.logOut();
                navigation.replace("Login");
            } else if (await passwordService.isLogged()) {
                //TODO: Auth service
                FingerprintScanner.authenticate({description: "Authentication required"})
                .then(() => navigation.replace("Home"))
                .error(error => console.log("FINGERPRINT ERROR: " + error));
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