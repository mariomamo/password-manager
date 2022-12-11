import './App.css';
import 'antd/dist/antd.css';
import AccountList from './components/AccountList/accountlist';
import TopBar from './components/TopBar/topbar';
import './services/PasswordService.js';
import { passwordService } from './services/PasswordService';
import { useEffect, useState } from 'react';
import { message } from 'antd';

function App() {
  const [accountList, setAccountList] = useState([]);
  const [clonedList, setClonedList] = useState([]);

  const loadAccounts = () => {
    passwordService.getAccountList()
    .then(accountList => {
      setAccountList(accountList);
      setClonedList(accountList);
    })
    .catch(e => {
      message.error('There was an error while loading accounts', 2);
      console.log(e);
    });
  }

  const deleteAccount = (accountName) => {
    passwordService.delete(accountName)
    .then(() => {
      message.success('Account ' + accountName + ' removed!', 2);
      loadAccounts();
    })
    .catch(e => {
      message.error('There was an error while deleting ' + accountName + ' account', 2);
      console.log(e);
    });
  }

  const onAdd = (accountName, secret) => {
    passwordService.add(accountName, secret)
    .then((result) => {
      if (result.success) {
        message.success('Account ' + accountName + ' added!', 2);
        loadAccounts();
      } else {
        message.error(result.message, 1);
        console.log("Error: " + JSON.stringify(result.message));
      }
    }).catch(error => {
      message.error('There was an error while creating ' + accountName + ' account', 2);
      console.log("Error: " + error);
    });
  }

  const onSearch = (accountList)=> {
    setAccountList(accountList);
  }

  useEffect(() => {
    loadAccounts();
  }, [])

  return (
    <div>
      <div className="App">
        <TopBar onAdd={onAdd} accountList={clonedList} onSearch={onSearch}/>
        <AccountList onDelete={deleteAccount} accountList={accountList}/>
      </div>
    </div>
  );
}

export default App;
