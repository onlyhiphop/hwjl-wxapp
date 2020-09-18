var API = require('./api.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装request
 */
function request(url, data={}, method="GET"){
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: (res) => {
        let code = null
        if(res.code == 200){
          resolve(res)
        }else if(res.code == 403 && res.code == 401){  //没有授权或者登录状态过期
          return login().then(res => {
            code = res.code;
            return getUserInfo();
          }).then(userInfo => {
            //请求远程服务器
            request(API.authLogin, {code: code, userInfo: userInfo}, 'POST').then(res => {
              if(res.code == 200){
                //全局存储用户信息
                wx.setStorageSync('userInfo', res.data.userInfo);
                wx.setStorageSync('token', res.data.token);
                resolve(res);
              }else{
                reject(res)
              }
            }).catch(err => {
              reject(err)
            })
          }).catch(err => {
            reject(err)
          })
        }else{
          reject(res);
        }
      }
    })
  })
}

/**
 *  Post请求
 */
function requestPost(url, data){
  request(url, data, "Post");
}

/**
 * 登录
 */
function login(){
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if(res.code){
          resolve(res)
        }else{
          reject(res)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  });
}

/**
 * 获取用户信息
 */
function getUserInfo(){
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      withCredentials: true,    //是否包含iv,encryptedData敏感信息， 要先调用wx.login 且登录状态没有过期，否则报错
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * 检查微信会话是否过期
 */
function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: (res) => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * 重定向
 */


module.exports = {
  formatTime: formatTime,
  request,
  requestPost,
  checkSession,
  login
}
