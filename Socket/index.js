import { Server } from "socket.io"; 
// import { getUsers } from "../client/src/services/api";

 const io = new Server(5000, {
    cors : {
        origin: 'https://chat-application-frontend-ankq.onrender.com'
    }
})

let users = [];

const getUser =(userId) => {
return users.find(user => user.sub === user.id)
}

const addUser = (userData, socketId) => {
!users.some(user=> user.sub == userData.sub) && users.push(...userData, socketId)
}


io.on('connection' , (socket)=> {
console.log('user Connected');

socket.on("addUsers", userData => {
    addUser(userData, socket.id);
    io.emit('getUsers', users);
})


socket.on('sendMessage', data => {
    const user = getUser(data.receiverId)

    io.to(user.socketId).emit('getMessage', data);
})
})