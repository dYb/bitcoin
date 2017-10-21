import { ajax, $, timer } from '../js/util'
import './index.less'

localStorage.removeItem('token')

const codeBtn = $('.js-code-btn')
const startTimer = timer(10, (time) => {
  codeBtn.textContent = `${time}秒后重发`
}, () => {
  codeBtn.disabled = false
  codeBtn.textContent = '发送验证码'
})
codeBtn.addEventListener('click', () => {
  const phone = $('.js-phone').value
  if (!phone) return
  if (codeBtn.disabled) return
  codeBtn.disabled = true
  startTimer()
  ajax({
    url: '/api/user/send_code',
    method: 'POST',
    data: { phone, type: 1 },
    success(data) {
      if (data.code === 0) {
        alert('success')
      } else {
        alert('error')
      }
    }
  })
}, false)
// 登录
$('.js-login').addEventListener('click', () => {
  const phone = $('.js-phone').textContent
  const code = $('.js-code').textContent
  if (!phone || !code) return
  ajax({
    url: '/api/user/login',
    data: {
      phone,
      verifyCode: code
    },
    success(data) {
      alert('success')
    },
    error(data) {
      alert('登录失败')
    }
  })
}, false)

