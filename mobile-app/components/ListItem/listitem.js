import { React } from 'react';
// import './listitem.css';
import style from './listitem-css'
import Toast from 'react-native-toast-message';
// import { DeleteFilled } from '@ant-design/icons';
import { View, Text, TouchableOpacity } from 'react-native';
// import { Popconfirm } from 'antd';
import useListItemHook from './listitemhook';

const ListItem = ({onDelete, accountName, onAuthError})=> {

    const {removeAccount, copyPassword, editAccount} = useListItemHook({onDelete, accountName, onAuthError});

    return (
        accountName !== "" && accountName !== undefined &&
        <View className="list-item">
            <View>
                <TouchableOpacity onPress={copyPassword}><Text style={style.list_item_title}>{accountName}</Text></TouchableOpacity>
                <View className="action-button delete-button">
                    {/* <Popconfirm
                        placement="topRight"
                        title="Do you want to remove this password?"
                        onConfirm={removeAccount}
                        okText="Yes"
                        cancelText="No"
                    > */}
                        {/* <DeleteFilled /> */}
                    {/* </Popconfirm> */}
                    </View>
                {/* <div className="action-button" onClick={() => editAccount("prova", "prova2")}><EditFilled /></div> */}
            </View>
        </View>
    )
}

export default ListItem;