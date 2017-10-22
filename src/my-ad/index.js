import { localParam, ajax, $, BASE_URL } from '../js/util'
import pop from '../js/pop'
import '../css/page.less'

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
    <div class="card">
      <div class="card-body">
        <div>广告ID：${data.id || ''} </div>
        <div>广告类型： ${data.adsType || ''}</div>
        <div>价格单价：${data.price || ''} </div>
        <div>最小交易额：${data.minLimitPrice || ''} </div>
        <div>最大交易额：${data.maxLimitPrice || ''} </div>
        <div>付款方式：${data.payType || ''} </div>
        <div>付款期限： ${data.limitTime || ''} </div>
        <div>是否上架：${data.adsStatus === 1 ? '<span class="badge badge-success">已上架</span>' : '<span class="badge badge-danger">已下架</span>'} </div>
        <div>创建时间： ${data.createTime || ''} </div>
        <div>更新时间： ${data.updateTime || ''} </div>
        <div>广告描述：${data.adsDescribe || ''} </div>
        <div>发布者名称： ${data.userName || ''} </div>
        <div>发布者ID: ${data.userId || ''} </div>
        <div>币种：${data.coinType || ''} </div>
        <div>货币：${data.currency || ''} </div>
        <div>地区：${data.area || ''} </div>
        ${data.adsStatus === 1 ? '<button data-code="offline" type="button" class="js-btn btn btn-outline-danger">下架</button>' : '<button data-code="online" type="button" class="js-btn btn btn-outline-success">上架</button>'}
      </div>
    </div>
  `
}
