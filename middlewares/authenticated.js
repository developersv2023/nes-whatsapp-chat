import { jwt } from "../utils/index.js";
function asureAuth(req, res, next) {
  // console.log("Midleware ejecutado");
  //res.status(400).send({msg: " no puedes pasar"});
  //   console.log(req.headers);
  if (!req.headers.authorization) {
    return res.status(403).send({ msg: "no tiene cabecera correcta" });
  }

  const token = req.headers.authorization.replace("Bearer ","");

  try {
    const hasExpired = jwt.hasExpiredToken(token);

    if (hasExpired) {
      return res.status(400).send({ msg: "el token ha espirado" });
    }

    const payload = jwt.decoded(token);
    
    req.user = payload;

    next();

  } catch (error) {
    return res.status(400).send({ msg: "token invalido" });
  }
}
export const mdAuth = {
  asureAuth,
};
