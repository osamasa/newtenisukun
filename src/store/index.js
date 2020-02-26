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
	user:{},
	userinfo: {
	    displayName: "ほげほげ太郎",
	    photoURL: "https://lh3.googleusercontent.com/a-/AAuE7mBnOXQMXtpHhReTB-pjTiZI-rsMzJXUJsQozUUiKA",
	    games: {},
	    record: [],
	},
	game:
	    {
		gamedate: '2020-02-25 16:00',
		gameplace: 'ほげほげ',
		users: {},
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
	getGameplace: (state) => {
	    return state.game.gameplace;
	},
	getUser: (state) => {
	    return state.user;
	},
	getUserinfo: (state) => {
	    return state.userinfo;
	}
    },
    mutations: {
	setUser: (state,payload) => {
	    state.user = payload;
	    state.userinfo.displayName=payload.displayName;
	    state.userinfo.photoURL=payload.photoURL;
	},
	setUserinfo: (state,payload) => {
	    state.userinfo = payload;
	},
	initGameDatabase: (state) => {
	    state.game.users[ state.user.uid ]=true;
	    state.game.ownuserid[ state.user.uid ]=true;
	    for(let i=0;i<state.game.peoples;i++) {
		state.game.gameusers.push({no:i,userid:''});
	    }
	    firebase.database().ref('/games/' + state.curgameid).set(state.game);
	},
	loadGameDatabase: (state) => {
	    const updates= {};
	    updates['/games/' + state.curgameid + '/users/' + state.user.uid] = true;
	    updates[ '/userinfo/' + state.user.uid + '/displayName/'] = state.userinfo.displayName;
	    updates[ '/userinfo/' + state.user.uid + '/photoURL/'] = state.userinfo.photoURL;
	    updates[ '/userinfo/' + state.user.uid +'/games/' + state.curgameid ] = true;

	    firebase.database().ref().update(updates);
	    
	    firebase.database().ref('/games/' + state.curgameid).on('value', function(snapshot) {
		state.game = snapshot.val();
	    });
	    firebase.database().ref('/userinfo/' + state.user.uid).on('value',function(snapshot) {
		state.userinfo = snapshot.val();
	    });
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
	createGameid(state) {
	    const newKey = firebase.database().ref().child('games').push().key;
	    state.curgameid = newKey;
	},
	setCurgamid(state, payload) {
	    state.curgameid = payload.curgameid;
	},
	updateShiaiRec(state, payload) {
	    const updates= {};
	    updates['/games/' + state.curgameid + '/shiairec/' + (payload.id-1)]  = payload;
	    firebase.database().ref().update(updates);
	},
	setShiaiRec(state,payload) {
	    if( payload.isRenewal ) {
		state.game.shiairec=[];
	    }
	    payload.shiairec.forEach( v => {
		state.game.shiairec.push(v);
	    });
	    if (! payload.isRenewal ) {
		console.log(state.game.shiairec);
		firebase.database().ref('/games/' + state.curgameid + '/shiairec/').set(state.game.shiairec);
	    }
	},
	setPeoples(state,payload) {
	    state.game.peoples = payload.peoples;
	},
	setGamedate(state,payload) {
	    state.game.gamedate = payload.gamedate;
	},
	setGameplace(state,payload) {
	    state.game.gameplace = payload.gameplace;
	},	
    },
    actions: {
	createGameidAction: (context) => {
	    context.commit('createGameid');
	},
	async loadGameDatabaseAction (context,payload) {
	    context.commit('loadGameDatabase');
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
	setGameplaceAction(context,payload) {
	    context.commit('setGameplace',payload);
	},	    	
	updateShiaiRecAction(context,payload) {
	    context.commit('updateShiaiRec',payload);
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
