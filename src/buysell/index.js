import '../js/size.js'
import Price from '../js/price.js'
import {
  ajax,
  $
}
  from '../js/util.js'
import '../css/reset.less'
import '../css/detail.less'

new Price({
  $wrapper: $('.module-price')
})
const getDetail = (orderId) => {
  ajax({
    url: `/api/order/info/${orderId}`,
    data: {
      orderId: '',
      token: ''
    },
    success() {

    }
  })
}
const submit = () => {
  ajax({
    url: '/api/order/createOrder',
    data: {
      adsId: '',
      token: '',
      orderMoney: ''
    },
    success() {

    }
  })
}
$('.btn-sellbuy').addEventListener('click', () => {
  submit()
})
