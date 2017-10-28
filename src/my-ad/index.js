import { localParam, ajax, $, BASE_URL, PAY_TYPE } from '../js/util'
import pop from '../js/pop'
import './index.less'

const { id } = localParam().search
ajax({
  url: `${BASE_URL}/api/ads/info/${id}`,
  success(data) {
    if (data.code !== 0) {
      pop.alert(data.msg)
    } else {
      $('.g-container').innerHTML = render(data.data)
    }
  }
})

$('.g-container').addEventListener('click', (e) => {
  if (!e.target.classList.contains('js-btn')) return
  ajax({
    url: `${BASE_URL}/api/ads/user/${e.target.dataset.code}`,
    data: {
      id
    },
    success(data) {
      if (data.code !== 0) {
        pop.error(data.msg)
      } else {
        pop.success('修改成功')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    },
    error() {
      pop.error('修改失败')
    }
  })
}, false)

function render(data) {
  return `
    <div class="line line-1">
      <span>
        <span class="text-dark">${data.userName || ''}</span>
        <span class="badge badge-success">${PAY_TYPE[data.payType]}</span>
      </span>
      
      <span class="text-success">${data.price || 0} CNY</span>
    </div>
    <div class="line line-2">
      <span>交易 ${data.tradeCount}</span>
      <span>信用 ${data.creditScore}</span>
    </div>
    <div class="line line-2">
      金额：<span>${data.minLimitPrice || ''} - ${data.maxLimitPrice || ''} CNY</span>
    </div>
    <div class="line line-3">
      上架状态：${data.adsStatus === 1 ? '<span class="badge badge-success">已上架</span>' : '<span class="badge badge-danger">已下架</span>'} </div>
    </div>
    <div class="line line-4">${data.adsDescribe || ''}</div>
    <div class="line line-5">
      ${data.adsStatus === 1 ? '<button data-code="offline" type="button" class="js-btn btn btn-outline-danger">下架</button>' : '<button data-code="online" type="button" class="js-btn btn btn-outline-success">上架</button>'}
    </div>
  `
}
