import React, { useState } from 'react';
import { Button } from 'react-native';
import { TextInput } from 'react-native';
import { Text, View  } from 'react-native';
import useLoignPageHook from './loginpagehook';

export default function LoginPage ({navigation}) {

    const {setUsername, setPassword, login} = useLoignPageHook({navigation});

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