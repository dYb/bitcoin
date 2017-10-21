import "../js/size.js";
import Pop from "../js/pop.js";
import {
	ajax
} from "../js/util.js";
import "../css/reset.less";
import '../css/list.less';

var getList = () => {
	// debugger;
	ajax({
		// url:"/api/ads/list",
		url: "/mocks/pageBuyList.json",
		data: {
			adsType: "",
			adsStatus: "",
			page: "",
			pageSize: ""
		},
		success(ajaxData) {
			var temp = "";
			[1, 2].forEach((_data) => {
				temp += `<li class="buycoin-item user-info">
			        <div class="headimg">
			          <img>
			        </div>
			        <div class="info">
			          <p><span class="name">1651234</span><span class="type">支付宝</span></p>
			          <p>交易74 | 好评100% | 新人36</p>
			          <p>限额：1000~5000</p>
			        </div>
			        <div class="action">
			          <p class="count">38000 CNY</p>
			          <p><a href="javascript:;" class="btn-buy">购买</a></p>
			        </div>
				</li>`
			})
			document.getElementsByClassName("buycoin-list")[0].innerHTML = temp;
		}
	})
}
var init = () => {
	getList();
	// document.getElementsByClassName("btn-buy")[0].addEventListener("click", () => {
	// 	Pop.alert();
	// })
}
init();