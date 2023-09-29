import './App.css';
import 'antd/dist/antd.css';
import AccountList from './components/AccountList/accountlist';
import TopBar from './components/TopBar/topbar';
import { passwordService } from './services/PasswordService/PasswordService';
import { importExportFileSystemService } from './services/PasswordService/ImportExportFileSystemService';
import { useEffect, useState } from 'react';
import { message, Menu, Input, Form, Modal } from 'antd';
import { UnauthorizedException } from './exceptions/UnauthorizedException';

function App() {
  const [accountList, setAccountList] = useState([]);
  const [clonedList, setClonedList] = useState([]);
  const [isModelOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loadAccounts = (isFirstLogin) => {
    passwordService.getAccountList()
    .then(accountList => {
      setAccountList(accountList);
      setClonedList(accountList);
    })
    .catch(e => {
      if (e instanceof UnauthorizedException) {
        setIsModalOpen(true);
        if (!isFirstLogin) {
          message.error("Unauthorized! please log again", 2);
        }
      } else {
        message.error('There was an error while loading accounts', 2);
      }
      console.log(e);
    });
  }

  const deleteAccount = (accountName) => {
    passwordService.delete(accountName)
    .then((result) => {
      if (result.status === "SUCCESS") {
        message.success('Account ' + accountName + ' removed!', 2);
        loadAccounts();
      } else if (result.status === "UNAUTHORIZED") {
        message.error("Unauthorized! please log again", 2);
        openLoginPopup();
      } else {
        message.error(result.message, 2);
        console.log("Error: " + JSON.stringify(result.message));
      }
    })
    .catch(e => {
      message.error('There was an error while deleting ' + accountName + ' account', 2);
      console.log(e);
    });
  }

  const openLoginPopup = () => {
    setIsModalOpen(true);
  }

  const login = ()=> {
    try {
      passwordService.generateToken(username, password)
      .then((status) => {
        if (status !== 401) {
          setIsModalOpen(false);
          setUsername("");
          setPassword("");
          loadAccounts();
        } else {
          message.error("Wrong credentials, retry", 2);
          setUsername("");
          setPassword("");
        }
      })
    } catch(error) {
      console.log("Error");
    }
  }

  const onAdd = (accountName, secret) => {
    passwordService.addAccount(accountName, secret)
    .then((result) => {
      if (result.status === "SUCCESS") {
        message.success('Account ' + accountName + ' added!', 2);
        loadAccounts();
      } else {
        message.error(result.message, 2);
        console.log("Error: " + JSON.stringify(result.message));
      }
    }).catch(error => {
      if (error instanceof UnauthorizedException) {
        message.error("Unauthorized! please log again", 2);
        openLoginPopup();
      } else {
        message.error('There was an error while creating ' + accountName + ' account', 2);
        console.log("Error: " + error);
      }
    });
  }

  const onSearch = (accountList)=> {
    setAccountList(accountList);
  }

  useEffect(() => {
    (async function checkJwtToken() {
      if(await passwordService.isLogged()) {
        loadAccounts(true);
      } else {
        openLoginPopup();
      }
    })();
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
    },
    {
      label: 'Logout',
      key: 'logout'
    }
  ];

  const onMenuClick = (e)=> {
    if (e.key === "export") {
      doExport();
    } else if (e.key === "logout") {
      passwordService.logOut().then(() => {
        setAccountList([]);
        setClonedList([]);
        openLoginPopup();
      });
    } else {
      doImport();
    }
  };

  const doExport = ()=> {
    importExportFileSystemService.export()
      .then(result => {
        if (result.status === "SUCCESS") {
          message.success('Export completed!', 2);
        } else if (result.status === "UNAUTHORIZED") {
          message.error("Unauthorized! please log again", 2);
          openLoginPopup();
        } else if (result.status === "ERROR") {
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
        if (result.status === "SUCCESS") {
          message.success('Import completed!', 2);
        } else if (result.status === "WARNING") {
          message.warning(result.message, 2);
        } else if (result.status === "UNAUTHORIZED") {
          message.error("Unauthorized! please log again", 2);
          openLoginPopup();
        } else if (result.status === "ERROR") {
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
        <AccountList onDelete={deleteAccount} accountList={accountList} onAuthError={() => {
          message.error("Unauthorized! please log again", 2);
          openLoginPopup();
        }}/>
      </div>

      <Modal title="Login" open={isModelOpen} onOk={login} cancelButtonProps={{ style: { display: 'none' } }} closable={false}>
        <Form initialValues={{ remember: false }}>
            <Input value={username} placeholder="Account name" onChange={e => setUsername(e.target.value)}/>
            <div style={{padding: 10}}></div>
            <Input.Password value={password} placeholder="Password" onChange={e => {setPassword(e.target.value)}}/>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
