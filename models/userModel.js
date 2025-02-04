import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        id: true
    }
);

/**
 * Creates an object from a mongoDb record of the user table
 * @param {Document} record The user record to convert into an object
 * @returns {{ username?: string, email?: string, hash?: string, salt?: string, id?: string }} The object that results from record
 */
export function getCleanUserObject(record) {
    return ({
        username: record.username,
        email: record.email,
        hash: record.hash,
        salt: record.salt,
        id: record._id
    });
}

export default mongoose.model('User', userSchema);

