import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	isLoading: true,
	shiaidba: null,
	gameusera: null,
	curgameid: '',
	nextPath: '',
	user:{},
	mygames: [],
	mygamescount :0,
	userinfo: {
   	    isAnonymous: false,
	    displayName: "",
	    photoURL: "",
	    games: {},
	},
	game:
	    {
		gamedate: '',
		gameplace: '',
		ownuserid: {},
		peoples: 5,
		users: []
	    },
	gameusers: [],
	shiairec: [],
	mymemos: []
    },
    getters: {
	getMyMemos: (state) => {
	    return state.mymemos;
	},
	getIsLoading: (state) => {
	    return state.isLoading;
	},
	getShiaiDba: (state) => {
	    return state.shiaidba;
	},
	getGameusera: (state) => {
	    return state.gameusera;
	},
	getMyGames: (state) => {
	    return state.mygames;
	},
	getMyGamesCount: (state) => {
	    return state.mygamescount;
	},
	getMyGamesLimit(state,payload) {
	    let iStart = (payload.page - 1) * payload.limit;
	    let iLast = iStart + payload.limit;
	    return state.mygames.slice(iStart,iLast);
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
	getGame: (state) => {
	    return state.game;
	},
	getGameInUser: (state) => {
	    return state.game.users;
	},
	getGameUsers: (state) => {
	    return state.gameusers;
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
	setIsLoading: (state,payload) => {
	    state.isLoading = payload;
	},	
	setShiaiDba:  (state,payload) => {
	    state.shiaidba = payload.shiaidba;
	},
	setGameUsera:  (state,payload) => {
	    state.gameusera = payload.gameusera;
	},	
	setMyGames: (state,payload) => {
	    state.mygames = payload;
	},
	setMyGamesCount: (state,payload) => {
	    state.mygamescount = payload;
	},
	setUser: (state,payload) => {
	    state.user = payload.user;
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
	setMyMemos(state,payload) {
	    if(payload.mymemos) {
		if( payload.isRenewal ) {
		    state.mymemos=[];
		}
		payload.mymemos.forEach( v => {
		    state.mymemos.push(v);
		});		
	    } else {
		state.mymemos = payload.mymemos;
	    }
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
	    const shiaidba = firebase.database().ref('/shiairec/' + context.getters.getCurgameid);
	    shiaidba.on('value',function(snapshot) {
		if(snapshot.exists) {
		    const payload = {
			shiairec : snapshot.val(),
			isRenewal : true
		    };
		    context.commit('setShiaiRec',payload);
		} else {
		    console.log('[ERR] Not Found /shiairec/' + state.curgameid);
		}
 	        context.commit('setIsLoading',false);		
	    });
	    if(shiaidba) {
		context.commit('setShiaiDba',{'shiaidba' : shiaidba});
	    }
	},

	async loadMyMemosDatabaseAction (context) {
	    const shiaidbc = firebase.database().ref('/mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid);
	    shiaidbc.once('value',function(snapshot) {
		if(snapshot.exists) {
		    const payload = {
			mymemos : snapshot.val(),
			isRenewal : true
		    };
		    context.commit('setMyMemos',payload);
		} else {
		    console.log('[ERR] Not Found /mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid);
		}		    
	    });
	},
	
	async loadGameMemberDatabaseAction(context,payload) {
	    const gameusera = firebase.database().ref('/gameusers/' + context.getters.getCurgameid );
	    gameusera.on('value', function(snapshot) {
		if(snapshot.exists) {
		    context.commit('setGameUsers',snapshot.val())
		} else {
		    console.log('[ERR] Not Found /gameusers/' + state.curgameid);
		}
	    });
	    if(gameusera) {
		context.commit('setGameUsera',{'gameusera':gameusera});
	    }
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
	async updateMyMemoAction(context,payload) {
	    const updates= {};
	    updates['/mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid + '/' + payload.id]  = context.getters.getMyMemos[payload.id];
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
	async setUserInfoDbGameAction(context,payload) {
	    firebase.database().ref('/userinfo/' + context.getters.getUser.uid + '/games/' + context.getters.getCurgameid).set(true,function(error) {
		if(error) {
		    console.log('[ERR]' + error);
		}
	    })
	},
	async loadUserInfoDbAction(context,payload) {
	    context.commit('setUser',payload)
	    firebase.database().ref('/userinfo/' + context.getters.getUser.uid).once('value').then(function(snapshot) {
		if(snapshot.val()) {
		    const _payload = {
			displayName : snapshot.val().displayName ,
			photoURL : snapshot.val().photoURL,
			games : snapshot.val().games,
			isAnonymous : snapshot.val().isAnonymous
		    };

		    context.commit('setUserinfo',_payload);
		} else {
		    const _payload = {
			displayName : context.getters.getUser.displayName || context.getters.getUser.email,
			photoURL : context.getters.getUser.photoURL || '',
			isAnonymous : context.getters.getUser.isAnonymous || false,
			games : {}
		    };
		    context.commit('setUserinfo',_payload);
		    firebase.database().ref('/userinfo/' + context.getters.getUser.uid ).set(context.getters.getUserinfo,function(error) {
			if(error) {
			    console.log('[ERR]' + error);
			}
		    })
		}
	    })
	},
	async resetGames(context,payload) {
	    if(context.getters.getGameUsera) {
		let a = context.getters.getGameUsera;
		a.off();
		context.commit('setGameUsera',{'gameusera' : null});
		
	    }
	    if(context.getters.getShiaiDba) {
		let b = context.getters.getShiaiDba
		b.off();
		context.commit('setShiaiDba',{'shiaidba' : null});
	    }
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
		shiairec : [],
		mymemos: []

	    };
	    context.commit('setCurgamid',payload);
	    context.commit('setGame',payload);
	    context.commit('setGameUsers',payload)
	    context.commit('setShiaiRec',payload);
	    context.commit('setMyMemos',payload);
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


	async storeMyMemosDb (context,payload)  {
	    if(!context.getters.getUser.isAnonymous) {
		firebase.database().ref('/mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid).set(context.getters.getMyMemos,function(error) {
		if(error) {
		    console.log('[ERR] ' + '/mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid );
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getMyMemos);
		}}
															       )
	    }
	},
	
	async addShiairecDb (context,payload)  {
	    payload.shiairec.forEach( v => {
		firebase.database().ref('/shiairec/' + context.getters.getCurgameid + '/' + (v.id-1) ).set(v).then(function(error) {
		if(error) {
		    console.log('[ERR] ' + '/shiairec/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getShiairec);
		}}
														   )
	    })
	},			    

	async addMyMemosDb (context,payload)  {
	    if(!context.getters.getUser.isAnonymous) {
		payload.shiairec.forEach( v => {
		    firebase.database().ref('/mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid + '/' + (v.id-1) ).set("").then(function(error) {
			if(error) {
			    console.log('[ERR]' + '/mymemos/' + context.getters.getCurgameid + '/' + context.getters.getUser.uid + '/' + (v.id-1));
			    console.log('[ERR]' + error);
			    console.log('[ERR] ' + context.getters.getMyMemos);
			}}
														      )
		})
		
	    }
	},
	
	async loadMyGamesAction(context) {
	    firebase.database().ref('/games').orderByChild('users/' + context.getters.getUser.uid).startAt(true).endAt(true).limitToLast(128).once('value').then(function(snapshot) {
		if(snapshot.val()) {
		    const mygames = [];
		    snapshot.forEach(function(data) {
			if((data.key) && (data.val().gameplace)) {
			    mygames.push(
				{ id : data.key,
				  gamedate : data.val().gamedate,
				  peoples : data.val().peoples,
				  gameplace : data.val().gameplace
				});
			}
		    });
		    context.commit('setMyGames',mygames.reverse());
		    context.commit('setMyGamesCount',mygames.length);
		} else {
		    context.commit('setMyGames',[]);
		    context.commit('setMyGamesCount',0);
		}
		context.commit('setIsLoading',false);
	    })
	},

	setIsLoadingAction(context,payload) {
	    context.commit('setIsLoading',payload);
	},
	
	async setShiaiRecAction(context,payload) {
	    payload.shiairec=[];
	    await axios.get('/' + context.getters['getPeoples'] +'.csv')
		.then((res) => {
		    let i=0;
		    let n=0;
		    let m=0;
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
	    if(payload.isRenewal) {
		context.commit('initGameState');
		context.commit('setShiaiRec',payload);
		payload.mymemos = new Array(context.getters['getShiairecNum']);
		for (let l=0;l< context.getters['getShiairecNum'];l++) {
		    payload.mymemos[l]="";
		}
		context.commit('setMyMemos',payload);		
		context.dispatch('storeGameDb');
		context.dispatch('storeGameUsersDb');
		context.dispatch('storeShiairecDb');
		context.dispatch('storeMyMemosDb');		
	    } else {
		context.dispatch('addShiairecDb',payload);
		payload.mymemos=[];
		payload.shiairec.forEach(function(v) {
		    payload.mymemos.push("");
		});
		context.commit('setMyMemos',payload);
		context.dispatch('addMyMemosDb',payload);		
	    }
	}
    }
})
