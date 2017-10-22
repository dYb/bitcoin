import '../js/size.js'
import {
  ajax,
  $,
  $$,
  BASE_URL
} from '../js/util.js'
import pop from '../js/pop.js'
import '../css/reset.less'
import '../css/ad.less'

let tradeType = 1
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
  const subData = getSubData()
  ajax({
    url: `${BASE_URL}/api/ads/user/saveOrUpdate`,
    data: Object.assign({
      adsType: tradeType,
      id: ''
    }, subData),
    success(ajaxData) {
      if (ajaxData.code == 0) {
        pop.alert('发布成功')
      } else {
        pop.alert(ajaxData.msg)
      }
    }
  })
}
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

    } else if (index == '2') {

    }
  }
})
$('.btn-publish').addEventListener('click', (e) => {
  submit()
})
