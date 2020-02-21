import Vue from 'vue'
import store from './../store'
import Router from 'vue-router'
import Game from '../components/HelloWorld'
import CreateGame from '../components/CreateGame'
import Signout from '../components/Signout'
import Signin from '../components/Signin'
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
	    path: '/game/:curgameid',
	    name: 'game',
	    component: Game,
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
	    component: Signin
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
    } 
    next()    
})

export default router;
