import React from 'react';

import { login } from '../handlers/authHandlers';

// UI Elements
import { Form, Input, Button, message } from 'antd';

const Login = (props) => {
    const {
        setLoggedIn
    } = props;

    const onFinish = (values) => {
        console.log('Received values:', values);
        login(values.email, values.password)
            .then((res) => {
                setLoggedIn(true);
                console.log("Login successful");
                message.success('Login successful');
                }
            ).catch((err) => {
                console.log("Login failed");
                console.log(err);
                message.error('Login failed');
            });
        
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            
            <Form
                name="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ width: 300 }}
            >

                <Form.Item
                    label=""
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }]}
                >
                    <Input placeholder="Enter your email"/>
                </Form.Item>

                <Form.Item
                    label=""
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;