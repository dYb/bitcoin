import {
  $,
  ajax,
  localParam,
  BASE_URL
} from '../js/util'
import pop from '../js/pop'
import chat from '../js/chat'
import '../css/page.less'

chat()

const {
  id
} = localParam().search
ajax({
  url: `${BASE_URL}/api/order/info/${id}`,
  success(data) {
    if (data.code !== 0) {
      pop.alert(data.msg)
    } else {
      $('.g-container').innerHTML = render(data.data)
    }
  }
})

$('.g-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('js-cancel')) {
    ajax({
      url: `${BASE_URL}/api/order/cancel/${id}`,
      success(ajaxData) {
        if (ajaxData.code === 0) {
          pop.alert('取消订单成功')
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
        } else {
          pop.alert(ajaxData.msg)
        }
      }
    })
  }
}, false)

const ORDER_STATUS = [
  '<span class="badge badge-secondary">初始化</span>',
  '<span class="badge badge-info">待付款</span>',
  '<span class="badge badge-success">交易成功</span>',
  '<span class="badge badge-danger">订单取消</span>'
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
      <button class="js-pay btn btn-outline-danger">确认已收到付款，同意支付比特币</button>
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
  return `
    <ul class="list-group">
      <li class="list-group-item d-flex justify-content-between">
        <div>订单编号：${data.id || ''} </div>
        <div>结束状态： ${ORDER_STATUS[data.orderStatus || 0]} </div>
      </li>
      <li class="list-group-item">
        <div class="d-flex justify-content-between"><span>交易单价：</span>${data.adsPrice || ''}</div>
        <div class="d-flex justify-content-between"><span>交易数量：</span>${data.orderNum || ''} </div>
        <div class="d-flex justify-content-between"><span>交易金额：</span>${data.orderMoney || ''} </div>
        <div class="d-flex justify-content-between"><span>平台佣金比例：</span>${data.brokerage || ''} </div>
      </li>
      <li class="list-group-item">
        <div class="row">
          <div class="col-6">买家：${data.buyUserName || ''} </div>
          <div class="col-6">卖家：${data.sellUserName || ''} </div>
        </div>
        <div>${data.adsDescribe || ''}</div>
      </li>
      <li class="list-group-item text-center">
        <div style="margin-bottom: 10px;">比特币将在托管中心保存分钟</div>
        ${actionHtml}
      </li>
      <li class="list-group-item">聊天</li>
    </ul>
  `
}
