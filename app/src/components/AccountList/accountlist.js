import { React } from 'react';
import ListItem from '../ListItem/listitem';
import './accountlist.css';

const AccountList = ({onDelete, accountList})=> {
    return (
        accountList !== undefined && accountList.map(account =>
            <ListItem onDelete={onDelete} accountName={account}/>
        )
    )
}

export default AccountList;