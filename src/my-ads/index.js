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
    url: `${BASE_URL}/api/ads/list`,
    data: {
      adsType: type,
      adsStatus: status,
      page
    },
    success(data) {
      if (data.code !== 0) {
        pop.alert(data.msg)
      } else {
        if (page === 1) {
          $('.js-list').innerHTML = ''
        }
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
          <div>数量：${item.minLimitPrice} ~ ${item.maxLimitPrice}</div>
        </li>
      `
    }).join('')
  }
  $('.js-list').insertAdjacentHTML('beforeend', html)
}
loadList(2, 1, 1)
