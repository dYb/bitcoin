import {
  ajax,
  redirect,
  BASE_URL
} from './util'
import pop from './pop'

export default (container) => {
  getCount((data) => {
    init(data, { onConnect, onOfflineMsgs })
  })
}

function onConnect() {
  console.log('connect')
}

function onOfflineMsgs() {
  console.log('offline message')
}

function init({ imToken, imAccount }, { onConnect, onOfflineMsgs }) {
  window.SDK.NIM.getInstance({
    appKey: imToken,
    account: imAccount,
    token: '219b600d736e71fa9d83b676326fec76',
    onconnect: onConnect,
    onerror() {
      pop.error('聊天初始化失败')
    },
    onofflinemsgs: onOfflineMsgs,
    ondisconnect(error) {
      if (error) {
        switch (error.code) {
          // 账号或者密码错误, 请跳转到登录页面并提示错误
          case 302:
            pop.error('账号密码错误')
            setTimeout(() => {
              redirect('./login.html', '登录')
            }, 1000)
            break
          default:
            break
        }
      }
      pop.error('聊天已断开')
    }
  })
}

function getCount(callback) {
  ajax({
    url: `${BASE_URL}/api/im/my/account`,
    success(data) {
      if (data.code !== 0) {
        pop.error(data.msg)
      } else {
        callback(data.data)
      }
    }
  })
}
