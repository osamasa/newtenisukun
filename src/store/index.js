import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	curgameid: 123456,
	isLogin: true,
	isTwitter: false,
	isFacebook: false,
	isGoogle: true,
	isYahoo: false,
	userinfo: {
	    userid:1234,
	    displayanme:'おさまさ',
	    memos: [
		{
		    gameid:1,
		    no:2,
		    memo: '寒い処理だった'
		},
		{
		    gameid:1,
		    no:4,
		    memo: 'ロブが良かった'
		}],
	    record: [
		{
		    gameid:1,
		    myno:2,
		    totalwin : 3,
		    totallose : 2,
		    totaldraw : 1,
		},
		{
		    gameid:2,
		    myno:3,
		    totalwin : 3,
		    totallose : 2,
		    totaldraw : 1,
		}],
	},
	game:
	    {
		gameid: 12345,
		gamedate: '2020-02-25',
		loginusers: {1234:true,
			     1354:true},
		gameusers: [{no:1, userid:0,displayanme: '名無し'},
			    {no:2, userid:0,displayanme: 'おさだ'},
			    {no:3, userid:1234},
			    {no:4, userid:1354},
			    {no:5, userid:0,displayanme: '名無し'}],
		ownuserid: '1234', 
		shiairec: [],
		peoples: 5
	    }
    },
    getters: {
	getShiairec: (state) => {
	    return state.game.shiairec;
	},
	getShiairecNum: (state) => {
	    return state.game.length;
	},
	getPeoples:  (state) => {
	    return state.game.peoples;
	},
	getCurgameid: (state) => {
	    return state.curgameid;
	},
	getGamedate: (state) => {
	    return state.gamedate;
	}
    },
    mutations: {
	setCurgamid(state, payload) {
	    state.curgameid = payload.curgameid;
	},
	updateRec(state, payload) {
	    console.log(payload);
	    console.log(state.game.shiairec);
	},
	setShiaiRec(state,payload) {
	    payload.shiairec.forEach( v => {
		state.game.shiairec.push(v);
	    });
	},
	setPeoples(state,payload) {
	    state.game.peoples = payload.peoples;
	},
	setGamedate(state,payload) {
	    state.game.gamedate = payload.gamedate;
	}
    },
    actions: {
	setCurgamidAction(context,payload) {
	    context.commit('setCurgamid',payload);
	},
	setPeoplesAction(context,payload) {
	    context.commit('setPeoples',payload);
	},
	setGamedateAction(context,payload) {
	    context.commit('setGamedate',payload);
	},	    
	updateShiaiRec(context,payload) {
	    context.commit('updateRec',payload);
	},
	async setShiaiRecAction(context) {
	    const payload = {
		shiairec : []
	    }
	    await axios.get('/' + context.getters['getPeoples'] +'.csv')
		.then((res) => {
		    let i=0;
		    let n=0;
		    const num = context.getters['getShiairecNum'] || 0;
		    let p1,p2,p3,p4
		    res.data.split('\r\n').forEach(vv => {
			vv.split(',').forEach(v => {
			    if((i % 4) == 0) {
				p1=v;
			    } else if((i % 4) == 1) {
				p2=v;
			    } else if((i % 4) == 2) {
				p3=v;
			    } else {
				p4=v;				
				payload.shiairec.push({"id":num+(++n), "p1": p1,"p2": p2, "p3": p3, "p4": p4, "r1": 0, "r2": 0, "rs": 0 });
			    }
			    i++;
			});
		    });
		})
		.catch(error => console.log(error))
	    context.commit('setShiaiRec', payload);
	}
    }
})
