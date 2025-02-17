import User from "../models/userModel.js";
import { encryptPassword, validatePassword } from "../middlewares/passwordFunctions.js";
import { message } from "../libs/messages.js";
import { createToken } from "../libs/jwt.js";

export const register = async ({ username, email, password }) => {
    return Promise.any([
        User.findOne({ username }), 
        User.findOne({ email })
    ])
        .then(async (user) => {
            if (user === null) {
                const { salt, hash } = encryptPassword(password);
                const record = new User({ username, email, hash, salt });
                return record
                    .save()
                    .then(record => createToken({ 
                        id: record._id,
                        username: record.username, 
                        email: record.email 
                    }))
                    .then(token => message(200, "User registered successfully", "", token))
                    .catch(error => message(400, "There was an error registering the user", error))
                ;
            }
            if (user.username === username) {
                return message(400, "The username already exists", `Username '${username}' already exists in the database; the user could not be registered`);
            }
            if (user.email === email) {
                return message(400, "The email already exists", `Email '${email}' already exists in the database; the user could not be registered`);
            }
        })
    ;

};

export const login = async ({ username, password }) => {
    return User
        .findOne({ username })
        .then((user) => {
            const isCorrectPassword = validatePassword(password, user.salt, user.hash);
            if (!isCorrectPassword) {
                return message(200, `Wrong password for user ${username}`);
            }
            return createToken({ id: user._id })
                .then(token => message(200, `Welcome ${username}!`, `User ${user._id} logged in`, token))
            ;
        })
        .catch(error => message(200, `The user with the username ${username} doesn't exist`))
    ;
};


export const isAdmin = async (id) => {
    try {
        const user = await userModel.findById(id);
        return user.type === "admin";
    } catch (error) {
        return false;
    }
};
