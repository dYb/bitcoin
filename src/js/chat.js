import {
  $,
  ajax,
  BASE_URL
} from './util'
import pop from './pop'

import "../css/chat.less";
var chatUser = ""
export default (container, userId) => {
  const onConnect = () => {
    console.log('connect111')
    initDom(container)
  }
  const onOfflineMsgs = (messages) => {
    console.log('offline message')
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(messages))
  }
  const onMsg = (messages) => {
    console.log('message')
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(messages))
  }
  const onRoamingmsgs = (messages) => {
    console.log('roaming message')
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(messages.msgs))
  }

  getAccount((data) => {
    const nim = init(data, {
      onConnect,
      onOfflineMsgs,
      onMsg,
      onRoamingmsgs
    })
    bindEvent(nim, container, userId)
  })
}

function initDom(container) {
  $(container).innerHTML = `
    <div class="js-list"></div>
    <div class="form form-inline">
      <div class="col-10">
        <input type="text" class="js-input form-control" style="margin-bottom: 0" />
      </div>
      <button class="js-btn btn btn-primary col-2">发送</button>
    </div>
  `
}

function init({
  imToken,
  imAccount
}, {
  onConnect,
  onOfflineMsgs,
  onMsg,
  onRoamingmsgs
}) {
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
    onroamingmsgs: onRoamingmsgs,
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
          // callback({
          //   imToken: '10ad68063cd5b7e02e060337e971cc16',
          //   imAccount: '6'
          // })
      } else {
        chatUser = data.data
        callback(data.data)
      }
    }
  })
}

function renderList(messages, self) {
  if(!messages || messages.length == 0){
    return "";
  }
  const html = messages.map((msg) => {
    if (chatUser.imAccount === msg.from) {
      self = true
    } else{
      self = false
    }
    return `
      <div class="clearfix">
        <span class="${self ? 'left' : 'right'}" style="max-width: 80%">
          ${msg.content.replace(/javascript/i, '')}
        </span>
      </div>
    `
  }).join('');
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
        $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList([msg], parseInt(Math.random() * 10) < 5 ? true : false))
      }
    })
  }, false)
}