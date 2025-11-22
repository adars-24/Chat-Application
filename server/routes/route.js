import express from "express";
import { addUser, getUser } from "../controller/UserController.js";
import { newConversation, getConversation } from "../controller/conversation-controller.js";
import { newMessage, getMessage, clearMessages } from "../controller/message-controller.js";
import { uploadFile, getImage } from "../controller/image-controller.js";
import upload from "../utils/upload.js";

const route = express.Router();

route.post('/add', addUser);
route.get('/user', getUser);

route.post('/conversation/add', newConversation);
route.post('/conversation/get', getConversation);




// CLEAR ALL MESSAGES IN A CONVERSATION
route.delete("/messages/clear/:id", clearMessages);



route.post('/message/add', newMessage);
route.get('/message/get/:id', getMessage);

// CLEAR ALL MESSAGES
route.delete("/messages/clear/:conversationId", clearMessages);

route.post('/file/upload', upload.single("file"), uploadFile);
route.get('/file/:filename', getImage);

export default route;
