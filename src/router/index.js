import Vue from 'vue'
import store from './../store'
import Router from 'vue-router'
import Game from '../components/HelloWorld'
import CreateGame from '../components/CreateGame'
import Signout from '../components/Signout'
import Signin from '../components/Signin'
import TSignin from '../components/TSignin'
import AssignMember from '../components/AssignMember'
import ViewResult from '../components/ViewResult'
import GameResult from '../components/GameResult'
import ListResult from '../components/ListResult'
import ViewQRCode from '../components/ViewQRCode'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
	{
	    path: '/creategame',
	    name: 'CreateGame',
	    component: CreateGame,
	    meta: { requiresAuth: true }	    
	},
	{
	    path: '/listresult',
	    name: 'ListResult',
	    component: ListResult,
	    meta: { requiresAuth: true }	    
	},
	{
	    path: '/viewqrcode/:ope/:curgameid',
	    name: 'viewqrcode',
	    component: ViewQRCode
	},	
	
	{
	    path: '/gameresult/:curgameid',
	    name: 'GameResult',
	    component: GameResult,
	    meta: { requiresAuth: true  }
	},	
	{
	    path: '/game/:curgameid',
	    name: 'game',
	    component: Game,
	    meta: { requiresAuth: true  }
	},
	{
	    path: '/assignmember/:curgameid',
	    name: 'assignmember',
	    component: AssignMember,
	    meta: { requiresAuth: true  }
	},
	{
	    path: '/viewresult/:curgameid',
	    name: 'viewresult',
	    component: ViewResult,
	    meta: { requiresAuth: true  }
	},
	{
	    path: '/signout',
	    name: 'SignOut',
	    component: Signout
	},
	{
	    path: '/signin',
	    name: 'Signin',
	    component: Signin,
	    meta: { requiresAuthChangeURL: true  }
	},
	{
	    path: '/tsignin',
	    name: 'TSignin',
	    component: TSignin
	}
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
	// すでに認証済みの場合は遷移
	if (firebase.auth().currentUser) {
	    next()
	    return
	}
	// まだ認証されていない場合は Firebase SDK からのコールバックを待つ
	firebase.auth().onAuthStateChanged(user => {
	    if (user) {
		next()
	    } else {
		store.dispatch('setNextPathAction',to);
		store.dispatch('doSave');
		next({ name: 'Signin' })
	    }
	    return
	})
    } else if (to.matched.some(record => record.meta.requiresAuthChangeURL)) {
	firebase.auth().onAuthStateChanged(user => {
	    if (user) {
		store.dispatch('doLoad');
		next(store.getters.getNextPath);
	    }
	})
    }
    next()    
})

export default router;
