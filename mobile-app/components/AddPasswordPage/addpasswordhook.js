import React, { useState } from "react";
import { passwordService } from "../../services/PasswordService/PasswordService";
import { toastService } from "../../services/ToastService/ToastService";
import { storageService } from "../../services/StorageService/StorageService";
import AddPasswordPage from "./addpasswordpage";

const useAddPasswordHook = ({accountList, onAdd, onSearch, navigation})=> {
    const [accountName, setAccountName] = useState("");
    const [secret, setSecret] = useState("");

    const addAccount = ()=> {
        passwordService.addAccount(accountName, secret)
        .then((result) => {
        if (result.status == "SUCCESS") {
            toastService.success("Account " + accountName + " added!");
            navigation.goBack();
        } else if (result.status == "UNAUTHORIZED") {
            toastService.error("Unauthorized! please log again");
            storageService.remove("jwt_token");
            navigation.replace("Login");
        } else {
            toastService.error(result.message);
            console.log("Error: " + JSON.stringify(result.message));
        }
        }).catch(error => {
            toastService.error("There was an error while creating " + accountName + " account");
            console.log("Error: " + error);
        });
    }

    return {setAccountName, setSecret, addAccount};
}

export default useAddPasswordHook;