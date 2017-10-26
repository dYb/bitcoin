import '../js/size.js'
import {
  ajax,
  $,
  $$,
  BASE_URL,
  PAY_TYPE,
  redirect
} from '../js/util.js'
import pop from '../js/pop.js'
import '../css/reset.less'
import '../css/ad.less'

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
    pop.alert("请输入正确的金额");
  } else if (!checkMoney(subData.minLimitPrice)) {
    pop.alert("请输入正确的最小金额");
  } else if (!checkMoney(subData.maxLimitPrice)) {
    pop.alert("请输入正确的最大金额");
  } else if (parseInt(subData.minLimitPrice) > parseInt(subData.maxLimitPrice)) {
    pop.alert("最小金额大于最大金额，请重新输入");
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
          setTimeout(() => {
            redirect('./market.html', '列表')
          }, 1000)
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