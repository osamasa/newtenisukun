<template>
 <div v-if="notLogin">
    <button @click="authGoogle">Google login</button>
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
    }
  }
}
</script>
