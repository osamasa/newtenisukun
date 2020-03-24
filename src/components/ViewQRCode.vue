<template>
  <v-app>
    <v-container>
    <vue-qrcode :value=getGameURL :options="option" tag="img"></vue-qrcode>
    <div>
    <v-btn type="button"
      v-clipboard:copy="getGameURL"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">URLをコピー</v-btn>
    </div>
    </v-container>              
    <v-container>
    <v-btn @click="goback();" color="primary">戻る</v-btn>
    </v-container>
  </v-app>
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
	}
    },
    computed:{
	getGameURL: function() {
	    return 'http://172.20.10.6:8080/' + this.$route.params.ope + '/' + this.$route.params.curgameid;
	}
    },
    methods: {
	goback: function() {
	    this.$router.go(-1);
	}	,
 onCopy: function (e) {
      alert('You just copied: ' + e.text)
    },
    onError: function (e) {
      alert('Failed to copy texts')
    }	
    }
};
</script>
