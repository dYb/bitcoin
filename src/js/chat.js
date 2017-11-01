import {
  $,
  ajax,
  BASE_URL
} from './util'
import pop from './pop'

import "../css/chat.less";
var chatUser = "",
  toUserId = "";
var filterChat = (list) => {
  chatUser
  return list.filter((_data) => {
    if (_data.from == chatUser.imAccount && _data.to == toUserId || _data.from == toUserId && _data.to == chatUser.imAccount) {
      return true
    } else {
      return false;
    }
  })
}
var getRoamMessage = () => {
  ajax({
    url: `${BASE_URL}/api/im/my/historyMsg`,
    data: {
      otherUserId: toUserId
    },
    success(ajaxData){
      debugger;
    }
  })
}
export default (container, userIdA, userIdB, obj) => {
  const onConnect = () => {
    console.log('connect111')
    initDom(container)
  }
  const onOfflineMsgs = (messages) => {
    console.log('offline message')
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(filterChat(messages)))
  }
  const onMsg = (messages) => {
    console.log('message')
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(filterChat([messages])))
  }
  const onRoamingmsgs = (messages) => {
    // 漫游消息
    console.log('roaming message')
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(filterChat(messages.msgs)))
  }
  const onOfflineCustomSysMsgs = (messages) => {
    // 收到离线自定义系统通知
    $(container).querySelector('.js-list').insertAdjacentHTML('`beforeend', renderList(filterChat(messages), "system"))
    obj.onOfflineCustomSysMsgs && obj.onOfflineCustomSysMsgs();
  }
  const onCustomSysMsg = (messages) => {
    //收到自定义系统通知
    $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList(filterChat([messages]), "system"))
    obj.onCustomSysMsg && obj.onCustomSysMsg();
  }

  getAccount((data) => {
    // 判断什么是自己的id，什么是对手的id
    toUserId = (data.imAccount == userIdA ? userIdB : userIdA);
    const nim = init(data, {
      onConnect,
      onOfflineMsgs,
      onMsg,
      onRoamingmsgs,
      onOfflineCustomSysMsgs,
      onCustomSysMsg
    })
    bindEvent(nim, container, toUserId)
    getRoamMessage();
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
    onRoamingmsgs,
    onOfflineCustomSysMsgs,
    onCustomSysMsg
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
    onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
    oncustomsysmsg: onCustomSysMsg,
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
        chatUser = data.data;
        callback(data.data)
      }
    }
  })
}

function renderList(messages, type) {
  if (!messages || messages.length == 0) {
    return "";
  }
  const html = messages.map((msg) => {
    if (!msg.content) {
      return;
    }
    var _msg = "";
    if (type !== "system") {
      _msg = msg.content ? msg.content.replace(/javascript/i, '') : "";
      if (chatUser.imAccount == msg.from) {
        type = "self"
      } else {
        type = "other"
      }
    } else if (type == "system") {
      type = "system";
      _msg = eval('(' + msg.content + ')').msg;
    }

    // var t = Math.random() * 10;
    // if (t < 3) {
    //   type = "self";
    // } else if (t > 6) {
    //   type = "other"
    // } else {
    //   type = "system"
    // }

    return `
      <div class="clearfix">
        <span class="${type}">
          ${_msg}
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
        $(container).querySelector('.js-list').insertAdjacentHTML('beforeend', renderList([msg]))
        $(container).querySelector('.js-input').value = "";
      }
    })
  }, false)
}