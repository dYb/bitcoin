import {
  ajax,
  $,
  BASE_URL,
  redirect,
  localParam,
  PAY_TYPE,
  getToken
} from '../js/util'
import pop from '../js/pop'
import '../css/reset.css'
import './index.less'

const BALANCE_TYPE = ['充值', '出售', '购买', '提现', '平台佣金', '矿工费']
let loading = true
let PAGE = 1
renderList(PAGE)
function renderList(page = 1, pageSize = 20) {
  ajax({
    url: `${BASE_URL}/api/otcusercapital/mylist`,
    data: { page, pageSize },
    success(data) {
      loading = false
      if (data.code !== 0) {
        pop.error(data.msg)
        return
      }
      const { list } = data.data
      if (page >= data.totalPage || list.length < pageSize) {
        $('.js-more').style.display = 'none'
      } else {
        $('.js-more').style.display = 'block'
      }
      const html = list.map(item => `
        <li>
          <div>
            <div>${BALANCE_TYPE[item.capitalType]}</div>
            <div class="time">${item.createTime}</div>
          </div>
          <div class="${item.capitalMount > 0 ? 'negative' : 'positive'}">${item.capitalMount > 0 ? '+' + item.capitalMount : item.capitalMount}</div>
        </li>
      `).join('')
      if (!html && page === 1) {
        $('ul').insertAdjacentHTML('beforeend', '<li class="nodata">暂无数据</li>')
      } else {
        $('ul').insertAdjacentHTML('beforeend', html)
      }
    },
    error() {
      loading = false
    }
  })
}

$('.js-more').addEventListener('click', () => {
  if (loading) return
  loading = true
  PAGE += 1
  renderList(PAGE)
}, false)
