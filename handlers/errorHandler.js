module.exports = (err, req, res, next) => {
  const status = 500;
  const message = "Internal server error";

  //!handle error sequelize
  if (err.errors) {
    if (err.errors[0].message === "minimum password length is 7!") {
      err.name = "minimum password length is 7!";
    }
    if (err.errors[0].message === "Invalid email format!") {
      err.name = "Invalid email format!";
    }
    if (err.errors[0].message === "email must be unique") {
      err.name = "email must be unique";
    }
    if (err.errors[0].message === "username must be unique") {
      err.name = "username must be unique";
    }
  }
  //!handle error dari users
  //!400
  switch (err.name) {
    case "name is required!":
    case "gender is required!":
    case "birthdate is required!":
    case "email is required!":
    case "password is required!":
    case "phone number is required!":
    case "address is required!":
    case "ktp id is required!":
    case "minimum password length is 7!":
    case "Invalid email format!":
    case "email must be unique":
    case "username must be unique":
    case "username is required!":
      res.status(400).json({ message: err.name });
      break;

    //!401
    case "invalid email/password":
    case "invalid username/password":
      res.status(401).json({ message: err.name });
      break;
    case "invalid token!":
      res.status(401).json({ message: err.name });
      break;

    //!500
    default:
      res.status(status).json({ message });
      break;
  }
};