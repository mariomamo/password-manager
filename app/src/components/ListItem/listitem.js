import { React } from 'react';
import './listitem.css';
import { DeleteFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import useListItemHook from './listitemhook';

const ListItem = ({onDelete, accountName})=> {

    const {removeAccount, copyPassword, editAccount} = useListItemHook({onDelete, accountName});

    return (
        accountName !== "" && accountName !== undefined &&
        <div className="list-item">
            <div className="list-item-row">
                <div onClick={copyPassword} className="list-item-title">{accountName}</div>
                <div className="action-button delete-button">
                    <Popconfirm
                        placement="topRight"
                        title="Do you want to remove this password?"
                        onConfirm={removeAccount}
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