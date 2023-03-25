import { passwordService } from '../../services/PasswordService/PasswordService';
import { message } from 'antd';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException';

const useListItemHook = ({onDelete, accountName, onAuthError})=> {
    const removeAccount = () => {
        onDelete(accountName);
    }

    const copyPassword = () => {
        passwordService.getDecryptedPassword(accountName)
        .then(decryptedPassword => {
            window.Neutralino.clipboard.writeText(decryptedPassword)
            .then(() => {
                message.success('Password for ' + accountName + ' copied to clipboard!', 2);
            })
            .catch(err => {
                message.error('Error while copying password for ' + accountName + ' to clipboard!', 2);
                console.log("ERROR: ", err);
            })
        })
        .catch(err => {
            console.log("ERROR: ", err);
            if (err instanceof UnauthorizedException) {
                console.log(onAuthError);
                onAuthError();
            } else {
                message.error("Error while copying password in clipboard", 2);
            }
        });
    }

    const editAccount = (oldName, newName) => {
        passwordService.edit(oldName, newName).then(() => message.success('Password for ' + accountName + ' edited!', 2));
    }

    return {removeAccount, copyPassword, editAccount};
}

export default useListItemHook;