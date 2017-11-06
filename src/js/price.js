import '../css/price.less'

export default function price(o) {
  Object.assign(this, {
    _btcValue: '',
    _RMBValue: '',
    _changeValue: 2,
    _min: 0,
    _max: 0
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
        <div>
          <div class="RMB">
            RMB  <input type="number" placeholder="请输入金额" class="RMB-input" value=""/>
          </div>
          <span><-></span>
          <div class="btc">
            BTC  <input type="number" placeholder="请输入比特币数量" class="btc-input" value=""/>
          </div>
        </div>				
			</div>
		`
    this.$wrapper.innerHTML = html
    this.$RMBInput = this.$wrapper.getElementsByClassName('RMB-input')[0]
    this.$btcInput = this.$wrapper.getElementsByClassName('btc-input')[0]
  },
  _timer: '',
  _ajaxGetScale(callback) {
    callback(this._changeValue);
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
  _setRMB(value) {
    const that = this
    that._ajaxGetScale((d) => {
      that._RMBValue = value
      that._btcValue = (value / d).toFixed(8)
      that.$btcInput.value = that._btcValue
    })
  },
  _setBtc(value) {
    const that = this
    that._ajaxGetScale((d) => {
      that._btcValue = value
      that._RMBValue = value * d
      that.$RMBInput.value = parseInt(that._RMBValue);
    })
  },
  _checkRMB(value) {
    return /^[1-9]{1}\d*(\.\d{1,2})?$/.test(value);
  },
  _checkBtc(value) {
    return /^[0-9]+.?[0-9]*$/.test(value)
  },
  _checkRange(value) {
    const className = 'error'
    let flag = ''
    const parentNode = this.$RMBInput.parentNode.parentNode
    if (value <= this._max && value >= this._min) {
      className = ''
      flag = true
    } else {
      flag = false
    }
    parentNode.className = className
    return flag
  },
  getCount() {
    return this._RMBValue
  },
  getBtc(){
    return this._btcValue
  },
  setChangeValue(value) {
    this._changeValue = value;
  },
  setMaxMin(min, max) {
    this._min = min;
    this._max = max;
  },
  _eventBind() {
    const that = this
    this.$RMBInput.addEventListener('keyup', (e) => {
      const val = e.target.value;
      if (that._checkRMB(val)) {
        that._setRMB(val)
      }
      //判断是否区间错误
      this._checkRange(val);
    })
    this.$btcInput.addEventListener('keyup', (e) => {
      const val = e.target.value;
      if (that._checkBtc(val)) {
        that._setBtc(val)
      }
      //判断是否区间错误
      this._checkRange(this._RMBValue);
    })
  }
}