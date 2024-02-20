import {Group, User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";

async function getMe(req, res) {
  const { user_id } = req.user;
  try {
    const response = await User.findById(user_id).select(["-password"]);
    if (!response) {
      res.status(400).send({ msg: "no se ha encontrado el usuarios" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error en del servidor" });
  }
}

async function getUsers(req, res) {
  //res.status(200).send("USUARIO...");
  //$ne para hacer una negacion
  try {
    const { user_id } = req.user;
    const users = await User.find({ _id: { $ne: user_id } }).select([
      "-password",
    ]);

    if (!users) {
      res.status(400).send({ msg: "No se ha encontrado usuario" });
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function getUser(req, res) {
  // res.status(500).send("OK");

  const { id } = req.params;
  try {
    const response = await User.findById(id).select(["-password"]);

    if (!response) {
      res.status(400).send({ msg: "No se ha encontrado el usuario" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function updateUser(req, res) {
  const { user_id } = req.user;

  const userData = req.body;

  //console.log(userData);
  //console.log(req.files); // muestra objeto json de los datos enviados
  if (req.files.avatar) {
    const imagePath = getFilePath(req.files.avatar);
    // console.log(imagePath);
    userData.avatar = imagePath;
  }
  

  User.findByIdAndUpdate({ _id: user_id }, userData).then(updatedUser => {
    res.status(200).send(updatedUser)
  }).catch((error) => {
    res.status(400).send({
      message: 'Error al actualizar el usuario'
    })
  })
 
}


async function getUsersExeptParticipantsGroup(req, res) {
  const { group_id } = req.params;

  const group = await Group.findById(group_id);
  const participantsStrings = group.participants.toString();
  const participants = participantsStrings.split(",");

  
  const response = await User.find({ _id: { $nin: participants } }).select([
    "-password",
  ]);

  if (!response) {
    res.status(400).sedn({ msg: "No se ha encontrado ningun usuario" });
  } else {
    res.status(200).send(response);
  }
}

export const UserController = {
  getMe,
  getUsers,
  getUser,
  updateUser,
  getUsersExeptParticipantsGroup,
};
