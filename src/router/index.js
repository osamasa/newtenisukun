import Vue from 'vue'
import store from './../store'
import Router from 'vue-router'
import Game from '../components/HelloWorld'
import Signout from '../components/Signout'
import Signin from '../components/Signin'
import AssignMember from '../components/AssignMember'
import GameResult from '../components/GameResult'
import ModPage from '../components/ModPage.vue'
import Index from '../components/index'
import firebase from 'firebase'
import ChangeAuth from '../components/ChangeAuth.vue'
import qrvcode from '../components/ViewQRCode.vue'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
	{
	    path: '/',
	    name: 'Index',
	    component: Index
	},
	{
	    path: '/changeauth',
	    name: 'ChangeAuth',
	    component: ChangeAuth,
	},
	{
	    path: '/modpage/:curgameid',
	    name: 'modpage',
	    component: ModPage
	},	
	{
	    path: '/gameresult/:curgameid',
	    name: 'GameResult',
	    component: GameResult
	},
	{
	    path: '/qrvcode/:ope/:curgameid',
	    name: 'qrvcode',
	    component: qrvcode
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
	    path: '/signout',
	    name: 'SignOut',
	    component: Signout
	},
	{
	    path: '/signin',
	    name: 'Signin',
	    component: Signin,
	    meta: { requiresAuthChangeURL: true  }
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
