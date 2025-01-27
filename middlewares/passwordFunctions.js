import crypto from "crypto"

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

export function onAuthorizedUser() {
    // 
}

export function onAuthorizedAdmin() {
    // 
}


