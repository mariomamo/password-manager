import React from "react";
import { passwordService } from '../../services/PasswordService/PasswordService';
import { Popconfirm, message } from 'antd';

const useListItemHook = ({onDelete, accountName})=> {
    const removeAccount = () => {
        onDelete(accountName);
    }

    const copyPassword = () => {
        passwordService.getDecryptedPassword(accountName)
        .then(decryptedPassword => {
            window.Neutralino.clipboard.writeText(decryptedPassword)
            .then(() => {
                message.success('Password for ' + accountName + ' copied to clipboard!', 1);
            })
            .catch(err => {
                message.error('Error while copying password for ' + accountName + ' to clipboard!', 1);
                console.log("ERROR: ", err);
            })
        })
        .catch(err => {
            message.error("Error while copying password in clipboard", 1);
            console.log("ERROR: ", err);
        });
    }

    const editAccount = (oldName, newName) => {
        passwordService.edit(oldName, newName).then(() => message.success('Password for ' + accountName + ' edited!', 1));
    }

    return {removeAccount, copyPassword, editAccount};
}

export default useListItemHook;