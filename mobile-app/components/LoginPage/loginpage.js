import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { Text, Button, View  } from 'react-native';
import useLoginPageHook from './loginpagehook';
import style from './loginpage-css';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function LoginPage ({route, navigation}) {

    const {setUsername, setPassword, login} = useLoginPageHook({route, navigation});

    return (
        <View style={style.main_page}>
            <View style={style.container}>
                <Text style={style.text_label}>Username</Text>
                <TextInput style={style.text_input} placeholder="username" onChangeText={text => setUsername(text)}/>
                <Text style={style.text_label}>Password</Text>
                <TextInput style={style.text_input} secureTextEntry={true} placeholder="password" onChangeText={text => setPassword(text)}/>
                <View style={style.button_container}>
                    <Button color={style.login_button.color} title="Login" onPress={login} />
                </View>
            </View>
        </View>
    )
}