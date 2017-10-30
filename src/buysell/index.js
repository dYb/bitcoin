import '../js/size.js'
import Price from '../js/price.js'
import {
  ajax,
  $,
  $$,
  timer,
  BASE_URL,
  redirect,
  localParam,
  PAY_TYPE,
  checkPassword
} from '../js/util'
import Confirm from "../js/confirm.js"
import Pop from '../js/pop.js'
import '../css/reset.less'
import '../css/detail.less'

var urlData = localParam(),
  price = new Price({
    $wrapper: $('.module-price')
  }),
  currentInfo = {};
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
      const _data = ajaxData.data;
      currentInfo = _data;
      price.setChangeValue(_data.price);
      price.setMaxMin(_data.minLimitPrice, _data.maxLimitPrice);
      $('.w-wrapper').innerHTML = ` <div class="user-info">
          <!--<div class="headimg">
            <img>
          </div>-->
          <div class="info">
            <p><span class="name">${_data.userName}</span><span class="type">${PAY_TYPE[_data.payType]}</span></p>        
            <p>限额：${_data.minLimitPrice} ~ ${_data.maxLimitPrice} RMB</p>
          </div>
          <div class="action">
            <p class="count">${_data.price} RMB</p>       
          </div>
        </div>
        <div class="trade-info">
          <ul>
            <li>
              <p>${_data.tradeCount}</p>
              <p>交易次数</p>
            </li>
            <li>
              <p>${_data.creditScore}</p>
              <p>信任</p>
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
  $(".price").innerHTML = currentInfo.price;
  $(".price1").innerHTML = price.getCount();
  $(".num").innerHTML = price.getBtc();
  Confirm({
    title: "下单确认",
    content: $(".trade-confirm").innerHTML,
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
  });

}
const init = () => {
  setTypeText()
  getDetail()
  $('.btn-sellbuy').addEventListener('click', () => {
    submit()
  })
}
// checkPassword(() => {
  init()
// })