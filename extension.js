game.import("extension", function(lib, game, ui, get, ai, _status) {
	return {
		editable: false,
		name: "格林笔记",
		content: function(config, pack) {
			game.gl_openBook = function(fast) {
				if (!ui.gl_book) {
					lib.init.json(lib.assetURL + 'extension/格林笔记/sce/galgame.json', function(text) {
						for (var i in text) {
							galgame.text[i] = text[i];
						}
					});
					var page = ui.create.div('.gl_book.hidden', ui.window);
					var obj = window.gl_createPage(lib, game, ui, get, ai, _status);
					obj.fast = fast;
					var node = obj.init(page);
					obj.over = function() {
						page.classList.add('hidden');
					}
					page.link = obj;
					ui.gl_book = page;
				} else if (ui.gl_book.classList.contains('hidden')) {
					ui.gl_book.classList.remove('hidden');
					ui.backgroundMusic.pause();
					if (ui.gl_book.link.backgroundMusic) {
						ui.gl_book.link.backgroundMusic.play();
					}
				}
			}
			game.gl_openSkin = function() {
				game.gl_openBook(this.link);
				ui.gl_book.link.$changeLink(this.link);
				if (ui.gl_book.link.content.type != 'skin') {
					ui.gl_book.link.changeChoose('skin');
				}
				while (ui.gl_book.link.index != ui.gl_book.link.pages.length - 1) {
					ui.gl_book.link.next();
				}
			}
			lib.init.js(lib.assetURL + 'extension/格林笔记/page', 'index');
			//角色开放列表
			var noban = ['gl_puluomixiusi', "gl_luyisha", "gl_dimu", "gl_shuiguai", "gl_ailixiya", "gl_taao", "gl_shiyin", "gl_aikesi", "gl_famu", "gl_aida", "gl_ailuoweisi", "gl_sade", "gl_aileina", "gl_luoji", "gl_kali"];
			if (lib.config.gelin.character) noban.addArray(lib.config.gelin.character);
			//检测存档异常
			lib.arenaReady.push(function() {
				if (parseInt(lib.version.slice(4, 7)) < 115) {
					alert('你的无名杀版本过低，正在关闭本扩展（格林笔记）并重启');
					game.saveConfig('extension_格林笔记_enable', false);
					game.reload();
					return;
				}
				if (!game.gl_save) return;
				if (confirm('检测到你的存档异常，是否启用备份存档？')) {
					game.saveConfig('gelin', game.gl_save);
				}
			});
			//环境牌
			lib.skill.gl_map = {
				trigger: {
					global: 'phaseBefore',
					player: ['roundStart', 'enterGame'],
				},
				forced: true,
				priority: 100,
				popup: false,
				firstDo: true,
				filter: function(event, player, name) {
					if (name == 'roundStart') return ui.gl_map && ui.gl_map.roundNumber;
					return event.name != 'phase' || game.phaseNumber == 0;
				},
				content: function() {
					if (event.triggername == 'roundStart') {
						ui.gl_map.roundNumber--;
						if (ui.gl_map.roundNumber == 0) ui.gl_map.destroy();
					} else {
						var skills = player.getSkills();
						for (var i of skills) {
							var name = get.info(i).gl_map;
							if (name) game.gl_changeMap(name).roundNumber = 3;
						}
					}
				},
			}
			game.addGlobalSkill('gl_map');
			game.gl_changeMap = function(name) {
				if (!name) return;
				if (ui.gl_map && ui.gl_map.name == name) return;
				var node = ui.create.div('.background.upper.land');
				node.setBackgroundImage('extension/格林笔记/image/' + name + '.jpg');
				node.destroy = function() {
					game.removeGlobalSkill(this.name);
					if (this.system) {
						this.system.remove();
					}
					var info = lib.skill[this.name];
					if (info.subSkill) {
						for (var i in info.subSkill) {
							game.removeGlobalSkill(this.name + '_' + i);
						}
					}
					if (info.over) {
						var next = game.createEvent(this.name + 'Over');
						next.setContent(info.over);
					}
					this.classList.add('hidden');
					var node = this;
					setTimeout(function() {
						node.remove();
					}, 3000);
					if (ui.gl_map == this) {
						ui.gl_map = null;
					}
				}
				if (ui.gl_map) {
					document.body.insertBefore(node, ui.gl_map);
					ui.gl_map.destroy();
				} else {
					node.classList.add('hidden');
					document.body.insertBefore(node, ui.window);
					ui.refresh(node);
					node.classList.remove('hidden');
				}
				ui.gl_map = node;
				node.name = name;
				node.system = ui.create.system(lib.translate[name], null, true, true);
				lib.setPopped(node.system, function() {
					var uiintro = ui.create.dialog('hidden');
					var str = '环境';
					if (node.roundNumber) {
						str = '剩余轮数：' + node.roundNumber;
					}
					var caption = uiintro.addText(str);
					caption.style.margin = '0';
					uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[name + '_info'] + '</div>');
					uiintro.add(ui.create.div('.placeholder.slim'));
					return uiintro;
				}, 200);
				game.addGlobalSkill(name);
				var info = lib.skill[name];
				if (info.subSkill) {
					for (var i in info.subSkill) {
						game.addGlobalSkill(name + '_' + i);
					}
				}
				if (info.start) {
					var next = game.createEvent(name + 'Start');
					next.setContent(info.start);
				}
				return node;
			}
			//判断关联角色
			get.gl_characterLink = function(name) {
				if (!lib.gl_characterLink[name]) return false;
				if (noban.contains(lib.gl_characterLink[name])) return true;
				if (lib.config.gelin.lianjie.contains(lib.gl_characterLink[name])) return true;
				return false;
			}
			//处理语音问题
			lib.skill.gl_audio = {
				hookTrigger: {
					log: function(player, name) {
						if (!lib.config.background_speak) return;
						if (!game.gelinAudio) return;
						var info;
						if (lib.config.skin[name] && game.gelinAudio[lib.config.skin[name] + name]) {
							info = game.gelinAudio[lib.config.skin[name] + name];
						} else {
							info = game.gelinAudio[name];
						}
						while (typeof info == 'string') {
							name = info;
							info = game.gelinAudio[name];
						}
						if (get.is.object(info) && info[player.name]) {
							name = name + '_' + player.name;
							info = info[player.name];
						}
						if (info === true) {
							game.playAudio('..', 'extension/格林笔记/voice', name);
						} else if (typeof info == 'number') {
							game.playAudio('..', 'extension/格林笔记/voice', name + Math.ceil(info * Math.random()));
						}
					},
				},
				trigger: {
					player: ["dieBefore", "useSkillBegin"]
				},
				direct: true,
				priority: -100,
				lastDo: true,
				forceDie: true,
				filter: function(event, player) {
					if (!lib.config.background_speak) return false;
					if (event.name == 'die') return player.name.indexOf('gl_') == 0;
					return game.gelinAudio && game.gelinAudio[event.skill];
				},
				content: function() {
					if (trigger.name == 'die') {
						var name = player.name;
						var playAudio;
						if (player.storage.gl_lianjie) name = player.storage.gl_lianjie[0];
						if (game.gelinAudio && lib.config.skin[name] && game.gelinAudio[lib.config.skin[name] + '_' + name]) {
							name = lib.config.skin[name] + name;
						}
						if (name != player.name) {
							playAudio = function() {
								game.playAudio('..', 'extension/格林笔记/voice', player.name + '_die');
							}
						}
						if (name.indexOf('gl_') == 0) {
							game.playAudio('..', 'extension/格林笔记/voice', name + '_die', playAudio);
						} else if (lib.character[name] && lib.character[name][4].contains('die_audio')) {
							game.playAudio('die', name, playAudio);
						} else {
							game.playAudio('die', name, function() {
								game.playAudio('die', name.slice(name.indexOf('_') + 1), playAudio);
							});
						}
					} else {
						lib.skill.gl_audio.hookTrigger.log(player, trigger.skill);
					}
				}
			}
			game.addGlobalSkill('gl_audio');
			//联结点数
			get.gl_count = function() {
				if (!lib.config.gelin.count) lib.config.gelin.count = 0;
				return lib.config.gelin.lianjie.length - lib.config.gelin.count;
			}
			//成就
			get.gl_achievement = function(name) {
				if (!lib.config.gelin.achievement) lib.config.gelin.achievement = [];
				return lib.config.gelin.achievement.contains(name);
			}
			//角色属性
			get.gl_nature = function(name) {
				if (!lib.config.gelin.nature) {
					lib.config.gelin.nature = {};
				}
				if (!lib.config.gelin.nature[name]) {
					lib.config.gelin.nature[name] = {
						power: 0,
						defense: 0,
						recover: 0,
						magic: 0,
					}
				}
				return lib.config.gelin.nature[name];
			}
			game.gl_gainNature = function(name, type, num) {
				var nature = get.gl_nature(name);
				var count = 200;
				for (var i in nature) {
					count -= nature[i];
				}
				if (num > count) num = count;
				if (num == 0) return;
				nature[type] += num;
				if (nature[type] > 100) {
					nature[type] = 100;
				}
				if (nature[type] < 0) {
					nature[type] = 0;
				}
				game.saveConfig('gelin', lib.config.gelin);
			}
			if (config.nature || get.mode() == 'xiangqv') {
				//暴击判定
				lib.skill._gl_power = {
					trigger: {
						source: "damageBegin2",
					},
					filter: function(event, player) {
						var num = Math.random() * 100;
						var count = get.gl_nature(player.name).power;
						var storage = player.storage.gl_lianjie;
						if (storage) {
							for (var i = 0; i < storage.length; i++) {
								count += get.gl_nature(storage[i]).power;
							}
							count = count / (storage.length + 1);
						}
						return num < game.checkMod(player, count, 'gl_power', player);
					},
					lastDo: true,
					priority: -100000,
					direct: true,
					content: function() {
						trigger.num = trigger.num * 2;
						player.popup('暴击', 'fire');
						game.log(player, '打中了', trigger.player, '的要害')
					},
				}
				//赐福判定
				lib.skill._gl_recover = {
					trigger: {
						player: "phaseAfter",
					},
					lastDo: true,
					priority: -100000,
					direct: true,
					content: function() {
						var count = get.gl_nature(player.name).recover;
						var storage = player.storage.gl_lianjie;
						if (storage) {
							for (var i = 0; i < storage.length; i++) {
								count += get.gl_nature(storage[i]).recover;
							}
							count = count / (storage.length + 1);
						}
						count = game.checkMod(player, count, 'gl_recover', player);
						var gain = 0;
						player.getHistory('gain', function(evt) {
							var judge = Math.random() * 100;
							if (judge < count && evt.cards) {
								gain += evt.cards.length;
							}
						});
						if (gain > 0) {
							player.directgain(get.cards(gain));
							player.popup('赐福', 'wood');
							game.log(player, '得到了赐福');
						}
					},
				}
				//格挡判定
				lib.skill._gl_defense = {
					trigger: {
						player: "damageBegin4",
					},
					lastDo: true,
					priority: -100000,
					filter: function(event, player) {
						var num = Math.random() * 100;
						var count = get.gl_nature(player.name).defense;
						var storage = player.storage.gl_lianjie;
						if (storage) {
							for (var i = 0; i < storage.length; i++) {
								count += get.gl_nature(storage[i]).defense;
							}
							count = count / (storage.length + 1);
						}
						return num < game.checkMod(player, count, 'gl_defense', player);
					},
					direct: true,
					content: function() {
						var num = Math.ceil(trigger.num / 2);
						player.changeHujia(num);
						player.popup('格挡', 'soil');
					},
				}
				//再动判定
				lib.skill._gl_magic = {
					trigger: {
						player: "phaseAfter",
					},
					lastDo: true,
					filter: function(event, player) {
						if (event.skill) return false;
						var num = Math.random() * 100;
						var count = get.gl_nature(player.name).magic;
						var storage = player.storage.gl_lianjie;
						if (storage) {
							for (var i = 0; i < storage.length; i++) {
								count += get.gl_nature(storage[i]).magic;
							}
							count = count / (storage.length + 1);
						}
						return num < game.checkMod(player, count, 'gl_magic', player);
					},
					priority: -100001,
					direct: true,
					content: function() {
						player.insertPhase();
						player.popup('再动', 'key');
						game.log(player, '的魔力充盈全身');
					},
				}
			}
			//真尼玛难搞的筛选角色
			ui.create.gl_lianjie = function(list) {
				var dialog;
				var node = ui.create.div('.caption.pointerspan');
				if (get.is.phoneLayout()) {
					node.style.fontSize = '30px';
				}
				var namecapt = [];
				var getCapt = function(str) {
					var capt;
					if (str.indexOf('_') == -1) {
						capt = str[0];
					} else {
						capt = str[str.lastIndexOf('_') + 1];
					}
					capt = capt.toLowerCase();
					if (!/[a-z]/i.test(capt)) {
						capt = '自定义';
					}
					return capt;
				}
				for (var i = 0; i < list.length; i++) {
					var capt = getCapt(list[i]);
					if (!namecapt.contains(capt)) {
						namecapt.push(capt);
					}
				}
				namecapt.sort(function(a, b) {
					return a > b ? 1 : -1;
				});
				namecapt.remove('自定义');
				namecapt.push('newline');
				namecapt.push('快捷');
				namecapt.push('英雄');
				var newlined = false;
				var newlined2;
				var packsource;
				var clickCapt = function(e) {
					if (_status.dragged) return;
					if (this.alphabet) {
						if (this.classList.contains('thundertext')) {
							dialog.currentcapt = null;
							dialog.currentcaptnode = null;
							this.classList.remove('thundertext');
							if (this.touchlink) {
								this.touchlink.classList.remove('active');
							}
							for (var i = 0; i < dialog.buttons.length; i++) {
								if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
									dialog.buttons[i].classList.add('nodisplay');
								} else if (dialog.currentcapt2 && dialog.buttons[i].capt !=
									dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
									dialog.buttons[i].classList.add('nodisplay');
								} else {
									dialog.buttons[i].classList.remove('nodisplay');
								}
							}
						} else {
							if (dialog.currentcaptnode) {
								dialog.currentcaptnode.classList.remove('thundertext');
								if (dialog.currentcaptnode.touchlink) {
									dialog.currentcaptnode.touchlink.classList.remove('active');
								}
							}
							dialog.currentcapt = this.link;
							dialog.currentcaptnode = this;
							this.classList.add('thundertext');
							if (this.touchlink) {
								this.touchlink.classList.add('active');
							}
							for (var i = 0; i < dialog.buttons.length; i++) {
								if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
									dialog.buttons[i].classList.add('nodisplay');
								} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
									dialog.buttons[i].classList.add('nodisplay');
								} else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
									dialog.buttons[i].classList.add('nodisplay');
								} else {
									dialog.buttons[i].classList.remove('nodisplay');
								}
							}
						}
					} else {
						if (newlined2) {
							newlined2.style.display = 'none';
							if (!packsource.onlypack) {
								packsource.classList.remove('thundertext');
								if (!get.is.phoneLayout() || !lib.config.filternode_button) {
									packsource.innerHTML = '武将包';
								}
							}
						}
						if (this.classList.contains('thundertext')) {
							dialog.currentcapt2 = null;
							dialog.currentcaptnode2 = null;
							this.classList.remove('thundertext');
							if (this.touchlink) {
								this.touchlink.classList.remove('active');
							}
							for (var i = 0; i < dialog.buttons.length; i++) {
								if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
									dialog.buttons[i].classList.add('nodisplay');
								} else if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
									dialog.buttons[i].classList.add('nodisplay');
								} else {
									dialog.buttons[i].classList.remove('nodisplay');
								}
							}
						} else {
							if (dialog.currentcaptnode2) {
								dialog.currentcaptnode2.classList.remove('thundertext');
								if (dialog.currentcaptnode2.touchlink) {
									dialog.currentcaptnode2.touchlink.classList.remove('active');
								}
							}
							dialog.currentcapt2 = this.link;
							dialog.currentcaptnode2 = this;
							this.classList.add('thundertext');
							if (this.touchlink) {
								this.touchlink.classList.add('active');
							} else if (this.parentNode == newlined2) {
								packsource.innerHTML = this.innerHTML;
								packsource.classList.add('thundertext');
							}
							for (var i = 0; i < dialog.buttons.length; i++) {
								if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
									dialog.buttons[i].classList.add('nodisplay');
								} else if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
									dialog.buttons[i].classList.add('nodisplay');
								} else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
									dialog.buttons[i].classList.add('nodisplay');
								} else {
									if (dialog.buttons[i].activate) {
										dialog.buttons[i].activate();
									}
									dialog.buttons[i].classList.remove('nodisplay');
								}
							}
						}
					}
					if (dialog.seperate) {
						for (var i = 0; i < dialog.seperate.length; i++) {
							if (!dialog.seperate[i].nextSibling.querySelector('.button:not(.nodisplay)')) {
								dialog.seperate[i].style.display = 'none';
								dialog.seperate[i].nextSibling.style.display = 'none';
							} else {
								dialog.seperate[i].style.display = '';
								dialog.seperate[i].nextSibling.style.display = '';
							}
						}
					}
					if (filternode) {
						if (filternode.querySelector('.active')) {
							packsource.classList.add('thundertext');
						} else {
							packsource.classList.remove('thundertext');
						}
					}
					if (e) e.stopPropagation();
				};
				for (i = 0; i < namecapt.length; i++) {
					if (namecapt[i] == 'newline') {
						newlined = document.createElement('div');
						newlined.style.marginTop = '5px';
						newlined.style.display = 'block';
						if (get.is.phoneLayout()) {
							newlined.style.fontSize = '32px';
						} else {
							newlined.style.fontSize = '22px';
						}
						newlined.style.textAlign = 'center';
						node.appendChild(newlined);
					} else if (newlined) {
						var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius');
						span.style.margin = '3px';
						span.style.width = 'auto';
						span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
						span.link = namecapt[i];
						span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
						newlined.appendChild(span);
						node[namecapt[i]] = span;
					} else {
						var span = document.createElement('span');
						span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
						span.link = namecapt[i];
						span.alphabet = true;
						span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
						node.appendChild(span);
					}
				}

				var groups = ['wei', 'shu', 'wu', 'qun', 'jin'];
				var bool1 = false;
				var bool2 = false;
				var bool3 = (get.mode() == 'guozhan' && _status.forceKey != true && get.config('onlyguozhan'));
				var bool4 = false;
				for (var i in lib.character) {
					if (lib.character[i][1] == 'shen') {
						bool1 = true;
					}
					if (bool3 || lib.character[i][1] == 'key') {
						bool2 = true;
					}
					if (!bool4 && get.is.double(i)) bool4 = true;
					if (bool1 && bool2 && bool4) break;
				}
				if (bool1) groups.add('shen');
				if (bool2 && !bool3) groups.add('key');
				if (bool4) groups.add('double');
				var natures = ['water', 'soil', 'wood', 'metal'];
				var span = document.createElement('span');
				newlined.appendChild(span);
				span.style.margin = '8px';
				var clickGroup = function() {
					if (_status.dragged) return;
					var node = this,
						link = this.link;
					if (node.classList.contains('thundertext')) {
						dialog.currentgroup = null;
						dialog.currentgroupnode = null;
						node.classList.remove('thundertext');
						for (var i = 0; i < dialog.buttons.length; i++) {
							if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
								dialog.buttons[i].classList.add('nodisplay');
							} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
								dialog.buttons[i].classList.add('nodisplay');
							} else {
								dialog.buttons[i].classList.remove('nodisplay');
							}
						}
					} else {
						if (dialog.currentgroupnode) {
							dialog.currentgroupnode.classList.remove('thundertext');
						}
						dialog.currentgroup = link;
						dialog.currentgroupnode = node;
						node.classList.add('thundertext');
						for (var i = 0; i < dialog.buttons.length; i++) {
							if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
								dialog.buttons[i].classList.add('nodisplay');
							} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
								dialog.buttons[i].classList.add('nodisplay');
							} else if (dialog.currentgroup == 'double') {
								if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group == 'ye') dialog.buttons[i].classList.remove('nodisplay');
								else dialog.buttons[i].classList.add('nodisplay');
							} else {
								if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group == 'ye' || dialog.buttons[i].group != dialog.currentgroup) {
									dialog.buttons[i].classList.add('nodisplay');
								} else {
									dialog.buttons[i].classList.remove('nodisplay');
								}
							}
						}
					}
				};
				for (var i = 0; i < groups.length; i++) {
					var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
					span.style.margin = '3px';
					newlined.appendChild(span);
					span.innerHTML = get.translation(groups[i]);
					span.link = groups[i];
					span._nature = natures[i];
					span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickGroup);
				}

				var span = document.createElement('span');
				newlined.appendChild(span);
				span.style.margin = '8px';

				packsource = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
				packsource.style.margin = '3px';
				newlined.appendChild(packsource);
				var filternode = null;
				var clickCaptNode = function(e) {
					delete _status.filterCharacter;
					ui.window.classList.remove('shortcutpaused');
					filternode.delete();
					filternode.classList.remove('shown');
					clickCapt.call(this.link, e);
				};
				if (get.is.phoneLayout() && lib.config.filternode_button) {
					newlined.style.marginTop = '';
					packsource.innerHTML = '筛选';
					filternode = ui.create.div('.popup-container.filter-character.modenopause');
					ui.create.div(filternode);
					filternode.listen(function(e) {
						if (this.classList.contains('removing')) return;
						delete _status.filterCharacter;
						ui.window.classList.remove('shortcutpaused');
						this.delete();
						this.classList.remove('shown');
						e.stopPropagation();
					});
					for (var i = 0; i < node.childElementCount; i++) {
						if (node.childNodes[i].tagName.toLowerCase() == 'span') {
							node.childNodes[i].style.display = 'none';
							node.childNodes[i].touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large.capt', node.childNodes[i].innerHTML);
							node.childNodes[i].touchlink.link = node.childNodes[i];
						}
					}
					ui.create.node('br', filternode.firstChild);
				} else {
					packsource.innerHTML = '武将包';
				}

				newlined2 = document.createElement('div');
				newlined2.style.marginTop = '5px';
				newlined2.style.display = 'none';
				newlined2.style.fontFamily = 'xinwei';
				newlined2.classList.add('pointernode');
				if (get.is.phoneLayout()) {
					newlined2.style.fontSize = '32px';
				} else {
					newlined2.style.fontSize = '22px';
				}
				newlined2.style.textAlign = 'center';
				node.appendChild(newlined2);

				packsource.addEventListener(lib.config.touchscreen ? 'touchend' : 'click',
					function() {
						if (packsource.onlypack) return;
						if (_status.dragged) return;
						if (get.is.phoneLayout() && lib.config.filternode_button &&
							filternode) {
							_status.filterCharacter = true;
							ui.window.classList.add('shortcutpaused');
							ui.window.appendChild(filternode);
							ui.refresh(filternode);
							filternode.classList.add('shown');
							var dh = filternode.offsetHeight - filternode.firstChild.offsetHeight;
							if (dh > 0) {
								filternode.firstChild.style.top = (dh / 2) + 'px';
							} else {
								filternode.firstChild.style.top = '';
							}
						} else {
							if (newlined2.style.display == 'none') {
								newlined2.style.display = 'block';
							} else {
								newlined2.style.display = 'none';
							}
						}
					});
				var packlist = [];
				for (var i = 0; i < lib.config.all.characters.length; i++) {
					if (!lib.config.characters.contains(lib.config.all.characters[i])) continue;
					packlist.push(lib.config.all.characters[i]);
				}
				for (var i in lib.characterPack) {
					if (!lib.config.all.characters.contains(i)) {
						packlist.push(i);
					}
				}
				packlist.remove('gl_create');
				packlist.remove('gelin');
				for (var i = 0; i < packlist.length; i++) {
					var span = document.createElement('div');
					span.style.display = 'inline-block';
					span.style.width = 'auto';
					span.style.margin = '5px';
					if (get.is.phoneLayout()) {
						span.style.fontSize = '32px';
					} else {
						span.style.fontSize = '22px';
					}
					span.innerHTML = lib.translate[packlist[i] + '_character_config'];
					span.link = packlist[i];
					span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
					newlined2.appendChild(span);
					if (filternode) {
						span.touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large', span.innerHTML);
						span.touchlink.link = span;
					}
				}

				var groupSort;
				var getGroup = function(name) {
					var group = get.is.double(name, true);
					if (group) return group[0];
					return lib.character[name][1];
				}
				groupSort = function(name) {
					if (!lib.character[name]) return 7;
					var group = getGroup(name);
					if (group == 'shen') return -1;
					if (group == 'wei') return 0;
					if (group == 'shu') return 1;
					if (group == 'wu') return 2;
					if (group == 'qun') return 3;
					if (group == 'jin') return 4;
					if (group == 'key') return 5;
					if (group == 'western') return 6;
					return 7;
				}
				list.sort(function(a, b) {
					var del = groupSort(a) - groupSort(b);
					if (del != 0) return del;
					var aa = a,
						bb = b;
					if (a.indexOf('_') != -1) {
						a = a.slice(a.lastIndexOf('_') + 1);
					}
					if (b.indexOf('_') != -1) {
						b = b.slice(b.lastIndexOf('_') + 1);
					}
					if (a != b) {
						return a > b ? 1 : -1;
					}
					return aa > bb ? 1 : -1;
				});
				dialog = ui.create.dialog('hidden');
				dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function() {
					_status.clicked2 = true;
				});
				dialog.getCurrentCapt = function(link, capt, noalph) {
					var currentcapt = noalph ? this.currentcapt2 : this.currentcapt;
					if (currentcapt == '英雄') {
						if (link.indexOf('gl_') == '0') return capt;
						return null;
					}
					if (currentcapt == '快捷') {
						if (!lib.config.gelin.keen) return null;
						if (lib.config.gelin.keen.contains(link)) return capt;
						return null;
					}
					if (lib.characterPack[currentcapt]) {
						if (lib.characterPack[currentcapt][link]) {
							return capt;
						}
						return null;
					}
					return this.currentcapt;
				}
				dialog.add(node);
				dialog.add([list, 'character']);
				dialog.add(ui.create.div('.placeholder'));
				for (i = 0; i < dialog.buttons.length; i++) {
					dialog.buttons[i].group = lib.character[dialog.buttons[i].link][1];
					dialog.buttons[i].capt = getCapt(dialog.buttons[i].link);
					if (!noban.contains(dialog.buttons[i].link) && !lib.config.gelin.lianjie.contains(dialog.buttons[i].link) && !get.gl_characterLink(dialog.buttons[i].link)) dialog.buttons[i].classList.add('gl_ban');
					dialog.buttons[i]._customintro = function(uiintro) {
						var character = this.link;
						if (lib.character[this.link] && lib.character[this.link][1]) {
							var group = get.is.double(this.link, true);
							if (group) {
								var str = get.translation(character) + '&nbsp;&nbsp;';
								for (var i = 0; i < group.length; i++) {
									str += get.translation(group[i]);
									if (i < group.length - 1) str += '/';
								}
								uiintro.add(str);
							} else uiintro.add(get.translation(character) + '&nbsp;&nbsp;' + lib.translate[lib.character[this.link][1]]);
						} else {
							uiintro.add(get.translation(character));
						}
						if (lib.config.gelin.data.contains('departure')) {
							var skin = ui.create.div('.text.center');
							skin.innerHTML = '更改皮肤';
							skin.link = this;
							skin.listen(game.gl_openSkin);
							uiintro.add(skin);
						}
						if (lib.characterTitle[this.link]) {
							uiintro.addText(get.colorspan(lib.characterTitle[this.link]));
						}
						if (lib.gl_skilling[character]) {
							uiintro.addText(get.colorspan('#r调律者技能'));
							for (var j = 0; j < lib.gl_skilling[character].length; j++) {
								var skill = lib.gl_skill[lib.gl_skilling[character][j]];
								var str = '<div><div class="skill">' + skill.name;
								str += '</div><div>类型：';
								switch (skill.type) {
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
								str += '</br>能量珠：<span style="color:#aa00ff">' + skill.price;
								str += '</span></br>' + skill.info + '</div></div>'
								uiintro.add(str);
							}
							uiintro.addText(get.colorspan('#b角色技能'));
						}
						var infoitem = lib.character[character];
						var skills = infoitem[3];
						for (j = 0; j < skills.length; j++) {
							if (lib.translate[skills[j] + '_info']) {
								translation = lib.translate[skills[j] + '_ab'] || get.translation(skills[j]).slice(0, 2);
								if (lib.skill[skills[j]] && lib.skill[skills[j]].nobracket) {
									uiintro.add('<div><div class="skilln">' + get.translation(skills[j]) + '</div><div>' + get.skillInfoTranslation(skills[j]) + '</div></div>');
								} else {
									uiintro.add('<div><div class="skill">【' + translation + '】</div><div>' + get.skillInfoTranslation(skills[j]) + '</div></div>');
								}
								if (lib.translate[skills[j] + '_append']) {
									uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[j] + '_append'] + '</div>')
								}
							}
						}
					}
				}
				clickCapt.call(node['英雄']);
				return dialog;
			}
			//登记获得牌的标签
			lib.skill.gl_gaintag = {
				trigger: {
					player: "gainBefore",
				},
				priority: 651656,
				firstDo: true,
				popup: false,
				forced: true,
				filter: function(event, player) {
					return event.cards && event.cards.length;
				},
				content: function() {
					var cards = trigger.cards;
					trigger.gaintag_map = {};
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].gaintag && cards[i].gaintag.length) {
							trigger.gaintag_map[cards[i].cardid] = cards[i].gaintag.slice(0);
						}
					}
				},
			}
			game.addGlobalSkill('gl_gaintag');
			//阵法技
			game.gl_zhenfa = function(player, target) {
				if (!player.storage.gl_zhenfa || !target.storage.gl_zhenfa) return false;
				if (!player.isAlive() || !target.isAlive()) return false;
				return player.storage.gl_zhenfa == target.storage.gl_zhenfa;
			}
			lib.skill.gl_zhenfa = {
				intro: {
					content: "你位于$的阵法队列中",
				},
			};
			lib.translate.gl_zhenfa = "阵法";
			//武装技
			lib.skill.gl_wuzhuang = {
				enable: "phaseUse",
				filter: function(event, player) {
					var list = [],
						info;
					var storage = player.storage.gl_wuzhuang;
					var skills = player.getSkills(false, false);
					for (var i = 0; i < skills.length; i++) {
						info = get.info(skills[i]);
						if (storage && storage.contains(skills[i])) continue;
						if (info.zhuSkill && !player.hasZhuSkill(skills[i])) continue;
						if (info.gl_wuzhuang) return true;
					}
					return false;
				},
				chooseButton: {
					dialog: function(event, player) {
						var list = [],
							info;
						var storage = player.storage.gl_wuzhuang;
						var skills = player.getSkills(false, false);
						for (var i = 0; i < skills.length; i++) {
							info = get.info(skills[i]);
							if (storage && storage.contains(skills[i])) continue;
							if (info.zhuSkill && !player.hasZhuSkill(skills[i])) continue;
							if (info.gl_wuzhuang) {
								if (Array.isArray(info.gl_wuzhuang)) {
									for (var j = 0; j < info.gl_wuzhuang.length; j++) {
										list.push([skills[i], '', info.gl_wuzhuang[j].name]);
									}
								} else {
									list.push([skills[i], '', info.gl_wuzhuang.name]);
								}
							}
						}
						return ui.create.dialog('选择一项技能武装化', [list, 'vcard']);
					},
					check: function(button) {
						return 1;
					},
					backup: function(links, player) {
						return {
							card: links[0],
							delay: false,
							filterCard: function() {
								return false
							},
							selectCard: -1,
							viewAs: {
								name: links[0][2]
							},
							precontent: function() {
								var result = event.result;
								event.parent.finish();
								var skill = lib.skill.gl_wuzhuang_backup.card[0];
								var card = lib.skill.gl_wuzhuang_backup.card[2];
								player.gl_wuzhuang(skill, result.targets[0], card);
								var evt = _status.event.getParent('phaseUse');
								if (evt && evt.name == 'phaseUse' && !evt.gl_wuzhuang) {
									evt.gl_wuzhuang = true;
									var next = game.createEvent('gl_wuzhuang_clear');
									_status.event.next.remove(next);
									evt.after.push(next);
									next.player = player;
									next.setContent(function() {
										delete player.storage.gl_wuzhuang;
									});
								}
								if (!player.storage.gl_wuzhuang) {
									player.storage.gl_wuzhuang = [];
								}
								player.storage.gl_wuzhuang.push(skill);
							},
						}
					},
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
					threaten: 1.5,
				},
			};
			lib.translate.gl_wuzhuang = "武装";
			lib.translate.gl_wuzhuang_backup = "武装";
			lib.element.player.gl_wuzhuang = function(skill, target, direct) {
				var player = this;
				if (!player.hasSkill(skill)) return;
				var card = get.info(skill);
				if (Array.isArray(card.gl_wuzhuang)) {
					if (direct) {
						for (var i = 0; i < card.gl_wuzhuang.length; i++) {
							if (card.gl_wuzhuang[i].name == direct) {
								card = game.createCard(card.gl_wuzhuang[i]);
								break;
							}
						}
					}
					if (get.itemtype(card) != 'card') {
						card = game.createCard(card.gl_wuzhuang[0]);
					}
				} else {
					card = game.createCard(card.gl_wuzhuang);
				}
				card.storage.gl_wuzhuang = {
					player: player,
					skill: skill
				};
				card.gl_yansheng = true;
				if (!target) target = player;
				target.equip(card);
				player.disableSkill('gl_wuzhuang' + skill, skill);
			}
			game.addGlobalSkill('gl_wuzhuang');
			//清理衍生卡
			lib.skill.gl_discard = {
				trigger: {
					global: ["cardsDiscardAfter", "loseAfter"],
				},
				firstDo: true,
				direct: true,
				filter: function(event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (!event.cards[i].gl_yansheng) continue;
						if (get.position(event.cards[i], true) == 'd') return true;
					}
					return false;
				},
				content: function() {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (!trigger.cards[i].gl_yansheng) continue;
						if (get.position(trigger.cards[i], true) != 'd') continue;
						trigger.cards[i].delete();
						var storage = trigger.cards[i].storage.gl_wuzhuang
						if (!storage || storage.player != player) continue;
						player.enableSkill('gl_wuzhuang' + storage.skill);
					}
				},
			}
			game.addGlobalSkill('gl_discard');
			//侍从技
			lib.skill.gl_shicong = {
				trigger: {
					player: "damageBefore"
				},
				priority: 100,
				firstDo: true,
				filter: function(event, player) {
					if (!player.storage.gl_shicong) return false;
					var list = player.storage.gl_shicong;
					for (var i = 0; i < list.length; i++) {
						var skill = list[i].skill;
						var subPlayer = list[i].subPlayer;
						if (player.hasSkill('subplayer')) {
							var name = player.storage.subplayer.name2;
							if (list[i].subPlayer == name) return true;
						}
						if (!player.hasSkill(skill, false, false)) continue;
						if (player.hasSkill(subPlayer)) return true;
					}
					return false;
				},
				direct: true,
				content: function() {
					'step 0'
					if (player.hasSkill('subplayer')) {
						player.chooseBool('即将受到伤害是否切换回本体？');
					} else {
						event.goto(2);
					}
					'step 1'
					if (result.bool) {
						player.exitSubPlayer();
					}
					event.finish();
					'step 2'
					var skills = [];
					var list = player.storage.gl_shicong;
					for (var i = 0; i < list.length; i++) {
						var skill = list[i].skill;
						var subPlayer = list[i].subPlayer;
						if (!player.hasSkill(skill, false, false)) continue;
						if (player.hasSkill(subPlayer)) {
							skills.push(subPlayer);
						}
					}
					var dialog = ui.create.dialog('即将受到伤害，是否调遣一名随从？', 'hidden');
					dialog.add([skills, 'character']);
					player.chooseButton(dialog);
					'step 3'
					if (result.bool) {
						player.callSubPlayer(result.links[0]);
					}
				},
			}
			lib.translate.gl_shicong = "侍从";
			game.addGlobalSkill('gl_shicong');
			lib.element.player.gl_shicong = function(skill) {
				if (!skill) return;
				var next = game.createEvent('gl_shicong', false);
				next.player = this;
				next.link = skill;
				next.setContent('gl_shicong');
				return next;
			}
			lib.element.content.gl_shicong = function() {
				var skill = event.link;
				if (!player.hasSkill(skill)) return;
				var info = get.info(skill).gl_shicong;
				if (!info) return;
				if (!player.storage.gl_shicong) player.storage.gl_shicong = [];
				for (var i = 0; i < player.storage.gl_shicong.length; i++) {
					if (player.storage.gl_shicong[i].skill == skill) return;
				}
				var hp = get.infoHp(info.hp);
				var maxHp = get.infoMaxHp(info.hp);
				var subPlayer = player.addSubPlayer({
					name: info.name,
					skills: info.skills,
					hp: hp,
					maxHp: maxHp,
					hs: get.cards(4),
					skill: skill,
					sex: info.sex || 'male',
					group: info.group || 'qun',
					intro: '此随从与你的【' + get.translation(skill) + '】共存亡。',
					intro2: '此随从与你的【' + get.translation(skill) + '】共存亡。',
					onremove: function(player) {
						player.disableSkill('gl_shicong' + skill, skill);
					}
				});
				var nameinfo = lib.character[info.name];
				var subinfo = lib.character[subPlayer];
				for (var i = 0; i < nameinfo[4].length; i++) {
					if (nameinfo[4][i].indexOf('ext:') == 0) {
						subinfo[4].length = 0;
						subinfo[4].add(nameinfo[4][i]);
						player.marks[subPlayer].setBackground(subPlayer, 'character');
					}
				}
				player.storage.gl_shicong.add({
					skill: skill,
					subPlayer: subPlayer
				});
			}
			//条件技
			lib.element.player.gl_cost = function() {
				var next = game.createEvent('gl_cost', false);
				next.player = this;
				next.cost = [];
				next.inital = {};
				for (var i = 0; i < arguments.length; i++) {
					if (Array.isArray(arguments[i])) {
						next.cost = next.cost.concat(arguments[i]);
					} else if (typeof arguments[i] == 'string') {
						next.link = arguments[i];
					} else {
						next.cost.push(arguments[i]);
					}
				}
				next.setContent('gl_cost');
				return next;
			}
			lib.element.content.gl_cost = function() {
				if (!event.link || event.cost.length == 0) return;
				var info = get.info(event.link);
				for (var i of event.cost) {
					if (!get.is.object(i)) return;
					if (i._triggered == 5) return;
					if (info.filterCost && !info.filterCost(i, player, event.inital)) return;
				}
				var next = game.createEvent(event.link, false);
				next.player = player;
				next.cost = event.cost;
				next.inital = event.inital;
				next.setContent(info.contentCost);
			}
			//卡牌构筑
			lib.skill.gl_gouzhu = {
				enable: "phaseUse",
				filter: function(event, player) {
					return player.gl_jingshi;
				},
				chooseButton: {
					dialog: function(event, player) {
						var list = [];
						for (var i in lib.card) {
							var info = lib.card[i];
							if (info.gl_material) {
								list.push([get.translation(info.type), get.cnNumber(lib.card[i].gl_jingshi), i]);
							}
						}
						return ui.create.dialog('请选择需要构筑的卡牌', [list, 'vcard']);
					},
					filter: function(button, player) {
						var info = lib.card[button.link[2]];
						if (player.gl_jingshi < info.gl_jingshi) return false;
						if (info.gl_material.filter) return info.gl_material.filter(player);
						for (var i in info.gl_material) {
							if (player.countCards('hes', info.gl_material[i].filter) < info.gl_material[i].num) return false;
						}
						return true;
					},
					check: function(button) {
						var info = lib.card[button.link[2]];
						var player = _status.event.player;
						if (player.countCards('h', button.link[2]) > 0) return 0;
						var effect = player.getUseValue(button.link[2]);
						if (info.notarget) effect = info.ai.useful;
						if (effect > 0) return effect;
						return 0;
					},
					backup: function(links, player) {
						var info = lib.card[links[0][2]];
						return {
							filterCard: function(card, player, target) {
								if (info.gl_material.filterCard) return info.gl_material.filterCard(card, player, target);
								var bool = {};
								for (var i in info.gl_material) {
									bool[i] = 0;
									for (var j of ui.selected.cards) {
										if (info.gl_material[i].filter(j, player, target)) bool[i]++;
									}
									if (info.gl_material[i].num > bool[i] && info.gl_material[i].filter(card, player, target)) return true;
								}
								return false;
							},
							complexCard: true,
							check: function(card, player, target) {
								if (info.gl_material.filterCard) return 11 - get.value(card);
								var num = 0;
								for (var i in info.gl_material) {
									if (info.gl_material[i].filter(j)) num += 5;
								}
								return num - get.value(card);
							},
							position: 'he',
							selectCard: function() {
								if (info.gl_material.num) return info.gl_material.num;
								var bool = {};
								for (var i in info.gl_material) {
									bool[i] = 0;
									for (var j of ui.selected.cards) {
										if (info.gl_material[i].filter(j)) bool[i]++;
									}
									if (info.gl_material[i].num > bool[i]) return ui.selected.cards.length + 1;
								}
								return [0, ui.selected.cards.length];
							},
							lose: false,
							card: links[0],
							delay: false,
							content: lib.skill.gl_gouzhu.contentx,
						}
					},
					prompt: function(links, player) {
						return '请选择用于构筑【' + get.translation(links[0][2]) + '】的素材';
					},
				},
				contentx: function() {
					'step 0'
					event.name = lib.skill.gl_gouzhu_backup.card[2];
					player.gl_changeJingshi(-lib.card[event.name].gl_jingshi);
					player.lose(event.cards, ui.discardPile, 'visible');
					game.log(player, '将', event.cards, '置入了弃牌堆');
					'step 1'
					var card = game.createCard(event.name);
					player.$gl_gainCard(card, event.cards);
					player.gain(card);
					card.gl_yansheng = true;
					card.storage.gl_gouzhu = event.cards.slice(0);
					game.log(player, '从衍生牌堆获得了', card);
				},
				ai: {
					order: 5,
					result: {
						player: 2,
					},
					threaten: 1.9,
				},
			};
			lib.translate.gl_gouzhu = "构筑";
			lib.translate.gl_gouzhu_backup = "构筑";
			if (config.gouzhu) {
				game.addGlobalSkill('gl_gouzhu');
			}
			//处理触发类卡牌的效果
			game.gl_changeCard = function(card, name) {
				if (!card.trigger) return;
				var info = lib.skill.gl_triggerCard;
				game.removeGlobalSkill('gl_triggerCard');
				var trigger;
				for (var i in card.trigger) {
					if (!info.trigger[i]) info.trigger[i] = [];
					if (Array.isArray(card.trigger[i])) {
						for (var j of card.trigger[i]) {
							trigger = card.trigger[i][j];
							info.trigger[i].add(trigger);
							if (!info.cards[trigger]) info.cards[trigger] = [];
							info.cards[trigger].add(name);
						}
					} else {
						trigger = card.trigger[i];
						info.trigger[i].add(trigger);
						if (!info.cards[trigger]) info.cards[trigger] = [];
						info.cards[trigger].add(name);
					}
				}
				game.addGlobalSkill('gl_triggerCard');
			}
			lib.skill.gl_triggerCard = {
				trigger: {},
				cards: {},
				direct: true,
				filter: function(event, player, name) {
					var cards = lib.skill.gl_triggerCard.cards;
					if (!cards[name]) return false;
					_status.gl_triggerCard = event;
					for (var i of cards[name]) {
						if (!player.hasUsableCard(i)) continue;
						if (lib.card[i].filter && !lib.card[i].filter(event, player, name)) continue;
						for (var j in lib.card[i].trigger) {
							if (event[j] != player && j != 'global') continue;
							var trigger = lib.card[i].trigger[j];
							if (trigger == name || (Array.isArray(trigger) && trigger.contains(name))) {
								return true;
							}
						}
					}
					delete _status.gl_triggerCard;
					return false;
				},
				content: function() {
					'step 0'
					_status.gl_triggerCard = trigger;
					var cards = lib.skill.gl_triggerCard.cards;
					player.chooseToUse(function(card, player) {
						var name = get.name(card);
						if (!cards[event.triggername].contains(name)) return false;
						if (!player.hasUsableCard(name)) return false;
						if (lib.card[name].filter && !lib.card[name].filter(trigger, player, event.triggername)) return false;
						for (var i in lib.card[name].trigger) {
							if (trigger[i] != player && i != 'global') continue;
							var tig = lib.card[name].trigger[i];
							if (tig == event.triggername || (Array.isArray(tig) && tig.contains(event.triggername))) {
								return lib.filter.cardEnabled(card, player, 'forceEnable');
							}
						}
						return false;
					});
					'step 1'
					if (result.bool && lib.skill.gl_triggerCard.filter(trigger, player, event.triggername)) {
						event.goto(0);
					}
					delete _status.gl_triggerCard;
				},
			}
			lib.translate.gl_triggerCard = "使用卡牌";
			//处理展示类卡牌的效果
			lib.skill.gl_showCard = {
				trigger: {
					player: "loseBefore"
				},
				forced: true,
				priority: 100,
				popup: false,
				firstDo: true,
				filter: function(event) {
					if (event.type != 'use') return false;
					return event.getParent().card.isCard && get.type(event.cards[0]) == 'science';
				},
				content: function() {
					player.showCards(trigger.cards);
					trigger.cancel();
				}
			}
			game.addGlobalSkill('gl_showCard');
			//数字选择器
			lib.element.player.chooseCount = function() {
				var next = game.createEvent('chooseCount');
				for (var i = 0; i < arguments.length; i++) {
					if (typeof arguments[i] == 'number') {
						next.num = arguments[i];
					} else if (typeof arguments[i] == 'string') {
						next.str = arguments[i];
					} else if (typeof arguments[i] == 'object') {
						next.arr = arguments[i];
					} else if (typeof arguments[i] == 'function') {
						next.ai = arguments[i];
					}
				}
				next.player = this;
				next.setContent('chooseCount');
				return next;
			}
			lib.element.content.chooseCount = function() {
				'step 0'
				event.result = false;
				if (event.isMine()) {
					if (!event.arr) event.arr = [0, 99];
					if (!event.num) event.num = event.arr[0];
					if (!event.str) event.str = '请选择一个数字';
					event.dialog = ui.create.dialog(event.str);
					event.count = ui.create.control('-', event.num, '+');
					var newcount = event.count.cloneNode(true);
					var list = newcount.childNodes;
					list[0].style.width = '20px';
					list[0].onclick = function() {
						event.num--;
						if (event.num < event.arr[0]) event.num = event.arr[1];
						list[1].innerHTML = event.num;
					}
					list[1].style.width = '60px';
					list[1].onclick = function() {
						newcount.parentNode.removeChild(newcount);
						event.dialog.parentNode.removeChild(event.dialog);
						game.resume();
					}
					list[2].style.width = '20px';
					list[2].onclick = function() {
						event.num++;
						if (event.num > event.arr[1]) event.num = event.arr[0];
						list[1].innerHTML = event.num;
					}
					event.count.parentNode.replaceChild(newcount, event.count);
					ui.updatec();
					game.pause();
				} else {
					event.result = 'ai';
				}
				'step 1'
				if (event.result == 'ai') {
					if (event.ai) {
						event.num = event.ai(event.getParent(), player);
					} else {
						event.num = 0;
					}
					if (event.num == false) {
						event.num = 0;
					}
					if (event.num == true) {
						event.num = event.arr[1];
					}
					if (event.arr[0] > event.num) {
						event.num = event.arr[0];
					} else if (event.arr[1] < event.num) {
						event.num = event.arr[1];
					}
				}
				ui.updatec();
				event.result = {
					num: event.num,
				}
			}
			game.gl_lianjie = {};
			game.gl_gain = function(name) {
				if (lib.config.gelin.lianjie.contains(name)) return false;
				lib.config.gelin.lianjie.push(name);
				game.saveConfig('gelin', lib.config.gelin);
			}
			game.gl_gainXiangqv = function(name) {
				if (!lib.config.gelin.xiangqv) lib.config.gelin.xiangqv = [];
				if (lib.config.gelin.xiangqv.contains(name)) return false;
				lib.config.gelin.xiangqv.add(name);
				game.saveConfig('gelin', lib.config.gelin);
			}
			game.gl_gainSkin = function(name) {
				if (!lib.config.gelin.skin) lib.config.gelin.skin = [];
				if (lib.config.gelin.skin.contains(name)) return false;
				lib.config.gelin.skin.add(name);
				game.saveConfig('gelin', lib.config.gelin);
			}
			game.gl_gainCharacter = function(name) {
				if (!lib.config.gelin.character) lib.config.gelin.character = [];
				if (lib.config.gelin.character.contains(name)) return false;
				lib.config.gelin.character.add(name);
				game.saveConfig('gelin', lib.config.gelin);
			}
			game.gl_setData = function(str) {
				if (lib.config.gelin.data.contains(str)) return false;
				lib.config.gelin.data.push(str);
				game.saveConfig('gelin', lib.config.gelin);
				return str;
			}
			game.gl_deleteData = function(str) {
				if (!lib.config.gelin.data.contains(str)) return false;
				lib.config.gelin.data.remove(str);
				game.saveConfig('gelin', lib.config.gelin);
				return str;
			}
			if (lib.config.gelin.lianjie.length > 50) {
				game.gl_gainXiangqv('leina');
			}
			//处理初始化信息
			if (!lib.element.player.inits) {
				lib.element.player.inits = [];
			}
			lib.element.player.inits.add(function(player) {
				var name1, name2;
				if (player.name1 && player.name1.indexOf('gl_') == 0 && !noban.contains(player.name1)) {
					name1 = noban.randomGet();
				}
				if (player.name2 && player.name2.indexOf('gl_') == 0 && !noban.contains(player.name2)) {
					name2 = noban.randomGet();
				}
				if ((name1 || name2) && get.mode() != 'xiangqv') {
					player.init(name1 || player.name1, name2 || player.name2);
					return;
				}
				game.gl_jingshi(player);
				//语音泛用化
				if (!player._hookTrigger) {
					player._hookTrigger = [];
				}
				player._hookTrigger.add('gl_audio');
				//明置技
				var list = player.hiddenSkills;
				if (list) {
					for (var i = 0; i < list.length; i++) {
						var info = get.info(list[i]);
						if (info.gl_mingzhi) {
							if (info.init) info.init(player, list[i]);
							if (info.global) {
								if (typeof info.global == 'string') {
									game.addGlobalSkill(info.global);
								} else {
									for (var j = 0; j < info.global.length; j++) {
										game.addGlobalSkill(info.global[j]);
									}
								}
							}
						}
					}
				}
			});
			//暗置角色
			lib.element.player.$hideCharacter = function(num, bool) {
				var info = lib.character[this.name1 || this.name];
				var skills = info[3].slice(0);
				this.clearSkills();
				if (num != 1) {
					if (!this.hiddenSkills) this.hiddenSkills = [];
					this.hiddenSkills.addArray(skills);
					skills = [];
					this.classList.add(_status.video ? 'unseen_v' : 'unseen');
					this.name = 'unknown';
					this.sex = 'male';
				}
				var info2;
				if (this.name2) {
					info2 = lib.character[this.name2];
				}
				if (num != 0) {
					if (!this.hiddenSkills) this.hiddenSkills = [];
					if (info2) this.hiddenSkills.addArray(info2[3]);
					this.classList.add(_status.video ? 'unseen2_v' : 'unseen2');
				} else if (info2) {
					skills = skills.concat(info2[3]);
				}
				if (!this.storage.nohp) {
					this.storage.rawHp = this.hp;
					this.storage.rawMaxHp = this.maxHp;
					this.hp = 1;
					this.maxHp = 1;
					this.node.hp.hide();
					this.storage.nohp = true;
				}
				if (bool) {
					skills.add('g_hidden_ai');
				}
				for (var i = 0; i < skills.length; i++) {
					this.addSkill(skills[i]);
				}
				this.checkConflict();
				this.update();
				return this;
			};
			//体力吸取
			lib.element.player.vampire = function() {
				var target, num;
				for (var i = 0; i < arguments.length; i++) {
					if (typeof arguments[i] == 'number') {
						num = arguments[i];
					} else if (get.itemtype(arguments[i]) == 'player') {
						target = arguments[i];
					}
				}
				var next = target.loseHp(num);
				var next2 = game.createEvent('vampire', false);
				_status.event.next.remove(next2);
				next.after.push(next2);
				next2.player = this;
				next2.target = target;
				next2.cause = next;
				next2.setContent(function() {
					var num = event.cause.num;
					if (event.cause._triggered != 5) {
						game.log(player, '吸取了', target, get.cnNumber(num) + '点体力');
						player.recover(num);
					};
				});
				return next;
			};
			//交换判定区
			lib.element.player.swapJudge = function(target) {
				var next = game.createEvent('swapJudge');
				next.player = this;
				next.target = target;
				next.setContent('swapJudge');
				return next;
			};
			lib.element.content.swapJudge = function() {
				'step 0'
				game.log(player, '和', target, '交换了判定区中的牌');
				event.cards = [player.getCards('j'), target.getCards('j')];
				player.lose(event.cards[0], ui.ordering, 'visible');
				target.lose(event.cards[1], ui.ordering, 'visible');
				if (event.cards[0].length) player.$give(event.cards[0], target, false);
				if (event.cards[1].length) target.$give(event.cards[1], player, false);
				'step 1'
				var card;
				for (var i = 0; i < event.cards[1].length; i++) {
					card = event.cards[1][i];
					if (card.viewAs) {
						player.addJudge({
							name: card.viewAs
						}, [card]);
					} else {
						player.addJudge(card);
					}
				}
				for (var i = 0; i < event.cards[0].length; i++) {
					card = event.cards[0][i];
					if (card.viewAs) {
						target.addJudge({
							name: card.viewAs
						}, [card]);
					} else {
						target.addJudge(card);
					}
				}
			}
			if (!window.initGalgame) {
				galgame = {
					text: {},
				};
				lib.init.js(lib.assetURL + 'extension/格林笔记/sce', 'galgame', function() {
					window.initGalgame(lib, game, ui, get, ai, _status);
				});
				lib.init.css(lib.assetURL + 'extension/格林笔记/sce', 'galgame');
			}
			//超级皮肤
			lib.gl_spSkin = {
				'gl_aikesi': {
					src: 'xinsheng',
					name: '新生',
					change: function(info) {
						info[2] = 6;
						info[3].add('gl_cuifeng');
					},
					info: '追加技能“摧锋”，追加2点体力上限。'
				},
				'gl_aileina': {
					src: 'juexing',
					name: '觉醒',
					change: function(info) {
						info[2] = 4;
						info[3].add('gl_changye');
					},
					info: '追加技能“长夜”，追加1点体力上限，追加“神”势力。'
				},
				gl_leina: {
					src: 'create',
					name: '造物主',
					change: function(info) {
						info[2] = 4;
						info[3].add('gl_yongjian');
						info[3].add('gl_jiandun');
					},
					info: '追加1点体力上限；追加技能“坚盾”、“勇剑”'
				},
				'gl_geerda': {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
						info[3].add('gl_lingshuang');
						info[3].add('gl_aiyu');
						info[3].add('gl_binghua');
					},
					info: '替换技能组为“凌霜”，“爱欲”，“冰花”，修改势力为“晋”',
				},
				'gl_ailisi': {
					'ailisi_hei': {
						src: ['hei1', 'hei2', 'hei3'],
						name: '黑混沌',
						key: 'ailisi_hei',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'jin';
							info[3].add('gl_shanqvan');
							info[3].add('gl_huanyi');
							info[3].add('gl_duwu');
						},
						info: '替换技能组为“黩武”，“幻翼”，“擅权”，修改势力为“晋”',
					},
					'ailisi_shufu': {
						src: 'shufu',
						name: '束缚',
						key: 'ailisi_shufu',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'key';
							info[3].add('gl_zhoufu');
							info[3].add('gl_guishao');
							info[3].add('gl_huanxiang');
						},
						info: '替换技能“咒缚”、“鬼烧”、“幻想”，修改势力为“键”'
					},
				},
				'gl_xiaohongmao': {
					'xiaohongmao_hei': {
						src: ['hei1', 'hei2'],
						name: '黑混沌',
						key: 'xiaohongmao_hei',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'jin';
							info[3].add('gl_fengbi');
							info[3].add('gl_moxiao');
							info[3].add('gl_huohuan');
						},
						info: '替换技能组为“封闭”、“魔哮”、“火环”，修改势力为“晋”',
					},
					'xiaohongmao_baoli': {
						src: 'baoli',
						name: '暴力',
						key: 'xiaohongmao_baoli',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'key';
							info[3].add('gl_shishang');
							info[3].add('gl_cannue');
							info[3].add('gl_huohuan');
						},
						info: '替换技能组“残虐”、“嗜伤”、“火环”，修改势力为“键”'
					}
				},
				gl_alading: {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
						info[3].add('gl_dengji');
						info[3].add('gl_shinue');
						info[3].add('gl_sangzhi');
					},
					info: '替换技能组为“登极”，“施虐”，“丧志”，修改势力为“晋”'
				},
				gl_baixueji: {
					'baixueji_hei': {
						src: ['hei1', 'hei2'],
						name: '黑混沌',
						key: 'baixueji_hei',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'jin';
						},
						info: '替换技能组为“荼毒”、“挣泞”、“复灭”，修改势力为“晋”'
					},
					'baixueji_zhengyi': {
						src: 'zhengyi',
						name: '正义',
						key: 'baixueji_zhengyi',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'key';
						},
						info: '替换技能组为“止戈”、“继命”、“正异”，修改势力为“键”'
					}
				},
				gl_huiguniang: {
					'huiguniang_hei': {
						src: ['hei1', 'hei2', 'hei3'],
						name: '黑混沌',
						key: 'huiguniang_hei',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'jin';
						},
						info: '替换技能组为“噬心”、“掌控”、“竭命”，修改势力为“晋”'
					},
					'huiguniang_beilie': {
						src: 'beilie',
						name: '卑劣',
						key: 'huiguniang_beilie',
						change: function(info) {
							info[3].length = 0;
							info[1] = 'key';
						},
						info: '替换技能组为“仇怨”、“蒙尘”、“恶环”，修改势力为“键”'
					}
				},
				gl_xiannv: {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
					},
					info: '替换技能组为“祝咒”、“血祭”、“解忧”，修改势力为“晋”'
				},
				gl_hongqiangwei: {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
					},
					info: '替换技能组为“无邪”、“裁断”、“捕杀”，修改势力为“晋”'
				},
				gl_baixuewanghou: {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
					},
					info: '替换技能组为“蚀心”、“妒火”、“怨毒”，修改势力为“晋”'
				},
				gl_maihuochai: {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
					},
					info: '替换技能组为“苍炎”、“冀影”、“浊光”，修改势力为“晋”'
				},
				gl_zhende: {
					src: 'hei',
					name: '黑混沌',
					change: function(info) {
						info[3].length = 0;
						info[1] = 'jin';
					},
					info: '替换技能组为“振军”、“战火”、“就义”，修改势力为“晋”'
				},
				init: {},
			}
			get.gl_spSkin = function(name) {
				if (!lib.config.gelin.skin) lib.config.gelin.skin = [];
				if (lib.config.gelin.skin.contains(name)) return true;
				return false;
			}
			game.gl_changeSkin = function(name, link) {
				if (lib.characterPack['mode_extension_童话想区'] && lib.characterPack['mode_extension_童话想区'][name]) {
					return;
				}
				if (lib.gl_spSkin[name]) {
					game.gl_initSkin(name);
				}
				var str = '';
				if (name.indexOf('gl_') == 0) {
					src = 'ext:格林笔记/';
					if (lib.config.skin[name]) {
						src += 'skin/' + name + '/' + lib.config.skin[name] + '.jpg';
					} else {
						src += name + '.jpg';
					}
					lib.character[name][4].remove(src);
				}
				if (link) {
					lib.config.skin[name] = link;
				} else {
					delete lib.config.skin[name];
				}
				game.saveConfig('skin', lib.config.skin);
				if (name.indexOf('gl_') == 0) {
					src = 'ext:格林笔记/';
					if (lib.config.skin[name]) {
						src += 'skin/' + name + '/' + lib.config.skin[name] + '.jpg';
					} else {
						src += name + '.jpg';
					}
					lib.character[name][4].push(src);
				}
				game.gl_changeSpskin(name, link);
				var nodes = game.players.concat(game.dead);
				for (var i of nodes) {
					if (i.name == name || i.name1 == name || (i.storage.gl_lianjie && i.storage.gl_lianjie[0] == name)) {
						i.node.avatar.setBackground(name, 'character');
					}
					if (i.name2 == name || (i.storage.gl_lianjie && i.storage.gl_lianjie[1] == name)) {
						i.node.avatar2.setBackground(name, 'character');
					}
					if (i.hasSkill('gl_lianjie')) lib.skill.gl_lianjie.update(i);
				}
				nodes = document.querySelectorAll('.character');
				for (var i of nodes) {
					if (i.link == name) {
						i.setBackground(name, 'character');
						if (i.refresh) i.refresh(i, name);
						i.group = lib.character[name][1];
					}
				}
			}
			game.gl_changeSpskin = function(name, spSkin) {
				if (lib.characterPack['mode_extension_童话想区'] && lib.characterPack['mode_extension_童话想区'][name]) {
					return;
				}
				var skin = lib.gl_spSkin[name];
				if (!skin) return;
				var list = lib.gl_spSkin.init;
				var character = lib.character[name];
				if (!list[name]) {
					list[name] = {
						sex: character[0],
						group: character[1],
						hp: character[2],
						skills: character[3].slice(0),
					};
				}
				if (skin.src) {
					if (!get.gl_spSkin(name)) return;
					if (skin.src == spSkin || (Array.isArray(skin.src) && skin.src.contains(spSkin))) {
						skin.change(character);
					}
				} else {
					for (var i in skin) {
						if (!get.gl_spSkin(i)) continue;
						if (skin[i].src == spSkin || (Array.isArray(skin[i].src) && skin[i].src.contains(spSkin))) {
							skin[i].change(character);
						}
					}
				}
			}
			game.gl_initSkin = function(name) {
				var list = lib.gl_spSkin.init[name];
				if (!list) return;
				var character = lib.character[name];
				character[0] = list.sex;
				character[1] = list.group;
				character[2] = list.hp;
				character[3].length = 0;
				character[3].addArray(list.skills);
			}
			for (var i in lib.gl_spSkin) {
				if (i == 'init') continue;
				var info = lib.character[i][4];
				var src;
				for (var j = 0; j < info.length; j++) {
					if (info[j].indexOf('ext:') == 0) {
						src = info[j].slice(info[j].lastIndexOf('/') + 1, info[j].lastIndexOf('.'));
						game.gl_changeSpskin(i, src);
						break;
					}
				}
			}
			//调律者技能
			lib.gl_skill = {
				'zaisheng': {
					name: '再生',
					type: 'replace',
					price: 2,
					count: 3,
					info: "效果：回复1点体力值。<br/>惩罚：失去1点体力值。",
					replace: function() {
						player.recover();
					},
					fail: function() {
						player.loseHp();
					}
				},
				'tuji': {
					name: '突击',
					type: 'replace',
					price: 1,
					count: 5,
					info: "效果：视为使用一张【杀】。<br/>惩罚：弃置一张牌。",
					replace: function() {
						player.chooseUseTarget('sha', true);
					},
					fail: function() {
						player.chooseToDiscard(true);
					}
				},
				'xvzhangshengshi': {
					name: '虚张声势',
					type: 'retreat',
					price: 1,
					count: 3,
					info: "效果：除你之外全场所有角色摸3张牌并陷入混乱直至回合结束。<br/>惩罚：你摸3张牌并陷入混乱直至回合结束。",
					retreat: function() {
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] != player) {
								game.players[i].addTempSkill('mad');
								game.players[i].draw(3);
							}
						}
					},
					fail: function() {
						player.addTempSkill('mad');
						player.draw(3);
					}
				},
				'zhanzhengbilei': {
					name: '战争壁垒',
					type: 'retreat',
					price: 1,
					count: 5,
					info: "效果：装备一张防具牌。<br/>惩罚：弃置所有装备牌。",
					retreat: function() {
						var card = get.cardPile(function(card) {
							return get.subtype('equip2');
						});
						if (card) {
							player.equip(card);
						}
					},
					fail: function() {
						player.discard(player.getCards('e'));
					}
				},
				'jipo': {
					name: '击破',
					type: 'driving',
					price: 3,
					count: 7,
					info: "对一名角色造成一点伤害。",
					content: function() {
						"step 0"
						player.chooseTarget('击破：对一名角色造成一点伤害');
						"step 1"
						if (result.bool) {
							player.line(result.targets[0]);
							result.targets[0].damage();
						}
					}
				},
				'kuangbao': {
					name: '狂暴',
					type: 'driving',
					price: 5,
					count: 10,
					filter: function(player) {
						return player.countCards('he') > 0;
					},
					info: "重铸至多3张牌，本回合可以额外使用至多重铸数量的【杀】。",
					content: function() {
						'step 0'
						player.chooseCard('he', '狂暴：请选择要重铸的牌', [1, 3], true);
						'step 1'
						if (result.bool) {
							if (!player.hasSkill('gl_kuangbao_tiaolv')) {
								player.addTempSkill('gl_kuangbao_tiaolv');
								player.storage.gl_kuangbao_tiaolv = result.cards.length;
							} else {
								player.storage.gl_kuangbao_tiaolv += result.cards.length;
							}
							player.lose(result.cards, ui.discardPile, 'visible');
							player.$throw(result.cards, 1000);
							game.log(player, '将', result.cards, '置入弃牌堆');
							player.draw(result.cards.length);
						}
					}
				},
				'shengmingzhiqvan': {
					name: '生命之泉',
					type: 'passive',
					price: 0,
					count: 8,
					info: "你的体力上限+1",
					replace: function() {
						player.maxHp++;
						player.update();
					},
					retreat: function() {
						player.maxHp--;
						player.update();
						if (player.maxHp == 0) {
							player.die();
						}
					}
				},
				'nengliangchaoxi': {
					name: '能量潮汐',
					type: 'passive',
					price: 0,
					count: 5,
					info: "你的能量珠+3",
					replace: function() {
						player.gl_changeJingshi(3);
					},
					retreat: function() {
						player.gl_changeJingshi(-3);
					}
				},
			}
			if (lib.config.gelin.skill && config.skill) {
				lib.gl_skilling = JSON.parse(JSON.stringify(lib.config.gelin.skill));
			} else {
				lib.gl_skilling = {};
			}
			if (!lib.config.gelin.amend) lib.config.gelin.amend = {};
			lib.gl_amend = JSON.parse(JSON.stringify(lib.config.gelin.amend));
			//退场机制
			lib.skill.gl_retreat = {
				content: function() {
					'step 0'
					lib.skill.gl_retreat.trigger(event, 'dieBefore');
					'step 1'
					lib.skill.gl_retreat.trigger(event, 'dieBegin');
					'step 2'
					lib.skill.gl_retreat.trigger(event, 'die');
					'step 3'
					lib.skill.gl_retreat.trigger(event, 'dieEnd');
					'step 4'
					lib.skill.gl_retreat.trigger(event, 'dieAfter');
				},
				trigger: function(event, name) {
					if (_status.video) return;
					if ((this.name === 'gain' || this.name === 'lose') && !_status.gameDrawed) return;
					if (name === 'gameDrawEnd') _status.gameDrawed = true;
					if (name === 'gameStart') {
						if (_status.brawl && _status.brawl.gameStart) {
							_status.brawl.gameStart();
						}
						if (lib.config.show_cardpile) {
							ui.cardPileButton.style.display = '';
						}
						_status.gameStarted = true;
						game.showHistory();
					}
					if (!lib.hookmap[name] && !lib.config.compatiblemode) return;
					if (!game.players || !game.players.length) return;
					var player = event.player;
					if (!player) return;
					if (!game.players.contains(player)) return;
					var list = [];
					var list2 = [];
					var mapx = [];
					var allbool = false;
					var roles = ['player', 'source', 'target'];
					var listAdded = {};
					var mapxx;
					var addList = function(skill, player) {
						if (listAdded[skill]) return;
						if (player.forbiddenSkills[skill]) return;
						if (player.disabledSkills[skill]) return;
						listAdded[skill] = true;
						var info = lib.skill[skill];
						var num = 0;
						if (info.priority) {
							num = info.priority * 100;
						}
						if (info.silent) {
							num++;
						}
						if (info.equipSkill) num -= 30;
						if (info.ruleSkill) num -= 30;
						if (info.firstDo) {
							list.push([skill, player, num]);
							list.sort(function(a, b) {
								return b[2] - a[2];
							});
							allbool = true;
							return;
						} else if (info.lastDo) {
							list2.push([skill, player, num]);
							list2.sort(function(a, b) {
								return b[2] - a[2];
							});
							allbool = true;
							return;
						}
						mapxx.list.push([skill, player, num]);
						mapxx.list.sort(function(a, b) {
							return b[2] - a[2];
						});
						allbool = true;
					};
					var map = _status.connectMode ? lib.playerOL : game.playerMap;
					var id = player.playerid;
					var mapxx = {
						player: player,
						list: [],
						list2: [],
					};
					if (lib.config.compatiblemode) {
						(function() {
							var skills = player.getSkills(true);
							game.expandSkills(skills);
							for (var i = 0; i < skills.length; i++) {
								var info = get.info(skills[i]);
								if (info && info.trigger) {
									var trigger = info.trigger;
									var add = false;
									if (trigger.player) {
										if (typeof trigger.player === 'string') {
											if (trigger.player === name) add = true;
										} else if (trigger.player.contains(name)) add = true;
									}
									if (trigger.target) {
										if (typeof trigger.target === 'string') {
											if (trigger.target === name) add = true;
										} else if (trigger.target.contains(name)) add = true;
									}
									if (trigger.source) {
										if (typeof trigger.source === 'string') {
											if (trigger.source === name) add = true;
										} else if (trigger.source.contains(name)) add = true;
									}
									if (trigger.global) {
										if (typeof trigger.global === 'string') {
											if (trigger.global === name) add = true;
										} else if (trigger.global.contains(name)) add = true;
									}
									if (add) {
										addList(skills[i], player);
									}
								}
							}
						}());
					} else {
						for (var i = 0; i < roles.length; i++) {
							var triggername = player.playerid + '_' + roles[i] + '_' + name;
							if (lib.hook[triggername]) {
								for (var j = 0; j < lib.hook[triggername].length; j++) {
									addList(lib.hook[triggername][j], player);
								}
							}
						}
						for (var i in lib.hook.globaltrigger[name]) {
							if (map[i] === player) {
								for (var j = 0; j < lib.hook.globaltrigger[name][i].length; j++) {
									addList(lib.hook.globaltrigger[name][i][j], map[i]);
								}
							}
						}
					}
					mapx.push(mapxx);
					if (allbool) {
						var next = game.createEvent('arrangeTrigger', false, event);
						next.setContent('arrangeTrigger');
						next.list = list;
						next.list2 = list2;
						next.map = mapx;
						next._trigger = event;
						next.triggername = name;
						event._triggering = next;
					}
				},
			}
			game.gl_qieti = function(list, player) {
				if (!list) return;
				var next = game.createEvent('gl_qieti');
				next.player = player;
				next.list = list.slice(0);
				next.type = 'replace';
				next.setContent('gl_qieti');
			};
			game.gl_cheli = function(list, player) {
				if (!list) return;
				var next = game.createEvent('gl_cheli');
				next.player = player;
				next.list = list.slice(0);
				next.type = 'retreat';
				next.setContent('gl_qieti');
			};
			lib.element.content.gl_qieti = function() {
				if (event.list.length) {
					var name = event.list.shift();
					var skill = lib.gl_skilling;
					if (skill[name]) {
						for (var i = 0; i < skill[name].length; i++) {
							var link = skill[name][i];
							if (lib.gl_skill[link][event.type]) {
								var next = game.createEvent(link, false);
								next.player = player;
								game.log(player, '发动了调律者技能', '#g【' + lib.gl_skill[link].name + '】');
								if (player.gl_jingshi >= lib.gl_skill[link].price) {
									player.gl_changeJingshi(-lib.gl_skill[link].price);
									next.setContent(lib.gl_skill[link][event.type]);
								} else {
									next.setContent(lib.gl_skill[link].fail);
								}
							}
						}
					}
					event.redo();
				}
			}
			lib.skill.gl_driving = {
				enable: "phaseUse",
				filter: function(event, player) {
					if (!player.storage.gl_lianjie) return false;
					var names = player.storage.gl_lianjie;
					for (var i = 0; i < names.length; i++) {
						var name = names[i];
						if (!lib.gl_skilling[name]) continue;
						for (var j = 0; j < lib.gl_skilling[name].length; j++) {
							var skill = lib.gl_skill[lib.gl_skilling[name][j]];
							if (skill.type == 'driving' && player.gl_jingshi >= skill.price) {
								if (skill.filter && !skill.filter(player)) continue;
								return true;
							}
						}
					}
					return false;
				},
				superCharlotte: true,
				content: function() {
					'step 0'
					var names = player.storage.gl_lianjie;
					var list = [];
					for (var i = 0; i < names.length; i++) {
						var name = names[i];
						if (!lib.gl_skilling[name]) continue;
						for (var j = 0; j < lib.gl_skilling[name].length; j++) {
							var skill = lib.gl_skill[lib.gl_skilling[name][j]];
							if (skill.type == 'driving' && player.gl_jingshi >= skill.price) {
								if (skill.filter && !skill.filter(player)) continue;
								list.push(skill);
							}
						}
					}
					if (list.length > 1) {
						var dialog = ui.create.dialog('请选择要发动的调律者技能', 'hidden');
						dialog.forcebutton = true;
						for (var i = 0; i < list.length; i++) {
							var node = ui.create.div('.popup.text', dialog.content);
							dialog.buttons.add(node);
							var click = lib.config.touchscreen ? 'touchend' : 'click';
							node.addEventListener(click, ui.click.button);
							node.style.width = 'calc(100% - 30px)';
							node.style.position = 'unset';
							node.link = list[i];
							var str = '【' + list[i].name + '】</br>能量珠：<span style="color:#55ffff">';
							str += list[i].price + '</span></br>' + list[i].info;
							node.innerHTML = str;
						}
						player.chooseButton(dialog, true);
					} else {
						event._result = {
							bool: true,
							links: [list[0]],
						}
					}
					'step 1'
					if (result.bool) {
						player.gl_changeJingshi(-result.links[0].price);
						game.log(player, '发动了调律者技能', '#g【' + result.links[0].name + '】');
						var next = game.createEvent('gl_driving', false);
						next.player = player;
						next.setContent(result.links[0].content);
					}
				},
			}
			lib.translate.gl_driving = '调律技';
			//能量珠
			game.gl_jingshi = function(player) {
				if (typeof player.gl_jingshi == 'number') return;
				player.gl_jingshi = 6;
				var node = ui.create.div('.gl_jingshi', player);
				var shadow = ui.create.div('.skillbarshadow', node);
				node.fillnode = ui.create.div('.skillbarfill', shadow);
				node.textnode = ui.create.div('.firetext', shadow);
				node.textnode.innerHTML = 6;
				node.fillnode.style.bottom = player.gl_jingshi + '0%';
				player.node.gl_jingshi = node;
				if (!get.gl_data('departure')) node.hide();
				return node;
			}
			lib.element.player.gl_changeJingshi = function(num) {
				var player = this;
				if (typeof player.gl_jingshi != 'number') return;
				if (typeof num != 'number') num = 1;
				if (num == 0) return;
				var node = player.node.gl_jingshi;
				player.gl_jingshi += num;
				if (player.gl_jingshi < 0) {
					player.gl_jingshi = 0;
				}
				if (player.gl_jingshi > 10) {
					player.gl_jingshi = 10;
				}
				node.textnode.innerHTML = player.gl_jingshi;
				node.fillnode.style.bottom = player.gl_jingshi + '0%';
				return player.gl_jingshi;
			};
			//半回合制
			lib.element.player.gl_changeSpeed = function(num) {
				game.gl_addSpeed();
				var next = game.createEvent('changeSpeed');
				next.setContent('gl_changeSpeed');
				next.player = this;
				next.num = num;
				return next;
			}
			lib.element.content.gl_changeSpeed = function() {
				'step 0'
				if (!num) num = 0;
				event.trigger('changeSpeed');
				'step 1'
				player.speed += num;
				var div = player.node.speed;
				if (player.speed >= 100) {
					div.style.width = '100%';
					if (_status.currentPhase != player) {
						game.speedPlayers.add(player);
					}
				} else {
					if (player.speed < 0) {
						player.speed = 0;
					}
					game.speedPlayers.remove(player);
					div.style.width = player.speed + '%';
				}
			}
			get.gl_speed = function(player) {
				var num = game.checkMod(player, 3, 'gl_speed', player);
				if (num < 1) {
					num = 1;
				}
				if (num > 10) {
					num = 10;
				}
				return num;
			}
			game.gl_gainSpeed = function(player) {
				if (!player.node.speed) {
					var timer = ui.create.div('.speed', player);
					player.node.timer = timer;
					var div = ui.create.div(timer);
					player.node.speed = ui.create.div(div);
					ui.refresh(player.node.speed);
					player.speed = 0;
				}
			}
			game.gl_addSpeed = function() {
				if (game.gl_speed) return;
				for (var i = 0; i < game.players.length; i++) {
					game.gl_gainSpeed(game.players[i]);
				}
				game.gl_speed = true;
				game.speedPlayers = [];
				lib.element.player.inits.add(game.gl_gainSpeed);
				lib.element.content.phaseLoop = function() {
					'step 0'
					var num = 1,
						current = player;
					while (current.getSeatNum() == 0) {
						current.setSeatNum(num);
						current = current.next;
						num++;
					}
					'step 1'
					var list = get.players(lib.sort.seat);
					for (var i = 0; i < list.length; i++) {
						var div = list[i].node.speed;
						list[i].speed += get.gl_speed(list[i]);
						if (list[i].speed >= 100) {
							div.style.width = '100%';
							game.speedPlayers.add(list[i]);
						} else {
							div.style.width = list[i].speed + '%';
						}
					}
					if (!game.speedPlayers.length) {
						event.redo();
					}
					game.delay(0.1);
					'step 2'
					for (var i = 0; i < lib.onphase.length; i++) {
						lib.onphase[i]();
					}
					event.player = game.speedPlayers.shift();
					event.player.phase();
					'step 3'
					var div = player.node.speed;
					div.style.transition = '0s';
					player.speed -= 100;
					if (player.speed >= 100) {
						div.style.width = '100%';
						game.speedPlayers.add(player);
					} else {
						if (player.speed < 0) {
							player.speed = 0;
						}
						div.style.width = player.speed + '%';
					}
					game.delay();
					'step 4'
					var div = player.node.speed;
					div.style.transition = '';
					if (game.speedPlayers.length) {
						event.goto(2);
					} else {
						event.goto(1);
					}
				};
				var parent = _status.event;
				while (parent.name != 'phaseLoop' && !parent.gl_speed) {
					if (parent.next) {
						for (var i = 0; i < parent.next.length; i++) {
							if (parent.next[i].name == 'phaseLoop') {
								parent = parent.next[i];
								break;
							}
						}
					}
					if (parent.name != 'phaseLoop') {
						if (parent.parent) {
							parent = parent.parent;
						} else {
							parent.gl_speed = true;
						}
					}
				}
				if (parent.name == 'phaseLoop') {
					if (parent.step != 0) {
						parent.step = 3;
						var current = parent.player;
						var currented = [];
						while (!currented.contains(current)) {
							currented.push(current);
							current.speed = 100;
							current.node.speed.style.width = '100%';
							if (_status.currentPhase != current) {
								game.speedPlayers.add(current);
							}
							current = current.next;
							if (current.getSeatNum() == 1) break;
						}
					}
					parent.setContent('phaseLoop');
				}
			}
			game.gl_createDailog = function() {
				var page = ui.create.div('.scedi.gl_scedi', ui.window);
				var str, list, click, bool;
				for (var i = 0; i < arguments.length; i++) {
					if (Array.isArray(arguments[i])) {
						list = arguments[i];
					} else if (typeof arguments[i] == 'function') {
						click = arguments[i];
					} else if (typeof(arguments[i]) == 'boolean') {
						bool = arguments[i];
					} else if (typeof arguments[i] == 'string') {
						str = arguments[i];
					}
				}
				if (bool !== false) {
					var leina = document.createElement('img');
					var name = lib.config['extension_格林笔记_heroine'] || 'leina';
					leina.setAttribute('src', lib.assetURL + 'extension/格林笔记/image/' + name + '.png');
					leina.className = 'gl_leina';
					page.appendChild(leina);
				}
				var dialog = ui.create.div('.gl_duihua', page);
				dialog.innerHTML = str;
				var select = ui.create.div('.gl_switch', page);
				if (!list) list = ['确定'];
				for (var i = 0; i < list.length; i++) {
					var node = ui.create.div(select);
					node.onclick = function() {
						ui.window.removeChild(page);
						if (typeof click == 'function') click(this.link);
					}
					node.link = list[i];
					node.innerHTML = get.translation(list[i]);
				}
				ui.window.appendChild(page);
			}
			lib.element.card.originalMoveDelete = function(player) {
				this.fixed = true;
				if (!this._listeningEnd || this._transitionEnded) {
					var dx, dy;
					if (this.classList.contains('center')) {
						var nx = [50, -52];
						var ny = [50, -52];
						nx = nx[0] * ui.arena.offsetWidth / 100 + nx[1];
						ny = ny[0] * ui.arena.offsetHeight / 100 + ny[1];
						dx = player.getLeft() + player.offsetWidth / 2 - 52 - nx;
						dy = player.getTop() + player.offsetHeight / 2 - 52 - ny;
					} else {
						this.style.left = this.offsetLeft + 'px';
						this.style.top = this.offsetTop + 'px';

						dx = player.getLeft() + player.offsetWidth / 2 - 52 - this.offsetLeft;
						dy = player.getTop() + player.offsetHeight / 2 - 52 - this.offsetTop;
					}
					if (get.is.mobileMe(player)) {
						dx += get.cardOffset();
						if (ui.arena.classList.contains('oblongcard')) {
							dy -= 16;
						}
					}
					if (this.style.transform && this.style.transform != 'none' && this.style.transform.indexOf('translate') == -1) {
						this.style.transform += ' translate(' + dx + 'px,' + dy + 'px)';
					} else {
						this.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
					}
					var that = this;
					setTimeout(function() {
						that.delete();
					}, 200);
				} else {
					this._onEndMoveDelete = player;
				}
			}
			lib.element.player.$gl_gainCard = function(card, cards) {
				game.pause();
				var cards = cards.slice(0);
				ui.arena.classList.add('playerfocus');
				var page = ui.create.div('.gl_gouzhu', ui.window);
				var cardNode = ui.create.div('.gl_fazhen');
				for (var i in lib.element.player) {
					cardNode[i] = lib.element.player[i];
				}
				ui.arena.appendChild(cardNode);
				var player = this;
				var boolCard = function() {
					if (cardNode.over) return;
					cardNode.over = true;
					var node = card.copy('thrown', false);
					node.classList.add('playerfocus');
					node.style.transform = 'scale(0) rotateX(180deg)';
					node.style.left = 'calc(50% - 52px)';
					node.style.top = 'calc(50% - 52px)';
					setTimeout(function() {
						ui.arena.appendChild(node);
						ui.refresh(node);
						node.show();
						node.style.transform = '';
					}, 500);
					setTimeout(function() {
						page.remove();
						node.moveDelete(player);
						cardNode.remove();
						game.resume();
						ui.arena.classList.remove('playerfocus');
					}, 1100);
				}
				if (!_status.connectMode) {
					var event = _status.event;
					event.forceMine = true;
					event.custom.replace.window = function() {
						if (!cardNode.over) {
							delete event.forceMine;
							boolCard();
							cardNode.over = true;
							game.resume();
						}
					}
				}
				var moveCard = function(node, num) {
					if (cardNode.over) return;
					var node;
					node = node.copy('thrown', false);
					node.classList.add('playerfocus');
					node.fixed = true;
					var top, left;
					switch (num % 4) {
						case 1:
							left = '100%';
							top = Math.random() * 100 + '%';
							break;
						case 2:
							left = '-10%';
							top = Math.random() * 100 + '%';
							break;
						case 3:
							left = Math.random() * 100 + '%';
							top = '100%';
							break;
						case 0:
							left = Math.random() * 100 + '%';
							top = '-10%';
							break;
					}
					node.style.left = left;
					node.style.top = top;
					node.style.transform = 'scale(0)';
					node.hide();
					ui.arena.appendChild(node);
					ui.refresh(node);
					node.show();
					node.style.transform = '';
					lib.listenEnd(node);
					setTimeout(function() {
						lib.element.card.originalMoveDelete.apply(node, [cardNode]);
						if (cards.length) {
							moveCard(cards.shift(), num + 1);
						} else {
							boolCard();
						}
					}, 500);
				}
				if (cards && cards.length) {
					setTimeout(function() {
						moveCard(cards.shift(), 1);
					}, 300)
				} else {
					boolCard();
				}
			}
			//滚动演示
			game.gl_broadcast = function() {
				var data, callback, src, side;
				for (var i = 0; i < arguments.length; i++) {
					if (Array.isArray(arguments[i])) {
						data = arguments[i];
					} else if (typeof arguments[i] == 'function') {
						callback = arguments[i];
					} else if (arguments[i] == 'right') {
						side = 'right';
					} else if (arguments[i] == 'left') {
						side = 'left';
					} else if (typeof arguments[i] == 'string') {
						src = arguments[i];
					}
				}
				if (!data) return;
				var background = ui.create.div('.gl_cg', document.body);
				background.setBackgroundImage(src || 'extension/格林笔记/image/title.jpg');
				var node = ui.create.div('.gl_broadcast', background);
				for (var i of data) {
					ui.create.div('.gl_broadcast', node).innerHTML = i;
				}
				if (side == 'right') {
					node.style.left = 'auto';
					node.style.right = '0';
				}
				if (side == 'left') {
					node.style.left = '0';
					node.style.right = 'auto';
				}
				var num = node.offsetHeight + background.offsetHeight + 100;
				node.style.transform = 'translateY(-' + num + 'px)';
				node.style.transition = 'all ' + (num / 60) + 's linear';
				node.addEventListener('webkitTransitionEnd', function() {
					background.delete();
					if (typeof callback == 'function') callback(this.link);
				});
				if (side == 'right') {
					background.style.backgroundPosition = "100% 0";
				}
				if (side == 'left') {
					background.style.backgroundPosition = "0 0";
				}
				return background;
			}
			//播放CG
			game.gl_cg = function(src, callback) {
				var cg = document.createElement("video");
				cg.setAttribute("width", "100%");
				cg.setAttribute("height", "100%");
				src = lib.assetURL + 'extension/格林笔记/' + src;
				cg.setAttribute("src", src);
				if (callback == 'preload') {
					cg.setAttribute("preload", "auto");
					return cg;
				}
				cg.setAttribute("autoplay", "autoplay");
				cg.addEventListener("ended", callback);
				var background = ui.create.div('.gl_cg', document.body);
				background.appendChild(cg);
				return background;
			}
			game.gl_getSkill = function(name) {
				var list = lib.config.gelin.skill;
				if (!list[name]) list[name] = [];
				return list[name];
			}
			get.gl_data = function(str) {
				return lib.config.gelin.data.contains(str);
			}
			get.gl_specialSkill = function(name) {
				var list = lib.config.gelin.specialSkill;
				if (!list[name]) list[name] = [];
				return list[name];
			}
			//抛硬币
			game.gl_throwCoin = function(bool) {
				if (bool !== true && bool !== false) {
					bool = Math.random() < 0.5 ? true : false;
				}
				_status.event._result = {
					bool: bool
				}
				var pause;
				if (!_status.paused) {
					game.pause();
					pause = true;
				}
				game.broadcastAll(function(bool) {
					var coinContainer = ui.create.div('.fullsize.dice-container', ui.window);
					ui.window.classList.add('dicepaused');
					var coin = ui.create.div('.kp_coin', coinContainer);
					var z = 20;
					var node;
					for (var i = 0; i <= z; i++) {
						node = ui.create.div(coin);
						node.style.transform = 'translateZ(' + i + 'px)';
						if (i == z) {
							node.innerHTML = '童话';
						}
					}
					coinContainer.appendChild(coin);
					if (bool === true) {
						coin.classList.add('kp_coin_true');
					} else {
						coin.classList.add('kp_coin_false');
					}

					coin.addEventListener('webkitAnimationEnd', function() {
						setTimeout(function() {
							coinContainer.delete();
							ui.window.classList.remove('dicepaused');
						}, 300);
						if (pause) setTimeout(game.resume, 800);
					});
				}, bool);
			}
			//演示库
			lib.gl_broadcast = {
				"童话世界": {
					side: 'left',
					data: [
						'吾不曾有过时间的概念',
						'那便是很久很久以前罢',
						'一只小鸟问吾',
						'“您知道童话世界在哪里吗？”',
						'吾无心理会这个小家伙',
						'它在吾的头顶盘旋过后又向远方飞去',
						'又不知过去多久',
						'那个小家伙又飞到吾的头顶',
						'它变得大概有些不同？',
						'一个小家伙不值得吾留心',
						'“请..请问您知道童话世界在哪吗？”',
						'又是曾经的那个问题',
						'不过刚问完它便从空中坠落',
						'那些红色的液体是什么？',
						'吾这才想起并非所有的生命都如吾一般',
						'花朵凋谢',
						'“我听说那儿非常的美丽”',
						'“是个没有痛苦、疾病与战争的地方”',
						'吾手中的笔被这个小家伙的话语束缚',
						'微风吹起吾手中尚着墨的白纸',
						'落在那个小家伙的身上',
						'迷雾亦伴随吾的迷茫升起......'
					]
				},
				"命运启示": {
					side: 'right',
					src: 'extension/格林笔记/image/mingyunqishi.jpg',
					data: [
						'在这个世界上',
						'每个人手中都有着一本命运之书',
						'那是全知全能的说书人所赐下的恩惠',
						'书上记录着持有者的出生到死亡',
						'所有人都遵循着命运之书生活',
						'......',
						'但我的命运之书为何空无一字呢？',
						'我诞生的意义是什么？',
						'我存在的命运又是什么？'
					]
				},
			}
			//开启本家势力联结
			var lianjieGroup = {
				'gl_famu': 'gl:wu:wei',
				'gl_aida': 'gl:wei:shu',
				'gl_ailuoweisi': 'gl:shu:wu',
				'gl_leina': 'gl:shen:key',
				'gl_aileina': 'gl:key:shen',
				'gl_sade': 'gl:jin:qun',
				'gl_kali': 'gl:qun:jin',
			}
			for (var i in lianjieGroup) {
				var nature = get.gl_nature(i);
				var count = 200;
				for (var j in nature) {
					count -= nature[j];
				}
				console.log(count);
				if (count == 0) {
					lib.character[i][4].push(lianjieGroup[i]);
				}
			}
		},
		precontent: function() {
			if (!lib.config.gelin) {
				lib.init.json(lib.assetURL + 'extension/格林笔记/save', function(e) {
					game.gl_save = e;
				}, function() {
					game.gl_save = false;
				})
				lib.config.gelin = {
					lianjie: [],
					data: []
				}
			}
			lib.gl_characterLink = {}
			if (!lib.config.gelin.specialSkill) {
				lib.config.gelin.specialSkill = {
					'gl_leina': ['gl_tiaolv'],
					'gl_famu': ['gl_tanbao'],
					'gl_aida': ['gl_shouhu'],
					'gl_ailuoweisi': ['gl_congjian'],
					'gl_sade': ['gl_qianxi'],
					'gl_aileina': ['gl_zaibian'],
					'gl_kali': ['gl_fuyin'],
				}
			}
			lib.init.css(lib.assetURL + 'extension/格林笔记', 'gelin');
			lib.init.js(lib.assetURL + 'extension/格林笔记', 'create');
			lib.init.js(lib.assetURL + 'extension/格林笔记', 'character');
			lib.init.js(lib.assetURL + 'extension/格林笔记', 'skill', function() {
				window.gelinSkill(lib, game, ui, get, ai, _status);
			});
			lib.init.js(lib.assetURL + 'extension/格林笔记/card', 'card');
			lib.init.js(lib.assetURL + 'extension/格林笔记/voice', 'voice');
			//给予抗性
			lib.gl_element = {};
			for (var i in lib.element.player) {
				lib.gl_element[i] = lib.element.player[i];
			}
			if (!lib.config.gelin.data.contains('departure')) return;
			var extensionMenu = {
				"intro": {
					name: '观看演示',
					clear: true,
					nopointer: true,
					item: {},
					visualBar: function(page, item, create) {
						if (page.created) {
							return;
						}
						page.created = true;
						page.classList.add('.menu-buttons');
						var list = lib.gl_broadcast;
						var callback = function() {
							game.gl_broadcast(this.link.data, this.link.src, this.link.side);
						}
						for (var i in list) {
							var node = ui.create.div('.menubutton', i, page, callback);
							node.link = list[i];
						}
					},
					visualMenu: function() {},
					onclick: function() {},
				},
				"heroine": {
					name: '看板娘',
					init: 'leina',
					item: {
						'leina': '蕾娜',
						'aileina': '艾蕾娜',
						'kali': '卡莉',
						'sade': '萨德',
						'famu': '法姆'
					},
					onclick: function(item) {
						game.saveConfig('extension_格林笔记_heroine', item);
					}
				},
				"book": {
					name: '<img src="' + lib.assetURL + 'extension/格林笔记/book.png"/>',
					clear: true,
					onclick: function() {
						game.gl_openBook();
					},
				},
				"skill": {
					"name": "启动调律者技能",
					"init": false
				},
				"nature": {
					"name": "启动属性加成",
					"init": false
				},
				"gouzhu": {
					"name": "启动卡牌构筑",
					"init": false
				},
				"load": {
					"name": "载入存档",
					"clear": true,
					onclick: function() {
						game.gl_createDailog('确定载入本地存档覆盖你的游戏进度？（无法撤销）', ['确定', '取消'], function(bool) {
							if (bool == '确定') {
								this.innerHTML = '正在载入......';
								var node = this;
								lib.init.json(lib.assetURL + 'extension/格林笔记/save', function(e) {
									game.saveConfig('gelin', e);
									game.gl_createDailog('载入成功，即将重启游戏！', function() {
										game.reload();
									});
								}, function() {
									game.gl_createDailog('载入失败，请检查你的本地文件！');
									node.innerHTML = '载入存档';
								})
							} else {
								game.gl_createDailog('过于频繁的存档和读档可能会导致存档坏死哦！');
							}
						});
					}
				},
				"save": {
					"name": "导出存档",
					"clear": true,
					onclick: function() {
						game.gl_createDailog('确定导出存档到本地？', ['确定', '取消'], function(bool) {
							if (bool == '确定') {
								this.innerHTML = '正在导出......';
								var node = this;
								var data = JSON.stringify(lib.config.gelin);
								game.writeFile(data, 'extension/格林笔记', 'save', function() {
									lib.init.json(lib.assetURL + 'extension/格林笔记/save', function(e) {
										game.gl_createDailog('导出成功');
										node.innerHTML = '导出存档';
									}, function() {
										game.gl_createDailog('导出失败，请重试！');
										node.innerHTML = '导出存档';
									})
								})
							} else {
								game.gl_createDailog('经常备份存档是个好习惯哦！');
							}
						});
					}
				},
			}
			for (var i in extensionMenu) {
				lib.extensionMenu['extension_格林笔记'][i] = extensionMenu[i];
			}
			delete lib.extensionMenu['extension_格林笔记'].delete;
			game.addMode('xiangqv', {
				start: function() {
					'step 0'
					ui.background.setBackgroundImage('extension/格林笔记/image/title.jpg');
					//自动载入
					var directstart = localStorage.getItem(lib.configprefix + 'gldirectstart');
					if (directstart) {
						game.pause();
						ui.background.setBackgroundImage('extension/格林笔记/mingyunzhishu.jpg');
						lib.init.js(lib.assetURL + 'extension/格林笔记/map/' + directstart, 'data', function() {
							window.gl_init(lib, game, ui, get, ai, _status);
							localStorage.removeItem(lib.configprefix + 'gldirectstart');
							event.goto(4);
							game.resume();
						});
						return;
					}
					//导入地图
					game.bage = ui.create.div(".gl_bage.hidden", ui.window);
					game.bage.buttons = [];
					var switchMode = ui.create.div(".gl_switchMode.hidden", ui.window);
					lib.setScroll(switchMode);
					if (!lib.config.touchscreen && lib.config.mousewheel) {
						switchMode._scrollspeed = 30;
						switchMode._scrollnum = 10;
						switchMode.onmousewheel = ui.click.mousewheel;
					}
					event.switchMode = switchMode;
					var map = {
						"命运启示": ['huiguniang:灰姑娘', 'xiaohongmao:小红帽', 'jimu:金银岛', 'tangjihede:堂•吉诃德', 'baixueji:白雪公主', 'geerda:冰雪奇缘', 'taotailang:桃太郎', 'alading:阿拉丁与神灯', 'zhende:奥尔良的圣女', 'ailisi:爱丽丝梦游仙境', 'sanyuetu:爱丽丝镜中奇遇'],
						"混沌来袭": ['wukong:西游记', 'taolesi:绿野仙踪', 'aobulang:仲夏夜之梦', 'jierdelei:蓝胡子', 'zhuliye:朱丽叶与罗密欧', 'huiye:御伽草子:yujiacaozi', 'yigenisi:冰与火的幻想曲', 'aiernuoya:亲爱与希望之春', 'yase:亚瑟王传奇', 'aikesi:万象'],
						"新生回响": ['ailier:海的女儿'],
						"万象终局": ['puluomixiusi:复苏的调律者'],
						"大千世界": ['kalun:红舞鞋', 'kamila:吸血鬼卡米拉', 'hongqiangwei:红蔷薇与白蔷薇', 'maihuochai:卖火柴的小女孩', 'yuyitiannv:羽衣天女', 'ailike:歌剧魅影', 'huiye:竹取物语', 'busi:穿靴子的猫', 'fulankensitan:科学怪人', 'jintailang:金太郎', 'pudaotailang:浦岛太郎', 'lubang:怪盗绅士'],
						"未知领域": ["xita:格林回音", "bulu:猫女仆，报告！", "souzhineihaojiang:天诛X神曲"],
						"造物起源": ['leina:调律巫女', 'shanluzuode:天方夜谭', 'ludeweixi:格林童话·上', 'yagebu:格林童话·中', 'shashibiya:喜剧与悲剧', 'kaluoer:爱丽丝系列', 'antusheng:安徒生童话', 'xialuote:格林童话·下', 'emama:鹅妈妈的故事·上', 'xiaer:鹅妈妈的故事·下', 'dafenqi:蒙娜丽莎', 'duoluoxiya:不为人知的英雄', 'wangdefa:快乐王子', 'yisuo:伊索寓言'],
						"无尽混沌": ['huzhinvshen:象征收集', 'huzhinvshen:试炼之地:shilianchang', 'huzhinvshen:无尽模式:wujin'],
					}
					lib.setScroll(game.bage);
					if (!lib.config.touchscreen && lib.config.mousewheel) {
						game.bage._scrollspeed = 30;
						game.bage._scrollnum = 10;
						game.bage.onmousewheel = ui.click.mousewheel;
					}
					for (var i in map) {
						var button = ui.create.div(switchMode);
						button.innerHTML = i;
						button.links = [];
						button.onclick = function() {
							if (game.bage.link) {
								game.bage.link.classList.remove('select');
							}
							this.classList.add('select');
							game.bage.link = this;
							for (var z = 0; z < game.bage.buttons.length; z++) {
								if (this.links.contains(game.bage.buttons[z])) {
									game.bage.buttons[z].style.display = '';
								} else {
									game.bage.buttons[z].style.display = 'none';
								}
							}
						}
						if (!game.bage.init) {
							game.bage.init = button;
						}
						for (var j = 0; j < map[i].length; j++) {
							var node = ui.create.div(game.bage);
							button.links.push(node);
							game.bage.buttons.push(node);
							var arr = map[i][j].split(':');
							node.setBackgroundImage('extension/格林笔记/gl_' + arr[0] + '.jpg');
							ui.create.div('.gl_title', node, arr[1]);
							node.onclick = function() {
								lib.init.js(lib.assetURL + 'extension/格林笔记/map/' + this.name, 'data', function() {
									window.gl_init(lib, game, ui, get, ai, _status);
									game.resume();
								}, function() {
									game.gl_createDailog('这片想区被重重迷雾包裹，没办法进入呢。（未找到想区文件，请检查本地文件后重试！）');
								});
							}
							node.name = arr[2] || arr[0];
						}
					}
					game.bage.init.onclick();
					'step 1'
					setTimeout(function() {
						if (!get.gl_data('xiangqv_start')) {
							var link = lib.gl_broadcast['童话世界'];
							game.gl_broadcast(link.data, link.src, link.side, function() {
								game.gl_setData('xiangqv_start');
								event.switchMode.show();
								game.bage.show();
								ui.background.setBackgroundImage('extension/格林笔记/mingyunzhishu.jpg');
							});
						} else {
							event.switchMode.show();
							game.bage.show();
							ui.background.setBackgroundImage('extension/格林笔记/mingyunzhishu.jpg');
						}
					}, 1000);
					'step 2'
					game.pause();
					'step 3'
					if (!window.xiangqv) {
						event.goto(2);
					}
					'step 4'
					if (window.xiangqv.initBefore) window.xiangqv.initBefore();
					game.animate.window(1);
					game.complexity = get.config('complexity') || 'ordinary';
					//特殊模块特殊处理
					lib.element.player.init = function(character, character2, skill) {
						if (get.intensify(this) || this.noInit) {
							character = this.name || character;
							character2 = null;
							skill = null;
						}
						return lib.gl_element.init.apply(this, [character, character2, skill]);
					};
					'step 5'
					//战斗模块
					game.addCharacterPack(window.xiangqv.pack, '童话想区');
					game.playBackgroundMusic();
					for (var i in window.xiangqv.galgame) {
						galgame.text[i] = window.xiangqv.galgame[i];
					}
					if (window.xiangqv.background) {
						ui.background.setBackgroundImage(window.xiangqv.background);
					}
					if (window.xiangqv.cmd === false) {
						var nodes = ui.commandnode.parentNode.childNodes;
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i].innerHTML == '控制' || nodes[i].innerHTML == '命令') {
								nodes[i].link.remove();
								nodes[i].remove();
								i--;
							}
						}
					}
					if (game.bage) game.bage.hide();
					if (event.switchMode) event.switchMode.hide();
					ui.create.cardsAsync();
					game.finishCards();
					ui.arena.setNumber(8);
					var player = ui.create.player();
					player.noRemove = true;
					player.getId();
					var name = 'gl_aikesi';
					if (window.xiangqv.player) name = window.xiangqv.player;
					player.init(name).animate('start');
					player.setIdentity('nei');
					player.identity = 'nei';
					game.players.push(player);
					player.dataset.position = 0;
					game.vitalPlayer.me = player;
					ui.arena.appendChild(player);
					if (window.xiangqv.beyond) {
						for (var i = 0; i < window.xiangqv.beyond.length; i++) {
							var player = ui.create.player();
							beyond = window.xiangqv.beyond[i];
							player.getId();
							for (var j in beyond) {
								if (j == 'name') {
									player.init(beyond[j]).animate('start');
								} else if (j == 'identity') {
									player.setIdentity(beyond[j]);
									player.identity = beyond[j];
									if (player.identity == 'zhu') {
										game.boss = player;
										game.playBackgroundMusic();
									}
								} else if (j == 'position') {
									player.dataset.position = beyond[j];
								} else if (j == 'init') {
									beyond[j](player);
								}
							}
							game.players.push(player);
							ui.arena.appendChild(player);
						}
					}
					ui.create.me();
					game.arrangePlayers();
					'step 6'
					game.animate.window(2);
					'step 7'
					if (get.config('control')) game.addGlobalSkill('autoControl');
					game.addGlobalSkill('gl_bossBuff');
					if (window.xiangqv.init) window.xiangqv.init(game);
					'step 8'
					event.trigger('gameStart');
					'step 9'
					game.gameDraw(true, 4);
					'step 10'
					event.dialog = ui.create.dialog('是否使用手气卡？');
					ui.create.confirm('oc');
					event.custom.replace.confirm = function(bool) {
						_status.event.bool = bool;
						game.resume();
					}
					'step 11'
					_status.imchoosing = true;
					event.switchToAuto = function() {
						_status.event.bool = false;
						game.resume();
					}
					game.pause();
					'step 12'
					_status.imchoosing = false;
					if (event.bool) {
						var hs = game.me.getCards('h');
						game.addVideo('lose', game.me, [get.cardsInfo(hs), [],
							[],
							[]
						]);
						for (var i = 0; i < hs.length; i++) {
							hs[i].discard(false);
						}
						game.me.directgain(get.cards(hs.length));
						event.goto(11);
					} else {
						if (event.dialog) event.dialog.close();
						if (ui.confirm) ui.confirm.close();
						game.me._start_cards = game.me.getCards('h');
					}
					'step 13'
					var num = window.xiangqv.loop || 0;
					game.phaseLoop(game.players[num]);
				},
				ui: {
					updatec: function() {
						if (_status.noupdatec) return;
						var length = 0,
							minoffset = -Infinity;
						var controls = [];
						var widths = [];
						var leftwidths = [];
						var add = function(node, first) {
							var thiswidth = parseInt(node.style.width);
							if (thiswidth) {
								thiswidth += 8;
								length += thiswidth;
								if (first) {
									leftwidths.push(thiswidth);
								} else {
									widths.push(thiswidth);
								}
							} else {
								length += node.offsetWidth;
								if (first) {
									leftwidths.push(node.offsetWidth);
								} else {
									widths.push(node.offsetWidth);
								}
							}
							if (first) {
								controls.unshift(node);
							} else {
								controls.push(node);
							}
						}
						widths = leftwidths.concat(widths);
						var staylefts = [];
						for (var i = 0; i < ui.control.childNodes.length; i++) {
							if (ui.control.childNodes[i].classList.contains('removing')) continue;
							if (lib.config.wuxie_right && ui.control.childNodes[i].stayleft) {
								staylefts.push(ui.control.childNodes[i]);
							} else {
								add(ui.control.childNodes[i]);
							}
						}
						if (staylefts.length) {
							var fullwidth = 0;
							var fullright = (game.layout == 'long' || game.layout == 'long2' || game.chess || (game.layout != 'nova' && parseInt(ui.arena.dataset.number) <= 5));
							for (var i = 0; i < widths.length; i++) {
								fullwidth += widths[i] + 6;
								if (get.is.phoneLayout()) fullwidth += 6;
							}
							fullwidth /= 2;
							var currentLeft = 0;
							for (var stayleft of staylefts) {
								stayleft.currentLeft = currentLeft;
								fullwidth += stayleft.offsetWidth;
								currentLeft += stayleft.offsetWidth;
								if (get.is.phoneLayout()) {
									fullwidth += 18;
									currentLeft += 18;
								} else {
									fullwidth += 12;
									currentLeft += 12;
								}
							}
							if (fullright) {
								fullwidth += 124;
							} else {
								fullwidth += 154;
							}
							for (var stayleft of staylefts) {
								if (game.layout != 'default' && game.layout != 'newlayout') {
									var current_offset = stayleft._offset;
									if (fullright) {
										stayleft._offset = Math.ceil(-ui.arena.offsetWidth / 2) + 135;
									} else {
										stayleft._offset = Math.ceil(-ui.arena.offsetWidth / 2) + 165;
									}
									stayleft._offset += stayleft.currentLeft;

									if (current_offset != stayleft._offset) {
										stayleft.animate('controlpressdownx', 500);
										stayleft.style.transform = 'translateX(' + stayleft._offset + 'px)';
									}
								} else {
									add(stayleft, true);
								}
							}
							if (staylefts.length && controls.length) {
								var last = staylefts[staylefts.length - 1];
								minoffset = last._offset + last.offsetWidth + (get.is.phoneLayout() ? 18 : 12);
							}
						}
						if (!controls.length) return;
						var offset = -length / 2;
						if (minoffset > offset) offset = minoffset;
						var control = controls.shift();
						if (control._offset != offset) {
							control.animate('controlpressdownx', 500);
							control.style.transform = 'translateX(' + offset + 'px)';
							control._offset = offset;
						}
						while (controls.length) {
							var control = controls.shift();
							var width = widths.shift();
							offset += width + 6;
							if (get.is.phoneLayout()) {
								offset += 6;
							}
							if (control._offset != offset) {
								control.animate('controlpressdownx', 500);
								control.style.transform = 'translateX(' + offset + 'px)';
								control._offset = offset;
							}
						}
					},
				},
				game: {
					gl_avatarList: ['gl_aikesi', 'gl_famu', 'gl_aida', 'gl_ailuoweisi', 'gl_sade', 'gl_kali', 'gl_leina', 'gl_aileina', 'cancel2'],
					syncMenu: true,
					xiangqv: [],
					vitalPlayer: {},
					playBackgroundMusic: function() {
						if (lib.config.background_music == 'music_off') {
							ui.backgroundMusic.src = '';
						} else if (game.boss) {
							ui.backgroundMusic.src = lib.assetURL + 'extension/格林笔记/bgm/boss.mp3';
						} else if (window.xiangqv) {
							ui.backgroundMusic.src = lib.assetURL + 'extension/格林笔记/bgm/battle.mp3';
						} else {
							ui.backgroundMusic.src = lib.assetURL + 'extension/格林笔记/bgm/bgm.mp3';
						}
					},
					gameDraw: function(bool, num) {
						var next = game.createEvent('gameDraw', bool ? true : false);
						next.player = game.me;
						if (num) {
							next.num = num;
						} else {
							next.num = 4;
						}
						next.setContent('gameDraw');
						return next;
					},
					arrangePlayers: function() {
						game.players.sort(lib.sort.position);
						var players = game.players.concat(game.dead);
						players.sort(lib.sort.position);
						for (var i = 0; i < players.length; i++) {
							if (i == 0) {
								players[i].previousSeat = players[players.length - 1];
							} else {
								players[i].previousSeat = players[i - 1];
							}
							if (i == players.length - 1) {
								players[i].nextSeat = players[0];
							} else {
								players[i].nextSeat = players[i + 1];
							}
						}
						for (var i = 0; i < game.players.length; i++) {
							if (i == 0) {
								game.players[i].previous = game.players[game.players.length - 1];
							} else {
								game.players[i].previous = game.players[i - 1];
							}
							if (i == game.players.length - 1) {
								game.players[i].next = game.players[0];
							} else {
								game.players[i].next = game.players[i + 1];
							}
						}
					},
					checkResult: function() {
						if (!game.hasPlayer(function(current) {
								return current.identity == 'nei';
							})) {
							game.over(false);
						}
					},
					nextLevel: function(data) {
						var players = game.players.concat(game.dead);
						var card;
						for (var i = 0; i < players.length; i++) {
							if (players[i] != game.me && !players[i].noRemove) {
								cards = players[i].getCards('hejsx');
								for (var j = 0; j < cards.length; j++) {
									cards[j].discard();
								}
								game.removePlayer(players[i]);
							}
						}
						ui.arena.setNumber(8);
						for (var i = 0; i < data.length; i++) {
							var player = ui.create.player();
							beyond = data[i];
							player.getId();
							for (var j in beyond) {
								if (j == 'name') {
									player.init(beyond[j]).animate('start');
								} else if (j == 'identity') {
									player.setIdentity(beyond[j]);
									player.identity = beyond[j];
									if (player.identity == 'zhu') {
										game.boss = player;
										game.playBackgroundMusic();
									}
								} else if (j == 'position') {
									player.dataset.position = beyond[j];
								} else if (j == 'init') {
									beyond[j](player);
								}
							}
							game.players.push(player);
							if (player.getSeatNum() == 0) {
								player.setSeatNum(game.players.length);
							}
							ui.arena.appendChild(player);
						}
					},
					addPlayer: function(position, character, character2) {
						if (position < 0 || position > game.players.length + game.dead.length || position == undefined) {
							position = Math.ceil(Math.random() * (game.players.length + game.dead.length));
						}
						var players = game.players.concat(game.dead);
						ui.arena.setNumber(players.length + 1);
						for (var i = 0; i < players.length; i++) {
							if (parseInt(players[i].dataset.position) >= position) {
								players[i].dataset.position = parseInt(players[i].dataset.position) + 1;
							}
						}
						var player = ui.create.player(ui.arena).animate('start');
						player.getId();
						if (character) player.init(character, character2);
						game.players.push(player);
						if (player.getSeatNum() == 0) {
							player.setSeatNum(game.players.length);
						}
						player.dataset.position = position;
						game.arrangePlayers();
						return player;
					},
					addCharacterPack: function(pack, packagename) {
						var extname = _status.extension || '扩展';
						packagename = packagename || extname;
						for (var i in pack) {
							if (i == 'mode' || i == 'forbid') continue;
							for (var j in pack[i]) {
								if (i == 'character') {
									if (!pack[i][j][4]) {
										pack[i][j][4] = [];
									}
									var imgsrc;
									if (_status.evaluatingExtension) {
										imgsrc = 'db:extension-' + extname + ':' + j + '.jpg';
									} else {
										imgsrc = 'ext:' + extname + '/' + j + '.jpg';
									}
									pack[i][j][4].push(imgsrc);
									if (pack[i][j][4].contains('boss') || pack[i][j][4].contains('hiddenboss')) {
										lib.config.forbidai.add(j);
									}
									if (lib.config.forbidai_user && lib.config.forbidai_user.contains(j)) {
										lib.config.forbidai.add(j);
									}
									for (var l = 0; l < pack[i][j][3].length; l++) {
										lib.skilllist.add(pack[i][j][3][l]);
									}
								} else if (i == 'skill') {
									if (typeof pack[i][j].audio == 'number' || typeof pack[i][j].audio == 'boolean') {
										pack[i][j].audio = 'ext:' + extname + ':' + pack[i][j].audio;
									}
								}
								lib[i][j] = pack[i][j];
							}
						}
						var packname = 'mode_extension_' + packagename;
						lib.characterPack[packname] = pack.character;
						lib.translate[packname + '_character_config'] = packagename;
					},
				},
				element: {
					content: {
						gameDraw: function() {
							if (_status.brawl && _status.brawl.noGameDraw) {
								return;
							}
							var end = player;
							var numx = num;
							do {
								if (typeof num == 'function') {
									numx = num(player);
								}
								if (player.getTopCards) player.directgain(player.getTopCards(numx));
								else player.directgain(get.cards(numx));
								player._start_cards = player.getCards('h');
								player = player.next;
							} while (player != end);
						},
					},
					player: {
						dieAfter: function() {
							game.checkResult();
						},
						removeSkill: function(skill) {
							if (get.intensify(this) && lib.character[this.name][3].contains(skill)) {
								return skill;
							}
							return lib.gl_element.removeSkill.apply(this, arguments);
						},
						reinit: function(from, to, maxHp, online) {
							if (get.intensify(this) || this.noInit) {
								return this;
							}
							return lib.gl_element.reinit.apply(this, arguments);
						},
						uninit: function() {
							if (get.intensify(this) || this.noInit) {
								return this;
							}
							return lib.gl_element.uninit.apply(this, arguments);
						},
						disableSkill: function(skill, skills) {
							if (get.intensify(this) && lib.character[this.name][3].contains(skills)) {
								return this;
							}
							return lib.gl_element.disableSkill.apply(this, arguments);
						},
						clearSkills: function(all) {
							if (get.intensify(this)) {
								return [];
							}
							return lib.gl_element.clearSkills.apply(this, arguments);
						},
						awakenSkill: function(skill, nounmark) {
							if (get.intensify(this) && lib.character[this.name][3].contains(skill)) {
								return this;
							}
							return lib.gl_element.awakenSkill.apply(this, arguments);
						}
					},
				},
				card: {},
				cardPack: {},
				skill: {
					hundun_mishu: {
						init: function(player) {
							var next = game.createEvent('hundun_mishu', false);
							next.player = player;
							next.setContent(lib.skill.hundun_mishu.content);
							return next;
						},
						list: {
							shu: ["jizhi"],
							wei: ["spzhuilie", "hundun_zhanyi", "reshangshi"],
							wu: ["hundun_kurou", "zhaxiang", "buyi"],
							qun: ["hundun_liushi", "fuqi", "hundun_moukui"],
							jin: [],
							key: []
						},
						forced: true,
						content: function() {
							if (!player.group) return;
							var skills = lib.skill.hundun_mishu.list[player.group];
							if (!skills) skills = [];
							player.addAdditionalSkill('hundun_mishu', skills);
						},
						mod: {
							cardname: function(card, player, name) {
								if (player.group == 'wei' && get.type(card) != 'basic') return 'sha';
							},
							"cardEnabled2": function(card, player) {
								if (player.group == 'wu' && get.type(card) != 'basic') return false;
							},
						}
					},
					hundun_zhanyi: {
						enable: 'phaseUse',
						usable: 1,
						audio: 'zhanyi',
						filterCard: true,
						position: 'he',
						check: function(card) {
							var player = _status.event.player;
							var type = get.type(card, 'trick');
							if (type == 'basic') {
								return 13 - get.value(card);
							}
							return 0;
						},
						content: function() {
							player.loseHp();
							switch (get.type(cards[0], 'trick')) {
								case 'basic':
									player.addTempSkill('zhanyi_basic');
									break;
								case 'equip':
									player.addTempSkill('zhanyi_equip');
									break;
								case 'trick':
									player.addTempSkill('zhanyi_trick');
									player.draw(2);
									break;
							}
						},
						ai: {
							order: 9.1,
							result: {
								player: 1
							}
						}
					},
					hundun_moukui: {
						trigger: {
							player: 'useCardToPlayered'
						},
						direct: true,
						filter: function(event, player) {
							return event.card.name == 'sha';
						},
						audio: 'moukui',
						content: function() {
							"step 0"
							var controls = ['draw_card'];
							if (trigger.target.countCards('he')) {
								controls.push('discard_card');
							}
							controls.push('cancel');
							player.chooseControl(controls).set('ai', function() {
								return 'draw_card';
							}).set('prompt', get.prompt2('moukui'));
							"step 1"
							if (result.control == 'draw_card') {
								player.draw();
								player.logSkill('moukui');
							} else if (result.control == 'discard_card' && trigger.target.countCards('he')) {
								player.discardPlayerCard(trigger.target, 'he', true).logSkill = ['moukui', trigger.target];
							} else event.finish();
							"step 2"
							player.addTempSkill('moukui2', 'shaEnd');
						},
						ai: {
							expose: 0.1
						}
					},
					hundun_liushi: {
						audio: 2,
						enable: 'phaseUse',
						filter: function(event, player) {
							return player.countCards('he', {
								suit: 'heart'
							}) > 0;
						},
						filterCard: {
							suit: 'heart'
						},
						position: 'he',
						filterTarget: function(card, player, target) {
							return player.canUse('sha', target, false);
						},
						check: function(card) {
							return 15 - get.value(card);
						},
						discard: false,
						prepare: 'throw',
						loseTo: 'cardPile',
						visible: true,
						insert: true,
						content: function() {
							game.log(player, '将', cards, '置于牌堆顶');
							player.useCard({
								name: 'sha',
								isCard: true
							}, false, targets).card.cxliushi = true;
						},
						group: 'hundun_liushi_damage',
						subSkill: {
							damage: {
								trigger: {
									source: 'damageSource'
								},
								forced: true,
								popup: false,
								filter: function(event, player) {
									return event.card && event.card.cxliushi == true && event.player.isAlive() && event.getParent(3).name == 'cxliushi';
								},
								content: function() {
									trigger.player.addMark('cxliushi2', 1);
									trigger.player.addSkill('cxliushi2');
								},
							},
						},
						ai: {
							order: 10,
							result: {
								target: function(player, target) {
									var eff = get.effect(target, {
										name: 'sha'
									}, player, target);
									return eff - 5;
								},
							},
						},
					},
					hundun_kurou: {
						enable: 'phaseUse',
						prompt: '失去一点体力并摸两张牌',
						content: function() {
							"step 0"
							player.loseHp(1);
							"step 1"
							player.draw(2);
						},
						ai: {
							basic: {
								order: 1
							},
							result: {
								player: 10,
							}
						}
					},
					gl_bossBuff: {
						trigger: {
							player: ["dieBefore", "damageBegin4"]
						},
						filter: function(event, player) {
							if (event.name == 'damage') return get.intensify(player);
							return player == game.boss && player.hp > 0;
						},
						forced: true,
						content: function() {
							if (trigger.name == 'damage') {
								if (trigger.source && !get.intensify(trigger.source)) {
									trigger.source.damage(trigger.num, 'notrigger');
									player.popup('荆棘', 'fire');
								} else {
									trigger.cancel();
									player.popup('天纵', 'fire');
								}
							} else {
								trigger.cancel();
								player.popup('不屈', 'fire');
							}
						},
						mod: {
							gl_power: function(player, num) {
								if (game.complexity == 'difficult' && player.identity == 'nei') return num - 100;
								if (get.intensify(player)) return num + 100;
							},
							gl_defense: function(player, num) {
								if (game.complexity == 'difficult' && player.identity == 'nei') return num - 100;
								if (get.intensify(player)) return num + 100;
							},
							gl_recover: function(player, num) {
								if (game.complexity == 'difficult' && player.identity == 'nei') return num - 100;
								if (get.intensify(player)) return num + 100;
							},
							gl_magic: function(player, num) {
								if (game.complexity == 'difficult' && player.identity == 'nei') return num - 100;
								if (get.intensify(player)) return num + 100;
							},
						}
					},
					autoControl: {
						firstDo: true,
						trigger: {
							player: ['playercontrol', 'chooseToUseBegin', 'chooseToRespondBegin', 'chooseToDiscardBegin', 'chooseToCompareBegin', 'chooseButtonBegin', 'chooseCardBegin', 'chooseTargetBegin', 'chooseCardTargetBegin', 'chooseControlBegin', 'chooseBoolBegin', 'choosePlayerCardBegin', 'discardPlayerCardBegin', 'gainPlayerCardBegin', 'chooseToMoveBegin', 'chooseToPlayBeatmapBegin']
						},
						forced: true,
						priority: 100,
						forceDie: true,
						popup: false,
						filter: function(event, player) {
							if (event.autochoose && event.autochoose()) return false;
							if (lib.filter.wuxieSwap(event)) return false;
							return player.identity == 'nei';
						},
						content: function() {
							game.swapControl(player);
							for (var i = 0; i < game.players.length; i++) {
								game.players[i].classList.remove('current_action');
							}
							game.me.classList.add('current_action');
							game.me.node.action.innerHTML = '行动';
						}
					},
					gl_hundun: {
						trigger: {
							player: ["turnOverBefore", "linkBefore"],
						},
						priority: 101,
						forced: true,
						firstDo: true,
						content: function() {
							trigger.cancel();
						},
						mod: {
							targetEnabled: function(card, player, target) {
								if (get.type(card) == 'delay') {
									return false;
								}
							},
						},
						ai: {
							noturn: true,
							effect: {
								target: function(card) {
									if (card.name == 'tiesuo') return 'zeroplayertarget';
								},
							},
						},
					}
				},
				character: {
					"hundun_villain": ["none", "jin", 5, ["gl_hundun"],
						["ext:格林笔记/hundun_villain.jpg"]
					],
					"hundun_shitu": ["none", "jin", 5, ["hundun_mishu"],
						["ext:格林笔记/hundun_shitu.jpg"]
					],
				},
				translate: {
					"zhu": "混沌",
					"fan": "混乱",
					"zhong": "秩序",
					"nei": "调律",
					"gl_hundun": "混沌",
					"gl_hundun_info": "锁定技，你不能被翻面、横置；你不是延迟锦囊牌的合法目标。",
					"hundun_villain": "混沌之仆",
					"hundun_shitu": "混沌使徒",
					"hundun_kurou": "苦肉",
					"hundun_kurou_info": '出牌阶段，你可以失去一点体力，然后摸两张牌。',
					"hundun_mishu": "秘术",
					"hundun_mishu_info": "灰烬教团的不传秘术，可以透支生命短时间内大幅度提升力量。",
					"hundun_liushi": "流矢",
					"hundun_liushi_info": "出牌阶段，你可以将一张红桃牌置于牌堆顶，视为对一名角色使用一张【杀】（无距离限制且不计入使用次数）。当此【杀】造成伤害后，受到伤害的角色获得一个“流”。有“流”的角色手牌上限-X（X为其“流”数）。",
					"hundun_moukui": "谋溃",
					"hundun_moukui_info": "当你使用【杀】指定目标后，你可以选择一项：摸一张牌，或弃置其一张牌。若如此做，当此【杀】被【闪】抵消时，目标角色弃置你的一张牌。",
				},
				get: {
					intensify: function(player) {
						if (game.complexity == 'difficult' && player.identity != 'nei' && player.identity != 'zhong') return true;
						if (game.complexity == 'ordinary' && game.boss == player) return true;
						return false;
					},
					rawAttitude: function(from, to) {
						var num = 0;
						if (from.identity == 'zhu') {
							switch (to.identity) {
								case 'zhong':
									num = -5;
									break;
								case 'fan':
									num = 10;
									break;
								case 'nei':
									num = -5;
									break;
								case 'zhu':
									num = 10;
									break;
							}
						}
						if (from.identity == 'zhong') {
							switch (to.identity) {
								case 'zhu':
									num = -5;
									break;
								case 'fan':
									num = -5;
									break;
								case 'nei':
									num = 5;
									break;
								case 'zhong':
									num = 5;
									break;
							}
						}
						if (from.identity == 'nei') {
							switch (to.identity) {
								case 'zhong':
									num = 5;
									break;
								case 'fan':
									num = -10;
									break;
								case 'nei':
									num = 10;
									break;
								case 'zhu':
									num = -10;
									break;
							}
						}
						if (from.identity == 'fan') {
							switch (to.identity) {
								case 'zhong':
									num = -10;
									break;
								case 'fan':
									num = 10;
									break;
								case 'nei':
									num = -10;
									break;
								case 'zhu':
									num = 10;
									break;
							}
						}
						return num;
					}
				},
				init: function() {
					if (!lib.config.gelin.data.contains('d' + 'eparture')) {
						onerror();
					}
				},
				startBefore: function() {
					var list = lib.config.extension_格林笔记_banext;
					if (list && list.length != 0 && !localStorage.getItem(lib.configprefix + 'glclose')) {
						var closes = 'extension_格林笔记_enable';
						for (var i = 0; i < list.length; i++) {
							console.log(list[i]);
							if (lib.config['extension_' + list[i] + '_enable'] !== false) {
								closes += ',extension_' + list[i] + '_enable';
								game.saveConfig('extension_' + list[i] + '_enable', false);
							}
						}
						game.saveConfig('mode', lib.config.mode);
						localStorage.setItem(lib.configprefix + 'directstart', true);
						localStorage.setItem(lib.configprefix + 'glclose', closes);
						game.reload();
					} else {
						var closes = localStorage.getItem(lib.configprefix + 'glclose');
						if (closes) {
							closes = closes.split(',');
							for (var i = 0; i < closes.length; i++) {
								game.saveConfig(closes[i], true);
							}
							localStorage.removeItem(lib.configprefix + 'glclose');
						}
					}
				},
			}, {
				translate: "想区",
				config: {
					control: {
						name: '多人控制',
						intro: '是否能够在想区模式中控制其他的调律行动',
						init: true
					},
					complexity: {
						name: '游戏难度',
						init: 'ordinary',
						item: {
							'simple': '宝宝童话',
							'ordinary': '真实世界',
							'difficult': '暗黑次元',
						}
					},
					banext: {
						name: '扩展禁用',
						intro: '设置禁止载入部分想区模式不兼容的扩展',
						item: {},
						visualBar: function(page, item, create) {
							if (page.created) {
								return;
							}
							page.created = true;
							page.classList.add('.menu-buttons');
							var list = lib.config.extensions;
							var callback = function() {
								if (!lib.config.extension_格林笔记_banext) {
									lib.config.extension_格林笔记_banext = [];
								}
								if (lib.config.extension_格林笔记_banext.contains(this.link)) {
									lib.config.extension_格林笔记_banext.remove(this.link);
									this.classList.remove('active');
								} else {
									lib.config.extension_格林笔记_banext.add(this.link);
									this.classList.add('active');
								}
								game.saveConfig('extension_格林笔记_banext', lib.config.extension_格林笔记_banext);
							}
							for (var i = 0; i < list.length; i++) {
								if (list[i] == '格林笔记') continue;
								var node = ui.create.div('.menubutton', list[i], page, callback);
								node.link = list[i];
								node.style.margin = '5px';
								if (lib.config.extension_格林笔记_banext && lib.config.extension_格林笔记_banext.contains(list[i])) {
									node.classList.add('active');
								}
							}
						},
						visualMenu: function() {},
						onclick: function() {},
					}
				},
				onremove: function() {
					game.clearModeConfig('xiangqv');
				},
			});
		},
		help: {
			"格林笔记": '<div style="margin:10px">名词释义</div>' +
				'<ul style="margin-top:0">' +
				'<li>沉默之雾<br>围绕在想区周围的迷雾，无法驱散。如果没有引导之证指引方向，很容易迷失其中。' +
				'<li>诗晶石<br>造物主们创造世界时与世界伴生的产物，是想区力量的源泉。' +
				'<li>引导之证<br>造物主的信物，能够和诗晶石、原典产生共鸣迸发出神奇的力量。' +
				'<li>造物主/说书人<br>对传说的神明的代称，无人知晓它们的名字。据说是它们在沉默之雾中开辟了作为生存空间的想区。' +
				'<li>命运之书<br>每个人出生开始就存在于意识之海中的神秘之书，上面记录着这个人的一生。与持有者紧密相连，书毁人死，人灭书散。' +
				'<li>原典<br>命运之书的原型，每当代理者逝去时，都会去寻找新的代理者开始新的轮回。' +
				'<li>空白之书<br>空无一字的命运之书，被视作“灾厄”的化身、被造物主遗弃的可怜之人。' +
				'<li>想区<br>由造物主开辟，遵循某种秩序不断轮回原典的故事，当故事严重背离原典时会崩溃，有一定的自我修复能力，是人们赖以生存的家园。' +
				'<li>混沌<br>促使想区崩溃的扭曲之物。惧怕诗晶石的力量，无法在正常情况下影响想区。' +
				'<li>混沌之仆<br>想区的居民命运之书被混沌力量所侵扰的产物，能够被引导之证的力量驱散。' +
				'<li>混沌之源<br>想区的居民主动寻求混沌力量的产物，会严重削弱诗晶石的力量，导致混沌侵入想区。' +
				'</ul>' +
				'<div style="margin:10px">技能说明</div>' +
				'<ul style="margin-top:0">' +
				'<li>调律者技能<br>拥有技能联结的角色，进行联结后可以使用的特殊技能。' +
				'<li>能量珠<br>用于释放调律者技能的消耗点数；初始值为6，上限为10。每轮游戏开始或击杀其他角色后均会自动回复一点。' +
				'<li>切替技能<br>当使用联结的效果和持有角色进行联结时，会自动释放效果，若使用时能量珠不足则会执行惩罚效果。' +
				'<li>撤离技能<br>当使用联结的效果和持有角色解除联结时，会自动释放效果，若使用时能量珠不足则会执行惩罚效果。' +
				'<li>被动技能<br>对联结状态持有角色的属性进行调整，不会消耗能量珠。' +
				'<li>主动技能<br>联结状态持有角色出牌阶段消耗能量珠主动释放效果，能量珠不足时无法使用。' +
				'<li>武力<br>影响暴击率每1点提高1%的暴击率。' +
				'<li>韧性<br>影响格挡率每1点提高1%的格挡率。' +
				'<li>祝福<br>影响赐福率每1点提高1%的赐福率。' +
				'<li>魔性<br>影响再动率每1点提高1%的再动率。' +
				'<li>速度<br>决定行动条的增长速度；最高为10，最低为1，默认值为3。' +
				'<li>行动条<br>当补充为最大值时，才能进行行动，只有在出现影响速度的因素时，才会显示。' +
				'<li>阵法技<br>只有处于“阵法队列”中才能生效，同一阵法队列中的所有角色，共享阵法技的阵法效果。' +
				'<li>武装技<br>出牌阶段仅一次可以主动武装化，武装化的情况下武装技失效，武装进入弃牌堆时移出游戏并恢复武装技。' +
				'<li>侍从技<br>侍从技持有者会获得1名对应的随从，随从阵亡后，侍从技失效；受到伤害前，本体与随从可以进行交替。' +
				'</ul>',
		},
		config: {
			"book": {
				"name": "作者QQ有事联系2839929208",
				"clear": true
			},
		},
		package: {
			character: {
				character: {},
				translate: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				skill: {
					_gl_gainJingshi: {
						trigger: {
							source: "dieAfter",
							global: "roundStart"
						},
						priority: 75,
						firstDo: true,
						forced: true,
						content: function() {
							var num = 1;
							if (trigger.name == '_turnover') num = Math.min(4, game.roundNumber);
							player.gl_changeJingshi(num);
						}
					},
					gl_kuangbao_tiaolv: {
						mod: {
							cardUsable: function(card, player, num) {
								if (card.name == 'sha') return num + player.storage.gl_kuangbao_tiaolv;
							},
						}
					},
					gl_jinglingzhisen: {
						start: function() {
							for (var i of game.players) {
								i.draw(2);
							}
						},
						enable: 'phaseUse',
						usable: 1,
						content: function() {
							'step 0'
							player.draw(4);
							'step 1'
							player.chooseToDiscard(4, true, 'he').set('ai', function(card) {
								if (_status.event.player.getDamagedHp()) {
									var suit = get.suit(card);
									for (var i = 0; i < ui.selected.cards.length; i++) {
										if (get.suit(ui.selected.cards[i]) == suit) {
											return -4 - get.value(card);
										}
									}
								}
								return -get.value(card);
							});
							'step 2'
							if (result.cards && result.cards.length == 4) {
								var suits = [];
								for (var i = 0; i < result.cards.length; i++) {
									suits.add(get.suit(result.cards[i]));
								}
								if (suits.length == 4) {
									player.recover();
								}
							}
						},
						ai: {
							order: 7,
							result: {
								player: 5
							},
							threaten: 1.5
						},
						subSkill: {
							sha: {
								trigger: {
									player: 'useCard'
								},
								forced: true,
								priority: 15,
								filter: function(event, player) {
									return event.card.name == 'sha';
								},
								content: function() {
									player.loseHp();
								},
								ai: {
									effect: {
										player: function(card, player, target) {
											if (card.name == 'sha') return [1, -2];
										}
									}
								}
							}
						}
					},
					gl_donghailonggong: {
						start: function() {
							'step 0'
							event.players = game.players.slice(0);
							'step 1'
							if (event.players.length) {
								var target = event.players.shift();
								var equip = get.cardPile(function(card) {
									return get.type(card) == 'equip' && target.hasUseTarget(card);
								});
								if (equip) {
									target.chooseUseTarget(equip, 'nothrow', 'nopopup', true);
								}
								event.redo();
							}
						},
						enable: "phaseUse",
						usable: 1,
						filter: function(event, player) {
							return player.countCards('he', {
								type: 'equip'
							}) > 0;
						},
						filterCard: function(card) {
							return get.type(card) == 'equip';
						},
						position: 'he',
						selectCard: [1, Infinity],
						check: function(card) {
							var player = _status.currentPhase;
							var nh = player.countCards('h');
							var pos = get.position(card);
							if (player.countCards('he', {
									subtype: get.subtype(card)
								}) > 1) {
								return 11 - get.equipValue(card) + (pos == 'e' ? 0.4 : 0);
							}
							return 5.5 - get.value(card) + (pos == 'e' ? 0.4 : 0);
						},
						prompt: "弃置任意装备牌并摸两倍的牌",
						content: function() {
							player.draw(cards.length * 2);
						},
						ai: {
							order: 7,
							result: {
								player: 5
							},
							threaten: 1.5
						},
						subSkill: {
							equip: {
								trigger: {
									player: "turnOverAfter"
								},
								forced: true,
								priority: 15,
								content: function() {
									var equip = get.cardPile(function(card) {
										return get.type(card) == 'equip' && player.hasUseTarget(card);
									});
									if (equip) {
										player.chooseUseTarget(equip, 'nothrow', 'nopopup', true);
									}
								},
							}
						}
					}
				},
				translate: {
					"gl_jinglingzhisen": "精灵之森",
					"gl_jinglingzhisen_info": "作为此地图发动的效果处理，全场所有角色摸2张牌。地图效果：使用【杀】时，将失去1点体力；出牌阶段仅一次，可以摸4张牌并弃置4张牌，若弃置的牌花色均不同再额外回复1点体力。",
					"gl_donghailonggong": "东海龙宫",
					"gl_donghailonggong_info": "作为此地图发动的效果处理，全场所有角色随机使用1张装备牌。地图效果：武将牌翻面后，随机使用1张装备牌；出牌阶段仅一次，可以将任意张装备牌置入弃牌堆并摸两倍的牌。"
				},
			},
			intro: "这个作者很懒，什么都没有写......",
			author: "尼斯湖水怪",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		},
		files: {
			"character": ["gl_yagebu.jpg", "gl_ludeweixi.jpg", "gl_kamila.jpg", "gl_sanyuetu.jpg", "gl_baixuewanghou.jpg", "gl_baiqiangwei.jpg", "gl_geerda.jpg", "gl_taolesi.jpg", "gl_duerxineiya.jpg", "gl_ailisi.jpg", "gl_aikesi.jpg", "gl_baixueji.jpg", "gl_xiaohongmao.jpg", "gl_zhende.jpg", "gl_kalun.jpg", "gl_wukong.jpg", "gl_yuyitiannv.jpg", "gl_alading.jpg", "gl_huiguniang.jpg", "gl_xierfu.jpg", "gl_maihuochai.jpg", "gl_jiayi.jpg", "gl_moligan.jpg", "gl_xiannv.jpg", "gl_kaluoer.jpg", "gl_bingxuenvwang.jpg", "gl_sade.jpg", "gl_ailuoweisi.jpg", "gl_aida.jpg", "gl_tangjihede.jpg", "gl_taotailang.jpg", "gl_hongqiangwei.jpg", "gl_famu.jpg", "gl_kali.jpg", "gl_weilian.jpg", "gl_jimu.jpg", "gl_kelisidina.jpg", "gl_ailike.jpg"],
			"card": [],
			"skill": []
		}
	}
})
