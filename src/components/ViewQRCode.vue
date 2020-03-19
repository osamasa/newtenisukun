<template>
  <v-app v-if="isLogin">
    <v-container>
      <vue-qrcode :value=getGameURL :options="option" tag="img"></vue-qrcode>
    </v-container>
  </v-app>
  <div v-else>
    しばらくおまちください
  </div>  
</template>

<script>
import firebase from 'firebase';
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
    components: {
	VueQrcode
    },    
    data: () => {
	return {
	    isLogin: false,
	    option: {
		errorCorrectionLevel: "M",
		maskPattern: 0,
		margin: 10,
		scale: 2,
		width: 300,
		color: {
		    dark: "#000000FF",
		    light: "#FFFFFFFF"
		}
	    }	    
	}},
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('setCurgamidAction',{ curgameid: this.$route.params.curgameid });
	    } else {
		this.isLogin = false;
	    }
	})	     	
    },
    computed:{
	getGameURL: function() {
	    return 'http://172.20.10.6:8080/game/' + this.$store.getters.getCurgameid;
	}
    },
    methods: {
    }
};
</script>
