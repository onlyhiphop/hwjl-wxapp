var CONFIG = require('../config.js')
var API = CONFIG.api;

//登录
var authLogin = API + '/wxLogin';

module.exports = {
  authLogin
}