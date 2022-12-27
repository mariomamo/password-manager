import './App.css';
import 'antd/dist/antd.css';
import AccountList from './components/AccountList/accountlist';
import TopBar from './components/TopBar/topbar';
import './services/PasswordService.js';
import { passwordService } from './services/PasswordService';
import { importExportFileSystemService } from './services/ImportExportFileSystemService';
import { useEffect, useState } from 'react';
import { message, Menu } from 'antd';

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
    passwordService.addAccount(accountName, secret)
    .then((result) => {
      if (result.status == "SUCCESS") {
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

  const items = [
    {
      label: 'File',
      key: 'SubMenu',
      children: [
        {
          type: 'group',
          children: [
            {
              label: 'Import',
              key: 'import',
            },
            {
              label: 'Export',
              key: 'export',
            },
          ],
        }
      ],
    }
  ];

  const onMenuClick = (e)=> {
    if (e.key == "export") {
      doExport();
    } else {
      doImport();
    }
  };

  const doExport = ()=> {
    importExportFileSystemService.export()
      .then(result => {
        if (result.status == "SUCCESS") {
          message.success('Export completed!', 2);
        } else if (result.status == "ERROR") {
          message.error('There was an error while exporting accounts', 2);
        }
      })
      .catch((error) => {
        message.error('There was an error while exporting accounts', 2);
      });
  }

  const doImport = ()=> {
    importExportFileSystemService.import()
      .then(result => {
        if (result.status == "SUCCESS") {
          message.success('Import completed!', 2);
        } else if (result.status == "WARNING") {
          message.warning(result.message, 2);
        } else if (result.status == "ERROR") {
          message.error(result.message, 2);
        }
        loadAccounts();
        console.log("Import completed! ", result);
      })
      .catch(error => {
        message.error('There was an error while importing accounts', 2);
        console.log(error);
      });
  }

  return (
    <div>
      <div className="App">
        <Menu onClick={onMenuClick} selectable={false} mode="horizontal" items={items}/>
        <TopBar onAdd={onAdd} accountList={clonedList} onSearch={onSearch}/>
        <AccountList onDelete={deleteAccount} accountList={accountList}/>
      </div>
    </div>
  );
}

export default App;
