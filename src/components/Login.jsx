import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app/customers'; 

  const onFinish = async (values) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/auth/login`, values);

      login(data.token, data.user); 
      message.success('Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      
      message.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Login to CRM" className="w-[400px]">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 

