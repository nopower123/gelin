window.gl_init = function(lib, game, ui, get, ai, _status) {
	window.xiangqv = {
		background: "extension/格林笔记/map/",
		init: function() {
			galgame.sce('fusutiaolv1');
		},
		galgame: {
			"fusutiaolv1": [
				"gl_aikesi:就让我们来粉碎你的阴谋！",
				"gl_leina:艾克斯，小心一点！他身上的混沌气息甚至比莫里甘更胜一筹。",
				"gl_kali:......",
				"gl_aikesi:卡莉，怎么了？",
				"gl_kali:也许是我的错觉吧......但是他给我的感觉好熟悉......",
				"gl_puluomixiusi:闲聊结束了吗？结束了就一起上吧，消灭了你们就没人能再阻止我的计划了。",
			],
		},
		pack: {
			character: {

			},
			skill: {

			},
			translate: {

			},
		},
		beyond: [{
			name: "gl_leina",
			position: 1,
			identity: "nei"
		}, {
			name: "gl_puluomixiusi",
			position: 4,
			identity: "zhu"
		}, {
			name: "gl_kali",
			position: 7,
			identity: "nei"
		}]
	}
}
