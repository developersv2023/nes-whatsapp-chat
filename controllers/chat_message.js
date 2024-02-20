import { ChatMessage } from "../models/index.js";
import { io, getFilePath } from "../utils/index.js";

function sendText(req, res) {
  const { chat_id, message } = req.body;
  const { user_id } = req.user;

  const chat_message = new ChatMessage({
    chat: chat_id,
    user: user_id,
    message,
    type: "TEXT",
  });

  chat_message
    .save()
    .then(async function () {
      const data = await chat_message.populate("user");
      io.sockets.in(chat_id).emit("message", data);
      io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);
      //console.log(data);
      res.status(201).send({});
    })
    .catch(function (err) {
      res.status(400).send({ msg: "Error al enviar el mensaje" });
    });
}

function sendImage(req, res) {
  const { chat_id } = req.body;
  const { user_id } = req.user;

  const chat_message = new ChatMessage({
    chat: chat_id,
    user: user_id,
    message: getFilePath(req.files.image),
    type: "IMAGE",
  });

  chat_message
    .save()
    .then(async function () {
      const data = await chat_message.populate("user");
      io.sockets.in(chat_id).emit("message", data);
      io.sockets.in(`${chat_id}_notify`).emit("message_notify", data);
      res.status(201).send({});
    })
    .catch(function (err) {
      res.status(400).send({ msg: "Error al enviar el mensaje" });
    });
}

async function getAll(req, res) {
  const { chat_id } = req.params;

  try {
    const messages = await ChatMessage.find({ chat: chat_id })
      .sort({
        createdAt: 1,
      })
      .populate("user");

    const total = await ChatMessage.find({ chat: chat_id }).count();

    res.status(200).send({ messages, total });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

//este bloque del intructor no funciono
// async function getTotalMessages(req, res) {
//   const { chat_id } = req.params;

//   try {
//     const response = await ChatMessage.find({ chat: chat_id }).count();
//     res.status(200).send(JSON.stringify(response));
//   } catch (error) {
//     res.status(500).send({ msg: "Error del servidor" });
//   }
// }

async function getTotalMessages(req, res) {
  try {
    const { chat_id } = req.params;
    const messages = await ChatMessage.find({ chat: chat_id });

    res.status(200).json(messages.length);
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function getLastMessage(req, res) {
  const { chat_id } = req.params;

  try {
    const response = await ChatMessage.findOne({ chat: chat_id }).sort({
      createdAt: -1,
    });
    res.status(200).send(response || {});
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

export const ChatMessageController = {
  sendText,
  sendImage,
  getAll,
  getTotalMessages,
   getLastMessage,
};
