import bscrypt from "bcryptjs";
import { User } from "../models/index.js";
import { jwt } from "../utils/index.js";

function register(req, res) {
  const { email, password } = req.body;

  const user = new User({
    email: email.toLowerCase(),
    password: password,
  });

  const salt = bscrypt.genSaltSync(10);
  const hashPassword = bscrypt.hashSync(password, salt);
  user.password = hashPassword;

  user
    .save()
    .then(function (userStorage) {
      res.status(201).send(userStorage);
    })

    .catch(function (err) {
      res.status(400).send({ msg: "Error al registrar usuario" });
    });

  // console.log(req.body);
  //res.status(201).send({ msg: "todo OK" });
}

function login(req, res) {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();

  User.findOne()
    .then(function (userStorage) {
      // res.status(200).send(userStorage);
      bscrypt.compare(password, userStorage.password, (bcriptError, check) => {
        if (bcriptError) {
          res.status(500).send({ msg: "Error en servidor" });
        } else if (!check) {
          res.status(400).send({ msg: "contrasena incorrecta" });
        } else {
          res.status(200).send({
            access: jwt.createAccessToken(userStorage),
            refresh: jwt.createRefreshToken(userStorage),
          });
        }
      });
    })
    .catch(function (err) {
      res.status(500).send({ msg: "Error del servidor" });
    });
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).send({ msg: "token requerido" });
  }
  const hasExpired = jwt.hasExpiredToken(refreshToken);
  if (hasExpired) {
    res.status(400).send({ msg: "Token requerido" });
  }

  const { user_id } = jwt.decoded(refreshToken);

  User.findById(user_id)
  .then(function (userStorage){
    res.status(200).send({
      accessToken: jwt.createAccessToken(userStorage),

    });
  })
  .catch(function (err){
    res.status(500).send({ msg: "error del servidor" });
  });
  
  
 // res.status(200).send({ msg: "todo ok" });
}
export const AuthController = {
  register,
  login,
  refreshAccessToken,
};
