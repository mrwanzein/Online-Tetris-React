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

let globalOnlineUsers = [];
let onlineUsers = [];
let usersInRoom = [];
io.on('connection', (socket) => {
    console.log('user connected');
    
    // ↓ -------------------- When users log in  ------------------------------------------------------------------------- ↓
    socket.on('getLoggedInUsers', () => {
        console.log(onlineUsers, 'from getLoggedInUsers');
        io.emit('getLoggedInUsers', onlineUsers);
    });
    
    socket.on('newUserLoggedIn', (user) => {
        onlineUsers.push([user, socket.id])
        globalOnlineUsers.push([user, socket.id])
        socket.username = user;
        io.emit('getNewLoggedInUsers', onlineUsers);
    });
    // ↑ -------------------- When users log in  ------------------------------------------------------------------------- ↑

   
    // ↓ -------------------- When users challenge each other  ----------------------------------------------------------- ↓
    socket.on('challengeOpponent', (opponent) => {
        io.to(onlineUsers.find(user => user[0] === opponent)[1]).emit('whoChallengeMe', `${socket.username}`);
    });

    socket.on('challengeRefused', (challenger) => {
        io.to(onlineUsers.find(user => user[0] === challenger)[1]).emit('challengeRefused', false);
    });
    // ↑ -------------------- When users challenge each other  ----------------------------------------------------------- ↑

    
    // ↓ -------------------- When 2 users accepted a  challenge  -------------------------------------------------------- ↓
    socket.on('joinBattleRoom', (duelUsers) => {
        let roomName = `${duelUsers[0]}VS${duelUsers[1]}`
        socket.join(roomName);
        io.to(onlineUsers.find(user => user[0] === duelUsers[1])[1]).emit('getInRoom', roomName);

        usersInRoom.push([roomName, [duelUsers[0]], [duelUsers[1]]]);
        
        let indexOfUser1;
        onlineUsers.forEach((user, index) => {
            if(user.indexOf(duelUsers[0]) !== -1){
              indexOfUser1 = index;
            }
        });
        onlineUsers.splice(indexOfUser1, 1);

        let indexOfUser2;
        onlineUsers.forEach((user, index) => {
            if(user.indexOf(duelUsers[1]) !== -1){
              indexOfUser1 = index;
            }
        });
        onlineUsers.splice(indexOfUser2, 1);

    });

    socket.on('challengerTurnToJoinRoom', (roomToJoin) => {
        socket.join(roomToJoin);
        io.in(roomToJoin).emit('readyUp', true);
    });

    socket.on('ready', (user) => {
        usersInRoom.forEach(room => {
            room.forEach(data => {
                if(data[0] === user){
                    data.push('ready');
                }
            });
        });
        console.log(usersInRoom, 'from ready')
        
        let indexOfRoom;
        usersInRoom.forEach((rooms, index) => {
            rooms.forEach(data => {
                if(typeof data !== 'string' && data.includes(socket.username)) {
                    indexOfRoom = index;
                }
            })
        });

        socket.to(usersInRoom[indexOfRoom][0]).emit('opponentReady', true);
    });

    socket.on('checkIfBothPlayerReady', () => {
        let indexOfRoom;
        usersInRoom.forEach((rooms, index) => {
            rooms.forEach(data => {
                if(typeof data !== 'string' && data.includes(socket.username)) {
                    indexOfRoom = index;
                }
            });
        });
        
        if(
            (   usersInRoom[indexOfRoom] !== undefined  &&
                usersInRoom[indexOfRoom][1] !== undefined && 
                usersInRoom[indexOfRoom][1][1] !== undefined && 
                usersInRoom[indexOfRoom][1][1] === 'ready'
            ) 
            && 
            (
                usersInRoom[indexOfRoom] !== undefined &&
                usersInRoom[indexOfRoom][2] !== undefined && 
                usersInRoom[indexOfRoom][2][1] !== undefined && 
                usersInRoom[indexOfRoom][2][1] === 'ready'
            )
        ) {
            io.in(usersInRoom[indexOfRoom][0]).emit('checkIfBothPlayerReady', true);
        }

    });
    
    socket.on('sendLocalFieldInfoToOpp', (oppInfo, score, rows, level) => {
        if(globalOnlineUsers.length) {
            let indexOfRoom;
            usersInRoom.forEach((rooms, index) => {
                rooms.forEach(data => {
                    if(typeof data !== 'string' && data.includes(socket.username)) {
                        indexOfRoom = index;
                    }
                });
            });
            
            let opponent;
            
            usersInRoom[indexOfRoom].forEach(data => {
                if(typeof data !== 'string' && data[0] !== socket.username) {
                    opponent = data[0];
                }
            });
            
            
            io.to(globalOnlineUsers.find(user => user[0] === opponent)[1]).emit('receiveOpponentFieldInfo', oppInfo, score, rows, level);
        }
    });

    socket.on('opponentLost?', (opponentHasLost, gamestarted, dropTime) => {
        if(globalOnlineUsers.length) {
            let indexOfRoom;
            usersInRoom.forEach((rooms, index) => {
                rooms.forEach(data => {
                    if(typeof data !== 'string' && data.includes(socket.username)) {
                        indexOfRoom = index;
                    }
                });
            });
            
            let opponent;
            
            usersInRoom[indexOfRoom].forEach(data => {
                if(typeof data !== 'string' && data[0] !== socket.username) {
                    opponent = data[0];
                }
            });
            
            
            if(opponentHasLost) {
                io.to(globalOnlineUsers.find(user => user[0] === opponent)[1]).emit('opponentLost?', opponentHasLost,  gamestarted, dropTime);
            }
        }
    });
    // ↑ -------------------- When 2 users accepted a  challenge  -------------------------------------------------------- ↑

    socket.on('disconnect', () => {
        let indexOfUser;
        onlineUsers.forEach((user, index) => {
            if(user.indexOf(socket.username) !== -1){
              indexOfUser = index;
            }
        });
        if(indexOfUser !== undefined) onlineUsers.splice(indexOfUser, 1);
        
        let indexOfRoomWhereUser;
        usersInRoom.forEach((rooms, index) => {
            rooms.forEach(data => {
                if(data.includes(socket.username)) {
                    indexOfRoomWhereUser = index;
                }
            });
        });
        if(indexOfRoomWhereUser !== undefined) usersInRoom.splice(indexOfRoomWhereUser, 1);
        console.log(`${socket.username} disconnected`);
    });
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
        
        let alreadyLogged;
        onlineUsers.forEach(users => {
            if(users.includes(username)) alreadyLogged = true;
        })

        if(user) {
            if(alreadyLogged) {
                res.status(200).json({ status: 200, message: "Already Logged"});
            }
            else if(await bcrypt.compare(password, user.password)){
                res.status(200).json({ status: 200, status: "success", username: user.username });
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