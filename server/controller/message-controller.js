import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// ----------------------------------------------------
// SEND MESSAGE (FULLY FIXED)
// ----------------------------------------------------
export const newMessage = async (req, res) => {
  try {
    let { conversationId, senderId, receiverId, text, type } = req.body;

    let conversation = null;

    // 1️⃣ If conversationId not provided → create new conversation
    if (!conversationId) {
      conversation = new Conversation({
        members: [senderId, receiverId],
        message: text
      });

      await conversation.save();
    }

    // 2️⃣ If conversationId exists → try finding it
    else {
      conversation = await Conversation.findById(conversationId);

      // 3️⃣ If deleted earlier → create new one
      if (!conversation) {
        conversation = new Conversation({
          members: [senderId, receiverId],
          message: text
        });

        await conversation.save();
      } else {
        // 4️⃣ Normal update of preview
        conversation.message = text;
        await conversation.save();
      }
    }

    // 5️⃣ Now save message with ALWAYS VALID conversation._id
    const newMsg = new Message({
      senderId,
      receiverId,
      conversationId: conversation._id,
      type,
      text
    });

    await newMsg.save();

    // 6️⃣ Return correct conversation ID (important)
    res.status(200).json({
      success: true,
      conversationId: conversation._id,
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};


// ----------------------------------------------------
// GET ALL MESSAGES
// ----------------------------------------------------
export const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};


// ----------------------------------------------------
// CLEAR ALL MESSAGES
// ----------------------------------------------------
export const clearMessages = async (req, res) => {
  try {
    const id = req.params.id;

    await Message.deleteMany({ conversationId: id });

    // clear preview
    await Conversation.findByIdAndUpdate(id, { message: "" });

    res.status(200).json("Chat cleared");

  } catch (error) {
    res.status(500).json(error);
  }
};
