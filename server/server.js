const express = require('express');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const { insertOneUser, getUser } = require('./Utils/mongoDBMethods');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('chatMsg', (msg) => {
        console.log(`message: ${msg}`);
    })

    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });
});


app.get('/', (req, res) => {
    res.send('Hearing you clearly sir');
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const userExist = await insertOneUser(username, hashedPassword);

        if(userExist) {
            return res.status(200).json({ status: 200, created: false, message: '*User already exists. Please choose a different username.' });
        } else {
            return res.status(201).json({ status: 201, created: true, message: 'User created' });
        }

    } catch(err) {
        console.log(err);
        return res.status(400).json({ status: 400, Error: err });
    }
})

app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUser(username);
        
        if(user) {
            if(await bcrypt.compare(password, user.password)){
                res.status(200).json({ status: 200, status: "success" });
            } else {
                res.status(200).json({ status: 200, status: "incorrect password" });
            }
        } else {
            return res.status(200).json({ status: 200, foundUser: false, message: '*User not found. Please register.' });
        }

    } catch(err) {
        console.log(err);
        return res.status(400).json({ status: 400, Error: "User does not exist" });
    }
})

server.listen(8000, () => {
    console.log("Listening on port 8000");
})