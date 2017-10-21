import '../js/size.js'
import {
  ajax
} from '../js/util.js'
import '../css/reset.less'
import '../css/ad.less'

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
    url: '/api/ads/user/saveOrUpdate',
    data: Object.assign({
      id: ''
    }, subData),
    success() {

    }
  })
}
submit()
