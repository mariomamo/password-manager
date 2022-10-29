import { React } from 'react';
import './listitem.css';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { Popconfirm, message } from 'antd';
import { passwordService } from '../../services/PasswordService.js';

const ListItem = ({onDelete, accountName})=> {

    const removeAccount = (accountName) => {
        // TODO: Reload accounts
        passwordService.delete(accountName).then(() => {
            message.success('Account ' + accountName + ' removed!', 1);
            onDelete(accountName);
        });
    }

    const copyPassword = (accountName) => {
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

    return (
        accountName !== "" && accountName !== undefined &&
        <div className="list-item">
            <div className="list-item-row">
                <div onClick={() => copyPassword(accountName)} className="list-item-title">{accountName}</div>
                <div className="action-button delete-button">
                    <Popconfirm
                        placement="topRight"
                        title="Do you want to remove this password?"
                        onConfirm={() => removeAccount(accountName)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteFilled />
                    </Popconfirm>
                    </div>
                {/* <div className="action-button" onClick={() => editAccount("prova", "prova2")}><EditFilled /></div> */}
            </div>
        </div>
    )
}

export default ListItem;