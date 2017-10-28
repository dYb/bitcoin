import {
	$$,
	$
} from "./util.js";
import "../css/confirm.less";
var OBJ = {
	title: "title",
	content: "content"
};
if ($$(".comfirm-wrapper").length == 0) {
	$("body").insertAdjacentHTML('beforeend',
		`<div class="comfirm-wrapper">
			<div class="confirm-inner">
				<div class="header">xxx</div>
				<div class="content">xxx</div>
				<div class="action">
					<a href="javascript:;" class="btn-sure fn-t-blue">确认</a>
					<a href="javascript:;" class="btn-cancel fn-t-blue">取消</a>
				</div>
			</div>
		</div>`);
};
$(".comfirm-wrapper").addEventListener("click", (e) => {
	var className = e.target.className;
	if (className.indexOf("btn-sure") !== -1) {
		OBJ.success && OBJ.success();
	} else if (className.indexOf("btn-cancel") !== -1) {
		OBJ.cancel && OBJ.cancel();
		$(".comfirm-wrapper").className = "comfirm-wrapper";
	}
})
const popUp = (o) => {
	OBJ = Object.assign(OBJ, o)
	$(".comfirm-wrapper").className = "comfirm-wrapper active";
	$$(".comfirm-wrapper .header")[0].innerHTML = o.title;
	$$(".comfirm-wrapper .content")[0].innerHTML = o.content;
}
export default popUp;