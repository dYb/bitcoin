import { ajax, $, localParam, timer } from '../js/util'
import '../css/page.less'

const { search } = localParam()
const token = search.token || localStorage.getItem('token')
if (search.set) {
  $('.js-has-no-password').style.display = 'block'
} else if (search.reset) {
  $('.js-reset-password').style.display = 'block'
} else {
  $('.js-change-password').style.display = 'block'
}

// 设置
{
  const btn = $('.js-has-no-password .js-set')
  btn.addEventListener('click', () => {
    const pwd = $('.js-has-no-password .js-password').value
    ajax({
      url: '/api/user/init_fund_pwd',
      method: 'POST',
      data: { pwd, token }
    })
  }, false)
}

// 修改
{
  const btn = $('.js-change-password .js-set')
  btn.addEventListener('click', () => {
    const oldPwd = $('.js-has-no-password .js-old-password').value
    const newPwd = $('.js-has-no-password .js-new-password').value
    ajax({
      url: '/api/user/m_fund_pwd',
      method: 'POST',
      data: { oldPwd, newPwd, token }
    })
  }, false)
}
// 重置

{
  const btn = $('.js-reset-password .js-set')
  btn.addEventListener('click', () => {
    const pwd = $('.js-has-no-password .js-password').value
    const verifyCode = $('.js-has-no-password .js-code').value
    ajax({
      url: '/api/user/m_fund_pwd',
      method: 'POST',
      data: { pwd, verifyCode, token }
    })
  }, false)
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
}