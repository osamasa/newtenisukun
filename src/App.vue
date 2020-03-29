<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
      <router-link to="/" class=".mycolor"><img src="@/assets/title.png"/></router-link>
      </div>
    <v-spacer></v-spacer>
    <v-avatar v-if="isLogin">
        <img
          :src="photoURL"
          :alt="displayName"
        >
    </v-avatar>
    <div class="d-flex align-center" v-if="isAnonymous">
       <v-btn @click="chgAuth">お試し中</v-btn>
    </div>
    <div class="d-flex align-center" v-else-if="isLogin">
       <v-btn @click="signOut">ログアウト</v-btn>
    </div>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>

     <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-list-item v-if="isLogin">
          <v-list-item-avatar>
	    <v-img :src="photoURL"></v-img>
          </v-list-item-avatar>
  
          <v-list-item-content>
            <v-list-item-title>{{ displayName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
	<v-list-item v-else>
          <v-list-item-content>
            <v-list-item-title>未ログイン</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
  	
        <v-divider></v-divider>
  
        <v-list dense>
 
          <v-list-item
            v-for="item in getItems"
            :key="item.title"
            link
          >
  	    <v-list-item-content>
    <v-list-item-title @click="chgURL(item.url)" >{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

    <v-footer>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}&nbsp;OSAMASA&nbsp;Inc.</div>
    </v-footer>

  </v-app>
</template>

<script>
import firebase from 'firebase';
export default {
    name: 'App',

    data: () => ({
	drawer: null,
	isLogin: false,
	isAnonymous : false,
	displayName: null,
	photoURL: null,
    }),
    mounted() {
	firebase.auth().onAuthStateChanged((user) => {
	    if(user) {
		this.isAnonymous = user.isAnonymous;	    
		this.displayName = user.displayName;
		this.photoURL = user.photoURL;
		this.isLogin = true;
	    }
	});
    },
    components: {
    },
    methods: {
	signOut: function () {
	    firebase.auth().signOut()
	    this.isLogin=false;
	    this.$router.push('/');
	},
	chgURL: function(url) {
	    this.$router.push(url)
	},
	chgAuth: function(url) {
	    this.$router.push('/changeauth');
	}	
    },
    computed: {
            getItems: function() {
		var items= [
		    { title: 'トップ', icon: 'dashboard', url: '/'},
		];

		if((this.isLogin) && (this.$store.getters.getShiairec)) {
		    items.push({ title: 'ゲーム画面', url: '/game/' + this.$store.getters.getCurgameid });
		items.push({ title: 'メンバー割当', url: '/assignmember/' + this.$store.getters.getCurgameid});
		    items.push({ title: '結果を見る', url: '/gameresult/' + this.$store.getters.getCurgameid });
		    items.push({ title: '友達を誘う', url: '/viewqrcode/game/' + this.$store.getters.getCurgameid });
		    items.push({ title: '結果を教える', url: '/viewqrcode/gameresult/' + this.$store.getters.getCurgameid });		    

		}

		return items;
	    }
    }
};
</script>

<style scoped>
a.router-link-active::before {
  width : 100%;
  opacity : 1;
}
</style>