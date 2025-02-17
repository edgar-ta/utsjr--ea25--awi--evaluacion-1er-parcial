import crypto from "crypto"
import jwt from "jsonwebtoken";
import { message } from "../libs/messages.js";
import userModel from "../models/userModel.js";
import { isAdmin } from "../db/userDb.js";

export function encryptPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");

    return {
        salt,
        hash
    };
}

export function validatePassword(password, salt, hash) {
    const tentativeHash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return hash == tentativeHash;
}

export function onAuthorizedUser(request, response, next) {
    const token = request.cookies.token;

    if (token === undefined) {
        response.status(400).json("El usuario no ha iniciado sesión");
        console.log("El usuario no está autorizado");
        return;
    }

    let shouldCallNext = false;
    jwt.sign(token, process.env.SECRET_TOKEN, (error, usuario) => {
        if (error !== null) {
            response.status(500).json("El usuario no está autorizado");
            return;
        }
        request.usuario = usuario;
        shouldCallNext = true;
    });

    if (shouldCallNext) {
        next();
    }
}

export function onAuthorizedUser2(request, token = null) {
    if (token === null) {
        return message(400, "Usuario no autorizado");
    }
    let returnMessage = message(200, `Bienvenido ${token}`);
    jwt.verify(token, process.env.SECRET_TOKEN, (error, usuario) => {
        if (error !== null) {
            returnMessage = message(400, "Usuario no autorizado");
            return;
        }

        request.usuario = usuario;
    });
    return returnMessage;
}

export async function onAuthorizedAdmin(request) {
    const token = request.cookies.token;
    const response = onAuthorizedUser2(request, token);

    if (response.status != 200) {
        return message(400, "Administrador no autorizado");
    }

    if (!(await isAdmin(request.usuario.id))) {
        return message(400, "Administrador no autorizado");
    }

    return message(200, "Administrador autorizado");
}
