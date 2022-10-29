import './App.css';
import 'antd/dist/antd.css';
import AccountList from './components/AccountList/accountlist';
import AddBar from './components/AddBar/addbar';
import './services/PasswordService.js';
import { passwordService } from './services/PasswordService';
import { useEffect, useState } from 'react';

function App() {
  const [accountList, setAccountList] = useState([]);

  const loadAccounts = () => {
    passwordService.getAccountList().then(accountList => setAccountList(accountList));
  }

  const deleteAccount = (accountName) => {
    passwordService.delete(accountName).then(loadAccounts());
  }

  useEffect(() => {
    loadAccounts();
  }, [])

  return (
    <div>
      <div className="App">
        <AddBar onAdd={loadAccounts}/>
        <AccountList onDelete={deleteAccount} accountList={accountList}/>
      </div>
    </div>
  );
}

export default App;
