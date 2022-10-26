import { React } from 'react';
import ListItem from '../listitem/listitem';
import './accountlist.css';

const AccountList = ({accountList})=> {
    return (
        accountList !== undefined && accountList.map(account =>
            <ListItem accountName={account}/>
        )
    )
}

export default AccountList;