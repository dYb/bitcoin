import '../js/size'
import '../css/common.less'
import {
  ajax,
  $,
  $$,
  BASE_URL,
  PAY_TYPE,
  openTab,
  checkPassword
} from '../js/util'
import pop from '../js/pop'
import '../css/reset.less'
import '../css/ad.less'
// document.body.style.height = document.documentElement.clientHeight + "px";

// checkPassword()

let tradeType = 1
let payTypeHtml = ''
PAY_TYPE.forEach((_data, i) => {
  if (i == 0) return
  payTypeHtml += `<option value="${i}">${PAY_TYPE[i]}</option>`
})

$('.payType').innerHTML = payTypeHtml

const getSubClass = (dom) => {
  const o = {}
  for (let i = 0; i < dom.length; i++) {
    let _d = dom[i],
      key = _d.className
    o[key] = _d.value
  }
  return o
}
const getSubData = () => {
  let input = document.getElementsByTagName('input'),
    select = document.getElementsByTagName('select'),
    textarea = document.getElementsByTagName('textarea')
  return Object.assign({}, getSubClass(input), getSubClass(select), getSubClass(textarea))
}
const submit = () => {
  const subData = getSubData();  
  // 校验  
  if (!checkMoney(subData.price)) {
    pop.error('请正确输入比特币价格');
  } else if (!(checkMoney(subData.minLimitPrice) && parseInt(subData.minLimitPrice, 10) >= 1)) {
    pop.error('请正确输入最小交易金额');
  } else if (!(checkMoney(subData.maxLimitPrice) && parseInt(subData.maxLimitPrice, 10) <= 1000000)) {
    pop.error('请正确输入最大交易金额');
  } else if (parseInt(subData.minLimitPrice) > parseInt(subData.maxLimitPrice)) {
    pop.error("最小金额大于最大金额，请重新输入");
  } else {
    ajax({
      url: `${BASE_URL}/api/ads/user/saveOrUpdate`,
      data: Object.assign({
        adsType: tradeType,
        id: ''
      }, subData),
      success(ajaxData) {
        if (ajaxData.code === 0) {
          pop.success('发布成功')
          $('form').reset()
          setTimeout(() => {
            openTab(1)
          }, 300)
        } else {
          pop.alert(ajaxData.msg)
        }
      }
    })
  }
}
const checkMoney = (value) => {
  return /^[1-9]{1}\d*(\.\d{1,2})?$/.test(value);
}
$('.tab').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
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

    } else if (index == '2') {

    }
  }
})
$('.btn-publish').addEventListener('click', (e) => {
  submit()
})
