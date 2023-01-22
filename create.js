game.import('character', function(lib, game, ui, get, ai, _status) {
	var gl_create = {
		name: 'gl_create',
		characterIntro: {
			gl_ludeweixi: '没有成为说书人的才能，总为不能跟上哥哥们的步伐而烦恼，在接受多萝西娅的教导后，有了新的感悟成为现世的最后一位说书人。',
			gl_yagebu: '表面上对待弟弟路德维希和妹妹夏洛特十分严苛，但实际上比谁都关怀他们。与弟弟威廉一起四处旅行，在游历无数想区后，借助无数想区原典的力量，成为了现世的一名说书人。',
			gl_shanluzuode: '为了化解国王的戾气，与妹妹诀别后独自前往王宫。想办法安抚国王的同时，作为说书人的才能不断展现，最终成为了现世的一名说书人。'
		},
		characterSort: {
			gl_create: {
				gl_previous: ["gl_duoluoxiya", "gl_yisuo", "gl_antusheng", "gl_xiaer", "gl_wangdefa", "gl_dafenqi"],
				gl_now: ["gl_ludeweixi", "gl_shashibiya", "gl_yagebu", "gl_weilian", "gl_shanluzuode", "gl_kaluoer"],
				gl_next: ["gl_xialuote", "gl_emama", "gl_leina"],
				gl_hundun: ["gl_moligan", "gl_puluomixiusi"]
			},
		},
		dynamicTranslate: {
			gl_lvfa: function(player) {
				if (player.storage.gl_lvfa) {
					return '转换技，你的回合开始前，你可以解除自身所有控制效果；锁定技，全场所有角色不能使用、打出或弃置，阴：基本牌。<span class="bluetext">阳：非基本牌。</span>';
				}
				return '转换技，你的回合开始前，你可以解除自身所有控制效果；锁定技，全场所有角色不能使用、打出或弃置，<span class="bluetext">阴：基本牌。</span>阳：非基本牌。';
			},
		},
		character: {
			gl_ludeweixi: ["male", "shen", 4, ["gl_huimeng", "gl_duren", "gl_tianyan", "gl_huanyu"],
				[]
			],
			gl_yagebu: ["male", "shen", 4, ["gl_zhenglun", "gl_huihu", "gl_anxian", "gl_jigong"],
				[]
			],
			gl_shashibiya: ["male", "shen", 4, [],
				[]
			],
			gl_weilian: ["male", "shen", 4, ["gl_yingyong", "gl_weigong", "gl_qianya", "gl_gaibian"],
				[]
			],
			gl_kaluoer: ["male", "shen", 4, ["gl_kaiyan", "gl_fengluan", "gl_meiyu", "gl_menghuan"],
				[]
			],
			gl_shanluzuode: ["female", "shen", 4, ["gl_sancai", "gl_lvfa", "gl_sihu", "gl_yetan"],
				[]
			],
			gl_yisuo: ["female", "shen", 4, ["gl_weidao", "gl_jiacheng", "gl_xinsheng_yisuo", "gl_yanling"],
				[]
			],
			gl_xiaer: ["male", "shen", 4, ["gl_rumeng", "gl_zhidou", "gl_yanjie", "gl_yujiao"],
				[]
			],
			gl_antusheng: ["male", "shen", 4, [],
				[]
			],
			gl_duoluoxiya: ["female", "shen", 4, [],
				[]
			],
			gl_xialuote: ["female", "shen", 4, ["gl_qiuyuan", "gl_xvanlv", "gl_jvguang"],
				[]
			],
			gl_emama: ["female", "shen", 4, [],
				[]
			],
			gl_moligan: ["female", "jin", 4, ["gl_midu", "gl_zhuixun", "gl_sangluan", "gl_yongye"],
				[]
			],
			gl_puluomixiusi: ["male", "jin", 4, ['gl_aige', 'gl_liezhua', 'gl_jiluan', 'gl_jueyi'],
				[]
			],
			gl_leina: ["female", "shen", 3, ["gl_lianjie", "gl_tiaolv"],
				["gl:shen"]
			],
			gl_wangdefa: ["male", "shen", 4, [],
				[]
			],
			gl_dafenqi: ["male", "shen", 4, [],
				[]
			],
			gl_shuiguai: ["female", "shen", 4, ["gl_tiaoxin", "gl_kanpo", "gl_dangxian", "gl_shenzhu"],
				["bossallowed", "boss"]
			],
		},
		characterTitle: {
			gl_ludeweixi: '#r梦想的缔造者',
			gl_leina: '#r原初的调律者',
			gl_shanluzuode: '#r神秘的缔造者',
			gl_yagebu: '#r继承的缔造者',
			gl_weilian: '#r谦雅的缔造者',
			gl_kaluoer: '#r梦幻的缔造者',
			gl_shashibiya: '#r浪漫的缔造者',
			gl_duoluoxiya: '#r秩序的缔造者',
			gl_yisuo: '#r神话的缔造者',
			gl_antusheng: '#r真实的缔造者',
			gl_dafenqi: '#r传奇的缔造者',
			gl_xiaer: '#r严厉的缔造者',
			gl_wangdefa: '#r幸福的缔造者',
			gl_xialuote: '#r音乐的开辟者',
			gl_emama: '#r少女的融合体',
			gl_moligan: '#b混沌的缔造者',
			gl_puluomixiusi: '#b混沌的主宰者',
		},
		skill: {
			"gl_shenzhu": {
				init: function(player) {
					if (get.mode() == 'boss' && player == game.boss) {
						player.maxHp = 30;
						player.hp = player.maxHp;
						player.update();
					}
				},
				trigger: {
					global: 'phaseBefore',
					player: ['enterGame', 'dieBefore'],
				},
				filter: function(event, player) {
					if (event.name == 'die') return get.mode() == 'boss' && player == game.boss && player != game.me;
					return event.name != 'phase' || game.phaseNumber == 0;
				},
				forced: true,
				charlotte: true,
				content: function() {
					"step 0"
					if (get.mode() == 'boss' && player == game.boss && player != game.me) {
						if (trigger.name == 'die') {
							if (game.roundNumber < 5) {
								player.say(['年轻人别那么大火气，来喝碗凉茶冷静一下~', '这次只是我运气，下次指定没你好果子吃。'].randomGet());
							} else {
								player.say(['你的力量强大而不失温柔，咱最好这口了~', '快去拯救世界吧，骚年！'].randomGet());
								game.gl_setData('departure');
							}
						} else {
							player.say(['别用你卑劣的人品来度量我高超的战术！', '崽种爷杀了你！'].randomGet());
						}
					}
					var list = ['wei', 'shu', 'wu', 'qun', 'jin', 'key', 'shen'];
					player.chooseControl(list).set('prompt', '请选择一种势力并获得技能').set('ai', function() {
						if (list.contains('shu')) return 'shu';
						return 0;
					});
					"step 1"
					if (result.control) {
						var skills = get.gainableSkills(function(info, skill, name) {
							return lib.character[name][1] == result.control;
						});
						player.addAdditionalSkill('gl_shenzhu', skills.randomGets(player.maxHp));
					}
				},
			},
			"gl_kanpo": {
				gl_wuzhuang: {
					name: 'bagua',
					suit: 'club',
					number: 2,
				},
				mod: {
					aiValue: function(player, card, num) {
						if (get.name(card) != 'wuxie' && get.color(card) != 'black') return;
						var cards = player.getCards('hs', function(card) {
							return get.name(card) == 'wuxie' || get.color(card) == 'black';
						});
						cards.sort(function(a, b) {
							return (get.name(b) == 'wuxie' ? 1 : 2) - (get.name(a) == 'wuxie' ? 1 : 2);
						});
						var geti = function() {
							if (cards.contains(card)) {
								return cards.indexOf(card);
							}
							return cards.length;
						};
						if (get.name(card) == 'wuxie') return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
						return Math.max(num, [6, 4, 3][Math.min(geti(), 2)]);
					},
					aiUseful: function() {
						return lib.skill.rekanpo.mod.aiValue.apply(this, arguments);
					},
				},
				locked: false,
				audio: 'rekanpo',
				position: "hes",
				enable: "chooseToUse",
				filterCard: function(card) {
					return get.color(card) == 'black';
				},
				viewAsFilter: function(player) {
					return player.countCards('hes', {
						color: 'black'
					}) > 0;
				},
				viewAs: {
					name: "wuxie",
				},
				prompt: "将一张黑色牌当无懈可击使用",
				check: function(card) {
					return 8 - get.value(card)
				},
			},
			"gl_tiaoxin": {
				gl_wuzhuang: {
					name: 'guding',
					suit: 'spade',
					number: 2,
				},
				audio: 'tiaoxin',
				enable: 'phaseUse',
				usable: 2,
				filterTarget: function(card, player, target) {
					return target != player && target.inRange(player) && target.countCards('he') > 0;
				},
				content: function() {
					"step 0"
					target.chooseToUse(function(card, player, event) {
						if (get.name(card) != 'sha') return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, '挑衅：对' + get.translation(player) + '使用一张杀，或令其弃置你的一张牌').set('targetRequired', true).set('complexSelect', true).set('filterTarget', function(card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
						return lib.filter.filterTarget.apply(this, arguments);
					}).set('sourcex', player);
					"step 1"
					if (result.bool == false && target.countCards('he') > 0) {
						player.discardPlayerCard(target, 'he', true);
					} else {
						event.finish();
					}
				},
				ai: {
					order: 4,
					expose: 0.2,
					result: {
						target: -1,
						player: function(player, target) {
							if (target.countCards('h') == 0) return 0;
							if (target.countCards('h') == 1) return -0.1;
							if (player.hp <= 2) return -2;
							if (player.countCards('h', 'shan') == 0) return -1;
							return -0.5;
						}
					},
					threaten: 1.1
				}
			},
			"gl_dangxian": {
				trigger: {
					global: 'roundStart'
				},
				audio: 'dangxian',
				direct: true,
				content: function() {
					'step 0'
					player.chooseTarget(get.prompt2(event.name), [1, 4]).set('ai', function(target) {
						var att = get.attitude(_status.event.player, target);
						if (game.gl_zhenfa(_status.event.player, target)) return 0;
						return 5;
					});
					'step 1'
					if (result.bool) {
						player.logSkill(event.name, result.targets);
						var targets = result.targets.slice(0);
						while (targets.length) {
							var target = targets.shift();
							if (game.gl_zhenfa(player, target)) {
								player.recover();
								delete target.storage.gl_zhenfa;
								target.unmarkSkill('gl_zhenfa');
							} else {
								game.asyncDraw([player, target]);
								target.storage.gl_zhenfa = player;
								target.markSkill('gl_zhenfa');
							}
						}
					}
				},
				group: "gl_dangxian_zhenfa",
				subSkill: {
					zhenfa: {
						trigger: {
							global: 'phaseBegin'
						},
						filter: function(event, player) {
							return game.gl_zhenfa(player, event.player);
						},
						forced: true,
						audio: 'dangxian',
						content: function() {
							'step 0'
							player.loseHp();
							var card = get.discardPile(function(card) {
								return card.name == 'sha';
							});
							if (card) player.gain(card, 'gain2');
							'step 1'
							game.updateRoundNumber();
							var next = player.phaseUse();
							event.next.remove(next);
							trigger.next.push(next);
						},
						sub: true,
					},
				},
			},
			"gl_huimeng": {
				trigger: {
					player: "phaseUseBegin",
				},
				parse: function(func) {
					var str = func.toString();
					str = str.slice(str.indexOf('{') + 1);
					if (str.indexOf('step 0') == -1) {
						str = '{if(event.step==1) {event.finish();return;}' + str;
					} else {
						for (var k = 1; k < 99; k++) {
							if (str.indexOf('step ' + k) == -1) break;
							str = str.replace(new RegExp("'step " + k + "'", 'g'), "break;case " + k + ":");
							str = str.replace(new RegExp('"step ' + k + '"', 'g'), "break;case " + k + ":");
						}
						str = str.replace(/'step 0'|"step 0"/, 'if(event.step==' + k + ') {event.finish();return;}switch(step){case 0:');
					}
					str = 'try{' + str + '}catch(e){console.log(e);event.finish();}';
					return (new Function('event', 'step', 'source', 'player', 'target', 'targets', 'card', 'cards', 'skill', 'forced', 'num', 'trigger', 'result', '_status', 'lib', 'game', 'ui', 'get', 'ai', str));
				},
				unique: true,
				frequent: true,
				getSkillDialog: function(skills, prompt) {
					var dialog = ui.create.dialog('hidden', 'forcebutton');
					if (prompt) dialog.addText(prompt);
					for (var i = 0; i < skills.length; i++) {
						if (skills[i] == 'cancel2') continue;
						dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
					}
					dialog.addText(' <br> ');
					return dialog;
				},
				content: function() {
					'step 0'
					var list = [];
					var skills = [];
					var info;
					for (var i in lib.character) {
						skills.addArray(lib.character[i][3]);
					}
					skills.randomSort();
					for (var i = 0; i < skills.length; i++) {
						info = lib.skill[skills[i]];
						if (!info || !info.content || info.contentBefore || info.contentAfter || info.init || info.unique || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill) {
							continue;
						}
						list.add(skills[i]);
						if (list.length > 4) break;
					}
					var next = player.chooseControl(list);
					next.dialog = lib.skill.gl_huimeng.getSkillDialog(list, '选择要获得的技能');
					'step 1'
					if (result.control) {
						player.addTempSkill(result.control, {
							player: 'phaseBefore'
						});
						player.storage.gl_huimeng = result.control;
					}
				},
				group: "gl_huimeng_merge",
				subSkill: {
					merge: {
						enable: "phaseUse",
						usable: 1,
						filter: function(event, player) {
							if (!player.storage.gl_huimeng) return false;
							if (!player.hasSkill(player.storage.gl_huimeng)) return false;
							if (player.hasSkill('gl_tianyan')) return true;
							if (player.hasSkill('gl_duren')) return true;
							return false;
						},
						content: function() {
							'step 0'
							var list = [];
							if (player.hasSkill('gl_tianyan')) {
								list.push('gl_tianyan')
							}
							if (player.hasSkill('gl_duren')) {
								list.push('gl_duren')
							}
							player.chooseControl(list);
							'step 1'
							var name = player.storage.gl_huimeng;
							player.storage[result.control].push(name);
							player.removeSkill(name);
						},
						sub: true,
					},
				},
			},
			"gl_duren": {
				trigger: {
					player: "useCardToPlayered",
				},
				mod: {
					cardUsable: function(card, player, num) {
						if (card.name == 'sha') return Infinity;
					},
				},
				check: function(event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				filter: function(event, player) {
					if (player.hasSkill('gl_duren_ising')) return false;
					return event.card.name == 'sha' && event.target != player;
				},
				logTarget: "target",
				content: function() {
					'step 0'
					player.addTempSkill('gl_duren_ising');
					trigger.target.gain(game.createCard('du'), 'gain2');
					event.list = player.storage.gl_duren.slice(0);
					'step 1'
					if (event.list.length) {
						var name = event.list.shift();
						var next = game.createEvent('gl_duren', false);
						next.player = player;
						next.target = trigger.target;
						next.targets = trigger.targets;
						next.card = trigger.cards[0];
						next.cards = trigger.cards;
						next.skill = 'gl_duren';
						next.num = 0;
						next._trigger = {
							name: 'gl_duren',
							step: 0,
							finished: false,
							next: [],
							after: [],
							custom: {
								add: {},
								replace: {}
							},
							_aiexclude: [],
							_notrigger: [],
							_result: {},
							_set: [],
						}
						for (var i in lib.element.event) {
							next._trigger[i] = lib.element.event[i];
						}
						next._trigger.source = player;
						next._trigger.player = trigger.target;
						next._trigger.target = trigger.target;
						next._trigger.targets = trigger.targets;
						next._trigger.card = trigger.cards[0];
						next._trigger.cards = trigger.cards;
						next._trigger.skill = 'gl_duren';
						next._trigger.num = 1;
						next.content = lib.skill.gl_huimeng.parse(lib.skill[name].content);
						event.redo();
					}
					'step 2'
					player.removeSkill('gl_duren_ising');
				},
				init: function(player) {
					if (!player.storage.gl_duren) {
						player.storage.gl_duren = [];
					}
				},
				subSkill: {
					ising: {
						sub: true,
					},
				},
				mark: true,
				intro: {
					content: function(storage, player) {
						var list = player.storage.gl_duren;
						var str = '<div style="text-align: center;width: 100%;">';
						if (list.length) {
							str += '已融合技能<br/>';
							for (var i = 0; i < list.length; i++) {
								str += get.translation(list[i]);
								str += '<br/>';
								str += get.translation(list[i] + '_info');
								str += '<br/>';
							}
							str += '</div>'
							return str;
						} else {
							return '未融合技能';
						}
					},
				},
				unique: true,
			},
			"gl_tianyan": {
				mark: true,
				intro: {
					content: function(storage, player) {
						var list = player.storage.gl_tianyan;
						var str = '<div style="text-align: center;width: 100%;">';
						if (list.length) {
							str += '已融合技能<br/>';
							for (var i = 0; i < list.length; i++) {
								str += get.translation(list[i]);
								str += '<br/>';
								str += get.translation(list[i] + '_info');
								str += '<br/>';
							}
							str += '</div>'
							return str;
						} else {
							return '未融合技能';
						}
					},
				},
				enable: "phaseUse",
				usable: 1,
				filter: function(event, player) {
					return player.countCards('he') > 0;
				},
				filterTarget: true,
				position: "he",
				filterCard: true,
				check: function(card) {
					return 8 - get.value(card);
				},
				multitarget: true,
				multiline: true,
				line: "fire",
				init: function(player) {
					if (!player.storage.gl_tianyan) {
						player.storage.gl_tianyan = [];
					}
				},
				filter: function(event, player) {
					return player.countCards('h');
				},
				unique: true,
				content: function() {
					'step 0'
					target.damage('fire');
					event.list = player.storage.gl_tianyan.slice(0);
					'step 1'
					if (event.list.length) {
						var name = event.list.shift();
						var next = game.createEvent('gl_tianyan', false);
						next.player = player;
						next.target = event.target;
						next.targets = event.targets;
						next.card = event.card;
						next.cards = event.cards;
						next.skill = 'gl_tianyan';
						next.num = 0;
						next._trigger = {
							name: 'gl_tianyan',
							step: 0,
							finished: false,
							next: [],
							after: [],
							custom: {
								add: {},
								replace: {}
							},
							_aiexclude: [],
							_notrigger: [],
							_result: {},
							_set: [],
						}
						for (var i in lib.element.event) {
							next._trigger[i] = lib.element.event[i];
						}
						next._trigger.source = player;
						next._trigger.player = event.target;
						next._trigger.target = event.target;
						next._trigger.targets = event.targets;
						next._trigger.card = event.card;
						next._trigger.cards = event.cards;
						next._trigger.skill = 'gl_tianyan';
						next._trigger.num = 1;
						next.content = lib.skill.gl_huimeng.parse(lib.skill[name].content);
						console.log(next.content);
						event.redo();
					}
				},
				ai: {
					damage: true,
					fireAttack: true,
					threaten: 1.5,
					order: 7,
					result: {
						target: function(player, target) {
							var eff = get.damageEffect(target, player, target, 'fire');
							return eff;
						},
					},
				},
			},
			"gl_huanyu": {
				trigger: {
					global: 'phaseBefore',
					player: 'phaseJieshuBegin',
				},
				forced: true,
				filter: function(event, player) {
					if (event.name == 'phase') return game.phaseNumber == 0;
					return true;
				},
				content: function() {
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						num += game.players[i].hp;
					}
					player.draw(num);
				},
				group: "gl_huanyu_discard",
				subSkill: {
					discard: {
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						forced: true,
						content: function() {
							var num = 0;
							for (var i = 0; i < game.players.length; i++) {
								num += game.players[i].hp;
							}
							player.chooseToDiscard(num, true);
						},
						sub: true,
					},
				},
			},
			"gl_zhenglun": {
				enable: "phaseUse",
				usable: 1,
				unique: true,
				init: function() {
					window.gl_zhenglunInfo = function(name) {
						ui.click.charactercard(name);
					}
				},
				content: function() {
					var list = [];
					for (var i in lib.character) {
						list.push(i);
					}
					list = list.randomGets(game.players.length);
					var cards = [];
					while (list.length) {
						var character = list.shift();
						var name = character + '_glzhenglun';
						if (!lib.card[name]) {
							var info = {
								enable: true,
								type: 'equip',
								subtype: lib.character[character][1],
								filterTarget: function(card, player, target) {
									return target == player;
								},
								ai: {
									order: 8.9,
									equipValue: 10,
									useful: 2.5,
									value: function(card, player) {
										var value = 0;
										var info = get.info(card);
										var current = player.getEquip(info.subtype);
										if (current && card != current) {
											value = get.value(current, player);
										}
										var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
										if (typeof equipValue == 'function') return equipValue(card, player) - value;
										return equipValue - value;
									},
									result: {
										target: function(player, target) {
											return get.equipResult(player, target, name);
										}
									}
								},
								fullimage: true,
								selectTarget: -1,
								modTarget: true,
								content: lib.element.content.equipCard,
								skills: lib.character[character][3],
								image: 'character:' + character,
							}
							lib.card[name] = info;
							lib.translate[name] = lib.translate[character];
							var skills = lib.character[character][3];
							var str = '';
							str += '<a class="gl_info" data-link="' + character + '" onclick="window.gl_zhenglunInfo(this.dataset.link)">【';
							str += lib.translate[character] + '】</a>的武将象征';
							lib.translate[name + '_info'] = str;
						}
						var card = game.createCard(name);
						card.setBackground(character, 'character');
						cards.push(card);
					}
					player.gain(cards, 'gain2');
				},
				ai: {
					order: 11,
					result: {
						player: 1,
					},
				},
			},
			"gl_jigong": {
				mark: true,
				intro: {
					content: function(storage, player) {
						var num = player.getHistory('useCard').length;
						num = num - (player.getStat().skill.gl_jigong || 0);
						if (num < 0) num = 0;
						return '急攻可发动' + num + '次';
					},
				},
				enable: "phaseUse",
				filter: function(event, player) {
					if (player.countCards('h') == 0) return false;
					var num = player.getHistory('useCard').length;
					if ((player.getStat().skill.gl_jigong || 0) >= num) return false;
					return true;
				},
				check: function(card) {
					return 10 - get.value(card);
				},
				filterCard: true,
				filterTarget: true,
				content: function() {
					target.damage();
				},
				ai: {
					order: 6,
					result: {
						target: function(player, target) {
							return get.damageEffect(target, player);
						},
					},
				},
			},
			"gl_anxian": {
				trigger: {
					player: "damageEnd",
				},
				content: function() {
					"step 0"
					player.draw(2);
					var cards = Array.from(ui.ordering.childNodes);
					while (cards.length) {
						cards.shift().discard();
					}
					"step 1"
					var evt = _status.event.getParent('phase');
					if (evt) {
						game.resetSkills();
						_status.event = evt;
						_status.event.finish();
						_status.event.untrigger(true);
					}
				},
			},
			"gl_huihu": {
				trigger: {
					global: "damageEnd",
				},
				filter: function(event, player) {
					if (!event.player.isAlive()) return false;
					return player != event.player && player.countCards('he', {
						type: 'equip'
					}) > 0;
				},
				direct: true,
				logTarget: "target",
				content: function() {
					"step 0"
					player.chooseCard('he', '将1张装备牌置入' + get.translation(trigger.player) + '的装备内').set('filterCard', function(card) {
						return get.type(card) == 'equip';
					}).set('ai', function(card) {
						if (get.attitude(player, trigger.player) > 0) {
							if (get.position(card) == 'e') {
								return 0.5;
							} else {
								return 1;
							}
						}
						return 0;
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gl_huihu', trigger.player);
						trigger.player.equip(result.cards[0]);
					} else {
						event.finish();
					}
					"step 2"
					if (trigger.source && trigger.source.isAlive()) {
						var es = trigger.player.countCards('e');
						var num = es - trigger.source.countCards('h');
						if (num > 0) {
							trigger.source.draw(num);
						} else if (num < 0) {
							trigger.source.chooseToDiscard('h', true, -num);
						}
					}
				},
			},
			"gl_sancai": {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function(card, player, target) {
					return player != target;
				},
				filter: function(event, player) {
					return player.countCards('h') > 0;
				},
				filterCard: true,
				selectCard: -1,
				discard: false,
				lose: false,
				delay: false,
				content: function() {
					target.gain(cards, player, 'giveAuto');
					player.draw(cards.length);
				},
				ai: {
					order: 11,
					result: {
						target: function(player, target) {
							if (player.countCards('h') == player.countCards('h', 'du')) {
								return -1;
							}
							if (get.attitude(player, target) > 3) {
								var basis = get.threaten(target) + 3;
								if (target.hasSkillTag('nogain')) basis--;
								if (target.hasJudge('lebu')) basis--;
								return basis;
							}
							return 0;
						},
					},
				},
			},
			"gl_lvfa": {
				trigger: {
					player: "phaseBefore",
				},
				zhuanhuanji: true,
				priority: 101,
				firstDo: true,
				check: function(event, player) {
					var cards = player.getCards('j');
					var num1 = game.countPlayer(function(current) {
						if (current.countCards('he') < 9) {
							return false;
						}
						if (get.attitude(player, current) < 0) {
							return true;
						}
						return false;
					});
					var num2 = game.countPlayer(function(current) {
						if (current.countCards('he') < 9) {
							return false;
						}
						if (get.attitude(player, current) > 0) {
							return true;
						}
						return false;
					});
					if (num1 > num2) return false;
					if (cards.length) return true;
					if (player.isTurnedOver()) return true;
					if (player.isLinked()) return true;
					if (num1 < num2) return true;
					return false;
				},
				content: function() {
					var skill = player.getSkills();
					for (var i = 0; i < skill.length; i++) {
						var info = lib.skill[skill[i]];
						if (info.debuff) player.removeSkill(skill[i]);
					}
					player.turnOver(false);
					player.link(false);
					player.discard(player.getCards('j'));
					if (player.storage.gl_lvfa == true) {
						player.storage.gl_lvfa = false;
					} else {
						player.storage.gl_lvfa = true;
					};
				},
				global: "gl_lvfa_jin",
				subSkill: {
					jin: {
						sub: true,
						mod: {
							cardEnabled: function(card, player) {
								var type = get.type(card);
								if (game.hasPlayer(function(current) {
										if (!current.hasSkill('gl_lvfa')) return false;
										if (!current.storage.gl_lvfa && type == 'basic') {
											return true;
										}
										if (current.storage.gl_lvfa && type != 'basic') {
											return true;
										}
									})) return false;
							},
							cardSavable: function(card, player) {
								var type = get.type(card);
								if (game.hasPlayer(function(current) {
										if (!current.hasSkill('gl_lvfa')) return false;
										if (!current.storage.gl_lvfa && type == 'basic') {
											return true;
										}
										if (current.storage.gl_lvfa && type != 'basic') {
											return true;
										}
									})) return false;
							},
							cardRespondable: function(card, player) {
								var type = get.type(card);
								if (game.hasPlayer(function(current) {
										if (!current.hasSkill('gl_lvfa')) return false;
										if (!current.storage.gl_lvfa && type == 'basic') {
											return true;
										}
										if (current.storage.gl_lvfa && type != 'basic') {
											return true;
										}
									})) return false;
							},
							cardDiscardable: function(card, player) {
								var type = get.type(card);
								if (game.hasPlayer(function(current) {
										if (!current.hasSkill('gl_lvfa')) return false;
										if (!current.storage.gl_lvfa && type == 'basic') {
											return true;
										}
										if (current.storage.gl_lvfa && type != 'basic') {
											return true;
										}
									})) return false;
							},
						},
					}
				}
			},
			"gl_sihu": {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				direct: true,
				content: function() {
					'step 0'
					player.chooseTarget(get.prompt('gl_sihu'), function(card, player, target) {
						return target != player;
					}).set('ai', function(target) {
						var att = get.attitude(_status.event.player, target);
						return att;
					});
					'step 1'
					if (result.bool) {
						event.current = result.targets[0];
						player.logSkill('gl_sihu', event.current);
						player.line(event.current, 'thunder');
						event.current.draw(player.hp * 2);
					} else event.finish();
					'step 2'
					if (event.current.countCards('he') >= player.hp) {
						var next = event.current.chooseCard(get.prompt('duwu'), player.hp, 'he');
						next.set('ai', function(card) {
							var att = get.attitude(_status.event.player, player);
							if (att > 0) return 0;
							return get.value(card);
						});
						next.filterCard = lib.filter.cardDiscardable;
					}
					'step 3'
					if (result.bool) {
						event.current.useSkill('duwu', result.cards, [player]);
						event.goto(2);
					} else {
						player.gain(event.current.getCards('hej'), event.current, 'giveAuto');
					}
				}
			},
			"gl_yetan": {
				trigger: {
					global: "phaseZhunbeiBegin",
				},
				unique: true,
				direct: true,
				filter: function(event, player) {
					var info = lib.character[event.player.name];
					return event.player != player && info;
				},
				content: function() {
					'step 0'
					if (trigger.player.storage.dualside_over) {
						event.goto(3);
					} else {
						var list = [];
						for (var i in lib.character) {
							if (i.indexOf('gl_') == 0) continue;
							if (i == trigger.player.name) continue;
							list.push(i);
						}
						list = list.randomGets(5);
						var dialog = ui.create.dialog('请选择' + get.translation(trigger.player) + '的背面武将', 'hidden');
						dialog.add([list, 'character']);
						player.chooseButton(dialog);
					}
					'step 1'
					if (result.bool) {
						var info = lib.character[trigger.player.name];
						trigger.player.unmarkSkill('dualside');
						player.logSkill('gl_yetan', trigger.player);
						for (var j = 0; j < info[4].length; j++) {
							if (info[4][j].indexOf('dualside:') == 0) {
								info[4].remove(info[4][j]);
							}
						}
						info[3].add('dualside');
						lib.character[result.links[0]][3].add('dualside');
						info[4].push('dualside:' + result.links[0]);
						trigger.player.addSkill('dualside');
						var next = game.createEvent('dualside_init');
						next.player = trigger.player;
						next.setContent(lib.skill.dualside_init.content);
					} else {
						event.finish();
					}
					'step 2'
					trigger.player.turnOver();
					event.finish();
					'step 3'
					player.chooseBool(get.prompt('gl_yetan', trigger.player));
					'step 4'
					if (result.bool) {
						trigger.player.turnOver();
					}
				},
			},
			"gl_tiaolv": {
				gl_wuzhuang: {
					name: "gl_xiangtingwangguo",
					number: 1,
					suit: 'heart'
				},
				derivation: ['gl_xiangtingwangguo'],
				init: function() {
					if (!game.gl_tiaolv_animation) {
						game.gl_tiaolv_animation = game.gl_cg('image/tiaolv.mp4', 'preload');
						game.gl_tiaolv_animation.addEventListener("ended", function() {
							var event = this.trigger;
							if (!event) return;
							if (event.bool) {
								document.body.removeChild(event.cg);
								ui.backgroundMusic.play();
								game.resume();
							} else {
								event.bool = true;
							}
						});
					}
				},
				unique: true,
				enable: "phaseUse",
				content: function() {
					'step 0'
					ui.backgroundMusic.pause();
					event.cg = ui.create.div('.gl_cg', document.body);
					event.cg.appendChild(game.gl_tiaolv_animation);
					game.gl_tiaolv_animation.trigger = event;
					game.gl_tiaolv_animation.play();
					event.players = game.filterPlayer();
					player.awakenSkill('gl_tiaolv');
					'step 1'
					game.animate.window(1);
					'step 2'
					if (event.players.length) {
						var target = event.players.shift();
						target.classList.remove('turnedover');
						target.classList.remove('linked');
						target.lose(target.getCards('hej'), ui.discardPile)._triggered = null;
						target.directgain(get.cards(4));
						target.changeHp(target.maxHp - target.hp);
						event.redo();
					}
					'step 3'
					game.animate.window(2);
					'step 4'
					if (event.bool) {
						document.body.removeChild(event.cg);
						ui.backgroundMusic.play();
					} else {
						game.pause();
						event.bool = true;
					}
				},
				group: "gl_tiaolv_dying",
				subSkill: {
					dying: {
						trigger: {
							global: "dying",
						},
						log: false,
						content: function() {
							player.useSkill('gl_tiaolv');
						},
						sub: true,
					}
				}
			},
			"gl_yingyong": {
				trigger: {
					global: "damageEnd"
				},
				filter: function(event, player) {
					return player.countCards('he') && event.player.isAlive();
				},
				direct: true,
				content: function() {
					'step 0'
					var next = player.chooseToDiscard([1, Infinity]);
					get.evtprompt(next, get.prompt('gl_yingyong', trigger.player));
					'step 1'
					if (result.bool) {
						trigger.player.recover(result.cards.length);
					}
				}
			},
			"gl_weigong": {
				trigger: {
					player: "useCardToPlayered",
				},
				filter: function(event, player) {
					if (event.getParent(3).name == 'gl_weigong') return false;
					return event.card.name == 'sha';
				},
				logTarget: "target",
				frequent: true,
				content: function() {
					"step 0"
					var targets = game.filterPlayer();
					targets.remove(player);
					targets.sort(lib.sort.seat);
					event.targets = targets;
					"step 1"
					if (event.targets.length) {
						var target = event.targets.shift();
						target.chooseToUse(function(card, player, event) {
							if (get.name(card) != 'sha') return false;
							return lib.filter.filterCard.apply(this, arguments);
						}, '围攻：是否对' + get.translation(trigger.target) + '使用一张杀？').set('complexSelect', true).set('filterTarget', function(card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.contains(_status.event.sourcex)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						}).set('sourcex', trigger.target);
						event.redo();
					}
				}
			},
			"gl_qianya": {
				mod: {
					targetEnabled: function(card, player, target, now) {
						if (player.countCards('h') > target.countCards('h')) {
							return false;
						}
					},
				},
			},
			"gl_gaibian": {
				hookTrigger: {
					block: function(event, player, name, skill) {
						if (skill.indexOf('_') == 0) return false;
						if (!lib.translate[skill] || lib.translate[skill].length == 0) {
							return false;
						}
						if (!lib.translate[skill + '_info'] || lib.translate[skill + '_info'].length == 0) {
							return false;
						}
						game.removeGlobalSkill('gl_gaibian_trigger');
						var global = lib.skill.gl_gaibian_trigger.trigger.global;
						global.add(skill + 'Before');
						game.addGlobalSkill('gl_gaibian_trigger');
						return false;
					},
				},
				inits: function(player) {
					if (!player._hookTrigger) {
						player._hookTrigger = [];
					}
					player._hookTrigger.add('gl_gaibian');
				},
				init: function() {
					for (var i = 0; i < game.players.length; i++) {
						lib.skill.gl_gaibian.inits(game.players[i]);
					}
					if (!lib.element.player.inits) {
						lib.element.player.inits = [];
					}
					lib.element.player.inits.add(lib.skill.gl_gaibian.inits);
				},
				unique: true,
				global: "gl_gaibian_trigger",
				subSkill: {
					trigger: {
						trigger: {
							global: [],
						},
						direct: true,
						filter: function(event, player) {
							return player.hasSkill('gl_gaibian');
						},
						unique: true,
						content: function() {
							'step 0'
							var list = [];
							var skills = [];
							var skills2 = []
							var map = {};
							var info;
							var position;
							var parent = trigger._trigger;
							if (parent.player && parent.player == trigger.player) {
								position = 'player';
							}
							if (parent.source && parent.source == trigger.player) {
								position = 'source';
							}
							if (parent.target && parent.target == trigger.player) {
								position = 'target';
							}
							for (var i in lib.character) {
								skills.addArray(lib.character[i][3]);
							}
							skills.randomSort();
							var name2 = trigger.triggername;
							for (var i = 0; i < skills.length; i++) {
								info = lib.skill[skills[i]];
								if (!info || info.unique || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill) {
									continue;
								}
								list = game.expandSkills([skills[i]]);
								for (var j = 0; j < list.length; j++) {
									info = lib.skill[list[j]];
									if (list[j] == trigger.name) {
										list.splice(j--, 1);
										continue;
									}
									map[list[j]] = skills[i];
									if (!info || !info.trigger || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) {
										list.splice(j--, 1);
										continue;
									}
									var bool = false;
									if (info.trigger[position]) {
										if (info.trigger[position] == name2) {
											bool = true;
										}
										if (Array.isArray(info.trigger[position]) && info.trigger[position].contains(name2)) {
											bool = true;
										}
									}
									if (info.trigger.global) {
										if (info.trigger.global == name2) {
											bool = true;
										}
										if (Array.isArray(info.trigger.global) && info.trigger.global.contains(name2)) {
											bool = true;
										}
									}
									if (!bool) {
										list.splice(j--, 1);
										continue;
									}
									if (info.init || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
										list.splice(j--, 1);
										continue;
									}
									if (info.filter) {
										try {
											var bool = info.filter(trigger._trigger, trigger.player, name2);
											if (!bool) {
												list.splice(j--, 1);
												continue;
											}
										} catch (e) {
											list.splice(j--, 1);
											continue;
										}
									}
								}
								if (list.length) {
									skills2.add(list[Math.floor(list.length * Math.random())]);
									if (skills2.length > 3) break;
								}
							}
							if (skills2.length) {
								event.map = {};
								skills = skills2.randomGets(4);
								list = [];
								for (var i = 0; i < skills.length; i++) {
									event.map[map[skills[i]]] = skills[i];
									list.push(map[skills[i]]);
								}
								list.push('cancel2');
								var next = player.chooseControl(list);
								var str = get.translation(trigger.player);
								str += '即将发动' + get.translation(trigger.name) + '是否进行改编？';
								next.dialog = lib.skill.gl_huimeng.getSkillDialog(list, str);
							}
							'step 1'
							if (result.control != 'cancel2') {
								var link = event.map[result.control];
								player.logSkill('gl_gaibian');
								var info = get.info(link);
								trigger.setContent(info.content);
							}
						}
					}
				}
			},
			"gl_qiuyuan": {
				skillAnimation: true,
				animationColor: "wood",
				trigger: {
					player: "dying",
				},
				derivation: ["gl_huimeng", "gl_qianya"],
				forced: true,
				unique: true,
				juexingji: true,
				content: function() {
					"step 0"
					player.recover(player.maxHp - player.hp);
					var skill = player.getSkills();
					for (var i = 0; i < skill.length; i++) {
						var info = lib.skill[skill[i]];
						if (info.debuff) player.removeSkill(skill[i]);
					}
					player.turnOver(false);
					player.link(false);
					player.discard(player.getCards('j'));
					player.addSkill('gl_huimeng');
					player.addSkill('gl_qianya');
					"step 1"
					player.awakenSkill('gl_qiuyuan');
					player.storage.gl_qiuyuan = true;
				},
			},
			"gl_xvanlv": {
				enable: "phaseUse",
				usable: 1,
				unique: true,
				chooseButton: {
					dialog: function(event, player) {
						var dialog = ui.create.dialog('旋律：请选择要演奏的卡包', 'hidden');
						dialog.forcebutton = true;
						for (var i in lib.cardPack) {
							var node = ui.create.div('.popup.text', dialog.content);
							dialog.buttons.add(node);
							var click = lib.config.touchscreen ? 'touchend' : 'click';
							node.addEventListener(click, ui.click.button);
							node.style.width = 'calc(100% - 30px)';
							node.style.position = 'unset';
							node.link = lib.cardPack[i];
							node.innerHTML = get.translation(i + '_card_config');
						}
						return dialog;
					},
					filter: function(event, player) {
						if (player.storage.youlong2.contains(name) || player.countDisabled() >= 5) return false;
						if (player.hasSkill('youlong_' + (player.storage.youlong || false))) return false;
						var type = player.storage.youlong ? 'basic' : 'trick';
						for (var name of lib.inpile) {
							if (player.storage.youlong2.contains(name)) continue;
							if (get.type(name) != type) continue;
							if (event.filterCard({
									name: name,
									isCard: true
								}, player, event)) return true;
						}
						return false;
					},
					backup: function(links, player) {
						return {
							pack: links[0],
							delay: false,
							content: lib.skill.gl_xvanlv.contentx,
						}
					},
				},
				contentx: function() {
					'step 0'
					var list = [];
					var pack = lib.skill.gl_xvanlv_backup.pack;
					for (var i = 0; i < pack.length; i++) {
						var type = get.type(pack[i]);
						list.push([get.translation(type), '', pack[i]]);
					}
					var next = player.chooseButton(['旋律：请选择使用顺序', [list, 'vcard']]);
					next.forced = true;
					next.selectButton = [1, Infinity];
					next.set('filterButton', function(button, player) {
						var event = _status.event.getParent(3);
						return event.filterCard(button, player, event);
					});
					'step 1'
					if (result.bool) {
						event.cards = [];
						for (var i = 0; i < result.links.length; i++) {
							event.cards.push(result.links[i][2]);
						}
					} else {
						event.finish();
					}
					'step 2'
					if (event.cards.length) {
						var card = event.cards.shift();
						if (player.hasUseTarget(card)) {
							player.chooseUseTarget(game.createCard(card), true, false);
						}
						event.redo();
					}
				}
			},
			"gl_jvguang": {
				global: "gl_jvguang_disable",
				mod: {
					targetEnabled: function(card, player, target, now) {
						if (target != player) return true;
					},
				},
				subSkill: {
					disable: {
						mod: {
							targetEnabled: function(card, player, target) {
								if (player.hasSkill('gl_jvguang')) return;
								if (target.hasSkill('gl_jvguang')) return;
								var bool = game.hasPlayer(function(current) {
									return current.hasSkill('gl_jvguang');
								});
								if (bool) return false;
							},
						},
						sub: true,
					}
				}
			},
			"gl_kaiyan": {
				enable: "phaseUse",
				usable: 1,
				filterTarget: true,
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content: function() {
					'step 0'
					player.chooseCount("开宴：请宣言一个数字令场上所有角色回复等量的体力值", [1, 5], 5, function(event, player) {
						return 5;
					});
					'step 1'
					event.num = result.num;
					event.current = player;
					event.currented = [];
					'step 2'
					event.currented.push(event.current);
					event.current.animate('target');
					event.current.recover(event.num);
					'step 3'
					event.current = event.current.next;
					if (event.current != player && !event.currented.contains(event.current)) {
						game.delay(0.5);
						event.goto(2);
					}
				},
				ai: {
					order: 1,
					result: {
						target: function(player, target) {
							if (target.hp == 1) return 5;
							return 2;
						},
					},
				},
			},
			"gl_fengluan": {
				trigger: {
					player: "changeHp",
				},
				filter: function(event, player) {
					return event.num != 0;
				},
				direct: true,
				content: function() {
					'step 0'
					event.num = Math.abs(trigger.num);
					'step 1'
					player.chooseTarget(get.prompt(event.name), function(card, player, target) {
						return target != player;
					}).set('ai', function(target) {
						if (get.attitude(player, target) > 0) {
							return 1;
						}
						return -2;
					});
					'step 2'
					if (result.bool) {
						player.logSkill(event.name, result.targets);
						event.target = result.targets[0];
						player.chooseCount("疯乱：请选择要令" + get.translation(event.target) + "摸的牌数", [1, 5], 1, function(event, player) {
							if (get.attitude(player, event.target) > 0) {
								return true;
							}
							return false;
						});
					} else {
						event.finish();
					}
					'step 3'
					event.target.draw(result.num);
					event.target.goMad('phaseAfter');
					event.num--;
					if (event.num > 0) {
						event.goto(1);
					}
				}
			},
			"gl_meiyu": {
				trigger: {
					global: "phaseZhunbeiBegin"
				},
				check: function(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				filter: function(event, player) {
					if (event.player.hasSkill('reyingzi')) return false;
					if (event.player.countCards('h') == player.countCards('h')) return true;
					if (event.player.hp == player.hp) return true;
					return false;
				},
				content: function() {
					player.loseHp();
					trigger.player.addSkill('reyingzi');
				}
			},
			"gl_menghuan": {
				enable: "phaseUse",
				usable: 5,
				filterTarget: function(card, player, target) {
					var list = target.getSkills(false, false);
					for (var i = 0; i < list.length; i++) {
						var str = lib.translate[list[i] + '_info'];
						if (str && str.indexOf('锁定技，') != -1) {
							return true;
						}
					}
					return false;
				},
				unique: true,
				skillsList: function() {
					var skills = [];
					var info;
					_status.gl_menghuan_skills = [];
					for (var i in lib.character) {
						skills.addArray(lib.character[i][3]);
					}
					for (var i = 0; i < skills.length; i++) {
						info = lib.translate[skills[i] + '_info'];
						if (info && info.indexOf('锁定技，') != -1) {
							_status.gl_menghuan_skills.push(skills[i]);
						}
					}
				},
				content: function() {
					'step 0'
					if (!_status.gl_menghuan_skills) {
						lib.skill.gl_menghuan.skillsList();
					}
					var list = _status.gl_menghuan_skills.randomGets(10);
					var dialog = ui.create.dialog('请选择用于替换的技能', 'hidden');
					dialog.forcebutton = true;
					for (var i = 0; i < list.length; i++) {
						var node = ui.create.caption('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[list[i] + '_info'] + '</div></div>', dialog.content);
						dialog.buttons.add(node);
						var click = lib.config.touchscreen ? 'touchend' : 'click';
						node.addEventListener(click, ui.click.button);
						node.style.width = 'calc(100% - 30px)';
						node.style.position = 'unset';
						node.link = list[i];
					}
					player.chooseButton(dialog, true);
					'step 1'
					if (result.bool) {
						event.link = result.links[0];
						var skills = [];
						var list = target.getSkills(false, false);
						for (var i = 0; i < list.length; i++) {
							var str = lib.translate[list[i] + '_info'];
							if (str && str.indexOf('锁定技，') != -1) {
								skills.push(list[i]);
							}
						}
						if (skills.length == 1) {
							event._result = {
								bool: true,
								control: skills[0],
							}
						} else {
							player.chooseControl(skills).set('prompt', '请选择要替换的技能');
						}
					} else {
						event.finish();
					}
					'step 2'
					target.addSkill(event.link);
					target.removeSkill(result.control);
				},
			},
			"gl_yongye": {
				hookTrigger: {
					block: function(event, player, name, skill) {
						if (!get.is.locked(skill, player)) return true;
					},
				},
				inits: function(player) {
					if (!player._hookTrigger) {
						player._hookTrigger = [];
					}
					player._hookTrigger.add('gl_yongye');
				},
				init: function() {
					for (var i = 0; i < game.players.length; i++) {
						lib.skill.gl_yongye.inits(game.players[i]);
					}
					if (!lib.element.player.inits) {
						lib.element.player.inits = [];
					}
					lib.element.player.inits.add(lib.skill.gl_yongye.inits);
				},
				unique: true,
				forced: true,
			},
			"gl_midu": {
				trigger: {
					global: "gainBefore",
				},
				filter: function(event, player) {
					return event.getParent(2).name != 'phaseDraw';
				},
				forced: true,
				content: function() {
					trigger.cancel();
					trigger.player.loseHp();
				},
				group: "gl_midu_draw",
				subSkill: {
					draw: {
						trigger: {
							player: "phaseDrawBegin2",
						},
						forced: true,
						filter: function(event, player) {
							return !event.numFixed;
						},
						content: function() {
							trigger.num += 2;
						},
						sub: true,
					},
				},
			},
			"gl_zhuixun": {
				trigger: {
					global: "useCard",
				},
				filter: function(event, player) {
					if (event.card.name) return false;
					return event.player.getHistory('useCard', function(evt) {
						return evt.card && evt.card.name == event.card.name
					});
				},
				forced: true,
				content: function() {
					trigger.cancel();
					player.vampire(trigger.player);
				},
				group: "gl_zhuixun_use",
				subSkill: {
					use: {
						trigger: {
							global: "phaseZhunbeiBegin",
						},
						filter: function(event, player) {
							return event.player != player;
						},
						forced: true,
						content: function() {
							player.chooseUseTarget('wanjian', true, false);
						},
						sub: true,
					},
				},
			},
			"gl_sangluan": {
				trigger: {
					global: 'roundStart',
				},
				forced: true,
				filter: function(event, player) {
					return game.players.length > 1;
				},
				content: function() {
					'step 0'
					player.chooseTarget(get.prompt2(event.name), function(card, player, target) {
						return player != target && !target._trueMe;
					}, true);
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						target._trueMe = player;
						game.addGlobalSkill('autoswap');
						if (target == game.me) {
							game.notMe = true;
							if (!_status.auto) ui.click.auto();
						}
						target.addTempSkill('gl_sangluan_control', 'roundStart');
					}

				},
				subSkill: {
					control: {
						onremove: function(player) {
							if (player == game.me) {
								if (!game.notMe) game.swapPlayerAuto(player._trueMe)
								else delete game.notMe;
								if (_status.auto) ui.click.auto();
							}
							delete player._trueMe;
						},
					},
				}
			},
			"gl_weidao": {
				trigger: {
					global: "dying"
				},
				filter: function(event, player) {
					var skills = event.player.getSkills(false, false);
					var list = [];
					for (var i = 0; i < skills.length; i++) {
						var name = skills[i];
						if (!lib.translate[name + '_info'] || !lib.translate[name]) continue;
						if (lib.translate[name + '_info'].length == 0) continue;
						if (lib.translate[name].length == 0) continue;
						list.add(name);
					}
					return list.length;
				},
				direct: true,
				content: function() {
					'step 0'
					var skills = trigger.player.getSkills(false, false);
					var list = [];
					for (var i = 0; i < skills.length; i++) {
						var name = skills[i];
						if (!lib.translate[name + '_info'] || !lib.translate[name]) continue;
						if (lib.translate[name + '_info'].length == 0) continue;
						if (lib.translate[name].length == 0) continue;
						list.add(name);
					}
					if (list.length) {
						var dialog = ui.create.dialog(get.prompt(event.name), 'hidden');
						dialog.forcebutton = true;
						for (var i = 0; i < list.length; i++) {
							var node = ui.create.caption('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[list[i] + '_info'] + '</div></div>', dialog.content);
							dialog.buttons.add(node);
							var click = lib.config.touchscreen ? 'touchend' : 'click';
							node.addEventListener(click, ui.click.button);
							node.style.width = 'calc(100% - 30px)';
							node.style.position = 'unset';
							node.link = list[i];
						}
						player.chooseButton(dialog, [1, trigger.player.maxHp - trigger.player.hp]);
					}
					'step 1'
					if (result.bool) {
						player.logSkill(event.name, trigger.player);
						trigger.player.removeSkill(result.links);
						trigger.player.recover(result.links.length);
						if (result.links.length >= 3 && trigger.source) {
							trigger.source.damage('fire', 3, trigger.player);
						}
					}
				}
			},
			"gl_jiacheng": {
				trigger: {
					global: "phaseEnd"
				},
				direct: true,
				filter: function(event, player) {
					return ui.discardPile.childNodes.length;
				},
				content: function() {
					'step 0'
					var lose = [];
					var cards1 = [];
					var cards2 = [];
					var history = trigger.player.getHistory('lose', function(evt) {
						lose.addArray(evt.cards);
					});
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						if (lose.contains(ui.discardPile.childNodes[i])) {
							cards1.add(ui.discardPile.childNodes[i])
						} else {
							cards2.add(ui.discardPile.childNodes[i])
						}
					}
					event.cards = cards1;
					var dialog = ui.create.dialog('hidden');
					dialog.add('勇敢的少年啊，你掉的是哪张牌呢？');
					if (cards1.length) {
						dialog.add('你本回合内失去的牌');
						dialog.add(cards1);
					}
					if (cards2.length) {
						dialog.add('非你本回合失去的牌');
						dialog.add(cards2);
					}
					var chooseButton = trigger.player.chooseButton([1, 3], dialog);
					chooseButton.set('cards', cards1);
					chooseButton.set('ai', function(button) {
						var player = _status.event.player;
						var cards = _status.event.cards;
						var num = get.value(button.link, player, 'raw');
						if (cards.contains(button.link)) return num;
						return num + get.damageEffect(player, player);
					});
					'step 1'
					if (result.bool) {
						trigger.player.gain(result.links, 'gain2', 'log');
						trigger.player.logSkill(event.name);
						var num = 0;
						for (var i = 0; i < result.links.length; i++) {
							if (!event.cards.contains(result.links[i])) num++;
						}
						if (num > 0) {
							trigger.player.damage(num);
						}
					}
				},
			},
			"gl_xinsheng_yisuo": {
				trigger: {
					player: "damageEnd"
				},
				filter: function(event) {
					return event.num > 0;
				},
				forced: true,
				content: function() {
					player.draw(trigger.num);
					player.gainMaxHp(trigger.num);
				}
			},
			"gl_yanling": {
				unique: true,
				enable: 'chooseToUse',
				filter: function(event, player) {
					return player.countCards('hs', {
						type: 'skill'
					}) > 0;
				},
				hiddenCard: function(player, name) {
					if (get.type2(name) == 'trick') return player.countCards('hs', {
						type: 'skill'
					}) > 0;
				},
				chooseButton: {
					dialog: function(event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (get.type2(name) == 'trick') list.push(['锦囊', '', name]);
						}
						return ui.create.dialog('言灵', [list, 'vcard']);
					},
					filter: function(button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player, _status.event.getParent());
					},
					check: function(button) {
						var player = _status.event.player;
						if (player.countCards('hs', button.link[2]) > 0) return 0;
						var effect = player.getUseValue(button.link[2]);
						if (effect > 0) return effect;
						return 0;
					},
					backup: function(links, player) {
						return {
							filterCard: function(card, player) {
								return get.type(card) == 'skill';
							},
							selectCard: 1,
							popname: true,
							check: function(card) {
								return 11 - get.value(card);
							},
							position: 'hs',
							viewAs: {
								name: links[0][2]
							},
						}
					},
					prompt: function(links, player) {
						return '将1张技能牌当做' + get.translation(links[0][2]) + '使用';
					}
				},
				ai: {
					order: 11,
					result: {
						player: 1
					},
					threaten: 1.9,
				},
				group: "gl_yanling_use",
				subSkill: {
					use: {
						trigger: {
							player: 'useCard'
						},
						frequent: true,
						filter: function(event) {
							return get.type2(event.card) == 'trick' && event.card.isCard;
						},
						content: function() {
							if (!_status.gl_yanling_skills) {
								_status.gl_yanling_skills = get.gainableSkills();
							}
							var skill = _status.gl_yanling_skills.randomGet();
							var name = skill + '_glskill';
							if (!lib.card[name]) {
								lib.card[name] = get.copy(lib.skill.gl_juedao.card);
								lib.card[name].skill = skill;
								lib.translate[name] = lib.translate[skill];
								var str = '出牌阶段，对一名角色使用。其失去1点体力上限并获得技能【';
								str += lib.translate[skill] + '】（';
								str += lib.translate[skill + '_info'] + '）。'
								lib.translate[name + '_info'] = str;
							}
							player.gain(game.createCard(name), 'gain2');
						}
					}
				}
			},
			"gl_rumeng": {
				trigger: {
					player: ['turnOverBefore', 'enterGame'],
					global: 'phaseBefore',
				},
				forced: true,
				filter: function(event, player) {
					if (event.name == 'turnOver') return player.isTurnedOver();
					return (event.name != 'phase' || game.phaseNumber == 0) && !player.isTurnedOver();
				},
				content: function() {
					if (trigger.name == 'turnOver') {
						trigger.cancel();
						player.addSkill('gl_rumeng_phase');
					} else {
						player.turnOver(true);
					}
				},
				ai: {
					noturn: true,
				},
				subSkill: {
					phase: {
						trigger: {
							global: "phaseAfter"
						},
						forced: true,
						charlotte: true,
						content: function() {
							player.removeSkill(event.name);
							var next = game.createEvent('gl_rumeng_phase', false);
							next.player = player;
							next.setContent('phase');
						},
					}
				}
			},
			"gl_zhidou": {
				trigger: {
					global: "phaseZhunbeiBegin"
				},
				logTarget: "player",
				filter: function(event, player) {
					return player.canCompare(event.player);
				},
				content: function() {
					'step 0'
					event.win = {};
					event.win[player.playerid] = 0;
					event.win[trigger.player.playerid] = 0;
					'step 1'
					if (player.canCompare(trigger.player)) {
						player.chooseToCompare(trigger.player).preserve = function(bool) {
							if (bool.winner) event.win[bool.winner.playerid]++;
						};
						event.redo();
					}
					'step 2'
					if (event.win[player.playerid] == event.win[trigger.player.playerid]) return;
					var winner, loser;
					if (event.win[player.playerid] < event.win[trigger.player.playerid]) {
						winner = trigger.player;
						loser = player;
					}
					if (event.win[player.playerid] > event.win[trigger.player.playerid]) {
						winner = player;
						loser = trigger.player;
					}
					winner.draw(6 - winner.countCards('h'));
					loser.turnOver();
				}
			},
			"gl_yanjie": {
				trigger: {
					player: ['phaseJudgeBegin', 'phaseDrawBegin', 'phaseUseBegin', 'phaseDiscardBegin'],
				},
				direct: true,
				content: function() {
					'step 0'
					player.chooseTarget(get.prompt2(event.name)).set('ai', function(target) {
						var nh = target.countCards('h');
						if (nh == target.hp - 1 || nh == target.hp + 1) {
							return 2;
						} else {
							return -1;
						}
					});
					'step 1'
					if (result.bool) {
						player.logSkill(event.name, result.targets);
						event.target = result.targets[0];
						delete event._result.bool;
						player.discardPlayerCard('h', '弃置其1张手牌，或取消对其造成1点伤害。', event.target).ai = function(button) {
							var player = _status.event.player;
							var target = _status.event.target;
							var att = get.attitude(player, target);
							var nh = target.countCards('h');
							var num = 0;
							if (nh == target.hp - 1) {
								num++;
							}
							if (nh == target.hp + 1) {
								num--;
							}
							if (att > 0) {
								return -num;
							}
							return num;
						};
					} else {
						event.finish();
					}
					'step 2'
					if (!result.bool) {
						target.damage();
					}
					'step 3'
					if (target.hp == target.countCards('h')) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (!target.hasUseTarget(name)) continue;
							var type = get.type(lib.inpile[i]);
							if (name == 'sha') {
								list.push(['基本', '', 'sha']);
								for (var j of lib.inpile_nature) {
									list.push([type, '', 'sha', j]);
								};
							} else if (type == 'trick' || type == 'basic') {
								list.push([type, '', name]);
							}
						}
						var dialog = ui.create.dialog('严诫', [list, 'vcard'], 'hidden');
						target.chooseButton(dialog).ai = function(button) {
							var player = _status.event.player;
							if (player.countCards('hs', button.link[2]) > 0) return 0;
							if (button.link[2] == 'wugu') return;
							var effect = player.getUseValue(button.link[2]);
							if (effect > 0) return effect;
							return 0;
						};
					} else {
						event.finish();
					}
					'step 4'
					if (result.bool) {
						var card = {
							name: result.links[0][2],
							nature: result.links[0][3]
						}
						target.chooseUseTarget(card, true, false);
					}
				}
			},
			"gl_yujiao": {
				trigger: {
					player: 'damageEnd',
					source: 'damageSource'
				},
				frequent: true,
				content: function() {
					if (!_status.gl_yujiao_skills) {
						_status.gl_yujiao_skills = get.gainableSkills(function(info) {
							if (!info.content) return false;
							if (!info.enable) return false;
							if (info.enable == "phaseUse") return true;
							if (Array.isArray(info.enable) && info.enable.contains("phaseUse")) return true;
							return false;
						});
					}
					var skill = _status.gl_yujiao_skills.randomGet();
					player.addTempSkill(skill, {
						player: 'phaseUseAfter'
					});
				},
				group: ["gl_yujiao_skill", "gl_yujiao_content"],
				subSkill: {
					skill: {
						trigger: {
							player: 'useCard',
						},
						direct: true,
						filter: function(event, player) {
							var info = get.info(event.card);
							var parent = event.parent;
							while (!parent.card || !parent.card.gl_yujiao) {
								parent = parent.parent;
								if (!parent) return true;
							}
							return false;
						},
						content: function() {
							'step 0'
							var skills = player.getSkills(false, false);
							var list = [];
							for (var i of skills) {
								var info = get.info(i);
								if (!info.content) continue;
								if (!info.enable) continue;
								if (info.enable != "phaseUse" && (!Array.isArray(info.enable) || !info.enable.contains("phaseUse"))) continue;
								list.push(i);
							}
							if (list.length) {
								var dialog = ui.create.dialog(get.prompt(event.name), 'hidden');
								dialog.forcebutton = true;
								for (var i = 0; i < list.length; i++) {
									var node = ui.create.caption('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(list[i]) + '】</div><div>' + lib.translate[list[i] + '_info'] + '</div></div>', dialog.content);
									dialog.buttons.add(node);
									var click = lib.config.touchscreen ? 'touchend' : 'click';
									node.addEventListener(click, ui.click.button);
									node.style.width = 'calc(100% - 30px)';
									node.style.position = 'unset';
									node.link = list[i];
								}
								player.chooseButton(dialog, get.prompt(event.name));
							}
							'step 1'
							if (result.bool) {
								player.logSkill(event.name);
								trigger.card.gl_yujiao = result.links[0];
							}
						},
						sub: true,
					},
					content: {
						trigger: {
							global: "useCardToBefore"
						},
						filter: function(event, player) {
							return event.card.gl_yujiao;
						},
						priority: 50,
						silent: true,
						content: function() {
							var name = lib.skill[trigger.card.gl_yujiao].content;
							trigger.content = lib.skill.gl_huimeng.parse(name);
						},
						sub: true,
						forced: true,
						popup: false,
					}
				}
			},
			"gl_aige": {
				trigger: {
					player: ["changeHp", "loseAfter"],
				},
				filter: function(event, player) {
					if (event.name == 'changeHp') return event.num < 0;
					return event.type == 'discard';
				},
				direct: true,
				content: function() {
					var cards = get.cards(10);
					player.$throw(cards, 1000);
					game.cardsDiscard(cards);
					game.log(player, '将', cards, '置入弃牌堆');
					player.addTempSkill('gl_aige_phase');
					player.storage.gl_aige_phase++;
					if (player.hp <= 1) {
						var card = get.cardPile('tao');
						if (card) {
							player.chooseUseTarget(card, false, true);
						}
					}
				},
				subSkill: {
					phase: {
						trigger: {
							global: 'phaseEnd'
						},
						init: function(player, skill) {
							if (!player.storage[skill]) player.storage[skill] = 0;
						},
						forced: true,
						charlotte: true,
						sub: true,
						content: function() {
							'step 0'
							if (player.storage.gl_aige_phase) {
								var list = ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'cancel2'];
								player.chooseControl(list).set('prompt', '哀歌：请选择要执行的主要阶段</br>（剩余：' + player.storage.gl_aige_phase + '次）');
							} else {
								event.finish();
							}
							'step 1'
							if (result.control != 'cancel2') {
								player[result.control]();
								player.storage.gl_aige_phase--;
								event.goto(0);
							}
						}
					}
				}
			},
			"gl_liezhua": {
				trigger: {
					source: 'damageSource',
					global: 'loseMaxHpAfter',
				},
				direct: true,
				filter: function(event, player) {
					return event.player.countCards('he');
				},
				priority: 5,
				content: function() {
					'step 0'
					event.num = trigger.player.hp;
					'step 1'
					if (trigger.player.countCards('he')) {
						player.discardPlayerCard('he', trigger.player, '裂爪：是否弃置' + get.translation(trigger.player) + '的牌？');
					} else {
						trigger.player.loseHp();
						var card = get.cardPile('wuzhong');
						if (card) {
							trigger.player.chooseUseTarget(card, false, true);
						}
						event.redo();
					}
					'step 2'
					if (result.bool) {
						event.num--;
						if (event.num > 0) event.goto(1);
					}
				},
			},
			"gl_jiluan": {
				trigger: {
					global: ['phaseJudgeBefore', 'phaseDrawBefore', 'phaseUseBefore', 'phaseDiscardBefore']
				},
				forced: true,
				priority: 100,
				popup: false,
				firstDo: true,
				content: function() {
					trigger.setContent(lib.skill.gl_jiluan[trigger.name]);
				},
				phaseJudge: function() {
					player.turnOver();
				},
				phaseDraw: function() {
					'step 0'
					var cards = Array.from(ui.discardPile.childNodes);
					if (cards && cards.length) {
						player.chooseButton(['选择要获得的牌', cards], [1, 2]).set('ai', function(button) {
							return get.value(button.link, _status.event.player, 'raw');
						});
					} else {
						event.finish();
					}
					'step 1'
					if (result.bool && result.links && result.links.length) {
						player.gain(result.links, 'gain2', 'log');
					}
				},
				phaseUse: function() {
					"step 0";
					var next = player.chooseToUse();
					if (!lib.config.show_phaseuse_prompt) {
						next.set('prompt', false);
					}
					"step 1"
					if (result.bool && !event.skipped) {
						event.goto(0);
						var stat = player.getStat();
						for (var i in stat.card) {
							var bool = false;
							var info = lib.card[i];
							if (!info) continue;
							if (info.updateUsable == 'phaseUse') stat.card[i] = 0;
						}
					}
					game.broadcastAll(function() {
						if (ui.tempnowuxie) {
							ui.tempnowuxie.close();
							delete ui.tempnowuxie;
						}
					});
					"step 2"
					var stat = player.getStat();
					for (var i in stat.skill) {
						var bool = false;
						var info = lib.skill[i];
						if (!info) continue;
						if (info.enable != undefined) {
							if (typeof info.enable == 'string' && info.enable == 'phaseUse') bool = true;
							else if (typeof info.enable == 'object' && info.enable.contains('phaseUse')) bool = true;
						}
						if (bool) stat.skill[i] = 0;
					}
				},
				phaseDiscard: function() {
					"step 0"
					if (lib.config.show_phase_prompt) {
						player.popup('弃牌阶段');
					}
					event.trigger('phaseDiscard');
					"step 1"
					player.chooseToDiscard(true);
					"step 2"
					event.cards = result.cards;
				},
			},
			"gl_jueyi": {
				trigger: {
					global: ['recoverBegin', 'damageBegin', 'gainBegin', 'useCard1']
				},
				forced: true,
				filter: function(event, player) {
					if (event.name == 'useCard') {
						if (event.cards) {
							for (var i of event.cards) {
								if (i.name == event.card.name) return false;
							}
						}
						return true;
					}
					if (event.name == 'damage' && (!event.source || !event.source.isAlive())) return false;
					var parent = event.getParent();
					if (parent.name && parent.name.indexOf('phase') == 0) return false;
					if (event.name == 'gain') {
						if (parent.card && parent.card.name && lib.card[parent.card.name]) return false;
						parent = parent.getParent();
					}
					return !parent.card || !parent.card.name || !lib.card[parent.card.name];
				},
				content: function() {
					if (trigger.name == 'damage') {
						trigger.source.loseMaxHp();
					} else {
						trigger.player.loseMaxHp();
					}
					trigger.cancel();
				},
			}
		},
		translate: {
			"gl_shashibiya": "莎士比亚",
			"gl_ludeweixi": "路德维希",
			"gl_yagebu": "雅各布",
			"gl_shanluzuode": "山鲁佐德",
			"gl_weilian": "威廉",
			"gl_kaluoer": "刘易斯",
			"gl_duoluoxiya": "多萝西娅",
			"gl_xialuote": "夏洛特",
			"gl_yisuo": "伊索",
			"gl_xiaer": "夏尔",
			"gl_emama": "鹅妈妈",
			"gl_antusheng": "安徒生",
			"gl_moligan": "莫里甘",
			"gl_leina": "蕾娜",
			"gl_puluomixiusi": "普罗米修斯",
			"gl_dafenqi": "达•芬奇",
			"gl_wangdefa": "奥斯卡",
			"gl_shuiguai": "尼斯湖水怪",
			"gl_shuiguai_ab": "珂珑公主",
			"gl_huimeng": "绘梦",
			"gl_huimeng_info": "你的出牌阶段开始时，你可以获得一项技能直到你的下个回合开始为止，出牌阶段，你可以将那项技能与你的【天炎】、【毒刃】进行融合。",
			"gl_tianyan": "天炎",
			"gl_tianyan_info": "出牌阶段限一次，你可以弃置1张牌并对1名角色造成1点火焰伤害。",
			"gl_duren": "毒刃",
			"gl_duren_info": "当你使用【杀】指定目标后，你可以令对方获得一张【毒】（此技能结算过程中不能再次发动）；锁定技，你使用【杀】没有次数限制。",
			"gl_huanyu": "幻雨",
			"gl_huanyu_info": "锁定技，结束阶段或游戏开始时，你摸X张牌；准备阶段，你需弃置X张牌。（X为场上所有角色体力值的总和）",
			"gl_zhenglun": "整论",
			"gl_zhenglun_info": "出牌阶段限一次，你可以从武将牌堆将X张牌作为象征装备（点击描述蓝字可查看详情）加入手牌。（X为场上角色数）",
			"gl_anxian": "安闲",
			"gl_anxian_info": "当你受到伤害后，你可以摸2张牌并终止所有结算，随后结束当前回合。",
			"gl_jigong": "急攻",
			"gl_jigong_info": "出牌阶段限X次，你可以弃置1张手牌并对1名其他角色造成1点伤害。（X为你本回合使用过的牌数）",
			"gl_huihu": "回护",
			"gl_huihu_info": "其他角色受到伤害后，你可以将1张装备牌置入其的装备区内，那之后伤害来源需将手牌调整至X（X为那名角色装备区内牌的数量）",
			"gl_sancai": "散财",
			"gl_sancai_info": "出牌阶段限一次，你可以将所有手牌交给1名其他角色并摸等量的牌。",
			"gl_lvfa": "律法",
			"gl_lvfa_info": "转换技，你的回合开始前，你可以解除自身所有控制效果；锁定技，全场所有角色不能使用、打出或弃置，阴：基本牌。阳：非基本牌。",
			"gl_sihu": "饲虎",
			"gl_sihu_info": "准备阶段，你可以令1名其他角色摸2X张牌，那之后其可以对你发动任意次【黩武】，随后你获得其区域内所有牌。（X为你当前体力值）",
			"gl_yetan": "夜谈",
			"gl_yetan_info": "其他角色准备阶段，你可以令其变为双面武将（已是双面武将则改为修改其背面的武将），那之后其翻面。",
			"gl_tiaolv": "调律",
			"gl_tiaolv_info": "武装技，限定技，出牌阶段或当有角色濒死时，你可以令场上所有角色重置武将牌并弃置区域内所有牌，那之后摸4张牌并将体力值回复至体力上限。",
			"gl_xvanlv": "旋律",
			"gl_xvanlv_info": "出牌阶段限一次，你可以选择1个卡包，随后以任意顺序使用其中的任意张卡。",
			"gl_xvanlv_backup": "旋律",
			"gl_qiuyuan": "求援",
			"gl_qiuyuan_info": "觉醒技，当你陷入濒死状态时，你回复所有体力并解除所有控制效果，随后获得技能“谦雅”和“绘梦”。",
			"gl_jvguang": "聚光",
			"gl_jvguang_info": "锁定技，所有其他角色的牌聚焦你为唯一目标。",
			"gl_qianya": "谦雅",
			"gl_qianya_info": "锁定技，手牌数大于你的角色，不能使用牌指定你为目标",
			"gl_weigong": "围攻",
			"gl_weigong_info": "当你使用【杀】指定目标后，其他角色也可以对该目标使用1张【杀】。（不会触发此技能）",
			"gl_yingyong": "英勇",
			"gl_yingyong_info": "当有角色受到伤害后，你可以弃置任意张牌并令其回复等量的体力。",
			"gl_gaibian": "改编",
			"gl_gaibian_info": "当有角色发动除此以外的触发类技能时，你可以将那个技能的效果替换为同时机的其他合法技能。",
			"gl_kaiyan": "开宴",
			"gl_kaiyan_info": "出牌阶段限一次，你可以宣言一个数字，令全场所有角色依次回复X点体力。（X为你宣言的数字且最大为5）",
			"gl_fengluan": "疯乱",
			"gl_fengluan_info": "当你的体力变化1点时，你可以选择1名其他角色并宣言一个数字，令其摸X张牌并陷入混乱状态直至回合结束。（X为你宣言的数字且最大为5）",
			"gl_meiyu": "美誉",
			"gl_meiyu_info": "当有角色准备阶段开始时，若其体力值或手牌与你相同，你可以失去1点体力并令其获得技能【英姿】",
			"gl_menghuan": "梦幻",
			"gl_menghuan_info": "出牌阶段限5次，你可以替换1名角色的1项锁定技。",
			"gl_midu": "蜜毒",
			"gl_midu_info": "锁定技，当有角色即将于摸牌阶段外获得牌时，取消之且其失去1点体力；锁定技，摸牌阶段，你多摸2张牌。",
			"gl_zhuixun": "追寻",
			"gl_zhuixun_info": "锁定技，当有角色使用牌时，若其于此回合内使用过相同牌名的牌，则那张牌无效且你吸取其的1点体力值；其他角色的准备阶段开始时，你视为使用一张【万箭齐发】。",
			"gl_sangluan": "丧乱",
			"gl_sangluan_info": "锁定技，一轮游戏开始时，你需获得场上1名其他角色的控制权直至下轮游戏开始为止。",
			"gl_yongye": "永夜",
			"gl_yongye_info": "锁定技，所有角色的非锁定技失效。",
			"gl_weidao": "卫道",
			"gl_weidao_info": "当有角色濒死时，你可以移除其任意项技能，令其回复等量的体力，若你移除的技能数量不小于3，则其再额外对伤害来源造成3点火焰伤害。",
			"gl_jiacheng": "嘉惩",
			"gl_jiacheng_info": "当有角色的回合结束时，其可以选择弃牌堆中至多3张牌获得之，若其选择了不为其本回合内失去的牌，其受到那个数量的伤害。",
			"gl_xinsheng_yisuo": "新生",
			"gl_xinsheng_yisuo_info": "锁定技，当你受到1点伤害后，你摸1张牌并增加1点体力上限。",
			"gl_yanling": "言灵",
			"gl_yanling_info": "当你使用非转换的锦囊锦囊牌时，你获得1张技能牌；你可以将1张技能牌当任意锦囊牌使用。",
			"gl_rumeng": "如梦",
			"gl_rumeng_info": "锁定技，你的武将牌始终背面朝上；你的翻面效果改为于1名角色下个回合结束后执行一个额外的准备阶段、判定结果、摸牌阶段、出牌阶段、弃牌阶段与结束阶段。",
			"gl_zhidou": "智斗",
			"gl_zhidou_info": "其他角色的准备阶段开始时，你可以与其进行拼点直至你们无法拼点为止。那之后，赢的次数较多的角色将手牌补至6张；输的次数较多的角色将武将牌翻面。",
			"gl_yanjie": "严诫",
			"gl_yanjie_info": "你的主要阶段开始前，你可以对1名角色造成1点伤害或弃置其1张手牌，那之后若其的手牌数与体力值相等，其可以视为使用任意1张基本牌或普通锦囊牌。",
			"gl_yujiao": "寓教",
			"gl_yujiao_info": "当你使用牌时，你可以令此牌的效果变为与你的一项主动技能相同；当你造成或受到伤害后，你可以获得一项主动技能直至你的下个出牌阶段结束时。",
			"gl_tiaoxin": "挑衅",
			"gl_tiaoxin_info": "武装技，出牌阶段限两次，你可以指定一名攻击范围内包含你的角色，该角色需对你使用一张【杀】，否则你弃置其一张牌。",
			"gl_kanpo": "看破",
			"gl_kanpo_info": "武装技，你可以将你的任意一张黑色手牌当做【无懈可击】使用。",
			"gl_dangxian": "当先",
			"gl_dangxian_info": "阵法技，一轮游戏开始时，你可以令至多4名角色加入/移出你的阵法队列并与其分别摸1张牌/回复1点体力；你们的回合开始时，你失去1点体力并获得弃牌堆中1张牌，随后执行一个额外的出牌阶段。",
			"gl_shenzhu": "神著",
			"gl_shenzhu_info": "锁定技，游戏开始时，你选择一种势力并获得X项该势力角色的技能。（X为你的体力上限）",
			"gl_aige": "哀歌",
			"gl_aige_info": "当你因弃置而失去牌或体力值减少后，你可以将牌堆顶10张牌置入弃牌堆，此回合结束后，你可以执行任意一个额外的主要阶段。若此技能结算时，你的体力值不大于1，你再从游戏内使用1张【桃】。",
			"gl_liezhua": "裂爪",
			"gl_liezhua_info": "当你造成伤害或有角色失去体力上限时，你可以依次弃置其至多X张牌，在此期间内若其没有牌，则其失去1点体力并从游戏内使用1张【无中生有】。(X为其当前的体力值)",
			"gl_jiluan": "极乱",
			"gl_jiluan_info": "锁定技，所有角色的判定阶段改为将武将牌翻面；所有角色的摸牌阶段改为获得弃牌堆中至多2张牌；所有角色的出牌阶段改为使用任意张牌；所有角色的弃牌阶段改为弃置1张牌。",
			"gl_jueyi": "绝异",
			"gl_jueyi_info": "锁定技，当有角色不因主要阶段或卡牌的效果回复体力、造成伤害、获得牌，或使用没有对应同名实体牌的卡牌时。其失去1点体力上限且该结算无效之。",

			"gl_previous": "先代造物主",
			"gl_now": "现任说书人",
			"gl_next": "继承探索者",
		},
	};
	var list = lib.config.gelin.character || [];
	for (var i in gl_create.character) {
		src = 'ext:格林笔记/';
		if (lib.config.skin[i]) {
			src += 'skin/' + i + '/' + lib.config.skin[i] + '.jpg';
		} else {
			src += i + '.jpg';
		}
		gl_create.character[i][4].push(src);
		if (lib.config.gelin.specialSkill[i]) gl_create.character[i][3].addArray(lib.config.gelin.specialSkill[i]);
		if (!list.contains(i) && i != 'gl_shuiguai' && i != 'gl_puluomixiusi') {
			gl_create.character[i][4].push('unseen');
			gl_create.character[i][3].length = 0;
		}
	}
	lib.config.all.characters.push('gl_create');
	lib.translate['gl_create_character_config'] = '造物主';
	lib.config.characters.push('gl_create');
	return gl_create;
});
