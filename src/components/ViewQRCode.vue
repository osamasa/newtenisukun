<template>
  <v-app>
    <v-container>
      <vue-qrcode :value=getGameURL :options="option" tag="img"></vue-qrcode>
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
    }
};
</script>
