<template>
  <v-app>
     <v-overlay
        opacity=0.46
	:value="isLoading"
     >
     <v-progress-circular
        :size="70"
        :width="7"
        color="white"
        indeterminate
      ></v-progress-circular>
     </v-overlay>
    <v-app-bar
      app
      color="primary"
      dark
      >
      <router-link to="/" icon @click="">
        <v-icon>mdi-home</v-icon>
      </router-link>
      <h3 color="info">テニス乱数表君V3</h3>
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
      <div>&copy; {{ new Date().getFullYear() }}&nbsp;OSAMASA&nbsp;Inc.
	<a href="mailto:osamasa@gmail.com">
	<v-icon
          large
      >
        mdi-email
      </v-icon></a></div>
    </v-footer>

  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'App',

    data: () => ({
	isAnonymous : false,
	displayName: null,
	photoURL: null,
	isLogin:false,
    }),
    components: {
    }, 
    created() {
	firebase.auth().onAuthStateChanged((user) => {
	    if(user) {
		this.isAnonymous = user.isAnonymous;	    
		this.displayName = user.displayName;
		this.photoURL = user.photoURL;
		this.isLogin = true;
	    } else {
	    	this.$store.dispatch('setIsLoadingAction',false);
	    }
	});
    },
    components: {
    },
    methods: {
	signOut: function () {
	    firebase.auth().signOut()
	    this.isLogin=false;
	    this.$store.dispatch('setIsLoadingAction',false);
	    this.$router.push('/');
	},
	chgURL: function(url) {
	    this.$router.push(url)
	},
	chgAuth: function(url) {
            this.$store.dispatch('setIsLoadingAction',true);
	    this.$router.push('/changeauth');
	}	
    },
    computed: {
      	isLoading: function() {
	   return this.$store.getters.getIsLoading;
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
