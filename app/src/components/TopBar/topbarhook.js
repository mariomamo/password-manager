import React, { useState } from "react";

const useTopBarHook = ({accountList, onAdd, onSearch})=> {
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [secret, setSecret] = useState("");
    // const [searchKey, setSearchKey] = useState("");

    const handleOk = ()=> {
        onAdd(accountName, secret);
        setIsModalOpen(false);
        setAccountName("");
        setSecret("");
        // filter(searchKey);
    }

    const handleCancel = ()=> {
        setIsModalOpen(false);
        setAccountName("");
        setSecret("");
    }

    const showModal = ()=> {
        setIsModalOpen(true);
    }

    const filter = (searchKey)=> {
        // setSearchKey(searchKey);
        var searchedList;
        if (searchKey == "") {
            searchedList = accountList;
        } else {
            searchedList = accountList.filter(e => e.includes(searchKey));
        }
        onSearch(searchedList);
    }

    return {handleOk, handleCancel, showModal, filter, isModelOpen, accountName, setAccountName, secret, setSecret};
}

export default useTopBarHook;