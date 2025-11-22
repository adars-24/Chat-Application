import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// -----------------------------------------------------
// CREATE A NEW CONVERSATION (FIXED)
// -----------------------------------------------------
export const newConversation = async (request, response) => {
  try {
    const { senderId, receiverId } = request.body;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (conversation) {
      // ⭐ return existing conversation (important)
      return response.status(200).json(conversation);
    }

    // Create new conversation
    conversation = new Conversation({
      members: [senderId, receiverId],
      message: ""
    });

    await conversation.save();

    // ⭐ return the new conversation
    return response.status(200).json(conversation);

  } catch (error) {
    return response.status(500).json(error.message);
  }
};


// -----------------------------------------------------
// GET A CONVERSATION BETWEEN TWO USERS (FIXED)
// -----------------------------------------------------
export const getConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    res.status(200).json(conversation || null);

  } catch (error) {
    res.status(500).json(error);
  }
};






