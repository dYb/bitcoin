import { ajax, $, localParam } from '../js/util'

const { search } = localParam()
const token = search.token || localStorage.getItem('token')

ajax({
  url: `/api/account/info?token?=${token}`,
  success(data) {
    console.log(data)
    render(data.data)
  }
})

function render(data) {
  $('.js-wallet').innerHTML = `
    <div>
      总资产：${(data.balance + data.freeze).toFixed(0)}
    </div>
    <div>
      可用资产：${data.balance}
    </div>
    <div>
      冻结资产：${data.freeze}
    </div>
  `
}
