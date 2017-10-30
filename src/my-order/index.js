import {
  $,
  ajax,
  localParam,
  PAY_TYPE,
  BASE_URL,
  ORDER_STATUS,
  redirect
} from '../js/util'
import pop from '../js/pop'
import chat from '../js/chat'
import confirm from "../js/confirm"
import '../css/reset.css'
import './index.less'

const {
  id
} = localParam().search
const getOrderDetail = () => {
  ajax({
    url: `${BASE_URL}/api/order/info/${id}`,
    success(data) {
      if (data.code !== 0) {
        pop.alert(data.msg)
      } else {
        $('.g-container-inner').innerHTML = render(data.data)
        initChat(data)
      }
    }
  })
}
getOrderDetail()
let initChatStatus = false
let CHAT = ''
const initChat = (data) => {
  if (initChatStatus) {
    return
  }
  initChatStatus = true
  CHAT = chat('.js-chat', data.data.userId, data.data.adsUserId, {
    onOfflineCustomSysMsgs() {
      getOrderDetail()
    },
    onCustomSysMsg() {
      getOrderDetail()
    }
  })
}


$('.g-container-inner').addEventListener('click', (e) => {
  if (e.target.classList.contains('js-cancel')) {
    confirm({
      title: '取消订单',
      content: '确认取消该订单么？',
      type: 'noRem',
      success() {
        ajax({
          url: `${BASE_URL}/api/order/cancel/${id}`,
          success(ajaxData) {
            if (ajaxData.code === 0) {
              pop.alert('取消订单成功')
              getOrderDetail()
            } else {
              pop.alert(ajaxData.msg)
            }
          }
        })
      }
    })
  } else if (e.target.classList.contains('js-confirm')) {
    confirm({
      title: '标记付款',
      content: '确认标记付款订单么？',
      type: 'noRem',
      success() {
        ajax({
          url: `${BASE_URL}/api/order/markPay/${id}`,
          success(ajaxData) {
            if (ajaxData.code === 0) {
              pop.alert('标记付款成功')
              getOrderDetail()
            } else {
              pop.alert(ajaxData.msg)
            }
          }
        })
      }
    })
  } else if (e.target.classList.contains('js-pay')) {
    confirm({
      title: '释放比特币',
      content: '确认释放比特币么？',
      type: 'noRem',
      success() {
        ajax({
          url: `${BASE_URL}/api/order/transfer/${id}`,
          success(ajaxData) {
            if (ajaxData.code === 0) {
              pop.alert('释放比特币成功')
              getOrderDetail()
            } else {
              pop.alert(ajaxData.msg)
            }
          }
        })
      }
    })
  } else if (e.target.classList.contains('js-remind-money')) {
    CHAT.getSend()('请您尽快付款')
  } else if (e.target.classList.contains('js-remind-coin')) {
    CHAT.getSend()('我已经付款，请确认后尽快释放货币')
  } else if (e.target.classList.contains('js-wallet')) {
    redirect('./wallet.html', '我的钱包')
  }
}, false)

function render(data) {
  let actionHtml = ''
  let statusHtml = ''
  if (data.canCancel) {
    actionHtml += `
      <button class="js-cancel btn btn-danger">取消订单</button>
    `
  }
  if (data.canPaySucc) {
    actionHtml += `
      <button class="js-confirm btn btn-outline-success">付款成功</button>
    `
  }
  if (data.canPayCoin) {
    actionHtml += `
      <button class="js-pay btn btn-outline-danger">对方已付款，同意释放比特币</button>
    `
  }
  if (data.canRemindPayMoney) {
    actionHtml += `
      <button class="js-remind-money btn btn-outline-primary">提醒对方付款</button>
    `
  }
  if (data.canRemindPayCoin) {
    actionHtml += `
      <button class="js-remind-coin btn btn-outline-primary">提醒对方打币</button>
    `
  }
  if (data.canToWallet) {
    actionHtml += `
      <button class="js-wallet btn btn-outline-primary">进入我的钱包</button>
    `
  }
  const minutes = Math.floor((data.endTime - Date.now()) / (60 * 1000))
  if (data.orderStatus == 0) {
    statusHtml = `<div class="text-secondary tip fn-mb10">比特币将在托管中心保存<span class="text-success">${minutes}</span>分钟</div>`
  }
  let display = 'block'
  if (!actionHtml && !statusHtml) {
    display = 'none'
  }
  return `
    <div class="line line-1 d-flex justify-content-between">
      <div class="text-dark">订单编号：${data.id || ''} </div>
      <div>${ORDER_STATUS[data.orderStatus || 0]} </div>
    </div>
    <div class="line line-2">
      <div class="d-flex text-dark justify-content-between"><span>交易金额</span>${data.orderMoney || 0} RMB</div>
      <div class="d-flex text-secondary justify-content-between"><span>交易数量</span>${data.orderNum || 0} BTC</div>
      <div class="d-flex text-secondary justify-content-between"><span>交易单价</span>${data.adsPrice || 0} RMB</div>
    </div>
    <div class="line line-3">
      <div class="text-dark d-flex">
        <div>买家：${data.buyUserName || ''} <span class="badge badge-succes">${PAY_TYPE[data.payType]}</span></div>
        <div style="text-align: right;">卖家：${data.sellUserName || ''} </div>
      </div>
      <div class="intro text-secondary">广告留言：${data.adsDescribe || ''}</div>
    </div>
    <div class="line line-3 text-center" style='display:${display}'>
      ${statusHtml}
      ${actionHtml}
    </div>
  `
}
