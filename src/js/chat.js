import {
  $,
  ajax,
  BASE_URL
} from './util'
import pop from './pop'

export default (container, userId) => {
  const onConnect = () => {
    console.log('connect111')
    initDom(container)
  }
  const onOfflineMsgs = (messages) => {
    console.log('offline message')
    $(container).querySelector('.js-list').innerHTML = renderList(messages, false)
  }
  const onMsg = (messages) => {
    console.log('message')
    $(container).querySelector('.js-list').innerHTML = renderList(messages, false)
  }
  const nim = init({ imAccount: 1 }, { onConnect, onOfflineMsgs, onMsg })
  bindEvent(nim, container, userId)
  // getAccount((data) => {
  //   const nim = init(data, { onConnect, onOfflineMsgs, onMsg })
  //   bindEvent(nim, container, userId)
  // })
}
function initDom(container) {
  $(container).innerHTML = `
    <div class="js-list"></div>
    <div class="form form-inline">
      <div class="form-group col-10">
        <input type="text" class="js-input form-control" style="margin-bottom: 0" />
      </div>
      <button class="js-btn btn btn-primary col-2">发送</button>
    </div>
  `
}
function init({ imToken, imAccount }, { onConnect, onOfflineMsgs, onMsg }) {
  return window.NIM.getInstance({
    appKey: '10ad68063cd5b7e02e060337e971cc16',
    account: imAccount,
    token: imToken,
    onconnect: onConnect,
    onerror() {
      pop.error('聊天初始化失败')
    },
    onofflinemsgs: onOfflineMsgs,
    onmsg: onMsg,
    ondisconnect(error) {
      console.log(error)
      pop.error('聊天已断开')
    }
  })
}

function getAccount(callback) {
  ajax({
    url: `${BASE_URL}/api/im/my/account`,
    success(data) {
      if (data.code !== 0) {
        pop.error(data.msg)
        callback({ imToken: '10ad68063cd5b7e02e060337e971cc16', imAccount: '6' })
      } else {
        callback(data.data)
      }
    }
  })
}

function renderList(messages, self) {
  const html = messages.map((msg) => {
    return `
    <div class="clearfix">
      <div class="card ${self ? 'bg-light float-right' : 'text-white bg-primary'}" style="max-width: 80%;">
        <div class="card-body">
          <p class="card-text">${msg.content.replace(/javascript/i, '')}</p>
        </div>
      </div>
    </div>
    `
  })
  return html
}

function bindEvent(nim, container, userId) {
  $(container).addEventListener('click', (e) => {
    if (!e.target.classList.contains('js-btn')) return
    const content = $(container).querySelector('.js-input').value.trim()
    if (!content) return
    const msg = nim.sendCustomMsg({
      scene: 'p2p',
      to: userId,
      content,
      done() {
        renderList([msg], true)
      }
    })
  }, false)
}
