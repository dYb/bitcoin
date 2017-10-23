import { ajax, $, BASE_URL, openTab, checkPassword } from '../js/util'
import pop from '../js/pop'
import './index.less'

checkPassword()
$('.js-extract').addEventListener('click', () => {
  const toAddress = $('.js-address').value
  const amount = $('.js-amount').value
  const fundPwd = $('.js-pwd').value
  const remark = $('.js-remark').value
  ajax({
    url: `${BASE_URL}/api/withdraw/apply`,
    data: {
      toAddress,
      amount,
      fundPwd,
      remark
    },
    success(data) {
      if (data.code !== 0) {
        pop.alert(data.msg)
      } else {
        pop.alert('修改成功')
        setTimeout(() => {
          openTab(4)
        }, 1000)
      }
    },
    error() {
      pop.alert('修改失败')
    }
  })
}, false)
