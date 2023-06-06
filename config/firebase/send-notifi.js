// const admin = require('firebase-admin');
// const user_controller = require('../models/user/userController');

// const onSendData = async (userId, data) => {
//   try {
//     // Get the users details
//     const user = await user_controller.get_user(userId);
//     console.log("Send notifi sever: ", user.tokenFcm);

//     const payload = {
//       notification: {
//         title: data.title,
//         body: data.body,
//       },
//       data: {
//         idSender: data.data.idSender,
//         idReceiver: data.data.idReceiver,
//         body: data.data.body,
//         image: data.data.image,
//         time: data.data.time,
//         _id: data.data._id + "",
//         idTalk: data.data.idTalk + "",
//       }
//     };

//     const res = await admin.messaging().sendToDevice(
//       user.tokenFcm, payload,
//       {
//         // Required for background/quit data-only messages on iOS
//         contentAvailable: true,
//         // Required for background/quit data-only messages on Android
//         priority: 'high',
//       },
//     );
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = {onSendData};