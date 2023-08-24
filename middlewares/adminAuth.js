const { verifToken } = require("../helpers/helper");
const { Admin } = require('../models/index');



module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: "require a valid token!" };
    const check = verifToken(access_token);
    if (!check) throw { name: "require a valid token!" };
    const data = await Admin.findByPk(check.id);
    if (!data) throw { name: "require a valid token!" };
    req.user = {
      id: data.id,
      email: data.email,
      username: data.username
    };
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.name = "require a valid token!";
    }
    next(error);
  }
};