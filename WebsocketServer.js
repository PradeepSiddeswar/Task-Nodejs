require('dotenv').config();
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const LoginDB = require("../Model/Login_Model"); // Adjust the path to your model
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
    console.log('Client connected');

    // Handle incoming messages
    socket.on('message', async (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'authenticate') {
                // Authenticate the user
                const { token } = parsedMessage;
                try {
                    const decoded = jwt.verify(token, SECRET_KEY);
                    socket.user = decoded; // Attach user info to socket
                    socket.send(JSON.stringify({ message: 'Authentication successful' }));
                } catch (error) {
                    socket.send(JSON.stringify({ message: 'Authentication failed' }));
                    socket.close();
                }
            } else if (parsedMessage.type === 'data') {
                // Handle other types of messages if needed
                if (socket.user) {
                    console.log('Received data from authenticated user:', parsedMessage.data);
                    // Process data...
                    socket.send(JSON.stringify({ message: 'Data received' }));
                } else {
                    socket.send(JSON.stringify({ message: 'Not authenticated' }));
                }
            }
        } catch (error) {
            console.error('Error handling message:', error);
            socket.send(JSON.stringify({ message: 'Error processing message' }));
        }
    });

    // Handle client disconnect
    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');