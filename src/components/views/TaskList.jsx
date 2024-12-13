import { useState, useEffect } from 'react';
import { Button, Row, Col, Space, List, Checkbox, Input, Divider, notification } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import produce from 'immer';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://demo2.z-bit.ee"; // Your API URL
const TOKEN = localStorage.getItem("access_token"); // Access token from localStorage

// Check if the user is authenticated (if token exists)
const isAuthenticated = () => !!localStorage.getItem("access_token");

// Function to fetch tasks from the server (GET request)
const fetchTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        return response.data; // Return the fetched tasks
    } catch (error) {
        throw new Error('Failed to fetch tasks. Please try again later.');
    }
};

export default function TaskList() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tasks when the component is mounted
    useEffect(() => {
        const getTasks = async () => {
            try {
                const tasksData = await fetchTasks(); // Fetch tasks from the server
                setTasks(tasksData);
            } catch (err) {
                setError(err.message); // Set error if something goes wrong
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated()) {
            getTasks(); // Only fetch tasks if user is authenticated
        }
    }, []);

    // Handle add task functionality (POST request)
    const handleAddTask = async () => {
        const token = localStorage.getItem("access_token"); // Get the token from localStorage
        if (!token) {
            notification.error({ message: 'Please log in to add a task.' });
            return;
        }
    
        try {
            const newTask = {
                title: "New Task", // Ensure that title is non-empty
                desc: "", // You can leave desc empty if not required
                marked_as_done: false // Default value
            };
    
            // Make the POST request to add the task
            const response = await axios.post(`${API_URL}/tasks`, newTask, {
                headers: {
                    Authorization: `Bearer ${token}`, // Using token in the header for authentication
                },
            });
    
            // If task is added successfully, update the tasks state
            setTasks((prevTasks) => [...prevTasks, response.data]);
            notification.success({ message: 'Task added successfully!' });
        } catch (error) {
            console.error('Error adding task:', error);
            if (error.response) {
                // If there is a response from the server
                console.error('Response error:', error.response);
                notification.error({ message: `Error adding task: ${error.response.data.message || 'Please try again.'}` });
            } else {
                // If there is no response (e.g., network issue)
                console.error('Network error:', error);
                notification.error({ message: 'Network error. Please try again.' });
            }
        }
    };
    
    
    

    // Task title change handler
    const handleTitleChange = async (task, event) => {
        const newTitle = event.target.value;
        const token = localStorage.getItem("access_token");  // Get the token from localStorage
    
        if (!token) {
            notification.error({ message: 'Please log in to update the task.' });
            return;
        }
    
        try {
            // Update the task title locally
            const updatedTasks = produce(tasks, (draft) => {
                const taskToUpdate = draft.find((t) => t.id === task.id);
                taskToUpdate.title = newTitle;
            });
    
            setTasks(updatedTasks);
    
            // Send the updated task to the server
            const response = await axios.put(`${API_URL}/tasks/${task.id}`, {
                title: newTitle,
                desc: task.desc,
                marked_as_done: task.marked_as_done
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Use the token for authentication
                },
            });
    
            // Update the task state with the server response (if needed)
            notification.success({ message: 'Task title updated!' });
        } catch (error) {
            console.error('Error updating task title:', error);
            notification.error({ message: 'Error updating task title.' });
        }
    };

    // Task completion change handler
    const handleCompletedChange = async (task, event) => {
        const newStatus = event.target.checked;
        const token = localStorage.getItem("access_token");
    
        if (!token) {
            notification.error({ message: 'Please log in to update task status.' });
            return;
        }
    
        try {
            // Update the task checked status locally
            const updatedTasks = produce(tasks, (draft) => {
                const taskToUpdate = draft.find((t) => t.id === task.id);
                taskToUpdate.marked_as_done = newStatus;
            });
    
            setTasks(updatedTasks);
    
            // Send the updated task to the server
            const response = await axios.put(`${API_URL}/tasks/${task.id}`, {
                title: task.title,
                desc: task.desc,
                marked_as_done: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Use the token for authentication
                },
            });
    
            notification.success({ message: 'Task status updated!' });
        } catch (error) {
            console.error('Error updating task status:', error);
            notification.error({ message: 'Error updating task status.' });
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
            notification.error({ message: "Error deleting task" });
        }
    };

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem("access_token"); // Remove the token
        navigate("/login"); // Redirect to login page
    };

    return (
        <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
            <Col span={12}>
                <h1>Task List</h1>

                {/* Conditionally render login/logout button */}
                <Space>
                    {isAuthenticated() && (
                        <>
                            <Button onClick={handleLogout} type="default">
                                Logout
                            </Button>
                            <Button onClick={handleAddTask} icon={<PlusOutlined />}>
                                Add Task
                            </Button>
                        </>
                    )}
                    {!isAuthenticated() && (
                        <Button onClick={() => navigate("/login")} type="primary">
                            Login
                        </Button>
                    )}
                </Space>

                <Divider />
                {/* Display loading spinner while tasks are being fetched */}
                {loading && <div>Loading...</div>}
                
                {/* Display error message if there is an error fetching tasks */}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                
                {/* Display tasks */}
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => (
                        <List.Item key={task.id}>
                            <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
                                <Space>
                                    <Checkbox
                                        checked={task.marked_as_done}
                                        onChange={(e) => handleCompletedChange(task, e)}
                                    />
                                    <Input
                                        value={task.title}
                                        onChange={(e) => handleTitleChange(task, e)}
                                    />
                                </Space>
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteTask(task.id)}
                                />
                            </Row>
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    );
}
