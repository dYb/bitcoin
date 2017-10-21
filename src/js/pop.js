import { $ } from './util'
import '../css/pop.less'

function getDom(message) {
  if ($('.pop-alert')) {
    $('.pop-alert').textContent = message
    return $('.pop-alert')
  }
  const div = document.createElement('div')
  div.classList.add('pop-alert-wrap')
  const inner = document.createElement('div')
  inner.classList.add('pop-alert')
  inner.textContent = message
  div.appendChild(inner)
  document.body.appendChild(div)
  return inner
}
export default {
  alert(message) {
    const dom = getDom(message)
    dom.style.display = 'inline-block'
    setTimeout(() => {
      dom.classList.add('active')
    }, 0)
    setTimeout(() => {
      dom.classList.remove('active')
    }, 2000)
    setTimeout(() => {
      dom.style.display = 'none'
    }, 2200)
  }
}
