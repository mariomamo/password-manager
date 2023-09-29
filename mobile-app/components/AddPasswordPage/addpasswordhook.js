import { useState } from "react";
import { passwordService } from "../../services/PasswordService/PasswordService";
import { toastService } from "../../services/ToastService/ToastService";
import { UnauthorizedException } from "../../exceptions/UnauthorizedException";

const useAddPasswordHook = ({navigation})=> {
    const [accountName, setAccountName] = useState("");
    const [secret, setSecret] = useState("");

    const addAccount = ()=> {
        passwordService.addAccount(accountName, secret)
        .then((result) => {
        if (result.status == "SUCCESS") {
            toastService.success("Account " + accountName + " added!");
            navigation.goBack();
        } else {
            toastService.error(result.message);
            console.log("Error: " + JSON.stringify(result.message));
        }
        }).catch(error => {
            if (error instanceof UnauthorizedException) {
                toastService.error("Unauthorized! please log again");
                navigation.replace("Login");
            } else {
                toastService.error("There was an error while creating " + accountName + " account");
                console.log("Error: " + error);
            }
        })
    }

    return {setAccountName, setSecret, addAccount};
}

export default useAddPasswordHook;