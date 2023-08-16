import { React } from 'react';
import { View } from 'react-native';
import ListItem from '../ListItem/listitem';
// import './accountlist.css';

const AccountList = ({onDelete, accountList, onAuthError})=> {
    return (
        accountList !== undefined && accountList.map((account, idx) =>
            <ListItem key={idx} onDelete={onDelete} accountName={account} onAuthError={onAuthError}/>
        )
    )
}

export default AccountList;