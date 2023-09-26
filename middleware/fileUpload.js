import multer from "multer";

const storage = multer.diskStorage({
  filename: function (request, file, callback) {
    callback(null, file.originalname);
  },
  destination: function (request, file, callback) {
    callback(null, process.cwd()+"/tmp");
  },
});

export default multer({ storage });
