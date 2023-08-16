import React, { useState } from "react";

const useTopBarHook = ({accountList, onAdd, onSearch, navigation})=> {
    const [accountName, setAccountName] = useState("");
    const [secret, setSecret] = useState("");

    const handleOk = ()=> {
        onAdd(accountName, secret);
        setAccountName("");
        setSecret("");
    }

    const handleCancel = ()=> {
        setAccountName("");
        setSecret("");
    }

    const openAddPage = ()=> {
        navigation.navigate("AddPasswordPage");
    }

    const filter = (searchKey)=> {
        var searchedList;
        if (searchKey == "") {
            searchedList = accountList;
        } else {
            searchedList = accountList.filter(e => e.includes(searchKey));
        }
        onSearch(searchedList);
    }

    return {handleOk, handleCancel, openAddPage, filter, accountName, setAccountName, secret, setSecret};
}

export default useTopBarHook;