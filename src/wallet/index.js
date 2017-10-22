import { ajax, $, BASE_URL } from '../js/util'
import pop from '../js/pop'
import '../css/page.less'

const clipboard = new window.Clipboard('.js-copy')

clipboard.on('success', (e) => {
  e.clearSelection()
  pop.success('复制成功')
})

clipboard.on('error', () => {
  pop.error('复制失败，请手动复制')
})

ajax({
  url: `${BASE_URL}/api/account/info`,
  success(data) {
    console.log(data)
    render(data.data)
  }
})

function render(data) {
  $('.js-wallet').innerHTML = `
    <div class="form-group">
      总资产：${(data.balance + data.freeze).toFixed(0)}
    </div>
    <div class="form-group">
      可用资产：${data.balance}
    </div>
    <div class="form-group">
      冻结资产：${data.freeze}
    </div>
  `
  $('.js-address').value = data.address
}
