import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView  } from 'react-native';
import AccountList from './components/AccountList/accountlist';
import { passwordService } from './services/PasswordService/PasswordService';
import { UnauthorizedException } from './exceptions/UnauthorizedException';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './components/TopBar/topbar';
import { storageService } from './services/StorageService/StorageService';
// import { message, Menu, Button, Input, Form, Modal } from 'antd';

export default function AccountsPage({navigation}) {
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
        // TODO: Oepn login page
        // setIsModalOpen(true);
        openLoginPage();
        if (!isFirstLogin) {
          // message.error("Unauthorized! please log again", 2);
          console.log("Unauthorized! please log again");
        }
      } else {
        // message.error('There was an error while loading accounts', 2);
        console.log('There was an error while loading accounts');
      }
      console.log(e);
    });
  }

  const deleteAccount = (accountName) => {
    
  }

  const openLoginPage = () => {
    storageService.remove("jwt_token")
    .then(storageService.remove("refresh_token"))
    .then(() => navigation.replace("Login"));
  }

  const onAdd = (accountName, secret) => {
    loadAccounts(false);
  }

  const onSearch = (accountList)=> {
    setAccountList(accountList);
  }

  // useEffect(() => {
  //   loadAccounts(true);
  // }, [])

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
        loadAccounts(false);
    });
    return focusHandler;
  }, [navigation]);

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
    
  }

  const doImport = ()=> {
    
  }

  return (
    <View>
      <TopBar onAdd={onAdd} accountList={clonedList} onSearch={onSearch} navigation={navigation}/>
      <ScrollView  className="App">
        {/* <Menu onClick={onMenuClick} selectable={false} mode="horizontal" items={items}/> */}
        <AccountList onDelete={deleteAccount} accountList={accountList} onAuthError={() => {
          // message.error("Unauthorized! please log again", 2);
          console.log("Unauthorized! please log again");
          openLoginPage();
        }}/>
      </ScrollView >

      {/* <Modal title="Login" open={isModelOpen} onOk={login} cancelButtonProps={{ style: { display: 'none' } }} closable={false}>
        <Form initialValues={{ remember: false }}>
            <Input value={username} placeholder="Account name" onChange={e => setUsername(e.target.value)}/>
            <View style={{padding: 10}}></View>
            <Input.Password value={password} placeholder="Password" onChange={e => {setPassword(e.target.value)}}/>
        </Form>
      </Modal> */}
    </View>

    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
