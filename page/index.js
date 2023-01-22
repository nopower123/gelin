window.gl_createPage = function(lib, game, ui, get, ai, _status) {
	var data = lib.config.gelin;
	var that = {
		init: function(baseplate) {
			that.coverImage = new Image();
			that.coverImage.src = lib.assetURL + 'extension/格林笔记/page/lucky.jpg';
			that.yindao = ui.create.div('.gl_yindao', baseplate);
			ui.create.div('#gl_character', that.yindao, that.initLucky);
			that.book = ui.create.div('.gl_shu', baseplate);
			that.index = 0;
			that.initPage();
			var list = [];
			for (var i in lib.characterPack) {
				if (i == 'mode_extension_童话想区') continue;
				for (var j in lib.characterPack[i]) {
					if (lib.character[j]) list.push(j);
				}
			}
			var dialog = ui.create.gl_lianjie(list);
			dialog.classList.add('gl_dialog');
			that.avatar.appendChild(dialog);
			var button;
			for (var i = 0; i < dialog.buttons.length; i++) {
				button = dialog.buttons[i];
				button.onclick = function() {
					if (this.classList.contains('gl_ban')) return;
					that.$changeLink(this);
				}
				if (button.link == 'gl_aikesi') {
					that.$changeLink(that.fast || button);
				}
			}
			for (var i = 0; i < that.pages.length; i++) {
				var num = that.pages.length - i;
				that.pages[i].index = i;
				that.pages[i].style.zIndex = String(num);
			}
			baseplate.classList.remove('hidden');
			ui.backgroundMusic.pause();
			return;
			var backgroundMusic = document.createElement('audio');
			backgroundMusic.volume = lib.config.volumn_background / 8;
			playBackgroundMusic();
			backgroundMusic.autoplay = true;
			backgroundMusic.addEventListener('ended', playBackgroundMusic);
			document.body.appendChild(backgroundMusic);
		},
		upData: function() {
			game.saveConfig('gelin', lib.config.gelin);
		},
		initPage: function() {
			ui.create.div('.gl_lastBtn', '◀', that.book, that.pav);
			ui.create.div('.gl_nextBtn', '▶', that.book, that.next);
			that.cover = ui.create.div('.gl_cover', that.book);
			ui.create.div('.gl_fazhen', that.cover);
			that.lucky = ui.create.div('.gl_lucky', that.cover);
			that.luckying = ui.create.div('.gl_luckying.hidden', that.cover);
			that.luckying.text = ui.create.div('.gl_title', that.luckying);
			ui.create.div('.gl_luckyText', that.cover, function() {
				if (that.luckying.classList.contains('hidden')) {
					for (var i of that.lucky.childNodes) {
						if (!i.open) {
							i.open = true;
							i.style.backgroundSize = 'cover';
							ui.create.div('.gl_title', i).innerHTML = i.bool.name;
							i.setBackgroundImage('extension/格林笔记/' + i.bool.img);
							i.bool.result();
							setTimeout(function() {
								that.cover.style.display = '';
								that.lucky.innerHTML = '';
							}, 2000)
						}
					}
				}
			}).innerHTML = '感受那来自无数命运中传来的回响';
			that.pages.push(that.createPage('page1'));
			that.pages.push(that.createPage('page2'));
			that.pages.push(that.createPage('page3'));
			// that.pages.push(that.createPage('page4'));
		},
		page1: function(page, page1, content, page2, state1, state2) {
			that.avatar = content;
			that.intensify = state1;
			state1.innerHTML = '修正属性';
			state2.classList.add('gl_nature');
			var list = ['性别:sex', '体力:hp', '登场:enter', '撤离:retreat', '隐匿:hidden', '双面:dualside', '国籍:group'];
			for (var i of list) {
				var link = i.split(':');
				var node = document.createElement('h3');
				node.innerHTML = link[0] + '修正';
				state1.appendChild(node);
				node.link = link[1];
				if (data.amend[node.link]) node.classList.add('gl_select');
				node.onclick = function() {
					if (!data.amend) {
						data.amend = {}
					}
					if (data.amend[this.link]) {
						delete data.amend[this.link];
						this.classList.remove('gl_select');
					} else {
						this.classList.add('gl_select');
						data.amend[this.link] = true;
					}
					that.upData();
				}
			}
			list = ['武力:power', '坚韧:defense', '祝福:recover', '魔性:magic'];
			for (var i of list) {
				var link = i.split(':');
				var node = ui.create.div(state2);
				node.innerHTML = link[0] + '<br/>';
				var minus = ui.create.div('.gl_minus', node);
				var shell = ui.create.div('.gl_shell', node);
				that[link[1]] = ui.create.div('#gl_' + link[1], shell);
				shell.appendChild(document.createElement('span'));
				var add = ui.create.div('.gl_add', node);
				add.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', that.longpressAdd);
				add.link = link[1];
				add.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', that.touchendAdd);
				minus.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', that.longpressMinus);
				minus.link = link[1];
				minus.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', that.touchendMinus);
			}
		},
		page2: function(page, page1, content, page2, state1, state2) {
			var title = document.createElement('h3');
			title.innerHTML = '调律者技能';
			content.appendChild(title);
			that.count = document.createElement('h3');
			content.appendChild(that.count);
			that.skills = ui.create.div(content, '#gl_skills');
			that.choose = state1;
			that.keen = document.createElement('h3');
			that.keen.innerHTML = '喜爱';
			state1.appendChild(that.keen);
			that.keen.onclick = function() {
				that.changeKeen(true);
			}
			that.skin = document.createElement('h3');
			that.skin.innerHTML = '皮肤';
			state1.appendChild(that.skin);
			that.skin.onclick = function() {
				that.changeChoose('skin');
			}
			that.info = document.createElement('h3');
			that.info.innerHTML = '简介';
			state1.appendChild(that.info);
			that.info.onclick = function() {
				that.changeChoose('info');
			}
			that.skill = document.createElement('h3');
			that.skill.innerHTML = '技能';
			state1.appendChild(that.skill);
			that.skill.onclick = function() {
				that.changeChoose('skill');
			}
			that.content = state2;
			that.content.type = 'info';
			that.choose.select = that.info;
			that.choose.select.classList.add('gl_select');
			state2.id = 'gl_content';
		},
		page3: function(page, page1, content, page2, state1, state2) {
			that.recall = content;
			that.recall.classList.add('gl_recall');
			that.items = state1;
			that.items.innerHTML = '物品介绍：像是剑一般的奇怪画笔，到底会是谁的东西呢？</br>效果说明：能够令路德维希的【毒刃】效果发生改变。'
			that.bag = state2;
			that.bag.classList.add('gl_bag');
			for (var i = 0; i < 20; i++) {
				var node = ui.create.div(that.bag);
				if (i == 0) {
					node.setBackgroundImage('extension/格林笔记/items/tiantianquan.jpg');
					ui.create.div(node).innerHTML = '甜甜圈';
				} else if (i == 1) {
					node.setBackgroundImage('extension/格林笔记/card/gl_tonghuahuibi.png');
					ui.create.div(node).innerHTML = '童话绘笔';
				} else {
					ui.create.div(node).innerHTML = '？？？';
				}
			}
		},
		page4: function(page, page1, content, page2, state1, state2) {
			that.achievement = content;
			that.achievement.classList.add('gl_achievement');
			that.achievement.num = 0;
			that.achievement.innerHTML = '<h2>成就</h2>';
		},
		achievementOnload: function() {
			if (that.achievement.num >= that.achievementList.length) return;
			var info = that.achievementList[that.achievement.num];
			var node = ui.create.div(that.achievement);
			node.setBackgroundImage('extension/格林笔记/' + info.image);
			ui.create.div(node).innerHTML = info.name;
			if (!get.gl_achievement(info.name)) {
				node.classList.add('gl_ban');
				node.link = info;
				node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', that.achievementAlert);
			}
			that.achievement.num++;
			setTimeout(that.achievementOnload, 50);
		},
		achievementAlert: function() {
			if (this.link.filter()) {
				this.classList.remove('gl_ban');
				var str = '恭喜你<span style="color:aqua;">' + this.link.info + '</span>，达成成就<span style="color:yellow;">' + this.link.name + '</span>';
				if (!data.achievement.contains(name)) {
					data.achievement.add(this.link.name);
					str += '在此奖励你<span style="color:lightgreen;">' + this.link.award + '</span>，希望你之后更加努力！';
				}
				game.gl_createDailog(str);
			} else {
				game.gl_createDailog('你需要<span style="color:aqua;">' + this.link.info + '</span>来解锁成就<span style="color:yellow;">' + this.link.name + '</span>');
			}
		},
		achievementList: [{
			name: '奇迹少女',
			info: '令爱丽丝的属性点达到200',
			image: 'gl_ailisi.jpg',
			award: '甜甜圈',
			filter: function() {
				var nature = get.gl_nature('gl_ailisi');
				var num = 0;
				for (var i in nature) {
					num += nature[i];
				}
				return num == 200;
			},
		}, {
			name: '加把劲骑士',
			info: '使用艾克斯累计战败100场',
			image: 'gl_aikesi.jpg',
			award: '',
			filter: function() {
				return false;
			},
		}, {
			name: '玫瑰骑士',
			info: '令艾达的属性点达到200',
			image: 'gl_aida.jpg',
			award: '',
			filter: function() {
				return false;
			},
		}, {
			name: '黄金国的守护者',
			info: '使用艾达累计胜利100场',
			image: 'gl_aida.jpg',
			award: '',
			filter: function() {
				return false;
			},
		}, {
			name: '小小怪盗',
			info: '令萨德的属性点达到200',
			image: 'gl_sade.jpg',
			award: '',
			filter: function() {
				var nature = get.gl_nature('gl_sade');
				var num = 0;
				for (var i in nature) {
					num += nature[i];
				}
				return num == 200;
			},
		}, {
			name: '黑暗中的逐光者',
			info: '使用萨德累计胜利100场',
			image: 'gl_sade.jpg',
			award: '',
			filter: function() {
				return false;
			},
		}, {
			name: '绘梦的缔造者',
			info: '使用路德维希在首回合内击杀7名角色',
			image: 'gl_ludeweixi.jpg',
			award: '童话绘笔',
			filter: function() {
				return true;
			},
		}],
		pages: [],
		createPage: function(func) {
			var page = ui.create.div('.gl_page', that.book);
			var page1 = ui.create.div('.gl_page1', page);
			var content = ui.create.div('.gl_content.content', page1);
			var page2 = ui.create.div('.gl_page2', page);
			var state1 = ui.create.div('.gl_state1', page2);
			var state2 = ui.create.div('.gl_state2', page2);
			if (typeof func == 'string') that[func](page, page1, content, page2, state1, state2);
			return page;
		},
		recallClick: function() {
			if (!galgame.text[this.link]) {
				game.gl_createDailog('不必强迫自己去回忆那些痛苦的事。');
				return;
			}
			galgame.sces({
				shijian: this.link,
				pause: false
			});
		},
		changeRecall: function(name) {
			that.recall.innerHTML = '<h2>追忆</h2>';
			if (!that.recallList[name]) return;
			for (var i of that.recallList[name]) {
				var arr = i.split(':');
				var node = ui.create.div(that.recall);
				node.innerHTML = arr[0];
				node.link = arr[1];
				node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', that.recallClick);
			}
		},
		longpressAdd: function() {
			var node = this;
			this.longpress = setTimeout(function() {
				node.interval = true;
				var interval = function() {
					if (get.gl_count() <= 0) return;
					var nature = get.gl_nature(that.content.link.link);
					if (nature[node.link] == 100) {
						return;
					}
					var num = 200;
					for (var i in nature) {
						num -= nature[i];
					}
					if (num == 0) {
						return;
					}
					that.addCount(node.link);
					data.count++;
					that.upData();
					that.count.innerHTML = '联结点数：' + get.gl_count();
					if (node.interval) {
						setTimeout(interval, 100);
					}
				}
				interval();
			}, 1000);
		},
		touchendAdd: function() {
			clearTimeout(this.longpress);
			var node = this;
			if (this.interval) {
				delete this.interval;
			} else {
				if (get.gl_count() <= 0) {
					game.gl_createDailog('联结点数不足！');
					return;
				}
				var nature = get.gl_nature(that.content.link.link);
				if (nature[node.link] == 100) {
					game.gl_createDailog('单项属性不能大于100！');
					return;
				}
				var num = 200;
				for (var i in nature) {
					num -= nature[i];
				}
				if (num == 0) {
					game.gl_createDailog('属性总和不能超过200！');
					return;
				}
				var str = '确定要消耗1点联结点数增加1点';
				switch (node.link) {
					case 'power':
						str += '武力';
						break;
					case 'defense':
						str += '韧性';
						break;
					case 'recover':
						str += '祝福';
						break;
					case 'magic':
						str += '魔性';
						break;
				}
				str += '吗？'
				game.gl_createDailog(str, ['确定', '取消'], function(bool) {
					if (bool == '确定') {
						that.addCount(node.link);
						data.count++;
						that.upData();
						that.count.innerHTML = '联结点数：' + get.gl_count();
					}
				});
			}
		},
		longpressMinus: function() {
			var node = this;
			this.longpress = setTimeout(function() {
				node.interval = true;
				var interval = function() {
					that.minusCount(node.link);
					if (node.interval) {
						setTimeout(interval, 100);
					}
				}
				interval();
			}, 1000);
		},
		touchendMinus: function() {
			clearTimeout(this.longpress);
			var node = this;
			if (this.interval) {
				delete this.interval;
			} else {
				var nature = get.gl_nature(that.content.link.link);
				if (nature[node.link] == 0) {
					game.gl_createDailog('单项属性不能低于0！');
					return;
				}
				var str = '确定要降低1点';
				switch (node.link) {
					case 'power':
						str += '武力';
						break;
					case 'defense':
						str += '韧性';
						break;
					case 'recover':
						str += '祝福';
						break;
					case 'magic':
						str += '魔性';
						break;
				}
				str += '属性吗？';
				game.gl_createDailog(str, ['确定', '取消'], function(bool) {
					if (bool == '确定') {
						that.minusCount(node.link);
					}
				});
			}
		},

		minusCount: function(type) {
			game.gl_gainNature(that.content.link.link, type, -1);
			that.changeNature(that.content.link.link);
		},

		addCount: function(type) {
			game.gl_gainNature(that.content.link.link, type, 1);
			that.changeNature(that.content.link.link);
		},

		change: function() {
			if (that.index == 0) {
				that.yindao.classList.remove('gl_samll');
			} else {
				that.yindao.classList.add('gl_samll');
			}
			if (that.index == 3) {
				that.achievementOnload();
			};
		},

		changeKeen: function(bool) {
			if (!data.keen) data.keen = [];
			that.keen.classList.remove('gl_select');
			if (bool) {
				if (data.keen.contains(that.content.link.link)) {
					data.keen.remove(that.content.link.link);
				} else {
					data.keen.push(that.content.link.link);
				}
				that.upData();
			}
			if (data.keen.contains(that.content.link.link)) {
				that.keen.classList.add('gl_select');
			}
		},

		changeChoose: function(link, type) {
			if (type == 'character') {
				that.content.link = link;
				that.changeKeen();
			} else {
				that.content.type = link;
				that.choose.select.classList.remove('gl_select');
				that.choose.select = that[link];
				that.choose.select.classList.add('gl_select');
			}
			that.content.innerHTML = '';
			if (that.content.type == 'skin') {
				that.changeSkin(that.content.link);
			}
			if (that.content.type == 'info') {
				that.content.innerHTML = get.characterIntro(that.content.link.link);
			}
			if (that.content.type == 'skill') {
				var list = lib.character[that.content.link.link][3];
				for (var i = 0; i < list.length; i++) {
					if (!lib.translate[list[i]] || !lib.translate[list[i] + '_info']) continue;
					var node = ui.create.div(that.content);
					ui.create.div(node).innerHTML = '【' + get.translation(list[i]) + '】<br>' + lib.translate[list[i] + '_info'];
					var info = get.info(list[i]);
					if (info.derivation) {
						var derivation = info.derivation;
						if (typeof derivation == 'string') {
							derivation = [derivation];
						}
						for (var j = 0; j < derivation.length; j++) {
							var deri = ui.create.div(node, '.bluetext');
							deri.innerHTML = '【' + get.translation(derivation[j]) + '】';
							deri.onclick = function() {
								game.gl_createDailog(get.skillInfoTranslation(this.link), false);
							}
							deri.link = derivation[j]
						}
					}
				}
			}
		},

		changeSkill: function(name) {
			that.skills.innerHTML = '';
			that.count.innerHTML = '联结点数：' + get.gl_count();
			if (that.skillList[name]) {
				var title = document.createElement('h3');
				title.innerHTML = '专有技能';
				that.skills.appendChild(title);
				var list = that.skillList[name];
				for (var i of list) {
					var node = ui.create.div(that.skills);
					node.link = i;
					if (data.specialSkill[name] && data.specialSkill[name].contains(i)) {
						node.classList.add('gl_select');
					}
					node.onclick = function() {
						var list = get.gl_specialSkill(name);
						if (list.contains(this.link)) {
							list.remove(this.link);
							this.classList.remove('gl_select');
							that.upData();
							return;
						}
						if (list.length >= 2) {
							game.gl_createDailog('贪心是没有好结果的啦！（已达使用上限）');
							return;
						}
						list.add(this.link);
						this.classList.add('gl_select');
						that.upData();
					}
					ui.create.div(node).innerHTML = '【' + get.translation(i) + '】<br/>' + lib.translate[i + '_info'];
				}
				var title = document.createElement('h3');
				title.innerHTML = '共有技能';
				that.skills.appendChild(title);
			}
			if (lib.character[name][3].contains('gl_lianjie')) {
				var list = {
					'lv0': '联结LV0<br />游戏开始时，你随机变身为一名愿意回应你的童话英雄。',
					'lv1': '联结LV1<br />出牌阶段限一次，你可以变身为一名你曾击败过的角色。',
					'lv2': '联结LV2<br />游戏开始时或出牌阶段限一次，你可以变身为一名你曾击败过的角色。',
					'lv3': '联结MAX<br />游戏开始时或出牌阶段限一次，你可以结合两名你曾击败过的角色力量。'
				}
				for (var i in list) {
					var node = ui.create.div(that.skills);
					ui.create.div(node).innerHTML = list[i];
					node.link = i.slice(2);
					if (!data.level && data.level !== 0) data.level = 1;
					if (node.link == data.level) {
						node.classList.add('gl_select');
						var skilling = node;
					}
					node.onclick = function() {
						if (!data.Maxlevel) data.Maxlevel = 1;
						if (this.link > data.Maxlevel) {
							var num = 10;
							if (data.Maxlevel == 2) {
								num = 100;
							}
							game.gl_createDailog('要消耗' + num + '点联结点数提升联结等级吗？', ['确定', '取消'], function(bool) {
								if (bool == '确定') {
									if (get.gl_count() < num) {
										game.gl_createDailog('你还不够成熟呢，去更多的历练自己吧！');
									} else {
										data.Maxlevel++;
										data.count += num;
										that.upData();
										that.count.innerHTML = '联结点数：' + get.gl_count();
										game.gl_createDailog('已经为你提升联结等级了，期待你以后的表现！');
									}
								}
							});
							return;
						}
						data.level = parseInt(this.link);
						skilling.classList.remove('gl_select');
						skilling = this;
						skilling.classList.add('gl_select');
						that.upData();
					}
				}
			} else if (lib.characterPack.gl_create[name]) {
				that.skills.innerHTML = '此为造物主，无调律者技能可用';
			} else {
				if (!data.skill) {
					data.skill = {};
				}
				for (var i in lib.gl_skill) {
					var node = ui.create.div(that.skills);
					var str = '【' + lib.gl_skill[i].name + '】</br>类型：';
					switch (lib.gl_skill[i].type) {
						case 'replace':
							str += '<span style="color:#0000ff">切替</span>';
							break;
						case 'retreat':
							str += '<span style="color:#55ff00">撤离</span>';
							break;
						case 'passive':
							str += '<span style="color:#ff007f">被动</span>';
							break;
						case 'driving':
							str += '<span style="color:#b1b1b1">主动</span>';
							break;
					}
					str += '</br>能量珠：' + lib.gl_skill[i].price + '</br>' + lib.gl_skill[i].info;
					ui.create.div(node).innerHTML = str;
					node.link = i;
					if (data.skill[name] && data.skill[name].contains(i)) {
						node.classList.add('gl_select');
					}
					node.onclick = function() {
						var name = that.content.link.link;
						var list = game.gl_getSkill(name);
						if (list.contains(this.link)) {
							list.remove(this.link);
							this.classList.remove('gl_select');
							that.upData();
							return;
						}
						if (list.length >= 2) {
							game.gl_createDailog('过多的调律者技能对英雄们来说是一种负担呢！（已达使用上限）');
							return;
						}
						if (!data.skills) data.skills = [];
						if (!data.skills.contains(this.link)) {
							var str = '要花费' + lib.gl_skill[this.link].count;
							str += '点联结点数解锁调律者技能【' + lib.gl_skill[this.link].name + '】吗？';
							var result = this.link;
							game.gl_createDailog(str, ['确定', '取消'], function(bool) {
								if (bool == '确定') {
									if (get.gl_count() < lib.gl_skill[result].count) {
										game.gl_createDailog('你还不够成熟呢，去更多的历练自己吧！');
									} else {
										data.skills.push(result);
										data.count += lib.gl_skill[result].count
										that.upData();
										that.count.innerHTML = '联结点数：' + get.gl_count();
										game.gl_createDailog('已经为你解锁了，期待你以后的表现！');
									}
								}
							});
							return;
						}
						for (var i = 0; i < list.length; i++) {
							if (lib.gl_skill[list[i]].type == lib.gl_skill[this.link].type) {
								game.gl_createDailog('不能同时使用两种相同类型的技能哦！');
								return;
							}
						}
						list.add(this.link);
						this.classList.add('gl_select');
						that.upData();
					}
				}
			}
		},

		changeNature: function(name) {
			var nature = get.gl_nature(name);
			that.power.style.width = nature.power + '%';
			console.log(that.power.parentNode.childNodes)
			that.power.parentNode.childNodes[1].innerHTML = nature.power + '/100';
			that.defense.style.width = nature.defense + '%';
			that.defense.parentNode.childNodes[1].innerHTML = nature.defense + '/100';
			that.recover.style.width = nature.recover + '%';
			that.recover.parentNode.childNodes[1].innerHTML = nature.recover + '/100';
			that.magic.style.width = nature.magic + '%';
			that.magic.parentNode.childNodes[1].innerHTML = nature.magic + '/100';
		},

		$changeLink: function(img, bool) {
			var node = that.yindao.childNodes[0];
			if (!node.rotating) {
				node.rotating = true;
				node.classList.add('gl_xvanzhuan');
				if (bool !== false) {
					node.style.backgroundImage = img.style.backgroundImage;
					that.changeNature(img.link);
					that.changeChoose(img, 'character');
					that.changeSkill(img.link);
					that.changeRecall(img.link);
				}
				setTimeout(function() {
					node.rotating = false;
					node.classList.remove('gl_xvanzhuan');
				}, 500);
			}
		},

		next: function() {
			if (that.index == that.pages.length - 1) {
				that.over();
				return;
			};
			game.playAudio('..', 'extension/格林笔记/page', 'books');
			that.pages[that.index].style.transform = 'rotateY(-180deg)';
			that.pages[that.index].childNodes[0].style.zIndex = '0';
			that.pages[that.index].style.zIndex = String(that.pages[that.index].index);
			that.index++;
			that.change()
		},

		pav: function() {
			if (that.index == 0) {
				that.over();
				return;
			};
			that.index--;
			game.playAudio('..', 'extension/格林笔记/page', 'books');
			that.pages[that.index].style.transform = 'rotateY(0deg)';
			that.pages[that.index].childNodes[0].style.zIndex = '';
			var num = that.pages.length - that.pages[that.index].index;
			that.pages[that.index].style.zIndex = String(num);
			that.change()
		},

		setBackground: function(node, name, type, ext, subfolder) {
			if (name.indexOf('gl_') == 0 && type == 'character') {
				src = 'extension/格林笔记/';
				if (lib.config.skin[name] && ext != 'noskin') {
					src += 'skin/' + name + '/' + lib.config.skin[name] + '.jpg';
				} else {
					src += name + '.jpg';
				}
				node.setBackgroundImage(src);
				node.style.backgroundSize = "cover";
			} else {
				node.setBackground(name, type, ext, subfolder);
			}
			return node;
		},

		changeSkinClink: function() {
			if (this.classList.contains('gl_ban')) return;
			that.$changeLink(null, false);
			game.gl_changeSkin(this.name, this.link, true);
			that.yindao.childNodes[0].setBackground(this.name, 'character');
		},

		changeSkin: function(link) {
			var name = link.link;
			var name2 = name;
			var src = 'image/skin/';
			if (name.indexOf('gl_') == 0) {
				src = 'extension/格林笔记/skin/';
			}
			var introadded = false;
			var gzbool = false;
			if (name.indexOf('gz_shibing') == 0) {
				name = name.slice(3, 11);
			} else if (name.indexOf('gz_') == 0) {
				name = name.slice(3);
				gzbool = true;
			}
			var node = that.yindao.childNodes[0];
			var createButtons = function(num, sp) {
				if (num == 0 && !sp) {
					that.content.innerHTML = '暂无皮肤';
					return;
				}
				for (var i = 0; i <= num; i++) {
					var button = ui.create.div('.button.character.pointerdiv', that.content, function() {
						that.$changeLink(null, false);
						game.gl_changeSkin(name, this.link);
						that.yindao.childNodes[0].setBackground(name, 'character');
					});
					button.link = i;
					if (i) {
						button.setBackgroundImage(src + name + '/' + i + '.jpg');
					} else {
						if (gzbool && lib.character[nameskin2][4].contains('gzskin') && lib.config.mode_config.guozhan.guozhanSkin) that.setBackground(button, name2, 'character', 'noskin');
						else that.setBackground(button, name, 'character', 'noskin');
					}
				}
				if (sp) {
					var skin = lib.gl_spSkin[name];
					var keys = [];
					if (skin) {
						if (skin.src) {
							keys.add(skin);
						} else {
							for (var i in skin) {
								keys.push(skin[i]);
							}
						}
					}
					for (var i = 0; i < sp.length; i++) {
						var list = sp[i].slice(0);
						if (list.length == 0) continue;
						var spSkin = ui.create.div(that.content);
						for (var j = 0; j < list.length; j++) {
							var button = ui.create.div('.button.character.pointerdiv', spSkin, that.changeSkinClink);
							button.link = list[j];
							button.name = name;
							button.setBackgroundImage(src + name + '/' + list[j] + '.jpg');
							if (!get.gl_spSkin(keys[i].key || name)) button.classList.add('gl_ban');
						}
						ui.create.div(spSkin).innerHTML = '【' + keys[i].name + '】</br>' + keys[i].info;
					}
				}
			}
			var num = 0,
				num2 = 0;
			var skinMap = [1];
			var skin = lib.gl_spSkin[name];
			if (skin) {
				var list;
				if (skin.src) {
					if (Array.isArray(skin.src)) {
						list = skin.src.slice(0);
					} else {
						list = [skin.src];
					}
					skinMap.push(list);
				} else {
					for (var i in skin) {
						if (Array.isArray(skin[i].src)) {
							list = skin[i].src.slice(0);
						} else {
							list = [skin[i].src];
						}
						skinMap.push(list);
					}
				}
			}
			var loadImage = function() {
				var img = new Image();
				img.onload = function() {
					if (typeof skinMap[num] == 'number') {
						skinMap[num]++;
					} else {
						if (num2 < skinMap[num].length - 1) {
							num2++;
						} else {
							num2 = 0;
							if (num < skinMap.length - 1) {
								num++;
							} else {
								createButtons(skinMap[0], skinMap.splice(1, skinMap.length));
								return;
							}
						}
					}
					loadImage();
				}
				img.onerror = function() {
					if (typeof skinMap[num] == 'number') {
						skinMap[num]--;
						if (num < skinMap.length - 1) {
							num++;
							loadImage();
						} else {
							createButtons(skinMap[0]);
						}
					} else {
						skinMap[num].splice(num2--, 1);
						if (num2 < skinMap[num].length - 1) {
							num2++;
							loadImage();
						} else {
							num2 = 0;
							if (num < skinMap.length - 1) {
								num++;
								loadImage();
							} else {
								createButtons(skinMap[0], skinMap.splice(1, skinMap.length));
							}
						}
					}
				}
				if (typeof skinMap[num] == 'number') {
					img.src = lib.assetURL + src + name + '/' + skinMap[num] + '.jpg';
				} else {
					img.src = lib.assetURL + src + name + '/' + skinMap[num][num2] + '.jpg';
				}
			}
			loadImage();
		},
		initLucky: function() {
			if (get.gl_count() < 5) {
				return;
			}
			game.gl_createDailog('要进行感应吗？（每次消耗5点联结点数）', ['来1次', '来5次', '来10次', '取消'], function(bool) {
				var num;
				switch (bool) {
					case '来1次':
						num = 1;
						break;
					case '来5次':
						num = 5;
						break;
					case '来10次':
						num = 10;
						break;
				}
				if (num && get.gl_count() >= num * 5) {
					data.count += num * 5;
					that.upData();
					that.cover.style.display = 'inline-block';
					that.count.innerHTML = '联结点数：' + get.gl_count();
					for (var i = 0; i < num; i++) {
						that.createLucky();
					}
					if (that.lucky.childNodes.length == 1) {
						that.lucky.childNodes[0].onclick();
					}
				}
			});
		},
		createLucky: function() {
			var node = ui.create.div(that.lucky);
			var num = Math.random();
			if (num < 0.5) {
				node.bool = that.luckyList.none;
			} else if (num < 0.8) {
				node.bool = that.luckyList.common.randomGet();
			} else if (num < 0.95) {
				node.bool = that.luckyList.rare.randomGet();
			} else {
				node.bool = that.luckyList.peerless.randomGet();
			}
			node.setBackgroundImage('extension/格林笔记/page/lucky.jpg');
			node.onclick = function() {
				if (!this.open && that.luckying.classList.contains('hidden')) {
					this.open = true;
					that.luckying.link = this;
					that.luckying.classList.remove('hidden');
					that.luckying.setBackgroundImage('extension/格林笔记/' + this.bool.img);
					that.fillCanvas(that.luckying);
				}
			}
		},
		fillCanvas: function(node) {
			var canvas = document.createElement('canvas');
			canvas.width = 210;
			canvas.height = 310;
			node.appendChild(canvas);
			canvas.ctx = canvas.getContext("2d");
			canvas.ctx.drawImage(that.coverImage, 0, 0, 210, 310);
			var tapstart = lib.config.touchscreen ? 'touchstart' : 'mousedown',
				tapmove = lib.config.touchscreen ? 'touchmove' : 'mousemove',
				tapend = lib.config.touchscreen ? 'touchend' : 'mouseup';
			canvas.ctx.globalCompositeOperation = 'destination-out';
			canvas.addEventListener(tapstart, that.eventDown);
			canvas.addEventListener(tapend, that.eventUp);
			canvas.addEventListener(tapmove, that.eventMove);
		},
		// 点击开始事件
		eventDown: function(e) {
			e.preventDefault();
			this.mousedown = true;
		},
		// 点击结束事件
		eventUp: function(e) {
			e.preventDefault();
			this.mousedown = false;
		},
		// 刮奖事件
		eventMove: function(e) {
			if (this.hasDone) return;
			let ctx = this.ctx;
			e.preventDefault();
			if (this.mousedown) {
				if (e.changedTouches) {
					e = e.changedTouches[0];
				}
				var x = (e.clientX + document.body.scrollLeft || e.pageX) - this.getBoundingClientRect().left || 0,
					y = (e.clientY + document.body.scrollTop || e.pageY) - this.getBoundingClientRect().top || 0;

				this.ctx.beginPath();
				this.ctx.arc(x, y, 20, 0, Math.PI * 2);
				this.ctx.fill();
			}
			that.handleFilledPercentage(this, that.getFilledPercentage(this));
		},
		getFilledPercentage: function(node) {
			let imgData = node.ctx.getImageData(0, 0, 100, 200);
			let pixels = imgData.data;
			let transPixels = [];
			for (let i = 0; i < pixels.length; i += 4) {
				if (pixels[i + 3] < 128) {
					transPixels.push(pixels[i + 3]);
				}
			}
			return ((transPixels.length / (pixels.length / 4)) * 100).toFixed(2) + '%';
		},
		handleFilledPercentage: function(node, percentage) {
			percentage = percentage || 0;
			var parent = node.parentNode;
			if (parseInt(percentage) > 50) {
				node.remove();
				node.hasDone = true;
				parent.link.style.backgroundSize = 'cover';
				that.luckying.text.innerHTML = parent.link.bool.name;
				ui.create.div('.gl_title', parent.link).innerHTML = parent.link.bool.name;
				parent.link.setBackgroundImage('extension/格林笔记/' + parent.link.bool.img);
				parent.link.bool.result();
				setTimeout(function() {
					parent.classList.add('hidden');
				}, 1000)
				for (var i of that.lucky.childNodes) {
					if (!i.open) return;
				}
				setTimeout(function() {
					that.cover.style.display = '';
					that.lucky.innerHTML = '';
				}, 2000)
			}
		},
		skillList: {
			'gl_aikesi': ['gl_lianhe', 'lianpo'],
			'gl_leina': ['gl_tiaolv', 'gl_qinhe'],
			'gl_famu': ['gl_tanbao', 'gl_yuhe'],
			'gl_aida': ['gl_shouhu', 'gl_guishi'],
			'gl_ailuoweisi': ['gl_congjian', 'gl_huashi', 'gl_jiqi', 'gl_suoji', 'gl_qipo'],
			'gl_sade': ['gl_qianxi', 'gl_qieqv'],
			'gl_aileina': ['gl_zaibian'],
			'gl_kali': ['gl_fuyin', 'gl_xinsheng', 'gl_wuhua'],
		},
		recallList: {
			"gl_aikesi": [
				"空白的命运之书:kongbaidemingyunzhishu",
				"永远的约定:yongyuandeyueding",
				"真公主与假王子:zhengongzhuyujiawangzi"
			],
			"gl_leina": [
				"格林之家:gelinzhijia"
			],
			"gl_famu": [
				"伟大的人:weidaderen",
				"两位魔女:liangweimonv"
			],
			"gl_huiguniang": [
				"噩梦舞会:emengwuhui"
			],
			"gl_xiaohongmao": [
				"战栗的火焰:zhanlidehuoyan"
			]
		},
		luckyList: {
			none: {
				name: '联结点数*1',
				img: 'xiangqv.jpg',
				result: function() {
					data.count--;
					that.upData();
					if (that.count) {
						that.count.innerHTML = '联结点数：' + get.gl_count();
					}
				}
			},
			common: [{
				name: '联结点数*5',
				img: 'xiangqv.jpg',
				result: function() {
					data.count -= 5;
					that.upData();
					if (that.count) {
						that.count.innerHTML = '联结点数：' + get.gl_count();
					}
				}
			}],
			rare: [{
				name: '束缚爱丽丝',
				img: 'gl_ailisi.jpg',
				result: function() {
					game.gl_gainSkin('ailisi_shufu');
				}
			}, {
				name: '黑混沌格尔达',
				img: 'gl_geerda.jpg',
				result: function() {
					game.gl_gainSkin('gl_geerda');
				}
			}, {
				name: '黑混沌爱丽丝',
				img: 'gl_ailisi.jpg',
				result: function() {
					game.gl_gainSkin('ailisi_hei')
				}
			}, {
				name: '黑混沌小红帽',
				img: 'gl_xiaohongmao.jpg',
				result: function() {
					game.gl_gainSkin('xiaohongmao_hei')
				}
			}, {
				name: '暴力小红帽',
				img: 'gl_xiaohongmao.jpg',
				result: function() {
					game.gl_gainSkin('xiaohongmao_baoli')
				}
			}, {
				name: '黑混沌阿拉丁',
				img: 'gl_alading.jpg',
				result: function() {
					game.gl_gainSkin('gl_alading')
				}
			}],
			peerless: [{
				name: '伊特',
				img: 'gl_yite.jpg',
				result: function() {
					game.gl_gain('gl_yite');
				}
			}, {
				name: '小矮人',
				img: 'gl_xiaoairen.jpg',
				result: function() {
					game.gl_gain('gl_xiaoairen');
				}
			}, {
				name: '猎人',
				img: 'gl_lieren.jpg',
				result: function() {
					game.gl_gain('gl_lieren');
				}
			}, {
				name: '米莉卡',
				img: 'gl_milika.jpg',
				result: function() {
					game.gl_gain('gl_milika');
				}
			}, {
				name: '塔琪安那',
				img: 'gl_taqianna.jpg',
				result: function() {
					game.gl_gain('gl_taqianna');
				}
			}, {
				name: '御坂美琴',
				img: 'gl_yubanmeiqin.jpg',
				result: function() {
					game.gl_gain('gl_yubanmeiqin');
				}
			}, {
				name: '有川姬',
				img: 'gl_youchuanji.jpg',
				result: function() {
					game.gl_gain('gl_youchuanji');
				}
			}, {
				name: '王陆',
				img: 'gl_wanglu.jpg',
				result: function() {
					game.gl_gain('gl_wanglu');
				}
			}],
		}
	}
	return that;
}
