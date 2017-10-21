import "../js/size.js";
import {
	ajax
} from "../js/util.js";
import "../css/reset.less";
import '../css/ad.less';
var getSubClass = (dom) => {
	var o = {};
	for (var i = 0; i < dom.length; i++) {
		var _d = dom[i],
			key = _d.className;
		o[key] = _d.value;
	}
	return o;
};
var getSubData = () => {
	var input = document.getElementsByTagName("input"),
		select = document.getElementsByTagName("select"),
		textarea = document.getElementsByTagName("textarea");
	return Object.assign({}, getSubClass(input), getSubClass(select), getSubClass(textarea));
};
var submit = () => {
	var subData = getSubData();
	ajax({
		url: "/api/ads/user/saveOrUpdate",
		data: Object.assign({
			id: ""
		}, subData),
		success() {

		}
	})
}
submit();