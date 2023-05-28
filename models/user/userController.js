const mailer = require('nodemailer');
const userService = require('./userService');
const jwt = require('jsonwebtoken');

const get_users = async () => {
    try {
        const users = await userService.get_users();
        return users;
    } catch (error) {
        console.log('Error get users: ' + error.message);
    }
};

const get_users_by_username = async (username) => {
    try {
        const user = await userService.get_users_by_username(username);
        return user;
    } catch (error) {
        console.log('Error get user by username: ' + error.message);
    }
};

const get_user = async (_idUser) => {
    try {
        const user = await userService.get_user(_idUser);
        return user;
    } catch (error) {
        console.log('Error get user: ' + error.message);
    }
};

// const login = async (email, password, fcmtoken) => {
//     try {
//         const user = await userService.login(email, password, fcmtoken);
//         if (user) {
//             return user;
//         }
//         return null;
//     } catch (error) {
//         console.log('Error login: ' + error.message);
//     }
// };

const login = async (username, email, password, fcmtoken) => {
    try {
        const user = await userService.login(username, email, password, fcmtoken);
        if (user) {
            return user;
        }
        return null;
    } catch (error) {
        console.log('Error login: ' + error.message);
    }
};

const updateFcmToken = async (_idUser, tokenFcm) => {
    try {
        const user = await userService.updateFcmToken(_idUser, tokenFcm);
        return user;
    } catch (error) {
        console.log('Error updateFcmToken: ' + error.message);
    }
};

const register = async (username, email, password, name, birthday, numberPhone, avatar) => {
    try {
        const user = await userService.register(
            username, email, password, name, birthday, numberPhone, avatar
        );
        return user;
    } catch (error) {
        console.log('Error register: ' + error.message);
    }
};

const update_user = async (_idUser, email, name, birthday, numberPhone, avatar) => {
    try {
        const user = await userService.update_user(
            _idUser, email, name, birthday, numberPhone, avatar
        );
        return user;
    } catch (error) {
        console.log('Error update_user: ' + error.message);
    }
};

const delete_user = async (_idUser) => {
    try {
        await userService.delete_user(_idUser);
        return 'Delete successfully';
    } catch (error) {
        console.log('Error delete_user: ' + error.message);
    }
};

//send mail
const transporter = mailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ngochuongtr1975@gmail.com',
        pass: 'evonernhfoelmaxh'
    },
});


const forgot_password = async (email) => {
    try {
        const user = await userService.forgot_password(email);
        if (user.resetPasswordToken) {
            const mailOptions = {
                from: '',
                to: email,
                subject: 'Reset password',
                html: `<h1>Click <a href="http://localhost:3000/users/cpanel/reset-password/${user.resetPasswordToken}">here</a> to reset password</h1>`
            };
            await transporter.sendMail(mailOptions);
            return true;
        }
        return false;
    } catch (error) {
        console.log('Error forgot_password: ' + error.message);
    }
};

// //Kiem tra token co hop le hay khong
// const verify_token = async (token) => {
//     const data = jwt.verify(token, 'shhhhh');
//     if (data) {
//         return true;
//     }
//     return false;
// };

//Reset password
const reset_password = async (token, password, confirm_password) => {
    if(password != confirm_password) {
        console.log('Password and confirm password not match');
        return false;
    }
    const data = jwt.verify(token, 'shhhhh');
    if(data) {
        const user = await userService.reset_password(token, password);
        return user;
    }
    return null;
};

const change_password = async ( id, password, new_password, confirm_password) => {
    if(new_password != confirm_password || password == new_password) {
        console.log('Password and confirm password not match');
        return false;
    }
    const user = await userService.change_password(id, password, new_password);
    return user;
};

module.exports = { 
    get_user, get_users, login, register, 
    update_user, delete_user, forgot_password, reset_password,
    get_users_by_username, change_password, updateFcmToken
}