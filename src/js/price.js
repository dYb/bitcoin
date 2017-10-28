import {
  ajax,
  BASE_URL
} from './util.js'
import '../css/price.less'

export default function price(o) {
  Object.assign(this, {
    _btcValue: '',
    _cnyValue: '',
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
          <div class="cny">
            CNY  <input type="text" class="cny-input" value=""/>
          </div>
          <span><---></span>
          <div class="btc">
            BTC  <input type="text" class="btc-input" value=""/>
          </div>
        </div>				
			</div>
		`
    this.$wrapper.innerHTML = html
    this.$cnyInput = this.$wrapper.getElementsByClassName('cny-input')[0]
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
      that.$cnyInput.value = parseInt(that._cnyValue);
    })
  },
  _checkCny(value) {
    return /^[1-9]{1}\d*(\.\d{1,2})?$/.test(value);
  },
  _checkBtc(value) {
    return /^[0-9]+.?[0-9]*$/.test(value)
  },
  _checkRange(value) {
    var className = "error",
      flag = "",
      parentNode = this.$cnyInput.parentNode.parentNode;
    if (value <= this._max && value >= this._min) {
      className = "";
      flag = true;
    } else {
      flag = false;
    }
    parentNode.className = className;
    return flag;
  },
  getCount() {
    return this._cnyValue
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
    this.$cnyInput.addEventListener('keyup', (e) => {
      const val = e.target.value;
      if (that._checkCny(val)) {
        that._setCny(val)
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
      this._checkRange(this._cnyValue);
    })
  }
}