import React from "react";
import useAddPasswordHook from "./addpasswordhook";
import { Text, Button, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import style from './addpassword-css';

export default function AddPasswordPage({navigation}) {
    const {setAccountName, setSecret, addAccount} = useAddPasswordHook({navigation});

    return (
        <View style={style.main_page}>
            <View style={style.container}>
                <Text style={style.text_label}>Account name</Text>
                <TextInput style={style.text_input} placeholder="Account name" onChangeText={setAccountName}/>
                <Text style={style.text_label}>Password</Text>
                <TextInput style={style.text_input} secureTextEntry={true} placeholder="Password" onChangeText={setSecret}/>
                <View style={style.button_container}>
                    <Button type="primary" color={style.login_button.color} title="Add new" onPress={addAccount} />
                </View>
            </View>
        </View>
    )
}