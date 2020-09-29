import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
	errorno:0,
	errormsg:'',
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
	    games: []
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
    },
    getters: {
	getErrorno: (state) => {
	    return state.errorno;
	},
	getErrormsg: (state) => {
	    return state.errormsg;
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
	    if((Array.isArray(state.shiairec)) && (state.shiairec.length >0)) {
		return state.shiairec.length;
	    } else {
		return null;
	    }
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
	setErrorno: (state,payload) => {
	    state.errorno = payload;
	},
	setErrormsg: (state,payload) => {
	    state.errormsg = payload;
	},		
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
	createGameidAction (context) {
	    const newKey = firebase.database().ref().child('games').push().key;
	    const payload = { curgameid : newKey };
	    context.commit('setCurgamid',payload);
	},
	async loadGameDatabaseAction (context) {
	    const shiaidba = firebase.database().ref('/shiairec/' + context.getters.getCurgameid);
	    shiaidba.on('value',function(snapshot) {
		if((snapshot.exists) && (snapshot.val()) && (snapshot.val().length)) {
		    const payload = {
			shiairec : snapshot.val(),
			isRenewal : true
		    };
		    context.commit('setShiaiRec',payload);
		} else {
		    context.commit('setErrorno',-1);
		    context.commit('setErrormsg','試合情報取得失敗。もう一度ホーム画面から作り直してください');
		    console.log('[ERR] Not Found /shiairec/' + context.getters.getCurgameid);
		}
 	        context.commit('setIsLoading',false);		
	    });
	    if(shiaidba) {
		context.commit('setShiaiDba',{'shiaidba' : shiaidba});
	    }
	},


	async updateGameData(context,payload) {
	    const updates = {};
	    updates[ '/games/' + context.getters.getCurgameid + '/gamedate' ] = payload.gamedate;
	    updates[ '/games/' + context.getters.getCurgameid + '/gameplace' ] = payload.gameplace;
	    firebase.database().ref().update(updates);
	},
	
	async loadGameMemberDatabaseAction(context,payload) {
	    const gameusera = firebase.database().ref('/gameusers/' + context.getters.getCurgameid );
	    gameusera.on('value', function(snapshot) {
		if(snapshot.exists) {
		    context.commit('setGameUsers',snapshot.val())
		} else {
		    context.commit('setErrorno',-3);
		    context.commit('setErrormsg','メンバー情報取得失敗。もう一度ホーム画面から作り直してください');
		    console.log('[ERR] Not Found /gameusers/' + state.curgameid);
		}
		context.commit('setIsLoading',false);
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
	setParamsAction (context, payload) {
	    context.commit('setParams',payload);
	},
	setNextPathAction (context, payload) {
	    context.commit('setNextPath',payload);	    
	},
	setCurgamidAction(context,payload) {
	    if(!payload.curgameid) {
		context.commit('setErrorno',-4);
		context.commit('setErrormsg','試合番号取得失敗。もう一度やり直してください');		
		console.log('[ERR] gameid is null');
		exit();
	    } else {
		context.commit('setCurgamid',payload);
	    }
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
		    context.commit('setErrorno',-5);
		    context.commit('setErrormsg','ユーザー情報更新失敗、しばらくしてからやり直してください ' + error);				    
		    console.log('[ERR]' + error);
		    console.log('[ERR] gameuser one record updae error');
		}
	    }
													 );
	},
	storeGamesUsersDbAction(context,payload) {
	    firebase.database().ref('/games/' + context.getters.getCurgameid + '/users/' + context.getters.getUser.uid).set(true, function(error) {
		if(error) {
		    context.commit('setErrorno',-6);
		    context.commit('setErrormsg','ゲームメンバー情報更新失敗、しばらくしてからやり直してください ' + error);
		    console.log('[ERR]' + error);
		    console.log('[ERR] games user login');
		}
	    });
	    
	},
	async _setUserInfoDbGameAction(context,payload) {
	    if(!context.getters.getUser.uid) {
		context.commit('setErrorno',-15);
		context.commit('setErrormsg','getUser失敗');		  
	    } else {
		firebase.database().ref('/userinfo/' + context.getters.getUser.uid + '/games/' + context.getters.getCurgameid).set(true,function(error) {
		if(error) {
		    context.commit('setErrorno',-7);
		    context.commit('setErrormsg','ユーザ情報更新失敗、しばらくしてからやり直してください ' + error);		    
		    console.log('[ERR]' + error);
		}
		})
	    }
	},
	updateUserInfoDbAction(context,payload) {
	    firebase.database().ref('/userinfo/' + context.getters.getUser.uid ).once('value',function(snapshot) {
		if((!snapshot.val()) || (!snapshot.val().displayName)){
		    let _gameid = context.getters.getCurgameid;
		    const _payload = {
			displayName : context.getters.getUser.displayName || context.getters.getUser.email || 'お試しさん',
			photoURL : context.getters.getUser.photoURL || '',
			games : { _gameid : true },
			isAnonymous : context.getters.getUser.isAnonymous || false,
		    };
		    console.log(_payload);		 
		    context.commit('setUserinfo',_payload);
		    firebase.database().ref('/userinfo/' + context.getters.getUser.uid ).set(context.getters.getUserinfo,function(error) {
			if(error) {
			    context.commit('setErrorno',-8);
			    context.commit('setErrormsg','ユーザ情報更新失敗、しばらくしてからやり直してください ' + error);		   			    
			    console.log('[ERR]' + error);
			}
		    })		    
		} else {
		    context.commit('setUserinfo',snapshot.val());
		    firebase.database().ref('/userinfo/' + context.getters.getUser.uid + '/games/' + context.getters.getCurgameid).set(true,function(error) {
			if(error) {
			    context.commit('setErrorno',-7);
			    context.commit('setErrormsg','ユーザ情報更新失敗、しばらくしてからやり直してください ' + error);		    
			    console.log('[ERR]' + error);
			}		    
		    })
		}
	    })
	},									     
	async loadUserInfoDbAction(context) {
	    firebase.database().ref('/userinfo/' + context.getters.getUser.uid ).once('value',function(snapshot) {
		if(!snapshot.exists) {
		    const _payload = {
			displayName : context.getters.getUser.displayName || context.getters.getUser.email || 'お試しさん',
			photoURL : context.getters.getUser.photoURL || '',
			isAnonymous : context.getters.getUser.isAnonymous || false,
			games : [],
		    };
		    context.commit('setUserinfo',_payload);
		    firebase.database().ref('/userinfo/' + context.getters.getUser.uid ).set(context.getters.getUserinfo,function(error) {
			if(error) {
			    context.commit('setErrorno',-8);
			    context.commit('setErrormsg','ユーザ情報更新失敗、しばらくしてからやり直してください ' + error);		   			    
			    console.log('[ERR]' + error);
			}
		    })		    
		} else {
		    context.commit('setUserinfo',snapshot.val());
		}
	    })
	},
	resetGames(context,payload) {
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
		shiairec : []

	    };
	    context.commit('setCurgamid',payload);
	    context.commit('setGame',payload);
	    context.commit('setGameUsers',payload)
	    context.commit('setShiaiRec',payload);
	},
	async loadGameDbAction (context,payload)  {
	    firebase.database().ref('/games/' + context.getters.getCurgameid).on('value',function(snapshot) {
		if(snapshot.exists) {
		    context.commit('setGame',{game : snapshot.val()});
		} else {
		    context.commit('setErrorno',-9);
		    context.commit('setErrormsg','ゲーム情報読み込み失敗、しばらくしてからやり直してください ' + error);
		    console.log('[ERR] Not Found /games/' + context.getters.getCurgameid);
		}
	    })
	},	    
	async storeGameDb (context,payload)  {
	    if(context.getters.getCurgameid) {
		firebase.database().ref('/games/' + context.getters.getCurgameid).set(context.getters.getGame,function(error) {
		    if (error) {
			context.commit('setErrorno',-10);
			context.commit('setErrormsg','ゲーム情報更新失敗、しばらくしてからやり直してください ' + error);		    
			console.log('[ERR] ' + '/games/' + context.getters.getCurgameid);
			console.log('[ERR]' + error);
		    }}
										     );
	    } else {
		context.commit('setErrorno',-19);
		context.commit('setErrormsg','ゲーム情報更新エラー ' + error);		    
	    }
	},

	async storeGameUsersDb(context,payload) {
	    firebase.database().ref('/gameusers/' + context.getters.getCurgameid).set(context.getters.getGameUsers,function(error) {
		if(error) {
		    context.commit('setErrorno',-11);
		    context.commit('setErrormsg','ゲームユーザ情報更新失敗、しばらくしてからやり直してください ' + error);
		    console.log('[ERR] ' + '/gameusers/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getGameUsers);
		}}
								       )
	},
	
	async storeShiairecDb (context,payload)  {
	    firebase.database().ref('/shiairec/' + context.getters.getCurgameid).set(context.getters.getShiairec,function(error) {
		if(error) {
		    context.commit('setErrorno',-12);
		    context.commit('setErrormsg','試合情報更新失敗、しばらくしてからやり直してください ' + error);		    
		    console.log('[ERR] ' + '/shiairec/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getShiairec);
		}}
								       )
	},


	
	async addShiairecDb (context,payload)  {
	    payload.shiairec.forEach( v => {
		firebase.database().ref('/shiairec/' + context.getters.getCurgameid + '/' + (v.id-1) ).set(v).then(function(error) {
		    if(error) {
		    context.commit('setErrorno',-13);
		    context.commit('setErrormsg','試合情報更新失敗、しばらくしてからやり直してください ' + error);		    			
		    console.log('[ERR] ' + '/shiairec/' + context.getters.getCurgameid);
		    console.log('[ERR]' + error);
		    console.log('[ERR] ' + context.getters.getShiairec);
		}}
														   )
	    })
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

	removeGamedata(context,payload) {
	    const updates= {};
	    updates['/games/' + payload.curgameid] =null;
	    updates['/shiairec/' + payload.curgameid] =null;
	    updates['/gameusers/' + payload.curgameid] =null;
	    firebase.database().ref().update(updates);
	    context.dispatch('loadMyGamesAction');
	},
	setShiaiRecAction(context,payload) {
	    payload.shiairec=[];
	    axios.get('/' + context.getters['getPeoples'] +'.csv')
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
		    if(payload.isRenewal) {
			context.commit('initGameState');
			context.commit('setShiaiRec',payload);
			context.dispatch('storeGameDb');
			context.dispatch('storeGameUsersDb');
			context.dispatch('storeShiairecDb');
		    } else {
			context.dispatch('addShiairecDb',payload);
		    }
		})
		.catch(error => {
		    context.commit('setErrorno',-14);
		    context.commit('setErrormsg','乱数情報読み込みエラー、ホーム画面に戻ってもう一度作り直してください ' + error);
		    exit(-14);
		})
	}
    }
})
