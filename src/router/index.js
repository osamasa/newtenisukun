import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/HelloWorld'
import CreateGame from '../components/CreateGame'
import Signup from '../components/Signup'
import Signin from '../components/Signin'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
	{
	    path: '/creategame',
	    name: 'creategame',
	    component: CreateGame
	},
	{
	    path: '/game/:curgameid',
	    name: 'game',
	    component: Game
	},
	{
	    path: '/signup/:curgameid',
	    name: 'Signup',
	    component: Signup
	},
	{
	    path: '/signin/:curgameid',
	    name: 'Signin',
	    component: Signin
	}      
    ]
})
