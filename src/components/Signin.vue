<template>
  <div v-if="notLogin">
    <v-btn color="grey lighten-5" @click="authGoogle">Google</v-btn>
    <v-btn color="error" @click="authYahoo">Yahoo!</v-btn>
    <v-btn color="indigo" @click="authFacebook">FaceBook</v-btn>
  </div>
<div v-else>
しばらくお待ちください    
</div>
</template>
<script>
import firebase from 'firebase'
import store from '../store/'
export default {
    name: 'Signin',
    data: () => ({
	nexturl: '',
	notLogin: false
    }),
    created() {
	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
	        console.log(user);
		this.notLogin = false;
	    } else {
		this.notLogin = true;
	    }
	})
    },
    methods: {  
	authGoogle () {
	    const provider = new firebase.auth.GoogleAuthProvider()
	    firebase.auth().signInWithRedirect(provider)
	},
	authYahoo() {
	    const provider = new firebase.auth.OAuthProvider('yahoo.com');
	    firebase.auth().signInWithRedirect(provider)
	},
	authFacebook() {
	    const provider = new firebase.auth.FacebookAuthProvider();
	    firebase.auth().signInWithRedirect(provider)
	},
	authMicrosoft() {
	    const provider = new firebase.auth.OAuthProvider('microsoft.com');
	    firebase.auth().signInWithRedirect(provider)
	}
  }
}
</script>
