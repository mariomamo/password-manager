import Clipboard from '@react-native-community/clipboard';
import { toastService } from '../../services/ToastService/ToastService';
import { passwordService } from '../../services/PasswordService/PasswordService';
import { UnauthorizedException } from '../../exceptions/UnauthorizedException'

const useListItemHook = ({onDelete, accountName, onAuthError})=> {
    const removeAccount = () => {
        onDelete(accountName);
    }

    const copyPassword = () => {
        toastService.info("Copying password for " + accountName);
        passwordService.getDecryptedPassword(accountName)
        .then(decryptedPassword => {
            Clipboard.setString(decryptedPassword);
            toastService.success("Password for " + accountName + " copied to clipboard!");
        })
        .catch(err => {
            console.log("ERROR: ", err);
            if (err instanceof UnauthorizedException) {
                onAuthError();
            } else {
                toastService.error("Error while copying " + accountName);
            }
        });
    }

    const editAccount = (oldName, newName) => {
        passwordService.edit(oldName, newName).then(() => message.success('Password for ' + accountName + ' edited!', 2));
    }

    return {removeAccount, copyPassword, editAccount};
}

export default useListItemHook;