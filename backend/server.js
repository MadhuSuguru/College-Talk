const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes');
const { NotFound, errorHandler } = require('./middlewares/error.js');
const chatRoute = require('./routes/chatRoute.js');
const messageRoute = require('./routes/messageRoute');
const collegeRoute = require('./routes/collegeRoute');
const path = require('path');

dotenv.config();

connectDB();
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);
app.use('/api/colleges', collegeRoute);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
    })
}
else {
    app.get('/', (req, res) => {
        res.send("API RUNNING")
    })
}
app.use(NotFound);
app.use(errorHandler);



const port = process.env.PORT || 8000;
const server = app.listen(port, console.log("Server Connected"));
const io=require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
    pingTimeout: 50000,
});
io.on("connection", (socket) => {
    socket.on('setup', (user) => {
        socket.join(user._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
    })

    socket.on('typing', (room) => {
        
        socket.in(room).emit('typing')
    })
    socket.on('stop typing', (room) => {
        
        socket.in(room).emit('stop typing')
    })

    socket.on('new msg', (newmsg) => {
        var chat = newmsg.chat;
        if (!chat.users) {
            console.log("NO USERS FOUND")
            return;
        }
        chat.users.forEach(user => {
            if (user._id === newmsg.sender.id) {
                return;
            }
            socket.in(user._id).emit("msg received", newmsg);
        })
    })

})