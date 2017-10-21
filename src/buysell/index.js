import "../js/size.js";
import Price from "../js/price.js";
import {
	ajax,
	$
}
from "../js/util.js";
import "../css/reset.less";
import '../css/detail.less';

new Price({
	$wrapper: $(".module-price")
});
var getDetail = (orderId) => {
	ajax({
		url: "/api/order/info/" + orderId,
		data: {
			orderId: "",
			token: ""
		},
		success() {

		}
	})
}
var submit = () => {
	ajax({
		url: "/api/order/createOrder",
		data: {
			adsId: "",
			token: "",
			orderMoney: ""
		},
		success() {

		}
	})
}
$(".btn-sellbuy").addEventListener("click",()=>{
	submit();
})