const filterImage = (req, file, cb) => {
  if (
    file.mimetype === "images/jpg" ||
    file.mimetype === "images/png" ||
    file.mimetype === "images/webp" ||
    file.mimetype === "images/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};

module.exports = { filterImage };
