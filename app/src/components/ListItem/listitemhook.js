import React from "react";
import { passwordService } from '../../services/PasswordService.js';
import { Popconfirm, message } from 'antd';

const useListItemHook = ({onDelete, accountName})=> {
    const removeAccount = () => {
        onDelete(accountName);
    }

    const copyPassword = () => {
        passwordService.getPassword(accountName)
        .then(decryptedPassword => {
            window.Neutralino.clipboard.writeText(decryptedPassword);
            message.success('Password for ' + accountName + ' copied to clipboard!', 1)
        })
        .catch(err => console.log("ERROR: ", err));
    }

    const editAccount = (oldName, newName) => {
        passwordService.edit(oldName, newName).then(() => message.success('Password for ' + accountName + ' edited!', 1));
    }

    return {removeAccount, copyPassword, editAccount};
}

export default useListItemHook;