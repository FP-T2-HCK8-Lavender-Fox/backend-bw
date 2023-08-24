const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const hashPassword = (password) => bcrypt.hashSync(password, 7);
const verifPassword = (password, hashed) => bcrypt.compareSync(password, hashed);
const signToken = (data) => jwt.sign(data, secret);
const verifToken = (access_token) => jwt.verify(access_token, secret);

module.exports = { hashPassword, verifPassword, signToken, verifToken };
