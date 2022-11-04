const Conversation = require("../models/conversationModel");
const Message = require("../models/messagesModel");
const User = require("../models/userModel");

const allMessages = async (request, response) => {
  try {
    const messages = await Message.find({
      conversation: request.params.conversationId,
    })
      .populate("fromUserId", "username email imageUrl")
      .populate("conversation");
    response.json(messages);
  } catch (error) {
    response.status(400).send({
      message: [error.message, `this is the error`],
    });
  }
};

const sendMessage = async (request, response) => {
  const { messageBody, conversationId, messageType } = request.body;
  if (!messageBody || !conversationId) {
    console.log("Invalid data");
    return response.sendStatus(400);
  }
  let newMessage = {
    fromUserId: request.user._id,
    messageBody: messageBody,
    messageType: messageType,
    conversation: conversationId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("fromUserId", "username imageUrl");
    message = await message.populate("conversation");
    message = await User.populate(message, {
      path: "conversation.users",
      select: "username email",
    });
    await Conversation.findByIdAndUpdate(request.body.conversationId, {
      latestMessage: message,
    });

    response.status(200).send(message);
  } catch (error) {
    response.status(400).send({
      message: error.message,
    });
  }
};

module.exports = { sendMessage, allMessages };
