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
    .map(key => `${key}=${data[key]}`)
    .join('&')
  const token = localStorage.getItem('token')
  if (needToken && !token) {
    redirect('./login/', '登录')
    return
  }
  if (needToken) {
    body += `&token=${token}`
  }
  const request = new XMLHttpRequest()
  request.open(method, url, true)
  if (method.toUpperCase() === 'POST') {
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
  }
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const result = JSON.parse(request.responseText)
      // 未登录
      if (needToken && +result.code === 100001) {
        redirect('./login/', '登录')
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
export const $$ = document.querySelectorAll.bind(document)

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

export function redirect(href, title) {
  if (process.env.NODE_ENV === 'development') {
    window.location.href = href
  } else {
    window.location.href = `bitcoin://open?title=${encodeURIComponent(title)}&`
  }
}
