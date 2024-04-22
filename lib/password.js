import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hash = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds).then(function (hash) {
            resolve(hash)
        })
        .catch(err => {
            reject({error: "Hashing not completed."})
        })
    })
}

export const verify = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash).then(function (result) {
            resolve(result)
        })
        .catch(err => {
            reject({error: "Please fill the correct password."})
        })
    })
}

export const validation = (password) => {
    var result = { valid: true, message: "Password is valid" };
    switch (true) {
        case password.length !== 8:
            result.valid = false;
            result.message = "Password must be 8 characters long";
            break;
        case !/[a-z]/.test(password):
            result.valid = false;
            result.message = "Password must contain at least one lowercase letter";
            break;
        case !/[A-Z]/.test(password):
            result.valid = false;
            result.message = "Password must contain at least one uppercase letter";
            break;
        case !/\d/.test(password):
            result.valid = false;
            result.message = "Password must contain at least one digit";
            break;
        default:
            break;
    }
    return result;
}