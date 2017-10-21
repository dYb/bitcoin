import { ajax, $, localParam, timer, getUserInfo, BASE_URL } from '../js/util'
import pop from '../js/pop'
import '../css/page.less'

const { search } = localParam()
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
      url: BASE_URL + '/api/user/init_fund_pwd',
      method: 'POST',
      data: { pwd },
      success(data) {
        if (data.code !== 0) {
          pop.alert(data.msg)
        } else {
          pop.alert('设置成功')
        }
      },
      error() {
        pop.alert('设置失败')
      }
    })
  }, false)
}

// 修改
{
  const btn = $('.js-change-password .js-set')
  btn.addEventListener('click', () => {
    const oldPwd = $('.js-change-password .js-old-password').value
    const newPwd = $('.js-change-password .js-new-password').value
    ajax({
      url: BASE_URL + '/api/user/m_fund_pwd',
      method: 'POST',
      data: { oldPwd, newPwd },
      success(data) {
        if (data.code !== 0) {
          pop.alert(data.msg)
        } else {
          pop.alert('修改成功')
        }
      },
      error() {
        pop.alert('修改失败')
      }
    })
  }, false)
}
// 重置

{
  const btn = $('.js-reset-password .js-set')
  const userInfo = getUserInfo()
  if (userInfo && userInfo.phone) {
    $('.js-phone').value = userInfo.phone
  }
  btn.addEventListener('click', () => {
    const pwd = $('.js-reset-password .js-password').value
    const verifyCode = $('.js-reset-password .js-code').value
    ajax({
      url: BASE_URL + '/api/user/reset_fund_pwd',
      method: 'POST',
      data: { pwd, verifyCode },
      success(data) {
        if (data.code !== 0) {
          pop.alert(data.msg)
        } else {
          pop.alert('重置成功')
        }
      },
      error() {
        pop.alert('重置失败')
      }
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
      url: BASE_URL + '/api/user/send_code',
      method: 'POST',
      needToken: false,
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
