import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import { TextInput } from 'react-native';
import { Text, View  } from 'react-native';
import useLoginPageHook from './loginpagehook';

export default function LoginPage ({route, navigation}) {

    const {setUsername, setPassword, login} = useLoginPageHook({route, navigation});

    return (
        <View>
            <Text>Username</Text>
            <TextInput placeholder="username" onChangeText={text => setUsername(text)}/>
            <Text>Password</Text>
            <TextInput secureTextEntry={true} placeholder="password" onChangeText={text => setPassword(text)}/>
            <Button title="Login" onPress={login} />
        </View>
    )
}