<template>
  <v-row justify="center">
    <v-dialog v-model="isAnonymous" persistent max-width="480" v-if="isAnonymous">
      <v-card>
	<v-card-title class="headline">ログイン方法をお選びください</v-card-title>
	<v-list>
	  <v-list-item>
            <v-list-item-content>
	      <v-btn color="grey lighten-5" @click="authGoogle">Google</v-btn>
            </v-list-item-content>
	  </v-list-item>
	</v-list>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="">戻る</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import store from '../store/'
export default {
    name: 'Signin',
    data: () => ({
	nexturl: '',
	isAnonymous: false
    }),
    created() {
	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
		this.isAnonymous = user.isAnonymous;
	    }
	    if((user) && (!user.isAnonymous)) {
		this.$router.push('/');		
	    }
	})
    },
    methods: {
	authGoogle () {
	    const provider = new firebase.auth.GoogleAuthProvider()
	    const googleUser = firebase.auth().signInWithRedirect(provider).catch(function(error) {
		console.log('[ERR] ' + error.code + ' ' + error.message);
	    });		       
	    const credential = firebase.auth.GoogleAuthProvider.credential(
		googleUser.getAuthResponse().id_token);
	    firebase.auth().currentUser.linkWithCredential(credential).then(function(usercred) {
		const user = usercred.user;
		this.isAnonymous = false;
		this.$store.dispatch('loadUserInfoDbAction',{'user':user});
		this.$route.push('/');
	    }, function(error) {
		console.log("Error upgrading anonymous account", error);
	    });
	}
    }
}
</script>
