import React from "react";
import useAddPasswordHook from "./addpasswordhook";
import { Button, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import style from './addpassword-css';

export default function AddPasswordPage({navigation}) {
    const {setAccountName, setSecret, addAccount} = useAddPasswordHook({navigation});

    return (
        <View>
            <TextInput placeholder="Account name" onChangeText={setAccountName}/>
            <View style={{padding: 10}}></View>
            <TextInput secureTextEntry={true} placeholder="Password" onChangeText={setSecret}/>
            <Button type="primary" title="Add new" onPress={addAccount}/>
            {/* <Search style={search} placeholder="input search text" enterButton onSearch={filter} onChange={e => {filter(e.target.value)}}/> */}
        </View>
    )
}