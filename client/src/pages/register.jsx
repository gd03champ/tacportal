import React, {useState} from 'react';

import { register } from '../handlers/authHandlers';

import { Form, Input, Button, message, Select, Radio } from 'antd';

const Register = (props) => {


    const { setLoggedIn } = props;

    const [userRole, setUserRole] = useState('student');

    const onFinish = (values) => {
        console.log('Received values:', values);
        console.log('Role:', values.role);
        console.log('Name:', values.name);
        register(values.email, values.password, values.rollno, values.name, userRole, values.department)
            .then((res) => {
                setLoggedIn(true);
                console.log("Registeration successful");
                message.success('Registeration successful 🎉');
            }
            ).catch((err) => {
                console.log("Registeration failed");
                console.log(err);
                message.error('Registeration failed');
                message.error(err.message);
            });

    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Form onFinish={onFinish}>
                <Form.Item
                    label=""
                    name="email"
                    placeholder="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Radio.Group style={{margin: '0 16px 20px 24px'}} defaultValue="student" buttonStyle="solid" onChange={(e) => { setUserRole(e.target.value) }}>
                    <Radio.Button value="student">Student</Radio.Button>
                    <Radio.Button value="staff">Admin</Radio.Button>
                </Radio.Group>

                <Form.Item
                    label=""
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                    label=""
                    name="rollno"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your roll number!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your roll number" />
                </Form.Item>

                <Form.Item
                    label=""
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your name" />
                </Form.Item>

                <Form.Item
                    label=""
                    name="department"

                    rules={[
                        {
                            required: true,
                            message: 'Please input your department!',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="cse">CSE</Select.Option>
                        <Select.Option value="ece">ECE</Select.Option>
                        <Select.Option value="eee">EEE</Select.Option>
                        <Select.Option value="mech">MECH</Select.Option>
                        <Select.Option value="auto">AUTO</Select.Option>
                        <Select.Option value="it">IT</Select.Option>
                    </Select>

                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;