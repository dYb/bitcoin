import {
  $,
  ajax,
  localParam,
  PAY_TYPE,
  BASE_URL
} from '../js/util'
import pop from '../js/pop'
import chat from '../js/chat'
import '../css/reset.css'
import './index.less'

const {
  id
} = localParam().search
ajax({
  url: `${BASE_URL}/api/order/info/${id}`,
  success(data) {
    if (data.code !== 0) {
      pop.alert(data.msg)
    } else {
      $('.g-container-inner').innerHTML = render(data.data)
      setTimeout(() => {
        chat('.js-chat', data.data.adsUserId)
      }, 0)
    }
  }
})

$('.g-container-inner').addEventListener('click', (e) => {
  if (e.target.classList.contains('js-cancel')) {
    ajax({
      url: `${BASE_URL}/api/order/cancel/${id}`,
      success(ajaxData) {
        if (ajaxData.code === 0) {
          pop.alert('取消订单成功')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          pop.alert(ajaxData.msg)
        }
      }
    })
  } else if (e.target.classList.contains('js-confirm')) {
    ajax({
      url: `${BASE_URL}/api/order/markPay/${id}`,
      success(ajaxData) {
        if (ajaxData.code === 0) {
          pop.alert('标记付款成功')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          pop.alert(ajaxData.msg)
        }
      }
    })
  } else if (e.target.classList.contains('js-pay')) {
    ajax({
      url: `${BASE_URL}/api/order/transfer/${id}`,
      success(ajaxData) {
        if (ajaxData.code === 0) {
          pop.alert('释放比特币成功')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          pop.alert(ajaxData.msg)
        }
      }
    })
  }
}, false)

const ORDER_STATUS = [
  '<span class="text-secondary">待付款</span>',
  '<span class="text-info">已付款</span>',
  '<span class="text-success">交易成功</span>',
  '<span class="text-danger">已取消</span>'
]

function render(data) {
  let actionHtml = ''
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
  const minutes = Math.floor((data.endTime - Date.now()) / (60 * 1000))
  return `
    <div class="line line-1 d-flex justify-content-between">
      <div class="text-dark">订单编号：${data.id || ''} </div>
      <div>${ORDER_STATUS[data.orderStatus || 0]} </div>
    </div>
    <div class="line line-2">
      <div class="d-flex text-dark justify-content-between"><span>交易金额</span>${data.orderMoney || 0} CNY</div>
      <div class="d-flex text-secondary justify-content-between"><span>交易数量</span>${data.orderNum || 0} BTC</div>
      <div class="d-flex text-secondary justify-content-between"><span>交易单价</span>${data.adsPrice || 0} CNY</div>
    </div>
    <div class="line line-3">
      <div class="text-dark d-flex">
        <div>买家：${data.buyUserName || ''} <span class="badge badge-succes">${PAY_TYPE[data.payType]}</span></div>
        <div>卖家：${data.sellUserName || ''} </div>
      </div>
      <div class="intro text-secondary">广告留言：${data.adsDescribe || ''}</div>
    </div>
    <div class="line line-4 text-center ${minutes > 0 ? '' : 'd-none'}">
      <div class="text-secondary tip">比特币将在托管中心保存<span class="text-success">${minutes}</span>分钟</div>
      ${actionHtml}
    </div>
    <div class="js-chat"></div>
  `
}
