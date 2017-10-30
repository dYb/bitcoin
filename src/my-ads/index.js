
import { redirect, ajax, localParam, $, $$, BASE_URL, PAY_TYPE } from '../js/util'
import pop from '../js/pop'
import './index.less'

let PAGE = 1
let STATUS = 1
const TYPE = localParam().search.type || 2

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
  redirect(`./my-ad.html?id=${li.dataset.id}`, '我的广告')
})

function loadList(type, status, page = 1, pageSize = 15) {
  if (page === 1) {
    $('.js-list').innerHTML = '加载中...'
  }
  ajax({
    url: `${BASE_URL}/api/ads/user/list`,
    data: {
      adsType: type,
      adsStatus: status,
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
        renderList(data.data.list, page)
      }
    }
  })
}

function renderList(list) {
  let html = ''
  if (!list.length) {
    html = '<div style="text-align: center;">暂无数据</div>'
  } else {
    html = list.map((item) => {
      return `
        <div class="item" data-id="${item.id}">
          <div class="line-1 d-flex justify-content-between">
            <span class="text-dark name">
              ${item.userName}
              <span class="badge badge-success">${PAY_TYPE[item.payType]}</span>
            </span>  
            <span class="amount">${item.price} <i class="text-secondary">RMB</i></span>
          </div>
          <div class="line-2 text-secondary">交易  ${item.tradeCount || 0}   |  信任  ${item.creditScore || 0}</div>
          <div class="line-3 text-secondary">限额：${item.minLimitPrice} - ${item.maxLimitPrice} RMB</div>
        </div>
      `
    }).join('')
  }
  $('.js-list').insertAdjacentHTML('beforeend', html)
}
