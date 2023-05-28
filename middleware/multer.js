const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  secure: true,
  cloud_name: 'dn46v6yn9',
  api_key: '648782375478592',
  api_secret: 'NrklW54a4wbl_689vLAT1eZQNtQ',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "iTech",
  },
});

const upload = multer({ storage: storage });

module.exports = upload;