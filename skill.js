window.gelinSkill = function(lib, game, ui, get, ai, _status) {
	var list = {
		skill: {
			"gl_shanqvan": {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function(event, player, target) {
					return player != target && target.countCards('hej');
				},
				content: function() {
					'step 0'
					player.gain(target.getCards('hej'), target, 'giveAuto');
					'step 1'
					player.showHandcards();
					var cards = player.getCards('h');
					var list = [];
					for (var i = 0; i < cards.length; i++) {
						if (!list.contains(get.suit(cards[i]))) {
							list.push(get.suit(cards[i]))
						}
					}
					player.damage(list.length, target);
				},
			},
			"gl_huanyi": {
				init: function() {
					game.gl_addSpeed();
				},
				global: "gl_huanyi_speed",
				subSkill: {
					speed: {
						mod: {
							gl_speed: function(player, speed) {
								if (!game.hasPlayer(function(current) {
										return current.hasSkill('gl_huanyi');
									})) return;
								var num = player.maxHp * 2;
								num -= player.countCards('h');
								num -= player.hp;
								return speed + num;
							}
						}
					}
				}
			},
			"gl_duwu": {
				enable: "phaseUse",
				usable: 1,
				filter: function(event, player) {
					return player.countCards('h');
				},
				content: function() {
					'step 0'
					var cards = player.getCards('h');
					player.addGaintag(cards, 'gl_duwu');
					player.addTempSkill('gl_duwu_dying');
					'step 1'
					var cards = player.getCards('hs', function(card) {
						return card.hasGaintag('gl_duwu');
					});
					if (cards.length) {
						if (player.hasUseTarget('sha')) {
							player.chooseUseTarget(true, false, {
								name: 'sha'
							}).cards = [cards[0]];
						}
						event.redo();
					}
					'step 2'
					player.removeSkill('gl_duwu_dying');
				},
				subSkill: {
					dying: {
						trigger: {
							global: "dying",
						},
						filter: function(event, player) {
							return event.player != player;
						},
						charlotte: true,
						content: function() {
							player.loseHp();
							player.chooseToDiscard(2, true);
						},
						sub: true,
						forced: true,
					},
				},
			},
			"gl_zhoufu": {
				trigger: {
					player: "useCardToPlayered",
				},
				filter: function(event, player) {
					var type = get.type(event.card);
					if (type == 'basic') return false;
					if (!event.targets) return false;
					if (!event.isFirstTarget) return false;
					if (event.targets.length > player.hp) return false;
					return game.hasPlayer(function(target) {
						return event.targets.contains(target) && !target.isLinked();
					});
				},
				prompt: function(event) {
					return '是否将' + get.translation(event.targets) + '横置？';
				},
				content: function() {
					player.line(trigger.targets, 'thunder');
					for (var i = 0; i < trigger.targets.length; i++) {
						trigger.targets[i].link(true);
					}
				},
				group: ['gl_zhoufu_use'],
				subSkill: {
					use: {
						trigger: {
							player: "useCard2",
						},
						forced: true,
						filter: function(event, player) {
							var type = get.type(event.card);
							if (type != 'basic') return false;
							return game.hasPlayer(function(target) {
								if (!target.isLinked()) return false;
								if (event.targets.contains(target)) return false
								return lib.filter.targetEnabled2(event.card, player, target);
							});
						},
						content: function() {
							var targets = game.filterPlayer(function(target) {
								if (!target.isLinked()) return false;
								if (trigger.targets.contains(target)) return false
								return lib.filter.targetEnabled2(trigger.card, player, target);
							});
							trigger.targets.addArray(targets)
						},
						sub: true,
					},
				},
			},
			"gl_guishao": {
				skillAnimation: 'epic',
				animationColor: 'fire',
				unique: true,
				limited: true,
				mark: true,
				init: function(player, skill) {
					player.storage[skill] = false;
				},
				trigger: {
					source: 'damageEnd'
				},
				filter: function(event, player) {
					if (event.nature != 'fire') return false;
					return !player.storage.gl_guishao;
				},
				logTarget: "player",
				intro: {
					content: "limited",
				},
				content: function() {
					player.awakenSkill('gl_guishao');
					player.storage.gl_guishao = true;
					player.storage.gl_guishao_buff = trigger.player;
					player.addTempSkill('gl_guishao_buff');
					trigger.player.draw(3);
				},
				group: "gl_guishao_huogong",
				subSkill: {
					buff: {
						sub: true,
						charlotte: true,
						mod: {
							targetInRange: function(card, player, target, now) {
								if (target == player.storage.gl_guishao_buff) return true;
							},
							cardUsableTarget: function(card, player, target) {
								if (player.storage.gl_guishao_buff && player.storage.gl_guishao_buff.contains(target)) return true;
							},
						},
					},
					huogong: {
						enable: "chooseToUse",
						viewAs: {
							name: "huogong"
						},
						filter: function(event, player) {
							return player.countCards('hes');
						},
						filterCard: true,
						position: "hes",
						prompt: "将一张牌当【火攻】使用",
						check: function(card) {
							var player = _status.currentPhase;
							if (player.countCards('h') > player.hp) {
								return 6 - get.value(card);
							}
							return 3 - get.value(card)
						},
					},
				}
			},
			"gl_cannue": {
				trigger: {
					global: "dying",
				},
				filter: function(event, player) {
					return _status.currentPhase == player;
				},
				forced: true,
				content: function() {
					trigger.player.recover();
					player.draw();
				},
			},
			"gl_shishang": {
				trigger: {
					player: "damageBegin2",
				},
				direct: true,
				content: function() {
					'step 0'
					var cards = [];
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						cards.push(ui.discardPile.childNodes[i])
					}
					player.chooseButton(['是否发动【嗜伤】？', cards]);
					'step 1'
					if (result.bool && result.links && result.links.length) {
						player.gain(result.links, 'gain2', 'log');
						event.card = result.links[0];
						trigger.num++;
						player.logSkill('gl_shishang');
						if (trigger.num >= player.hp) {
							player.addSkill('gl_shishang_damage');
							player.storage.gl_shishang_damage++;
						}
					}
				},
				subSkill: {
					damage: {
						trigger: {
							source: "damageBegin2",
						},
						init: function(player) {
							if (!player.storage.gl_shishang_damage) {
								player.storage.gl_shishang_damage = 0;
							}
						},
						forced: true,
						popup: false,
						content: function() {
							trigger.num += player.storage.gl_shishang_damage;
							player.storage.gl_shishang_damage = 0;
							player.removeSkill('gl_shishang_damage');
						},
						sub: true,
					}
				}
			},
			"gl_fengkuang": {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function(card, player, target) {
					return player != target;
				},
				filter: function(event, player) {
					return player.countCards('h') > 0;
				},
				selectTarget: -1,
				filterCard: true,
				selectCard: -1,
				discard: false,
				lose: false,
				delay: false,
				multitarget: true,
				multiline: true,
				content: function() {
					player.useCard({
						name: 'sha'
					}, cards, targets);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			"gl_moxiao": {
				gl_shicong: {
					name: 'gl_dahuilang',
					skills: ["gl_fengkuang", "gl_canjiao", "gl_menggong"],
					hp: 3
				},
				init: function(player, skill) {
					player.gl_shicong(skill);
				},
				trigger: {
					source: "damageSource",
				},
				frequent: true,
				content: function() {
					'step 0'
					event.cards = get.cards(5);
					player.chooseButton(['魔哮：请选择一张牌获得之', event.cards], true);
					'step 1'
					if (result.bool && result.links && result.links.length) {
						player.gain(result.links);
						event.cards.remove(result.links[0]);
						player.$throw(event.cards, 1000);
						player.lose(event.cards, ui.discardPile, 'visible');
						game.log(player, '将', event.cards, '置入弃牌堆');
					}
				},
			},
			"gl_menggong": {
				trigger: {
					player: "shaMiss",
				},
				direct: true,
				filter: function(event, player) {
					return event.target.isAlive();
				},
				content: function() {
					player.loseHp();
					trigger.untrigger();
					trigger.trigger('shaHit');
					trigger._result.bool = false;
					trigger._result.result = null;
				},
			},
			"gl_fengbi": {
				trigger: {
					player: "damageBefore",
				},
				filter: function(event, player) {
					return _status.currentPhase == player;
				},
				forced: true,
				content: function() {
					trigger.cancel();
				},
				mod: {
					"cardEnabled2": function(card, player) {
						if (_status.currentPhase == player) return;
						if (get.position(card) == 'h') return false;
					},
				},
			},
			"gl_canjiao": {
				trigger: {
					player: "exitSubPlayerBefore"
				},
				filter: function(event, player) {
					return event.remove;
				},
				direct: true,
				content: function() {
					'step 0'
					var cards = [];
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						cards.push(ui.discardPile.childNodes[i])
					}
					player.chooseButton(['是否发动【残叫】？', cards], [1, 3]);
					'step 1'
					if (result.bool && result.links && result.links.length) {
						player.logSkill('gl_canjiao');
						var next = game.createEvent('exitSubPlayer', false);
						next.player = player;
						next.setContent('exitSubPlayer');
						player.gain(result.links, 'gain2', 'log');
						var next = game.createEvent('callSubPlayer', false);
						next.player = player;
						next.directresult = event.name2;
						next.setContent('callSubPlayer');
					}
				}
			},
			"gl_cuifeng": {
				trigger: {
					global: 'phaseBefore',
				},
				priority: 8,
				filter: function(event, player) {
					if (event.player == player) return false;
					return player.gl_jingshi && player.gl_jingshi >= 5;
				},
				content: function() {
					player.gl_changeJingshi(-5);
					trigger.player = player;
				},
			},
			"gl_yongjian": {
				trigger: {
					source: 'damageSource',
				},
				filter: function(event, player) {
					return _status.currentPhase == player;
				},
				content: function() {
					player.loseHp();
					var stat = player.getStat();
					for (var i in stat.skill) {
						var bool = false;
						var info = lib.skill[i];
						if (!info) continue;
						if (info.enable != undefined) {
							if (typeof info.enable == 'string' && info.enable == 'phaseUse') bool = true;
							else if (typeof info.enable == 'object' && info.enable.contains('phaseUse'))
								bool = true;
						}
						if (bool) stat.skill[i] = 0;
					}
					for (var i in stat.card) {
						var bool = false;
						var info = lib.card[i];
						if (!info) continue;
						if (info.updateUsable == 'phaseUse') stat.card[i] = 0;
					}
				},
			},
			"gl_jiandun": {
				trigger: {
					player: 'damageBegin4',
				},
				forced: true,
				content: function() {
					player.changeHujia();
				},
				group: "gl_jiandun_phase",
				subSkill: {
					phase: {
						trigger: {
							global: 'phaseAfter'
						},
						forced: true,
						filter: function(event, player) {
							if (event.player == player) return false;
							var history = player.getHistory('damage', function(evt) {
								if (evt.hujia) return evt.num > evt.hujia;
								return evt.num > 0;
							});
							return history.length;
						},
						content: function() {
							player.insertPhase();
						}
					}
				}
			},
			"gl_guishi": {
				trigger: {
					player: 'damageEnd',
				},
				filter: function(event, player) {
					if (!player.gl_jingshi) return false;
					if (player.gl_jingshi < 2) return false;
					if (get.itemtype(event.cards) != 'cards') return false;
					if (get.position(event.cards[0], true) != 'o') return false;
					return true;
				},
				content: function() {
					player.gl_changeJingshi(-2);
					player.gain(trigger.cards, 'gain2').gaintag.add('gl_guishi');
				},
				mod: {
					targetInRange: function(card, player, target, now) {
						if (get.position(card) != 'h') return;
						if (card.hasGaintag('gl_guishi')) return true;
					},
					cardUsable: function(card, player, num) {
						if (get.position(card) != 'h') return;
						if (card.hasGaintag('gl_guishi')) return Infinity;
					},
				},
			},
			"gl_yuhe": {
				trigger: {
					player: 'phaseZhunbeiBegin',
				},
				direct: true,
				filter: function(event, player) {
					if (!player.gl_jingshi) return false;
					if (player.gl_jingshi < 2) return false;
					return true;
				},
				content: function() {
					'step 0'
					player.chooseTarget(get.prompt2(event.name));
					'step 1'
					if (result.bool) {
						player.gl_changeJingshi(-2);
						var target = result.targets[0];
						event.target = target;
						player.logSkill(event.name, result.targets);
						var controls = ['摸两张牌'];
						if (target.maxHp > target.hp) {
							controls.push('回复体力');
						}
						if (target.countCards('j')) {
							controls.push('弃置判定牌');
						}
						if (target.isLinked() || target.isTurnedOver()) {
							controls.push('重置武将牌');
						}
						if (controls.length == 1) {
							target.draw(2);
							event.finish();
						} else {
							target.chooseControl(controls).set('prompt', '请选择以下一项执行');
						}
					} else {
						event.finish();
					}
					'step 2'
					switch (result.control) {
						case '回复体力':
							target.recover();
							break;
						case '摸两张牌':
							target.draw(2);
							break;
						case '重置武将牌':
							target.turnOver(false);
							target.link(false);
							break;
						case '弃置判定牌':
							target.discard(target.getCards('j'));
							break;
					}
				},
			},
			"gl_huashi": {
				trigger: {
					player: 'phaseZhunbeiBegin',
				},
				filter: function(event, player) {
					if (!player.gl_jingshi) return false;
					if (player.gl_jingshi < 2) return false;
					return true;
				},
				direct: true,
				content: function() {
					'step 0'
					var list = [];
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						var node = ui.cardPile.childNodes[i];
						if (get.subtype(node) == 'equip1') {
							list.push(node);
						}
					}
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						var node = ui.discardPile.childNodes[i];
						if (get.subtype(node) == 'equip1') {
							list.push(node);
						}
					}
					player.chooseButton([get.prompt(event.name), list]);
					'step 1'
					if (result.bool) {
						player.gl_changeJingshi(-2);
						player.gain(result.links, 'gain2');
					}
				},
			},
			"gl_xinsheng": {
				trigger: {
					global: 'phaseUseBegin',
				},
				filter: function(event, player) {
					if (!player.gl_jingshi) return false;
					if (player.gl_jingshi < 2) return false;
					return event.player.countCards('h') && event.player != player;
				},
				check: function(event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content: function() {
					'step 0'
					player.gl_changeJingshi(-2);
					var list = ['置于牌堆顶', '置入弃牌堆'];
					var dialog = ui.create.dialog('心声', 'hidden');
					var table = document.createElement('div');
					table.classList.add('add-setting');
					table.style.margin = '0';
					table.style.width = '100%';
					table.style.position = 'relative';
					for (var i = 0; i < list.length; i++) {
						if (player.isDisabled(i)) continue;
						var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
						td.innerHTML = '<span>' + list[i] + '</span>';
						td.link = i;
						td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
						for (var j in lib.element.button) {
							td[j] = lib.element.button[j];
						}
						table.appendChild(td);
						dialog.buttons.add(td);
					}
					dialog.content.appendChild(table);
					dialog.add(trigger.player.getCards('h'));
					var next = player.chooseButton(dialog, 2, true);
					next.filterButton = function(button) {
						if (ui.selected.buttons.length && typeof ui.selected.buttons[0].link == 'number') {
							return (typeof button.link == 'object');
						}
						return true;
					}
					'step 1'
					if (result.bool) {
						var cards = [],
							index = 2;
						for (var i = 0; i < result.links.length; i++) {
							if (typeof result.links[i] == 'object') {
								cards.push(result.links[i]);
							} else {
								index = result.links[i];
							}
						}
						if (index == 0 || index == 2) {
							var card = cards.shift();
							trigger.player.lose(card, 'insert', ui.cardPile);
							game.log(player, '将一张牌置于牌堆顶');
							game.updateRoundNumber();
							player.turnOver(true);
						}
						if (index == 1 || index == 2) {
							var card = cards.shift();
							trigger.player.$throw(card, 1000);
							trigger.player.lose(card, ui.discardPile, 'visible');
							game.log(player, '将', card, '置入弃牌堆');
							player.link(true);
						}
						if (index == 2) {
							player.$hideCharacter(2);
						}
					}
				},
			},
			"gl_qieqv": {
				trigger: {
					player: 'showCharacterAfter'
				},
				forced: true,
				filter: function(event, player) {
					if (!player.gl_jingshi) return false;
					if (player.gl_jingshi < 2) return false;
					return event.toShow && event.toShow.contains('gl_sade');
				},
				hiddenSkill: true,
				content: function() {
					'step 0'
					player.chooseTarget(get.prompt2(event.name), function(card, player, target) {
						return target.countGainableCards(player, player == target ? 'ej' : 'hej') > 0;
					});
					'step 1'
					if (result.bool) {
						player.gl_changeJingshi(-2);
						var target = result.targets[0];
						player.logSkill(event.name, result.targets);
						player.gainPlayerCard(player == target ? 'ej' : 'hej', target, true);
					}
				},
			},
			"gl_aiyu": {
				trigger: {
					source: ['damageBegin2', 'damageEnd']
				},
				filter: function(event, player, name) {
					if (event.player == player) return false;
					if (!event.player.isAlive()) return false;
					if (name == 'damageBegin2' && event.player.hasSex('female')) return true;
					if (name == 'damageEnd' && event.player.hasSex('male')) return player.countCards('he');
					return false;
				},
				direct: true,
				content: function() {
					'step 0'
					if (event.triggername == 'damageBegin2') {
						player.chooseBool(get.prompt(event.name));
					}
					if (event.triggername == 'damageEnd') {
						player.chooseToDiscard(2, 'he', get.prompt(event.name));
					}
					'step 1'
					if (result.bool) {
						if (event.triggername == 'damageBegin2') {
							player.logSkill(event.name);
							player.loseHp();
							trigger.num++;
							trigger.nature = 'fire';
						}
						if (event.triggername == 'damageEnd') {
							player.logSkill(event.name);
							player.recover();
							trigger.player.recover();
						}
					}
				},
			},
			"gl_binghua": {
				trigger: {
					global: "loseAfter",
				},
				filter: function(event, player) {
					if (event.player == player) return false;
					return event.type == 'discard';
				},
				priority: 5,
				forced: true,
				content: function() {
					'step 0'
					player.gain(trigger.cards, 'gain2', 'log');
					'step 1'
					if (player.isMaxHandcard(true)) {
						player.loseHp();
					}
				},
			},
			"gl_changye": {
				enable: "phaseUse",
				filterTarget: function(card, player, target) {
					if (!target.hasSkill('baiban')) return true;
					if (target.countCards('he') > 0) return true;
					return false;
				},
				filter: function(event, player) {
					if (!player.gl_jingshi) return false;
					if (player.gl_jingshi < 2) return false;
					return player.storage.disableEquip != undefined && player.storage.disableEquip.length < 5;
				},
				content: function() {
					'step 0'
					event.cards = player.getCards('e');
					player.gl_changeJingshi(-2);
					player.chooseToDisable();
					'step 1'
					event.control = result.control;
					target.addTempSkill('baiban');
					player.discardPlayerCard(target, 'he', true);
					'step 2'
					for (var i = 0; i < event.cards.length; i++) {
						if (get.subtype(event.cards[i]) == event.control) {
							player.draw();
							break;
						}
					}
				},
			},
			"gl_dengji": {
				trigger: {
					player: ['loseAfter', 'damageAfter'],
				},
				usable: 1,
				filter: function(event, player) {
					if (event.name == 'lose') return event.type = 'discard' && !player.isMaxHp() && player.getDamagedHp() != 0;
					return !player.isMaxHandcard();
				},
				content: function() {
					if (event.name == 'lose') {
						var num = 0;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].hp > num) num = game.players[i].hp;
						}
						player.recover(num - player.hp);
					} else {
						var num = 0;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].countCards('h') > num) num = game.players[i].countCards('h');
						}
						player.draw(num - player.countCards('h'));
					}
				}
			},
			"gl_shinue": {
				enable: "phaseUse",
				usable: 1,
				viewAs: {
					name: "shuiyanqijunx",
				},
				filterCard: function() {
					return false;
				},
				selectCard: -1,
				selectTarget: 1,
				prompt: '视为使用一张【水淹七军】',
				check: function(card) {
					return 15 - get.value(card)
				},
				group: "gl_shinue_damage",
				subSkill: {
					damage: {
						trigger: {
							source: "damageEnd",
						},
						forced: true,
						filter: function(event) {
							return event.parent.skill == 'gl_shinue';
						},
						popup: false,
						content: function() {
							'step 0'
							player.chooseDrawRecover(2);
							'step 1'
							if (result.control == 'draw_card') {
								trigger.player.draw(2);
							} else {
								trigger.player.recover();
							}
						},
						sub: true,
					},
				},
			},
			"gl_sangzhi": {
				trigger: {
					player: ["damageBegin4", "phaseDrawBegin2", "useCardToPlayer"],
				},
				forced: true,
				content: function() {
					if (trigger.name == 'damage') {
						trigger.num++;
					} else if (trigger.name == 'phaseDraw') {
						trigger.num--;
					} else if (trigger.target) {
						trigger.target.addTempSkill('gl_sangzhi', {
							player: ['damageEnd', 'phaseAfter']
						});
					}
				}
			},
			"gl_jiqi": {
				trigger: {
					player: 'phaseDrawBegin'
				},
				content: function() {
					trigger.cancel();
					var card = get.cardPile('sha');
					if (card) {
						player.gain(card, 'gain2', 'log');
					}
					player.addTempSkill('gl_jiqi_damage');
				},
				subSkill: {
					damage: {
						trigger: {
							source: "damageBegin1",
						},
						filter: function(event) {
							return event.card && event.card.name == 'sha' && event.notLink();
						},
						content: function() {
							trigger.num++;
						},
						ai: {
							damageBonus: true,
						},
						sub: true,
						forced: true,
						charlotte: true,
					},
				},
			},
			"gl_suoji": {
				trigger: {
					player: 'useCardToPlayered'
				},
				filter: function(event, player) {
					return event.card.name == 'sha';
				},
				direct: true,
				content: function() {
					"step 0"
					player.chooseControl('不可响应', '技能失效', 'cancel2').set('prompt', get.prompt(event.name));
					"step 1"
					if (result.control == '不可响应') {
						trigger.getParent().directHit.add(trigger.target);
					}
					if (result.control == '技能失效') {
						if (!trigger.target.hasSkill('fengyin')) {
							trigger.target.addTempSkill('fengyin');
						}
					}
				},
			},
			"gl_qipo": {
				trigger: {
					player: 'damageBegin2'
				},
				filter: function(event, player) {
					return event.card.name == 'sha' && !player.inRange(event.player) && event.player.countDiscardableCards(player, 'he');
				},
				forced: true,
				content: function() {
					player.discardPlayerCard('he', trigger.player, true);
					trigger.num--;
				},
				mod: {
					targetInRange: function(card) {
						if (card.name == 'sha') return true;
					},
				},
			},
			"gl_qinhe": {
				trigger: {
					player: ['judgeBegin', 'drawBegin']
				},
				forced: true,
				silent: true,
				filter: function(event, player) {
					if (event.name == 'draw' && event.num >= ui.cardPile.childNodes.length) return false;
					return !event.directresult;
				},
				content: function() {
					var tempcard = false,
						temp = -Infinity;
					var cards = [];
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						cards.push(ui.cardPile.childNodes[i]);
					}
					cards.sort(function(a, b) {
						if (trigger.name == 'judge') {
							return trigger.judge(b) - trigger.judge(a);
						} else {
							return get.value(b, player, 'raw') - get.value(a, player, 'raw');
						}
					})
					if (cards.length) {
						if (trigger.name == 'judge') {
							trigger.directresult = cards[0];
						} else {
							ui.cardPile.insertBefore(cards[0], ui.cardPile.firstChild);
						}
					}
				},
				ai: {
					luckyStar: true
				},
			},
			"gl_wuhua": {
				trigger: {
					player: 'phaseJieshuBegin'
				},
				direct: true,
				content: function() {
					'step 0'
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var type = get.type2(lib.inpile[i]);
						list.push([get.translation(type), '', lib.inpile[i]]);
					}
					player.chooseButton([get.prompt('gl_wuhua'), [list, 'vcard']]);
					'step 1'
					if (result.bool) {
						player.logSkill(event.name);
						player.storage.gl_wuhua = result.links[0][2];
						player.addTempSkill('gl_wuhua_use', {
							player: 'phaseBegin'
						});
					}
				},
				subSkill: {
					use: {
						trigger: {
							global: 'useCard',
						},
						filter: function(event, player) {
							return event.card.name == player.storage.gl_wuhua;
						},
						charlotte: true,
						forced: true,
						content: function() {
							trigger.cancel();
							player.removeSkill('gl_wuhua_use');
							player.$hideCharacter(2);
							player.addTempSkill('qianxing', {
								player: 'showCharacterAfter'
							});
						},
						ai: {
							threaten: 1.8,
							expose: 0.3
						}
					},
				}
			}
		},
		translate: {
			"gl_shanqvan": "擅权",
			"gl_shanqvan_info": "出牌阶段限一次，你可以获得一名其他角色区域内的所有牌，那之后，你展示手牌，其中每有一种花色的牌，其便对你造成一点伤害。",
			"gl_huanyi": "幻翼",
			"gl_huanyi_info": "锁定技，场上所有角色的速度+X。（X为其的体力上限*2-其的体力值与手牌数）",
			"gl_duwu": "黩武",
			"gl_duwu_info": "出牌阶段限一次，你可以将所有的手牌依次当【杀】使用，结算过程中，每有一名其他角色濒死你便失去1点体力并弃置两张牌。",
			"gl_zhoufu": "咒缚",
			"gl_zhoufu_info": "当你使用非基本牌指定不大于X名角色为目标时，你可以将这些角色横置；锁定技，你使用的基本牌会将场上被横置的角色也变为额外目标。（X为你当前的体力值）",
			"gl_guishao": "鬼烧",
			"gl_guishao_info": "你可以将1张牌当【火攻】使用；限定技，当你造成火焰伤害后，你可以令对方摸3张牌且对其使用牌无视次数与距离限制直至本回合结束为止。",
			"gl_shishang": "嗜伤",
			"gl_shishang_info": "当你即将受到伤害时，你可以获得弃牌堆中的1张牌并令此伤害+1，若此伤害为致命伤害，则额外令你下次造成的伤害+1。",
			"gl_cannue": "残虐",
			"gl_cannue_info": "锁定技，当有角色于你的回合内陷入濒死状态时，其回复一点体力且你摸一张牌。",
			"gl_fengbi": "封闭",
			"gl_fengbi_info": "锁定技，你的回合内，你免疫所有伤害；你的回合外，你不能使用或打出手牌。",
			"gl_moxiao": "魔哮",
			"gl_moxiao_info": "侍从技，当你造成伤害后，你可以观看牌堆顶5张牌，获得其中一张牌随后弃置剩余的牌。",
			"gl_fengkuang": "疯狂",
			"gl_fengkuang_info": "出牌阶段限一次，你可以将所有手牌当做【杀】对除你以外的所有角色使用。",
			"gl_canjiao": "残叫",
			"gl_canjiao_info": "当你即将牺牲时，你可以将弃牌堆至多3张牌交给你的本体。",
			"gl_menggong": "猛攻",
			"gl_menggong_info": "当你的杀被闪响应时，你可以失去一点体力令那张杀依旧造成伤害。",
			"gl_cuifeng": "摧锋",
			"gl_cuifeng_info": "其他角色的回合开始前，你可以消耗5枚能量珠，改为由你执行此回合。",
			"gl_yongjian": "勇剑",
			"gl_yongjian_info": "当你造成伤害后，你可以失去1点体力并刷新你的所有技能与卡牌的使用次数。",
			"gl_jiandun": "坚盾",
			"gl_jiandun_info": "锁定技，当你即将受到伤害时，你获得1点护甲；其他角色的回合结束后，若你于此回合内受到过伤害，你执行一个额外一个回合。",
			"gl_guishi": "玫矢",
			"gl_guishi_info": "当你受到伤害后，你可以消耗2枚能量珠，获得对你造成伤害的牌；锁定技，你使用以此法获得的牌没有次数与距离限制。",
			"gl_yuhe": "愈合",
			"gl_yuhe_info": "准备阶段开始时，你可以消耗2枚能量珠，令1名角色选择以下一项执行：1，摸2张牌；2，回复1点体力；3，重置武将牌；4，弃置判定区内所有牌。",
			"gl_huashi": "花饰",
			"gl_huashi_info": "准备阶段开始时，你可以消耗2枚能量珠，从牌堆、弃牌堆获得任意1张武器牌。",
			"gl_xinsheng": "心声",
			"gl_xinsheng_info": "其他角色出牌阶段开始时，你可以消耗2枚能量珠，观看其的手牌并执行以下一项：1，将其中1张牌置于牌堆顶并翻至背面；2，将其中1张牌置入弃牌堆并横置；背水：隐匿你的武将牌。",
			"gl_qieqv": "窃取",
			"gl_qieqv_info": "隐匿技，当你登场时，你可以消耗2枚能量珠，获得1名角色区域内1张牌。",
			"gl_aiyu": "爱欲",
			"gl_aiyu_info": "当你对男性角色造成伤害后，你可以弃置2张牌与其分别回复1点体力；你对女性角色造成伤害时，你可以失去1点体力，令变为火焰伤害且伤害值+1。",
			"gl_binghua": "冰花",
			"gl_binghua_info": "锁定技，当其他角色的牌因弃置而进入弃牌堆时，你获得那些牌，那之后若你的手牌数为全场唯一最多你失去1点体力。",
			"gl_changye": "长夜",
			"gl_changye_info": "出牌阶段，你可以消耗2枚能量珠并废除1个装备区。弃置1名角色1张牌并令其的所有技能失效直至回合结束，若你废除装备区内原本有牌存在，则你额外摸1张牌。",
			"gl_dengji": "登极",
			"gl_dengji_info": "每回合限一次，当你受到伤害/因弃置而失去牌后，你可以将手牌数/体力值调整至全场最大。",
			"gl_shinue": "施虐",
			"gl_shinue_info": "出牌阶段限一次，你可以视为使用1张【水淹七军】；当有角色因此受到伤害后，你可以与其分别回复1点体力或摸2张牌。",
			"gl_sangzhi": "丧志",
			"gl_sangzhi_info": "锁定技，摸牌阶段，你少摸1张牌；当你受到伤害时，此伤害+1。当你使用牌指定目标后，对方也获得此技能直至其的下个回合结束或受到伤害为止。",
			"gl_jiqi": "集气",
			"gl_jiqi_info": "摸牌阶段开始时，你可以放弃摸牌改为获得1张【杀】，直至此回合结束为止你【杀】的伤害+1。",
			"gl_suoji": "锁击",
			"gl_suoji_info": "当你使用【杀】指定目标后，若你与其的距离为1，则你可以执行以下一项：1，其的非锁定技失效；2，此杀不可响应。",
			"gl_qipo": "气魄",
			"gl_qipo_info": "锁定技，当你使用【杀】造成伤害时，若其不在你的攻击范围内，则你弃置其1张牌并令此伤害-1；你的【杀】没有距离限制。",
			"gl_qinhe": "亲和",
			"gl_qinhe_info": "锁定技，今天是幸运的一天，你应该唱首小幸运。",
			"gl_wuhua": "雾化",
			"gl_wuhua_info": "回合结束后，你可以暗记1种牌名，直至你的下个回合开始为止，当有角色使用你记录的牌名时，那张牌无效之，随后你隐匿武将牌并进入潜行状态直至登场为止。",
		},
	}

	for (var i in list.skill) {
		game.addSkill(i, list.skill[i], list.translate[i], list.translate[i + '_info']);
	}
}
