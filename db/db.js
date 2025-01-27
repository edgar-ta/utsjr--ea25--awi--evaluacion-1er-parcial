import mongoose from "mongoose";

import { message } from "../libs/messages.js";



export async function connectDb() {
    // const url = 'mongodb+srv://trejoavilaesgar:csfFhB0dJX8B4Q0q@cluster0.7jsob.mongodb.net/?retryWrites=true&w=majority&appName=MongoDbApp';
    const url = 'mongodb://localhost:27017/'

    return mongoose.connect(url)
        .then(connection => {
            // console.log(connection);
            console.log("Conexión correcta con MongoDB");
            return message(200, "Connection was successful");
        })
        .catch(error => {
            throw message(400, "There was a connection error", error);
        })
    ;
}
