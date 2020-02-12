import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/HelloWorld'
import Signup from '../components/Signup'
import Signin from '../components/Signin'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
	{
	    path: '/game/:curgameid',
	    name: 'game',
	    component: Game
	},
	{
	    path: '/signup',
	    name: 'Signup',
	    component: Signup
	},
	{
	    path: '/signin',
	    name: 'Signin',
	    component: Signin
	}      
    ]
})
