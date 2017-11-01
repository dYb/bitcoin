import { redirect, ajax, localParam, $, $$, BASE_URL, ORDER_STATUS, ORDER_TYPE } from '../js/util'
import pop from '../js/pop'
import './index.less'

let PAGE = 1
let STATUS = 0
const TYPE = localParam().search.type || ''

loadList(TYPE, STATUS, 1)

$('.js-tab').addEventListener('click', (e) => {
  if (!e.target.classList.contains('item')) return
  if (e.target.classList.contains('active')) return
  const { status } = e.target.dataset
  STATUS = status
  PAGE = 1
  loadList(TYPE, STATUS)
  $$('.js-tab .item').forEach((item) => {
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
    $('.js-list').innerHTML = '<div style="padding-top: 10px;text-align: center;">加载中</div>'
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
        // 没有更多列表
        if (data.data.currPage < data.data.totalPage && data.data.list === pageSize) {
          $('.js-more').style.display = 'block'
        } else {
          $('.js-more').style.display = 'none'
        }
        $('.js-more').disabled = false
        $('.js-more').textContent = '加载更多'
        renderList(data.data.list)
      }
    }
  })
}

function renderList(list) {
  let html = ''
  if (!list.length) {
    html = '<div style="padding-top: 10px;text-align: center;">暂无数据</div>'
  } else {
    html = list.map((item) => {
      return `
        <div class="item" data-id="${item.id}">
          <div class="line-1">
            <span class="name">
              ${item.listShowName}
              <span class="badge badge-success">${ORDER_TYPE[item.orderType]}</span>
            </span>
            <span style="font-size: 16px">${ORDER_STATUS[item.orderStatus]}</span>
          </div>
          <div class="line-2">
            <span>交易金额：${item.orderMoney} RMB</span>
            <span>订单编号：${item.id}</span>
          </div>
        </div>
      `
    }).join('')
  }
  $('.js-list').insertAdjacentHTML('beforeend', html)
}
