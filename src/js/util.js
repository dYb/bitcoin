export function localParam(search, hash) {
  const s = search || window.location.search
  const h = hash || window.location.hash
  let fn = (str, reg) => {
    let data = {}
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
export function ajax(option) {
  if (!option.url) {
    throw new Error('Need for url')
  }
  const dataType = option.dataType || 'text'
  const method = option.method || 'GET'
  let data = ''
  if (!!option.data && typeof option.data !== 'string') {
    data = Object.keys(option.data)
      .map(key => `${key}=${option.data[key]}`)
      .join('&')
  } else {
    data = option.data
  }
  const request = new XMLHttpRequest()
  request.open(method, option.url, true)
  if (method.toUpperCase() === 'POST') {
    if (!option.headers) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    } else {
      Object.keys(option.headers).forEach((item) => {
        request.setRequestHeader(item, option.headers[item])
      })
    }
  }
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      let result = request.responseText
      if (dataType.toUpperCase() === 'JSON') {
        result = JSON.parse(request.responseText)
      }
      if (typeof option.success === 'function') {
        option.success(result)
      }
    } else if (typeof option.error === 'function') {
      option.error()
    }
  }
  request.send(data)
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
      time = time - 1
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
