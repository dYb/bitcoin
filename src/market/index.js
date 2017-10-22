import '../js/size.js'
import {
  ajax,
  $,
  $$,
  timer,
  BASE_URL,
  redirect,
  PAY_TYPE
} from '../js/util'
import '../css/reset.less'
import '../css/market.less'


const currentPage = 1
let tradeType = 1
const getList = (adsType) => {
  ajax({
    url: `${BASE_URL}/api/ads/list`,
    data: {
      adsType,
      adsStatus: '1',
      page: currentPage,
      pageSize: '20'
    },
    success(ajaxData) {
      let temp = '',
        text = adsType == 1 ? '购买' : '出售'
      ajaxData.data.list.forEach((_data) => {
        temp += `<li class="buycoin-item user-info">
			        <!--<div class="headimg">
			          <img>
			        </div>-->
			        <div class="info">
			          <p><span class="name">${_data.userId}</span><span class="type">${PAY_TYPE[_data.payType]}</span></p>
			          <!--<p>交易74 | 好评100% | 新人36</p>-->
			          <p>限额：${_data.minLimitPrice}~${_data.maxLimitPrice}</p>
			        </div>
			        <div class="action">
			          <p class="count">${_data.price} CNY</p>
			          <p><a href="javascript:;" data-id="${_data.id}" class="btn-buy">${text}</a></p>
			        </div>
				</li>`
      })
      document.getElementsByClassName('buycoin-list')[0].innerHTML = temp
    }
  })
}
const init = () => {
  getList(1)
  $('.tab').addEventListener('click', (e) => {
    if (e.target.tagName == 'LI') {
      $$('.tab li').forEach((t) => {
        t.className = ''
      })
      const className = e.target.className
      if (className.indexOf('active') == -1) {
        e.target.className = 'active'
      }
      const index = e.target.getAttribute('data-index')
      tradeType = index
      if (index == '1') {
        getList(1)
      } else if (index == '2') {
        getList(2)
      }
    }
  })
  $('.buycoin-list').addEventListener('click', (e) => {
    if (e.target.className == 'btn-buy') {
      const id = e.target.getAttribute('data-id')
      redirect(`./buysell.html/?type=${tradeType}&id=${id}`, '交易')
    }
  })
}
init()
