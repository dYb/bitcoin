import { ajax, $, localParam, timer, redirect, setUserInfo, getUserInfo, BASE_URL, openTab } from '../js/util'
import pop from '../js/pop'
import '../css/page.less'
import './index.less'

const { search } = localParam()
const userInfo = getUserInfo()

if (!userInfo.token) {
  redirect('./login.html', '登录')
}

// 不存在资金密码，直接设置
if (!userInfo.hasFundPwd) {
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
      url: `${BASE_URL}/api/user/init_fund_pwd`,
      method: 'POST',
      data: { pwd },
      success(data) {
        if (data.code !== 0) {
          pop.error(data.msg)
        } else {
          pop.success('设置成功')
          userInfo.hasFundPwd = true
          setUserInfo(userInfo)
          setTimeout(() => {
            openTab(1)
          }, 1000)
        }
      },
      error() {
        pop.error('设置失败')
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
      url: `${BASE_URL}/api/user/m_fund_pwd`,
      method: 'POST',
      data: { oldPwd, newPwd },
      success(data) {
        if (data.code !== 0) {
          pop.error(data.msg)
        } else {
          pop.success('修改成功')
          setTimeout(() => {
            openTab(1)
          }, 1000)
        }
      },
      error() {
        pop.error('修改失败')
      }
    })
  }, false)
}
// 重置

{
  const btn = $('.js-reset-password .js-set')
  if (userInfo && userInfo.phone) {
    $('.js-phone').value = userInfo.phone
  }
  btn.addEventListener('click', () => {
    const pwd = $('.js-reset-password .js-password').value
    const verifyCode = $('.js-reset-password .js-code').value
    ajax({
      url: `${BASE_URL}/api/user/reset_fund_pwd`,
      method: 'POST',
      data: { pwd, verifyCode },
      success(data) {
        if (data.code !== 0) {
          pop.error(data.msg)
        } else {
          pop.success('重置成功')
          setTimeout(() => {
            openTab(1)
          }, 1000)
        }
      },
      error() {
        pop.error('重置失败')
      }
    })
  }, false)
  const codeBtn = $('.js-code-btn')
  const startTimer = timer(60, (time) => {
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
      url: `${BASE_URL}/api/user/send_code`,
      method: 'POST',
      needToken: false,
      data: { phone, type: 2 },
      success(data) {
        if (data.code === 0) {
          pop.success('发送成功')
        } else {
          pop.error(data.msg)
        }
      }
    })
  }, false)
}
