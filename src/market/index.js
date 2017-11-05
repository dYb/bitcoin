import '../js/size.js'
import '../css/common.less'
import {
  ajax,
  $,
  $$,
  BASE_URL,
  redirect,
  PAY_TYPE,
  checkPassword
} from '../js/util'
import '../css/reset.less'
import '../css/market.less'


let currentPage = 1
let tradeType = 1
const getList = (adsType) => {
  ajax({
    url: `${BASE_URL}/api/ads/list`,
    data: {
      adsType: adsType == 1 ? 2 : 1,
      adsStatus: '1',
      page: currentPage,
      pageSize: '10'
    },
    needToken: false,
    success(ajaxData) {
      let text = (adsType == 1 ? '购买' : '出售'),
        frag = document.createDocumentFragment();
      ajaxData.data.list.forEach((_data) => {
        var div = document.createElement("li");
        div.className = "buycoin-item user-info";
        div.innerHTML = `<!--<div class="headimg">
                <img>
              </div>-->
              <div class="info">
                <p><span class="name">${_data.userName}</span><span class="type">${PAY_TYPE[_data.payType]}</span></p>
                <p>交易 ${_data.tradeCount} | 信用 ${_data.creditScore}</p>
                <p>限额：${_data.minLimitPrice} ~ ${_data.maxLimitPrice} RMB</p>
              </div>
              <div class="action">
                <p class="count">${_data.price} <i>RMB</i></p>
                <p><a href="javascript:;" data-id="${_data.id}" class="btn-buy">${text}</a></p>
              </div>`;
        frag.appendChild(div);
      })
      $('.buycoin-list').appendChild(frag);
      if (ajaxData.data.currPage * ajaxData.data.pageSize >= ajaxData.data.totalCount) {
        $(".btn-more").parentNode.style.display = "none";
      }
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
      const className = e.target.className;
      currentPage = 1;
      if (className.indexOf('active') == -1) {
        e.target.className = 'active'
      }
      const index = e.target.getAttribute('data-index')
      tradeType = index;
      $(".btn-more").parentNode.style.display = "block";
      $('.buycoin-list').innerHTML = "";
      if (index == '1') {
        getList(1)
      } else if (index == '2') {
        getList(2)
      }
    }
  })
  $('.buycoin-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-buy')) {
      checkPassword(() => {
        const { id } = e.target.dataset
        redirect(`./buysell.html?type=${tradeType}&id=${id}`, '交易')
      })
    }
  })
  $('.btn-more').addEventListener('click', () => {
    currentPage++
    getList(tradeType)
  })
}
init()
