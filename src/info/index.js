import { ajax, BASE_URL, redirect, $, getUserInfo, getToken } from '../js/util'
import pop from '../js/pop'
import '../css/reset.css'
import './index.less'

function renderPage(logout) {
  const { phone } = getUserInfo()
  const token = getToken()
  if (!token || logout) {
    $('.phone').textContent = '登录'
    $('.g-password').style.display = 'none'
  } else {
    $('.phone').textContent = phone
    $('.g-password').style.display = 'block'
  }
}
renderPage()
$('.g-info').addEventListener('click', () => {
  const token = getToken()
  if (!token) {
    redirect('./login.html', '登录')
  } else {
    renderPage()
  }
}, false)
// if (!token) {
//   redirect('./login.html', '登录')
// }


$('.g-container').addEventListener('click', (e) => {
  if (!e.target.dataset.href) return
  const token = getToken()
  if (!token) {
    redirect('./login.html', '登录')
  } else {
    redirect(e.target.dataset.href, e.target.textContent)
  }
}, false)

$('.js-logout').addEventListener('click', () => {
  ajax({
    url: `${BASE_URL}/api/user/logout`,
    success({ code, msg }) {
      if (code !== 0) {
        pop.error(msg)
      } else {
        pop.success('退出登录成功')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
        renderPage(true)
      }
    }
  })
}, false)
