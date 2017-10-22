import '../js/size.js'
import Price from '../js/price.js'
import {
  ajax,
  $,
  $$,
  timer,
  BASE_URL,
  redirect,
  localParam
} from '../js/util'
import Pop from '../js/pop.js'
import '../css/reset.less'
import '../css/detail.less'

const urlData = localParam(),
  price = new Price({
    $wrapper: $('.module-price')
  })
const setTypeText = () => {
  let text = '购买'
  if (urlData.search.type == 2) {
    text = '出售'
  }
  $$('.c-text').forEach((t) => {
    t.innerHTML = text
  })
}
const getDetail = (orderId) => {
  ajax({
    url: `${BASE_URL}/api/ads/info/${urlData.search.id}`,
    data: {
      id: urlData.search.id
    },
    success(ajaxData) {
      const _data = ajaxData.data
      $('.w-wrapper').innerHTML = ` <div class="user-info">
          <div class="headimg">
            <img>
          </div>
          <div class="info">
            <p><span class="name">${_data.userId}</span><span class="type">${_data.payType}</span></p>        
            <p>限额：${_data.minLimitPrice}~${_data.maxLimitPrice}</p>
          </div>
          <div class="action">
            <p class="count">${_data.price} CNY</p>       
          </div>
        </div>
        <div class="trade-info">
          <ul>
            <li>
              <p>0</p>
              <p>交易次数</p>
            </li>
            <li>
              <p>10</p>
              <p>信任人数</p>
            </li>
            <li>
              <p>0%</p>
              <p>好评</p>
            </li>
            <li>
              <p>0 BTC</p>
              <p>历史成交</p>
            </li>
          </ul>
        </div>
        <div class="banner-text">
          ${_data.adsDescribe}
        </div>`
    }
  })
}
const submit = () => {
  ajax({
    url: `${BASE_URL}/api/order/createOrder`,
    data: {
      adsId: urlData.search.id,
      orderMoney: price.getCount()
    },
    success(ajaxData) {
      if (ajaxData.code !== 0) {
        Pop.alert(ajaxData.msg)
      }
    }
  })
}

const init = () => {
  setTypeText()
  getDetail()
  $('.btn-sellbuy').addEventListener('click', (e) => {
    submit()
  })
}
init()
