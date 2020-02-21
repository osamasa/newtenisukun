import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	curgameid: 123456,
	isLogin: true,
	isTwitter: false,
	isFacebook: false,
	isGoogle: true,
	isYahoo: false,
	nextPath: '',
	user: null,
	userinfo: {
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
		gamedate: '2020-02-25 16:00',
		loginusers: {},
		gameusers: [],
		ownuserid: {}, 
		shiairec: [],
		peoples: 5
	    }
    },
    getters: {
	getNextPath: (state) => {
	    return state.nextPath;
	},
	getShiairec: (state) => {
	    return state.game.shiairec;
	},
	getShiairecNum: (state) => {
	    return state.game.shiairec.length;
	},
	getPeoples:  (state) => {
	    return state.game.peoples;
	},
	getCurgameid: (state) => {
	    return state.curgameid;
	},
	getGamedate: (state) => {
	    return state.game.gamedate;
	},
	getUser: (state) => {
	    return state.user;
	}
    },
    mutations: {
	setUser: (state,payload) => {
	    state.user = payload;
	},
	initGameDatabase: (state) => {
	    state.game.loginusers[ state.user.uid ]=true;
	    state.game.ownuserid[ state.user.uid ]=true;
	    for(let i=0;i<state.game.peoples;i++) {
		state.game.gameusers.push({no:i,userid:''});
	    }
	    firebase.database().ref('/games/' + state.curgameid).set(state.game);
	},
	loadGameDatabase: (state,payload) => {
	    firebase.database().ref('/games/' + payload.curgameid).once('value').then(function(snapshot) {
		console.log(snapshot.val());
		state.game = snapshot.val();
	    })
	},
	save: (state) => {
	    localStorage.setItem('nextPath',state.nextPath);
	},
	load: (state) => {
	    if (localStorage.getItem('nextPath')) {
		state.nextPath=localStorage.getItem('nextPath');
		localStorage.clear;
	    }
	},
	setNextPath: (state, payload) => {
	    state.nextPath = payload.fullPath;
	},
	setCurgamid(state, payload) {
	    state.curgameid = payload.curgameid;
	},
	updateRec(state, payload) {
	    console.log(payload);
	    console.log(state.game.shiairec);
	},
	setShiaiRec(state,payload) {
	    if( payload.isRenewal ) {
		state.game.shiairec=[];
	    }
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
	loadGameDatabaseAction: (context,payload) => {
	    context.commit('loadGameDatabase',payload);
	},
	setUserAction: (context,payload) => {
	    context.commit('setUser',payload);
	},
	doSave: (context) => {
	    context.commit('save');
	},
	doLoad: (context) => {
	    context.commit('load');
	},	
	setParamsAction: (context, payload) => {
	    context.commit('setParams',payload);
	},
	setNextPathAction: (context, payload) => {
	    context.commit('setNextPath',payload);	    
	},
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
	async setShiaiRecAction(context,payload) {
	    payload.shiairec=[];
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
	    if(payload.isRenewal) {
		context.commit('initGameDatabase');
	    }
	}
    }
})
