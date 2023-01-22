/**
 * @description :
 * @author 看破����date 2021/2/12
 */
window.initGalgame = function(lib, game, ui, get, ai, _status) {
	if (!galgame.func) galgame.func = {};
	galgame.sce = function(shijian) {
		next = game.createEvent('sce', false);
		next.shijian = shijian;
		next.setContent(galgame.sces);
		next.func = {};
		for (var i in galgame.func) {
			next.func[i] = galgame.func[i];
		}
		return next;
	}
	galgame.backgroundMusic = document.createElement("audio");
	galgame.backgroundMusic.addEventListener("ended", function() {
		galgame.backgroundMusic.currentTime = 0;
		galgame.backgroundMusic.play();
	});
	galgame.audio = document.createElement("audio");
	galgame.end = function(event) {
		galgame.audio.pause();
		galgame.backgroundMusic.pause();
		if (event.pause !== false) game.resume();
	}
	galgame.cg = function(src, callback) {
		var cg = document.createElement("video");
		cg.setAttribute("width", "100%");
		cg.setAttribute("height", "100%");
		cg.setAttribute("src", src);
		cg.setAttribute("autoplay", "autoplay");
		cg.addEventListener("ended", callback);
		cg.addEventListener("loadedmetadata", function() {
			this.onclick = function() {
				this.play();
				this.currentTime = this.duration;
			}
		});
		return cg;
	}
	galgame.sces = function(event) {
		var color = {};
		var beijing = event.beijing = ui.create.div('.scedi', ui.window);
		var booth = event.booth = {};
		booth.node = ui.create.div(".scetu", beijing);
		var node = event.node = ui.create.div('.sce', beijing);
		var drive = event.drive = ui.create.div('.drive', beijing);
		var tou = event.tou = ui.create.div('.tou', node);
		var txt = event.txt = ui.create.div('.txt', node);
		var right = event.right = ui.create.div(node);
		var title = event.title = ui.create.div('.title.hidden', beijing);
		var lefttitle = event.lefttitle = ui.create.div('.left.hidden', title);
		var rightitle = event.rightitle = ui.create.div('.right.hidden', title);
		var name = event.name = ui.create.div('.name', tou);
		var name2 = event.name2 = ui.create.div('.name', right);
		var fast = ui.create.div('.fast', beijing);
		var num = 0,
			i = 0;
		fast.innerHTML = '▷▷';
		fast.onclick = function() {
			if (this.link) {
				clearInterval(this.link);
				delete this.link;
				this.innerHTML = '▷▷';
			} else {
				this.link = setInterval(function() {
					if (num == galgame.text[event.shijian].length) clearInterval(fast.link);
					if (drive.onclick) drive.onclick();
				}, 100);
				this.innerHTML = '▶▶';
			}
		}
		var bofang = function() {
			var arr = galgame.text[event.shijian][num].split(':');
			if (arr[0] == "function") {
				var func = event.func[arr[1]];
				if (func) {
					func(event);
				}
				num++;
				bofang();
				return;
			} else if (arr[0] == "title") {
				if (arr[1] == "none") {
					title.hide();
				} else {
					title.show();
					if (arr[1].length) {
						lefttitle.innerHTML = arr[1];
						lefttitle.show();
					} else {
						lefttitle.hide();
					}
					if (arr[2].length) {
						rightitle.innerHTML = arr[2];
						rightitle.show();
					} else {
						rightitle.hide();
					}
				}
				if (arr[3]) {
					title.dataset.border = arr[3];
				}
				num++;
				bofang();
				return;
			} else if (arr[0] == "background") {
				if (arr[1] == "none") {
					beijing.style.backgroundImage = "";
				} else {
					beijing.setBackgroundImage('extension/' + arr[1]);
				}
				num++;
				bofang();
				return;
			} else if (arr[0] == "booth") {
				if (arr[6] || (arr[1] == "none" && arr[2])) {
					if (!booth[arr[6]]) {
						booth[arr[6]] = ui.create.div(".scetu", beijing);
					}
					if (arr[1] == "none") {
						booth[arr[2]].hide();
					} else {
						if (booth[arr[6]].classList.contains("hidden")) booth.show();
						booth[arr[6]].style.width = arr[2];
						booth[arr[6]].style.height = arr[3];
						booth[arr[6]].style.left = arr[4];
						booth[arr[6]].style.top = arr[5];
						booth[arr[6]].setBackgroundImage('extension/' + arr[1]);
					}
				} else {
					if (arr[1] == "none") {
						booth.node.hide();
					} else {
						if (booth.node.classList.contains("hidden")) booth.show();
						booth.node.style.width = arr[2];
						booth.node.style.height = arr[3];
						booth.node.style.left = arr[4];
						booth.node.style.top = arr[5];
						booth.node.setBackgroundImage('extension/' + arr[1]);
					}
				}
				num++;
				bofang();
				return;
			} else if (arr[0] == "color") {
				if (arr[1] == "text") {
					node.style.backgroundColor = arr[2];
				}
				if (arr[1] == "choose") {
					if (arr[3]) {
						color[arr[3]] = arr[2];
					} else {
						color.every = arr[2];
					}
				}
				num++;
				bofang();
				return;
			} else if (arr[0] == "music") {
				ui.backgroundMusic.pause();
				galgame.backgroundMusic.src = lib.assetURL + "extension/" + arr[1];
				galgame.backgroundMusic.play();
				num++;
				bofang();
				return;
			} else if (arr[0] == "audio") {
				galgame.audio.src = lib.assetURL + "extension/" + arr[1];
				galgame.audio.play();
				num++;
				bofang();
				return;
			} else if (arr[0] == "cg") {
				ui.backgroundMusic.pause();
				galgame.backgroundMusic.pause();
				var di = ui.create.div('.cg');
				var cg = galgame.cg(lib.assetURL + "extension/" + arr[1], function() {
					beijing.removeChild(di);
					ui.backgroundMusic.play();
					bofang();
				});
				di.appendChild(cg);
				beijing.appendChild(di);
				num++;
				return;
			} else if (arr[0] == "choose") {
				var choose = ui.create.div('.choose', beijing);
				for (var j = 1; j < arr.length; j++) {
					var sele = ui.create.div('.sele', choose);
					sele.onclick = function() {
						event.result = {
							bool: this.innerText,
						}
						ui.window.removeChild(beijing);
						ui.backgroundMusic.play();
						galgame.end(event);
					};
					sele.innerHTML = arr[j];
					if (color.every) sele.style.backgroundColor = color.every;
					if (color[j]) sele.style.backgroundColor = color[j];
				}
				num++;
				return;
			} else if (arr[0] == "right") {
				if (arr[1] != "none") {
					if (!right.classList.contains("galright")) {
						right.classList.add("galright");
					}
					if (!txt.classList.contains("txt2")) {
						txt.classList.add("txt2");
					}
					if (lib.character[arr[1]]) {
						right.setBackground(arr[1], "character");
					} else {
						right.setBackgroundImage('extension/' + arr[1]);
					}
					if (arr[2] == "none") {
						name2.innerHTML = "";
					} else {
						name2.innerHTML = arr[2];
					}
					if (arr[3]) {
						if (arr[3] == "left") {
							if (!tou.classList.contains("darksome")) {
								tou.classList.add("darksome");
							}
							if (right.classList.contains("darksome")) {
								right.classList.remove("darksome");
							}
						}
						if (arr[3] == "right") {
							if (tou.classList.contains("darksome")) {
								tou.classList.remove("darksome");
							}
							if (!right.classList.contains("darksome")) {
								right.classList.add("darksome");
							}
						}
					} else {
						if (tou.classList.contains("darksome")) {
							tou.classList.remove("darksome");
						}
						if (right.classList.contains("darksome")) {
							right.classList.remove("darksome");
						}
					}
				} else {
					right.classList.remove("galright");
					txt.classList.remove("txt2");
					if (tou.classList.contains("darksome")) {
						tou.remove("darksome");
					}
					if (right.classList.contains("darksome")) {
						right.remove("darksome");
					}
					name2.innerHTML = "";
				}
				num++;
				bofang();
				return;
			}
			tou.show();
			name.show();
			if (arr[0] == "none") {
				tou.hide();
				name.hide();
			} else if (arr[0] == "sp") {
				tou.setBackgroundImage("extension/" + arr[3]);
				name.innerHTML = arr[2];
			} else {
				tou.setBackground(arr[0], "character");
				name.innerHTML = arr[2] || lib.translate[arr[0]];
			}
			var link = arr[1].replace(/@/g, lib.config.connect_nickname);
			var show = function() {
				if (link[i] == "<") {
					for (var j = i; j < link.length; j++) {
						if (link[j] == ">") {
							if (link[j + 1] && link[j + 1] == "<") {
								continue;
							}
							i = j + 1;
							break;
						}
					}
				}
				var str = link.substr(0, i);
				txt.innerHTML = str;
				i++;
				if (i <= link.length) {
					setTimeout(show, 70);
				} else {
					if (num < galgame.text[event.shijian].length) {
						drive.onclick = function() {
							this.onclick = false;
							i = 0;
							galgame.audio.pause();
							bofang();
						}
					} else {
						drive.onclick = function() {
							ui.backgroundMusic.play();
							ui.window.removeChild(beijing);
							galgame.end(event);
						}
					}
				}
			}
			show();
			drive.onclick = function() {
				i = link.length;
			};
			num++;
		}
		bofang();
		if (event.pause !== false) game.pause();
	}
}
