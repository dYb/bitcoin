import '../css/price.less'

export default function price(o) {
  Object.assign(this, {
    _btcValue: 0,
    _cnyValue: 0,
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
					CNY  <input type="text" class="cny-input" value="0"/>
				</div>
				<span><---></span>
				<div class="btc">
					BTC  <input type="text" class="btc-input" value="0"/>
				</div>
			</div>
		`
    this.$wrapper.innerHTML = html
    this.$cnyInput = this.$wrapper.getElementsByClassName('cny-input')[0]
    this.$btcInput = this.$wrapper.getElementsByClassName('btc-input')[0]
  },
  _setCny(value) {
    this._cnyValue = value
    this._btcValue = value / this._changeValue
    this.$btcInput.value = this._btcValue
  },
  _setBtc(value) {
    this._btcValue = value
    this._cnyValue = value * this._changeValue
    this.$cnyInput.value = this._cnyValue
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
