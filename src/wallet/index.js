import { ajax, $, BASE_URL } from '../js/util'
import pop from '../js/pop'
import '../css/reset.css'
import './index.less'

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
    render(data.data)
  }
})

function render(data) {
  $('.total span').innerHTML = `&#579;${(data.balance + data.freeze).toFixed(8).slice(0, 13)}`
  $('.usable span').innerHTML = `&#579;${data.balance.toFixed(8).slice(0, 13)}`
  $('.unusable span').innerHTML = `&#579;${data.freeze.toFixed(8)}`
  $('.js-addr').textContent = data.address
  new window.QRCode($('.qrcode'), {
    text: data.address,
    width: 180,
    height: 180
  })
}
