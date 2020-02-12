import Vue from 'vue'
import Router from 'vue-router'
import Game from '../components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/game/:curgameid',
      name: 'game',
      component: Game
    }
  ]
})
