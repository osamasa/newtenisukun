<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      >
      <router-link to="/" icon @click="">
        <v-icon>mdi-home</v-icon>
      </router-link>
      <h3>テニス乱数表君V3</h3>
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
    }
};
</script>

<style scoped>
a.router-link-active::before {
  width : 100%;
  opacity : 1;
}
</style>