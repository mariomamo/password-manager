import { React } from 'react';
import './listitem.css';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { Popconfirm, message } from 'antd';

const ListItem = ({accountName})=> {

    const removeAccount = (accountName)=> {
        message.success('Account ' + accountName + ' removed!', 1);
    }

    const copyPassword = ()=> {
        message.success('Password for ' + accountName + ' copied to clipboard!', 1);
    }

    return (
        accountName !== "" && accountName !== undefined &&
        <div className="list-item">
            <div className="list-item-row">
                <div onClick={()=> copyPassword()} className="list-item-title">{accountName}</div>
                <div className="action-button delete-button">
                    <Popconfirm
                        placement="topRight"
                        title="Vuoi eliminare questa password?"
                        onConfirm={()=> removeAccount(accountName)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteFilled />
                    </Popconfirm>
                    </div>
                <div className="action-button"><EditFilled /></div>
            </div>
        </div>
    )
}

export default ListItem;