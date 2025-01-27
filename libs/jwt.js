import jwt from "jsonwebtoken"
import { message } from "../libs/messages.js";
import "dotenv/config";
import { Types } from "mongoose";

/**
 * 
 * @param {{ id: Types.ObjectId }} data 
 * @returns 
 */
export function createToken(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            data,
            process.env.SECRET_TOKEN,
            {
                expiresIn: "1d"
            },
            (error, token) => {
                if (error !== null) {
                    reject(message(400, "Error when signing up/logging in", error));
                    return;
                }
                resolve(token);
            }
        );
    });
};

