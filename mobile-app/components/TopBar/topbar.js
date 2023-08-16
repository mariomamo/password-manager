import React from "react";
import useTopBarHook from "./topbarhook";
import { Button, View, Text, Image } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import style from './topbar-css';

const TopBar = ({onAdd, accountList, onSearch, navigation})=> {
    const {handleOk, handleCancel, openAddPage, filter, accountName, setAccountName, secret, setSecret} = useTopBarHook({accountList, onAdd, onSearch, navigation});

    return (
        <View style={style.container}>
            <TouchableOpacity style={style.add_icon} onPress={openAddPage}>
                <Image style={style.icon} source={require('../../images/add-icon.png')} />
            </TouchableOpacity>
            <View style={style.search_box}>
                <TextInput style={style.input} placeholder="Search" onChangeText={filter}/>
            </View>
        </View>
    )
}

export default TopBar;