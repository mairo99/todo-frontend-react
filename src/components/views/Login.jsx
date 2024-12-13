import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";
import axios from 'axios';

const API_URL = "https://demo2.z-bit.ee";
export default function Login() {
    const navigate = useNavigate();

    // Handle the login form submission
    const onFinish = (values) => {
        const { username, password } = values;
    
        // Assuming login API request returns a token
        axios
            .post(`${API_URL}/users/get-token`, { username, password })
            .then((response) => {
                // Save token to localStorage
                localStorage.setItem("access_token", response.data.access_token);
    
                // Redirect to TaskList page
                notification.success({
                    message: 'Logged in successfully',
                });
                navigate('/');
            })
            .catch((error) => {
                console.error('Login failed:', error);
                notification.error({
                    message: 'Wrong username or password',
                });
            });
    };
    
    

    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
