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
	    records: [],
	},
	game:
	    {
		gamedate: '2020-02-25 16:00',
		gameplace: 'ほげほげ',
		ownuserid: {},
		peoples: 5
	    },
	gameusers: {
	    ownuserid: {},
	    records: []
	},
	shiairec: {
	    ownuserid: {},
	    records: []
	},
	loginusers: {
	    users: {},
	}
    },
    getters: {
	getNextPath: (state) => {
	    return state.nextPath;
	},
	getShiairec: (state) => {
	    return state.shiairec.records;
	},
	getShiairecNum: (state) => {
	    return state.shiairec.records.length;
	},
	getGameUsers: (state) => {
	    return state.gameusers.records;
	},
	getGame: (state) => {
	    return state.game;o
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
	},
	getLoginUsers: (state) => {
	    return state.loginusers.users;
	}
    },
    mutations: {
	loginUserDatabase: (state) => {
	    const updates= {};
	    updates[ '/userinfo/' + state.user.uid + '/games/' + state.curgameid ] = true;
	    updates[ '/loginusers/' + state.curgameid + '/users/' + state.user.uid  + '/displayName/'] = state.userinfo.displayName,
	    updates[ '/loginusers/' + state.curgameid + '/users/' + state.user.uid  + '/photoURL/'] = state.userinfo.photoURL;
	    firebase.database().ref().update(updates);
	},
	setUser: (state,payload) => {
	    state.user = payload;
	    state.userinfo.displayName=payload.displayName;
	    state.userinfo.photoURL=payload.photoURL;
	},
	setUserinfo: (state,payload) => {
	    state.userinfo = payload;
	},
	setGameUsers: (state,payload) => {
	    state.gameusers.records = payload.gameusers;
	    state.gameusers.ownuserid[ state.user.uid ] = true;
	    firebase.database().ref('/gameusers/' + state.curgameid ).set(state.gameusers);
	},
	setGameUsersOne: (state,payload) => {
	    const index = state.gameusers.records.findIndex((v) => v.no === payload.nowrec.no);
	    state.gameusers.records[index].no = payload.nowrec.no;
	    if((payload.key) && (payload.value)) {
		state.gameusers.records[index].userid=payload.key,
		state.gameusers.records[index].displayName=payload.value.displayName,
		state.gameusers.records[index].photoURL= payload.value.photoURL		    

	    } else {		
		state.gameusers.records[index].userid='';
		state.gameusers.records[index].displayName=payload.nowrec.displayName;
		state.gameusers.records[index].photoURL=''
	    }
	    firebase.database().ref('/gameusers/' + state.curgameid + '/records/' + index + '/').set(state.gameusers.records[index]);
	},
	
	initGameDatabase: (state) => {
	    const updates= {};
	    state.game.ownuserid[ state.user.uid ]=true;
	    state.gameusers.ownuserid[ state.user.uid ]=true;
	    state.shiairec.ownuserid[ state.user.uid ]=true;	    

	    state.userinfo.displayName=state.user.displayName;
	    state.userinfo.photoURL=state.user.photoURL;
	    state.userinfo.games[state.curgameid] = true;
	    
	    for(let i=0;i<state.game.peoples;i++) {
		state.gameusers.records.push({
		    no:(i+1),
		    userid:'',
		    displayName:'名無し',
		    photoURL:''
		});
	    }

	    firebase.database().ref('/games/' + state.curgameid).set(state.game,function(error) {
		if (error) {
		    console.log('[ERR] ' + '/games/' + state.curgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + state.game);		    
		} else {
		    firebase.database().ref('/userinfo/' + state.user.uid).set(state.userinfo,function(error) {
			if(error) {
			    console.log('[ERR] ' + '/userinfo/' + state.user.uid);
			    console.log('[ERR]' + error);
			    console.log('[ERR] ' + state.userinfo);		    
			} else {
			    firebase.database().ref('/shiairec/' + state.curgameid).set(state.shiairec,function(error) {
				if(error) {
				    console.log('[ERR] ' + '/shiairec/' + state.curgameid);
				    console.log('[ERR]' + error);
				    console.log('[ERR] ' + state.shiairec);
				} else {
				    updates[ '/loginusers/' + state.curgameid + '/users/' + state.user.uid  + '/displayName/'] = state.userinfo.displayName,
				    updates[ '/loginusers/' + state.curgameid + '/users/' + state.user.uid  + '/photoURL/'] = state.userinfo.photoURL;
				    updates['/gameusers/' + state.curgameid]=state.gameusers;
				    firebase.database().ref().update(updates,function(error) {
					if(error) {
					    console.log('[ERR]' + error);
					}
				    });
				}
			    });
			}
		    })
		}})
	},
	loadGameMemberDatabaseOnce: (state) => {
	    firebase.database().ref('/gameusers/' + state.curgameid ).once('value').then(function(snapshot) {
		state.gameusers = snapshot.val();
		console.log('/gameusers/' + state.curgameid);
	    });
	},	
	loadGameMemberDatabase: (state) => {
	    firebase.database().ref('/gameusers/' + state.curgameid ).on('value', function(snapshot) {
		if(snapshot.exists) {
		    state.gameusers = snapshot.val();
		} else {
		    console.log('[ERR] Not Found /gameusers/' + state.curgameid);
		}
	    });
	},
	loadLoginUsersDatabase: (state) => {
	    firebase.database().ref('/loginusers/' + state.curgameid  ).on('value', function(snapshot) {
		if(snapshot.exists) {
		    state.loginusers = snapshot.val();
		} else {
		    console.log('[ERR] Not Found /loginusers/' + state.curgameid);
		}
	    });
	},

	loadGameDatabase: (state,payload) => {
	    firebase.database().ref('/shiairec/' + state.curgameid).on('value',function(snapshot) {
		if(snapshot.exists) {
		    state.shiairec = snapshot.val();
		} else {
		    console.log('[ERR] Not Found /shiairec/' + state.curgameid);
		}		    
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
	    updates['/shiairec/' + state.curgameid + '/records/' + (payload.id-1)]  = payload;
	    firebase.database().ref().update(updates);
	},
	setShiaiRec(state,payload) {
	    if( payload.isRenewal ) {
		state.shiairec.ownuserid[ state.user.uid ]=true;
		state.shiairec.records=[];
	    }
	    payload.shiairec.forEach( v => {
		state.shiairec.records.push(v);
	    });
	    
	    firebase.database().ref('/shiairec/' + state.curgameid ).set(state.shiairec);

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
	loadGameDatabaseAction (context,payload) {
	    context.commit('loadGameDatabase',payload);
	},
	loadGameMemberDatabaseAction(context,payload) {
	    context.commit('loadGameMemberDatabase',payload);
	},
	loadGameMemberDatabaseOneceAction(context,payload) {
	    context.commit('loadGameMemberDatabaseOnce',payload);	    
	},	
	loadLoginUsersDatabaseAction(context,payload) {
	    context.commit('loadLoginUsersDatabase',payload);
	},
	loginUserDatabaseAction: (context,payload) => {
	    context.commit('loginUserDatabase',payload);
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
	setGameUsersOneAction(context,payload) {
	    context.commit('setGameUsersOne',payload);
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
