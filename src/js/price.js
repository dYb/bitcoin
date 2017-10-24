import {
  ajax,
  BASE_URL
} from './util.js'
import '../css/price.less'

export default function price(o) {
  Object.assign(this, {
    _btcValue: '',
    _cnyValue: '',
    _changeValue: 2
  }, o)
  this._init()
  this._eventBind()
}
price.prototype = {
  _init() {
    this._combineDom()
  },
  _combineDom() {
    const html = `
			<div class="price-module-wrapper">
				<div class="cny">
					CNY  <input type="text" class="cny-input" value=""/>
				</div>
				<span><---></span>
				<div class="btc">
					BTC  <input type="text" class="btc-input" value=""/>
				</div>
			</div>
		`
    this.$wrapper.innerHTML = html
    this.$cnyInput = this.$wrapper.getElementsByClassName('cny-input')[0]
    this.$btcInput = this.$wrapper.getElementsByClassName('btc-input')[0]
  },
  _timer: '',
  _ajaxGetScale(callback) {
    callback();
    // this._timer = setTimeout(() => {
    //   ajax({
    //     url: `${BASE_URL}/api/ads/indexPrice`,
    //     data: {
    //       coin: 'btc',
    //       currency: '1'
    //     },
    //     success(ajaxData) {
    //       callback(ajaxData.data)
    //     }
    //   })
    // }, 100)
  },
  setChangeValue(value){
    this._changeValue = value;
  },
  _setCny(value) {
    const that = this
    that._ajaxGetScale((d) => {
      that._cnyValue = value
      that._btcValue = (value / d).toFixed(8)
      that.$btcInput.value = that._btcValue
    })
  },
  _setBtc(value) {
    const that = this
    that._ajaxGetScale((d) => {
      that._btcValue = value
      that._cnyValue = value * d
      that.$cnyInput.value = that._cnyValue
    })
  },
  _checkCny(value) {
    return /^[1-9]{1}\d*(\.\d{1,2})?$/.test(value)
  },
  _checkBtc(value) {
    return /^[0-9]+.?[0-9]*$/.test(value)
  },
  getCount() {
    return this._cnyValue
  },
  _eventBind() {
    const that = this
    this.$cnyInput.addEventListener('keyup', (e) => {
      const val = e.target.value
      if (that._checkCny(val)) {
        that._setCny(val)
      }
    })
    this.$btcInput.addEventListener('keyup', (e) => {
      const val = e.target.value
      if (that._checkBtc(val)) {
        that._setBtc(val)
      }
    })
  }
}
