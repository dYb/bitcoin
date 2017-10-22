import { redirect, ajax, $, $$, BASE_URL, timeFormat } from '../js/util'
import pop from '../js/pop'
import './index.less'

let PAGE = 1
let STATUS = 0
let TYPE = 2

$('.js-tab').addEventListener('click', (e) => {
  if (!e.target.classList.contains('list-group-item')) return
  if (e.target.classList.contains('active')) return
  const { status, type } = e.target.dataset
  STATUS = status
  TYPE = type
  PAGE = 1
  loadList(type, status)
  $$('.js-tab .list-group-item').forEach((item) => {
    item.classList.remove('active')
  })
  e.target.classList.add('active')
}, false)

$('.js-more').addEventListener('click', () => {
  PAGE += 1
  loadList(TYPE, STATUS, PAGE)
  $('.js-more').disabled = true
  $('.js-more').textContent = '加载中...'
}, false)

$('.js-list').addEventListener('click', (e) => {
  const li = e.target
  if (!li.dataset.id) return
  redirect(`./my-order.html?id=${li.dataset.id}`, '我的订单')
})

function loadList(type, status, page = 1, pageSize = 15) {
  if (page === 1) {
    $('.js-list').innerHTML = '<li class="list-group-item">加载中...</li>'
  }
  ajax({
    url: `${BASE_URL}/api/order/list`,
    data: {
      orderType: type,
      finishStatus: status,
      page,
      pageSize
    },
    success(data) {
      if (data.code !== 0) {
        pop.alert(data.msg)
      } else {
        if (page === 1) {
          $('.js-list').innerHTML = ''
        }
        if (data.data.currPage >= data.data.totalPage) {
          $('.js-more').style.display = 'none'
        } else {
          $('.js-more').style.display = 'block'
        }
        $('.js-more').disabled = false
        $('.js-more').textContent = '加载更多'
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
          <div>交易单价： ${item.orderType}</div>
          <div>数量：${item.orderNum}</div>
          <div>金额：${item.orderMoney}</div>
          <div>建立时间: ${timeFormat(item.createTime)}</div>
          <div>交易时间: ${timeFormat(item.finishTime)}</div>
          ${type === 1 ? `<div>卖家： ${item.sellUserName}</div>` : `<div>买家： ${item.buyUserName}</div>`}
          <div>平台佣金比例: ${item.brokerage}</div>
        </li>
      `
    }).join('')
  }
  $('.js-list').insertAdjacentHTML('beforeend', html)
}
loadList(2, 1, 1)
