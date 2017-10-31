// export const BASE_URL = 'http://116.206.176.112'
export const BASE_URL = (() => {
  if (window.location.host.indexOf('localhost') >= 0) {
    // return 'http://47.95.234.100:8081'
    return 'http://116.206.176.112'
  }
  return ''
})()

const isApp = (/bitcoin/i).test(navigator.userAgent)

export function localParam(search, hash) {
  const s = search || window.location.search
  const h = hash || window.location.hash
  const fn = (str, reg) => {
    const data = {}
    if (str) {
      str.replace(reg, ($0, $1, $2, $3) => {
        data[$1] = $3
      })
      return data
    }
    return null
  }
  return {
    search: fn(s, new RegExp('([^?=&]+)(=([^&]*))?', 'g')) || {},
    hash: fn(h, new RegExp('([^#=&]+)(=([^&]*))?', 'g')) || {}
  }
}
export function ajax({
  url,
  method = 'GET',
  data = {},
  needToken = true,
  success = () => {},
  error = () => {}
}) {
  let body = Object.keys(data)
    .filter(key => data[key] !== '')
    .map(key => `${key}=${data[key]}`)
    .join('&')
  const token = getToken()
  let URL = url
  if (needToken && !token) {
    redirect('./login.html', '登录')
    return
  }
  if (needToken) {
    if (body) {
      body += '&'
    }
    body += `token=${token}`
  }
  if (method === 'GET') {
    URL = `${url}?${body}`
  }
  const request = new XMLHttpRequest()
  request.open(method, URL, true)
  if (method.toUpperCase() === 'POST') {
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
  }
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const result = JSON.parse(request.responseText)
      // 未登录
      if (needToken && +result.code === 100001) {
        redirect('./login.html', '登录')
        return
      }
      success(result)
    } else {
      error(request.responseText)
    }
  }
  request.send(body)
}

export const $ = document.querySelector.bind(document)
export const $$ = (selector) => {
  const doms = document.querySelectorAll(selector)
  return Array.prototype.slice.call(doms)
}

export function timer(interval, onProgress, onEnd) {
  let t = null
  return () => {
    let time = interval
    if (t) return
    onProgress(time)
    t = setInterval(() => {
      time += -1
      if (time <= 0) {
        clearInterval(t)
        t = null
        onEnd()
      } else {
        onProgress(time)
      }
    }, 1000)
  }
}

export function getToken() {
  const token = localParam().search.token || localStorage.getItem('token')
  return token
}

export function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return false
  return JSON.parse(userInfo)
}
export function setUserInfo(userInfo) {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function checkPassword(callback = () => {}) {
  const token = getToken()
  const { hasFundPwd } = getUserInfo()
  if (!token) {
    redirect('./login.html', '登录')
    return
  }
  // 存在资金密码
  if (hasFundPwd) {
    callback()
    return
  }
  ajax({
    url: `${BASE_URL}/api/user/info`,
    success(data) {
      if (data.code !== 0) {
        redirect('./login.html', '登录')
      } else if (data.data.hasFundPwd) {
        callback()
      } else {
        redirect('./password.html?set=1', '设置资金密码')
      }
    }
  })
}

export function redirect(href, title) {
  if (isApp) {
    window.location.href = `bitcoin://open?title=${encodeURIComponent(title)}&url=${encodeURIComponent(href)}`
  } else {
    window.location.href = href
  }
}

export function openTab(index, url = '') {
  if (isApp) {
    const schema = `bitcoin://openTab/${index}`
    console.log(url ? `${schema}?url=${encodeURIComponent(url)}` : schema)
    window.location.href = url ? `${schema}?url=${encodeURIComponent(url)}` : schema
  } else {
    window.location.href = './market.html'
  }
}

export const PAY_TYPE = ['', '支付宝', '银行转账', '微信支付']
export const ORDER_STATUS = ['待付款', '已付款', '交易成功', '已取消']
export const ORDER_TYPE = ['', '购买', '出售']

export function timeFormat(time) {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${year}-${fixNumber(month)}-${fixNumber(day)} ${fixNumber(hour)}:${fixNumber(minute)}`
}

function fixNumber(number) {
  if (number < 10) {
    return `0${number}`
  }
  return number
}
