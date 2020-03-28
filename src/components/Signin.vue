<template>
  <v-row justify="center">
    <v-dialog v-model="notLogin" persistent max-width="480" v-if="notLogin">
      <v-card>
	<v-card-title class="headline">ログイン方法をお選びください</v-card-title>
	<v-list>
	  <v-list-item>
            <v-list-item-content>
	      <v-btn color="grey lighten-5" @click="authGoogle">Google</v-btn>
            </v-list-item-content>
	  </v-list-item>
	  <v-list-item>
            <v-list-item-content>	  
	      <v-btn color="error" @click="authYahoo">Yahoo!</v-btn>
            </v-list-item-content>
	  </v-list-item>	      
	</v-list>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="">戻る</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-else>
      しばらくお待ちください    
    </div>
  </v-row>
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
		this.notLogin = false;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('loadUserInfoDbAction');
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
},

  }
}
</script>
