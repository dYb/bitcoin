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
const pop = {
  alert(message) {
    const dom = getDom(message)
    dom.style.display = 'inline-block'
    setTimeout(() => {
      dom.classList.add('active')
    }, 0)
    setTimeout(() => {
      dom.classList.remove('active')
    }, 4000)
    setTimeout(() => {
      dom.style.display = 'none'
    }, 4200)
  },
  success(message) {
    const dom = getDom(message)
    dom.className = 'pop-alert success'
    pop.alert(message)
  },
  error(message) {
    const dom = getDom(message)
    dom.className = 'pop-alert error'
    pop.alert(message)
  }
}
export default pop
