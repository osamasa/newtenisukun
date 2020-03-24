import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	curgameid: 123456,
	nextPath: '',
	user:{},
	mygames: {},
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
		peoples: 5,
		users: {}
	    },
	gameusers: [],
	shiairec: []
    },
    getters: {
	getMyGames: (state) => {
	    return state.mygames;
	},
	getNextPath: (state) => {
	    return state.nextPath;
	},
	getShiairec: (state) => {
	    return state.shiairec;
	},
	getShiairecNum: (state) => {
	    return state.shiairec.length;
	},
	getGameUsers: (state) => {
	    return state.gameusers;
	},
	getGame: (state) => {
	    return state.game;
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
	setMyGames: (state,payload) => {
	    state.mygames = payload;
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
	    state.gameusers = payload;
	},
	setGameUsersOne: (state,payload) => {
	    const index = payload.index;
	    state.gameusers[index].no = payload.nowrec.no;
	    if((payload.key) && (payload.value)) {
		state.gameusers[index].userid=payload.key;
		state.gameusers[index].displayName=payload.value.displayName;
		state.gameusers[index].photoURL= payload.value.photoURL;
	    } else {		
		state.gameusers[index].userid='';
		state.gameusers[index].displayName=payload.nowrec.displayName;
		state.gameusers[index].photoURL=''
	    }
	},
	setGame: (state,payload) => {
	    state.game = payload.game;
	},
	initGameState: (state) => {
	    state.game.ownuserid[ state.user.uid ]=true;
	    state.game.users[ state.user.uid ]=true;	    

	    state.userinfo.displayName=state.user.displayName;
	    state.userinfo.photoURL=state.user.photoURL;
	    state.userinfo.games[state.curgameid] = true;

	    const tmp = [];
	    
	    for(let i=0;i<state.game.peoples;i++) {
		    tmp.push({
		    no:(i+1),
		    userid:'',
		    displayName:'名無し',
		    photoURL:''
		});
	    }
	    state.gameusers = tmp;
	},
	setNextPath: (state, payload) => {
	    state.nextPath = payload.path;
	},
	setCurgamid(state, payload) {
	    state.curgameid = payload.curgameid;
	},
	setShiaiRec(state,payload) {
	    if(payload.shiairec) {
		if( payload.isRenewal ) {
		    state.shiairec=[];
		}
		payload.shiairec.forEach( v => {
		    state.shiairec.push(v);
		});		
	    } else {
		state.shiairec = payload.shiairec;
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
	}
    },
    actions: {
	async getUserAction(context) {
	    context.commit('getUser');
	},
	async createGameidAction (context) {
	    const newKey = firebase.database().ref().child('games').push().key;
	    const payload = { curgameid : newKey };
	    context.commit('setCurgamid',payload);
	},
	async loadGameDatabaseAction (context) {
	    firebase.database().ref('/shiairec/' + context.getters.getCurgameid).on('value',function(snapshot) {
		if(snapshot.exists) {
		    const payload = {
			shiairec : snapshot.val(),
			isRenewal : true
		    };
		    context.commit('setShiaiRec',payload);
		} else {
		    console.log('[ERR] Not Found /shiairec/' + state.curgameid);
		}		    
	    });

	},
	async loadGameMemberDatabaseAction(context,payload) {
	    firebase.database().ref('/gameusers/' + context.getters.getCurgameid ).on('value', function(snapshot) {
		if(snapshot.exists) {
		    context.commit('setGameUsers',snapshot.val())
		} else {
		    console.log('[ERR] Not Found /gameusers/' + state.curgameid);
		}
	    });
	},
	async setUserAction (context,payload)  {
	    context.commit('setUser',payload);
	},
	async doSave(context) {
	    await localStorage.setItem('nextPath',context.getters.getNextPath);
	},
	async doLoad (context) {
	    if (localStorage.getItem('nextPath')) {
		const payload = {
		    path : localStorage.getItem('nextPath'),
		};
		context.commit('setNextPath',payload);
		localStorage.clear;
	    }
	},
	async setParamsAction (context, payload) {
	    context.commit('setParams',payload);
	},
	async setNextPathAction (context, payload) {
	    context.commit('setNextPath',payload);	    
	},
	async setCurgamidAction(context,payload) {
	    context.commit('setCurgamid',payload);
	},
	async setPeoplesAction(context,payload) {
	    context.commit('setPeoples',payload);
	},
	async setGamedateAction(context,payload) {
	    context.commit('setGamedate',payload);
	},
	async setGameplaceAction(context,payload) {
	    context.commit('setGameplace',payload);
	},	    	
	async updateShiaiRecAction(context,payload) {
	    const updates= {};
	    updates['/shiairec/' + context.getters.getCurgameid + '/' + (payload.id-1)]  = payload;
	    firebase.database().ref().update(updates);
	},
	async setGameUsersOneAction(context,payload) {
	    const index = context.getters.getGameUsers.findIndex((v) => v.no === payload.nowrec.no);
	    payload['index'] = index;
	    context.commit('setGameUsersOne',payload);

	    firebase.database().ref('/gameusers/' + context.getters.getCurgameid + '/' + index + '/').set(context.getters.getGameUsers[index],function(error) {
		if(error) {
		    console.log('[ERR]' + error);
		    console.log('[ERR] gameuser one record updae error');
		}

	    }
													 );
	},
	async storeGamesUsersDbAction(context,payload) {
	    firebase.database().ref('/games/' + context.getters.getCurgameid + '/users/' + context.getters.getUser.uid).set(true, function(error) {
		if(error) {
		    console.log('[ERR]' + error);
		    console.log('[ERR] games user login');
		}
	    });
	    
	},
	async loadUserInfoDbAction(context,payload) {
	    const curgameid = context.getters.getCurgameid;	    
	    firebase.database().ref('/userinfo/' + context.getters.getUser.uid).once('value').then(function(snapshot) {
		if(snapshot.val()) {
		    const payload = {
			displayName : snapshot.val().displayName,
			photoURL : snapshot.val().photoURL,
			records: snapshot.val().records,
			games : snapshot.val().games
		    };
		    payload.games.curgameid = true;
		    context.commit('setUserinfo',payload);
		    firebase.database().ref('/userinfo/' + context.getters.getUser.uid + '/games/' + curgameid).set(true,function(error) {
			if(error) {
			    console.log('[ERR]' + error);
			}
		    })
		} else {
		    const payload = {
			displayName : context.getters.getUser.displayName,
			photoURL : context.getters.getUser.photoURL,
			records: [],
			games : {}
		    };
		    payload.games.curgameid = true;
		    context.commit('setUserinfo',payload);
		    firebase.database().ref('/userinfo/' + context.getters.getUser.uid ).set(context.getters.getUserinfo,function(error) {
			if(error) {
			    console.log('[ERR]' + error);
			}
		    })
		}
	    })
	},
	async resetGames(context,payload) {
	    payload = {
		curgameid : null,
		game: {
		    gamedate: null,
		    gameplace: null,
		    ownuserid: {},
		    peoples: 0,
		    users: {}
		},
		gameusers : [],
		shiairec : []

	    };
	    context.commit('setCurgamid',payload);
	    context.commit('setGame',payload);
	    context.commit('setGameUsers',payload)
	    context.commit('setShiaiRec',payload);
	},
	async loadGameDbAction (context,payload)  {
	    firebase.database().ref('/games/' + context.getters.getCurgameid).once('value').then(function(snapshot) {
		if(snapshot.exists) {
		    context.commit('setGame',{game : snapshot.val()});
		} else {
		    console.log('[ERR] Not Found /games/' + context.getters.getCurgameid);
		}
	    })
	},	    
	async storeGameDb (context,payload)  {
	    firebase.database().ref('/games/' + context.getters.getCurgameid).set(context.getters.getGame,function(error) {
		if (error) {
		    console.log('[ERR] ' + '/games/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		}}
								    );
	},

	async storeUserInfoDb(context,payload) {
	    firebase.database().ref('/userinfo/' + context.getters.getUser.uid).set(context.getters.getUserinfo,function(error) {
		if (error) {
		    console.log('[ERR] ' + '/userinfo/' + context.getters.getUser.uid);
		    console.log('[ERR]' + error);
		}
	    }
								      )
	},

	async storeGameUsersDb(context,payload) {
	    firebase.database().ref('/gameusers/' + context.getters.getCurgameid).set(context.getters.getGameUsers,function(error) {
		if(error) {
		    console.log('[ERR] ' + '/gameusers/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getGameUsers);
		}}
								       )
	},
	
	async storeShiairecDb (context,payload)  {
	    firebase.database().ref('/shiairec/' + context.getters.getCurgameid).set(context.getters.getShiairec,function(error) {
		if(error) {
		    console.log('[ERR] ' + '/shiairec/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getShiairec);
		}}
								       )
	},

	async loadMyGamesAction(context) {
	    const payload = {};
	    firebase.database().ref('/games').orderByChild('users/' + context.getters.getUser.uid).startAt(true).endAt(true).once('value').then(function(snapshot) {
		if(snapshot.val()) {
		    context.commit('setMyGames',snapshot.val());
		} else {
		    console.log('[error] ' + '/games/users/' + context.getters.getUser.uid);
		}
	    })
	},
	
	async setShiaiRecAction(context,payload) {
	    payload.shiairec=[];
	    await axios.get('/' + context.getters['getPeoples'] +'.csv')
		.then((res) => {
		    let i=0;
		    let n=0;
		    const num = payload.isRenewal ? 0 : context.getters['getShiairecNum'];
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
		context.commit('initGameState');
		context.dispatch('storeGameDb');
		context.dispatch('storeUserInfoDb');
		context.dispatch('storeGameUsersDb');
	    }
	    context.dispatch('storeShiairecDb');	    
	}
    }
})
