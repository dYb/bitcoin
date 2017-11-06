import '../js/size'
import Price from '../js/price'
import {
  ajax,
  $,
  $$,
  BASE_URL,
  redirect,
  localParam,
  PAY_TYPE,
  checkPassword
} from '../js/util'
import Confirm from '../js/confirm'
import Pop from '../js/pop'
import '../css/reset.less'
import '../css/detail.less'
import './index.less'

const urlData = localParam()
const price = new Price({
  $wrapper: $('.module-price')
})
let currentInfo = {}
const setTypeText = () => {
  let text = '购买'
  if (urlData.search.type == 2) {
    text = '出售'
  }
  $$('.c-text').forEach((t) => {
    t.innerHTML = text
  })
}
const getDetail = () => {
  ajax({
    url: `${BASE_URL}/api/ads/info/${urlData.search.id}`,
    data: {
      id: urlData.search.id
    },
    success(ajaxData) {
      const data = ajaxData.data
      currentInfo = data
      price.setChangeValue(data.price)
      price.setMaxMin(data.minLimitPrice, data.maxLimitPrice)
      $('.w-wrapper').innerHTML = ` <div class="user-info">
          <!--<div class="headimg">
            <img>
          </div>-->
          <div class="info">
            <p><span class="name">${data.userName}</span><span class="type">${PAY_TYPE[data.payType]}</span></p>        
            <p>限额：${data.minLimitPrice} RMB ~ ${data.maxLimitPrice} RMB</p>
          </div>
          <div class="action">
            <p class="count">${data.price} <i>RMB</i></p>       
          </div>
        </div>
        <div class="trade-info">
          <ul>
            <li>
              <p>${data.tradeCount}</p>
              <p>交易次数</p>
            </li>
            <li>
              <p>${data.creditScore}</p>
              <p>信用</p>
            </li>
          </ul>
        </div>
        <div class="banner-text">
          ${data.adsDescribe || ''}
        </div>`
    }
  })
}
const submit = () => {
  if ($('.w-wrapper .error')) {
    Pop.error('请在限额内交易')
    return
  }
  $('.price').innerHTML = currentInfo.price
  $('.price1').innerHTML = price.getCount()
  $('.num').innerHTML = price.getBtc()
  Confirm({
    title: '下单确认',
    content: $('.trade-confirm').innerHTML,
    success() {
      ajax({
        url: `${BASE_URL}/api/order/createOrder`,
        data: {
          adsId: urlData.search.id,
          orderMoney: price.getCount()
        },
        success(ajaxData) {
          if (ajaxData.code !== 0) {
            Pop.alert(ajaxData.msg)
          } else {
            redirect(`./my-order.html?type=${urlData.search.type}&id=${ajaxData.data.orderId}`, '订单详情')
          }
        }
      })
    }
  })
}
const init = () => {
  setTypeText()
  getDetail()
  $('.btn-sellbuy').addEventListener('click', () => {
    submit()
  })
}
checkPassword(() => {
  init()
})
