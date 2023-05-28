const user_model = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const get_users = async () => {
    const list_user = await user_model.find({});
    return list_user;
};

const get_users_by_username = async (username) => {
    const user = await user_model.findOne({ email: username });
    return user;
};

const get_user = async (_idIser) => {
    const user = await user_model.findById(_idIser);
    return user;
};
// const login = async (email, password, fcmtoken) => {
//     const user = await user_model.findOne({ email });
//     if (user != null && await bcrypt.compare(password, user.password)) {
//         //console.log('UserService login: ', user);
//         user.fcmtoken = fcmtoken;
//         await user.save();
//         return user;
//     }
//     return null;
// };

const login = async (username, email, password, fcmtoken) => {
    if (username == null) {
        const user = await user_model.findOne({ email });
        if (user != null && await bcrypt.compare(password, user.password)) {
            //console.log('UserService login: ', user);
            user.fcmtoken = fcmtoken;
            await user.save();
            return user;
        }
    } else {
        const user2 = await user_model.findOne({ username });
        if (user2 != null && await bcrypt.compare(password, user2.password)) {
            //console.log('UserService login: ', user);
            user2.fcmtoken = fcmtoken;
            await user2.save();
            return user2;
        }
    }
    return null;
};

const updateFcmToken = async (_idUser, tokenFcm) => {
    const user = await user_model.findByIdAndUpdate(
        { _id: _idUser }, { fcmtoken: tokenFcm }
    );
    return user;
};

// const register = async (email, password, name, birthday, numberPhone, avatar) => {
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(password, salt);
//     const user_server = await user_model.findOne({ 'email': email });
//     if (user_server != null) {
//         return;
//     } else {
//         if (email == "" || password == "") {
//             return;
//         } else {
//             const user = new user_model({ email, password: hash, name, birthday, numberPhone, avatar });
//             await user.save();
//             return user;
//         }
//     }
// };

const register = async (username, email, password, name, birthday, numberPhone, avatar) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user_server = await user_model.findOne({ 'email': email });
    const user_server2 = await user_model.findOne({ 'username': username });
    if (user_server != null || user_server2 != null) {
        return;
    } else {
        if (username == null) {
            if (email == "" || password == "") {
                return;
            } else {
                const user = new user_model({ username, email, password: hash, name, birthday, numberPhone, avatar, loginType: 'google' });
                await user.save();
                return user;
            }
        } else {
            if (username == "" || password == "") {
                return;
            } else {
                const user = new user_model({ username, email, password: hash, name, birthday, numberPhone, avatar, loginType: 'username' });
                await user.save();
                return user;
            }
        }

    }
};

// const update_user = async (_idUser, email, name, birthday, numberPhone, avatar) => {
//     const user = await user_model.findByIdAndUpdate(
//         { _id: _idUser }, { email, name, birthday, numberPhone, avatar }
//     );
//     return user;
// };

const update_user = async (_idUser, email, name, birthday, numberPhone, avatar) => {
    const user = await user_model.findById({ _id: _idUser });
    //console.log('user: ', user);
    const users = await user_model.find({});
    if (user != null) {
        if (users.length > 0) {
            let check = false;
            for (let i = 0; i < users.length; i++) {
                if(users[i].email == null){
                    continue;
                }
                if (users[i].email.toLowerCase() == email.toLowerCase() && users[i]._id != _idUser) {
                    check = true;
                    break;
                }
            }
            if (check == true) {
                return null;
            } else {
                user.email = email;
                user.name = name;
                user.birthday = birthday;
                user.numberPhone = numberPhone;
                user.avatar = avatar;
                await user.save();
                return user;
            }
        } else {
            user.email = email;
            user.name = name;
            user.birthday = birthday;
            user.numberPhone = numberPhone;
            user.avatar = avatar;
            await user.save();
            return user;
        }
    } else {
        return null;
    }
};

const delete_user = async (_idUser) => {
    await user_model.deleteOne(_idUser);
};

const forgot_password = async (email) => {
    const user = await user_model.findOne({ email });
    if (user) {
        const token = jwt.sign({ user }, 'shhhhh', { expiresIn: '300s' });
        user.resetPasswordToken = token;
        await user.save();
        return user;
    }
    return null;
};

//reset password
const reset_password = async (token, password) => {
    const user = await user_model.findOne({ resetPasswordToken: token });
    if (user) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        user.resetPasswordToken = null;
        await user.save();
        return user;
    }
    return null;
};

//Doi mat khau
const change_password = async (id, password, new_password) => {
    const user = await user_model.findById(id);
    if (user && await bcrypt.compare(password, user.password)) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(new_password, salt);
        user.password = hash;
        await user.save();
        return user;
    }

};

module.exports = {
    get_user, get_users, login, register,
    update_user, delete_user, forgot_password, reset_password,
    get_users_by_username, change_password, updateFcmToken
};