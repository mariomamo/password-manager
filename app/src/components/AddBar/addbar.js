// import { React } from 'react';
// import { Button, Input, Form} from 'antd';
// import { passwordService } from '../../services/PasswordService';
// import { message } from 'antd';
// import './addbar.css';

// const AddBar = ({onAdd})=> {
//     const [form] = Form.useForm();

//     const addAccount = async (accountName, secret) => {
//         // TODO: Test
//         passwordService.add(accountName, secret)
//         .then(() => {
//             message.success('Account ' + accountName + ' added!', 1);
//             onAdd();
//         });
//     }

//     return (
//         <div className="add-bar">
//             <div>
//                 <Form
//                     form={form}
//                     name="basic"
//                     labelCol={{ span: 8 }}
//                     wrapperCol={{ span: 8 }}
//                     initialValues={{ remember: true }}
//                     onFinish={values => {
//                         addAccount(values["account-name"], values["password"]);
//                         form.resetFields();
//                     }}
//                     autoComplete="off"
//                     >
//                     <Form.Item
//                         label="Account name"
//                         name="account-name"
//                         rules={[{ required: true, message: 'Please input the account name!' }]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.Item
//                         label="Password"
//                         name="password"
//                         rules={[{ required: true, message: 'Please input your password!' }]}
//                     >
//                         <Input.Password />
//                     </Form.Item>

//                     <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
//                         <div className="add-button">
//                             <Button type="primary" htmlType="submit">
//                             add
//                             </Button>
//                         </div>
//                     </Form.Item>
//                 </Form>
//             </div>
//         </div>
//     )
// }

// export default AddBar;