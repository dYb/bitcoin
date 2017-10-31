import { ajax, BASE_URL, redirect, $, getUserInfo, getToken } from '../js/util'
import pop from '../js/pop'
import '../css/reset.css'
import './index.less'

const { phone } = getUserInfo()
const token = getToken()
if (!token) {
  $('.phone').textContent = '登录'
  $('.g-password').style.display = 'none'
} else {
  $('.phone').textContent = phone
}
$('.g-info').addEventListener('click', () => {
  if (!token) {
    redirect('./login.html', '登录')
  }
}, false)
// if (!token) {
//   redirect('./login.html', '登录')
// }


$('.g-container').addEventListener('click', (e) => {
  if (!e.target.dataset.href) return
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
        setTimeout(() => {
          redirect('./login.html', '登录')
        }, 1000)
      }
    }
  })
}, false)
