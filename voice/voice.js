game.gelinAudio = {
	//在这输入技能的ID：后面接入语音数量其余的交给函数处理。例：
	"gl_huimeng": 2,
	//单个语音的情况直接输入true。例：
	"gl_tianyan": true,
	"gl_duren": true,
	"gl_huanyu": true,
	//某些技能存在子技能需要进行语音重定向。例：
	"gl_huanyu_discard": "gl_huanyu",
	"gl_huimeng_merge": "gl_huimeng",
	//当出现多个角色公用一个技能需要加入语音的场合，则需要填入一个对象{}对象中输入角色的ID并根据上面的写法编辑。例：
	"gl_lianjie_backup": {
		'gl_aikesi': true,
		'gl_famu': 3
	},
	//死亡语音不需要在此页面进行初始化直接将文件名以角色ID+_die.mp3的形式放入voice即可自动读取。
}
