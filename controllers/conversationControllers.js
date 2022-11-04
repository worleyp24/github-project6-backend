const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

const accessConversation = async (request, response) => {
  const { userId } = request.body;
  if (!userId) {
    console.log("UserId not available");
    return response.sendStatus(400);
  }
  let isConversation = await Conversation.find({
    $and: [
      { users: { $elemMatch: { $eq: request.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isConversation = await User.populate(isConversation, {
    path: "latestMessage.fromUserId",
    select: "email",
  });
  if (isConversation.length > 0) {
    response.send(isConversation[0]);
  } else {
    let conversationData = {
      conversationName: "fromUserId",
      users: [request.user._id, userId],
    };
    try {
      const createdConversation = await Conversation.create(conversationData);
      const FullConversation = await Conversation.findOne({
        _id: createdConversation._id,
      }).populate("users", "-password");
      response.status(200).send(FullConversation);
    } catch (error) {
      response.status(400).send({
        message: [error.message],
      });
    }
  }
};

const fetchConversation = async (request, response) => {
  try {
    Conversation.find({
      users: { $elemMatch: { $eq: request.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.fromUserId",
          select: "username email imageUrl",
        });
        response.send(results);
      });
  } catch (error) {
    response.status(400).send({
      message: error.message,
    });
  }
};

module.exports = {
  accessConversation,
  fetchConversation,
};
