import { localParam, ajax, $, $$, BASE_URL } from '../js/util'
import pop from '../js/pop.js'

$('.js-tab').addEventListener('click', (e) => {
  if (!e.target.classList.contains('list-group-item')) return
  if (e.target.classList.contains('active')) return
  const { status, type } = e.target.dataset
  loadList(type, status)
  $$('.js-tab .list-group-item').forEach((item) => {
    item.classList.remove('active')
  })
  e.target.classList.add('active')
}, false)

function loadList(type, status, page = 1) {
  if (page === 1) {
    $('.js-list').innerHTML = '<li class="list-group-item">加载中...</li>'
  }
  ajax({
    url: `${BASE_URL}/api/order/list`,
    data: {
      orderType: type,
      finishStatus: status,
      page
    },
    success(data) {
      if (data.code !== 0) {
        pop.alert(data.msg)
      } else {
        if (page === 1) {
          $('.js-list').innerHTML = ''
        }
        renderList(data.data.list, type)
      }
    }
  })
}

function renderList(list, type) {
  let html = ''
  if (!list.length) {
    html = '<li class="list-group-item">暂无数据</li>'
  } else {
    html = list.map((item) => {
      return `
        <li class="list-group-item" data-id="${item.id}">
          <div>订单ID： ${item.id}</div>
          <div>用户名： ${item.userName}</div>
          <div>交易单价： ${item.orderType}</div>
          <div>建立时间: ${item.createTime}</div>
          <div>交易时间: ${item.finishTime}</div>
          ${type === 1 ? `<div>卖家： ${item.sellUserName}</div>` : `<div>买家： ${item.buyUserName}</div>`}
          <div>付款方式：${item.payType}</div>
          <div>平台佣金比例: ${item.brokerage}</div>
          <div>数量：${item.minLimitPrice} ~ ${item.maxLimitPrice}</div>
        </li>
      `
    }).join('')
  }
  $('.js-list').insertAdjacentHTML('beforeend', html)
}
loadList(2, 1, 1)
