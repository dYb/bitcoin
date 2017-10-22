import { redirect, ajax, $, $$, BASE_URL } from '../js/util'
import pop from '../js/pop'
import './index.less'

let PAGE = 1
let STATUS = 1
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
  redirect(`./my-ad?id=${li.dataset.id}`, '我的广告')
})

function loadList(type, status, page = 1, pageSize = 15) {
  if (page === 1) {
    $('.js-list').innerHTML = '<li class="list-group-item">加载中...</li>'
  }
  ajax({
    url: `${BASE_URL}/api/ads/list`,
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
    html = '<li class="list-group-item">暂无数据</li>'
  } else {
    html = list.map((item) => {
      return `
        <li class="list-group-item" data-id="${item.id}">
          <div>用户名： ${item.userName}</div>
          <div>单价： ${item.price}</div>
          <div>付款方式：${item.payType}</div>
          <div>金额：${item.minLimitPrice} ~ ${item.maxLimitPrice}</div>
        </li>
      `
    }).join('')
  }
  $('.js-list').insertAdjacentHTML('beforeend', html)
}
loadList(2, 1, 1)
