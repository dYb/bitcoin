import "../css/pop.less";
var _Pop = {
	init() {
		var that = this;
		this.$popAlert = document.getElementsByClassName("pop-alert-wrapper")[0];
		if (!this.$popAlert) {
			this.$popAlert = document.createElement("div");
			this.$popAlert.className = "pop-alert-wrapper";
			this.$popAlert.innerHTML = `
				<div class="pop-alert-inner">
					<div class="text">XXXXXXXXXXXXXX</div>
					<div class="action">确定</div>
				</div>	
			`;
			document.body.appendChild(this.$popAlert);			
			this.$popAlert.getElementsByClassName("action")[0].addEventListener("click", (e) => {
				that.alertClose();
			})
		}

	},
	alert() {
		var className = this.$popAlert.className;
		this.$popAlert.className = className + " active";
	},
	alertClose() {
		var className = this.$popAlert.className;
		this.$popAlert.className = className.replace("active", "");
	},
	confirm() {}
}
_Pop.init();
export default _Pop