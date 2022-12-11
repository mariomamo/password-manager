import React from "react";
import { Button, Input, Form, Modal } from 'antd';
import Search from "antd/lib/input/Search";
import useTopBarHook from "./topbarhook";

const TopBar = ({onAdd, accountList, onSearch})=> {
    const {handleOk, handleCancel, showModal, filter, isModelOpen, accountName, setAccountName, secret, setSecret} = useTopBarHook({accountList, onAdd, onSearch});

    const container = {
        flex: 1,
        flexDirection: "row"
    }
    
    const addButton = {
        flex: 1,
        margin: 10
    }
    
    const search = {
        width: "80%",
        margin: 10,
        flex: 1
    }

    return (
        <div className={container}>
            <Button style={addButton} type="primary" onClick={showModal}>Add new</Button>
            <Modal title="Add new account" open={isModelOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form initialValues={{ remember: false }}>
                    <Input value={accountName} placeholder="Account name" onChange={e => setAccountName(e.target.value)}/>
                    <div style={{padding: 10}}></div>
                    <Input.Password value={secret} placeholder="Password" onChange={e => {setSecret(e.target.value)}}/>
                </Form>
            </Modal>
            <Search style={search} placeholder="input search text" enterButton onSearch={filter} onChange={e => {filter(e.target.value)}}/>
        </div>
    )
}

export default TopBar;