import { ajax, BASE_URL, redirect, $, getUserInfo } from '../js/util'
import pop from '../js/pop'
import '../css/reset.css'
import './index.less'

$('.phone').textContent = getUserInfo().phone

$('.g-container').addEventListener('click', (e) => {
  if (!e.target.dataset.href) return
  redirect(e.target.dataset.href, e.target.textContent)
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
