<template>
  <v-app>
    <v-container>
      <base-material-card
	color="success"
	icon="mdi-play-circle"
	title="QRコード"
	class="px-5 py-8"
	>
	<v-row>
	<v-col>
<div v-if="isGame">
試合に参加するお友達を誘いましょう。
</div>
<div v-else>
試合が終わった後に結果をお知らせできます。
</div>
	</v-col>
	</v-row>
    <vue-qrcode :value=getGameURL :options="option" tag="img"></vue-qrcode>
    <div>
    <v-row>
    <v-col cols=2>
    <v-btn type="button"
      v-clipboard:copy="getGameURL"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">URLをコピー</v-btn>
    </v-col>
    </v-row>
    </div>
    </v-col>
    </v-row>
    </base-material-card>
    </v-container>
    <v-container>
    <v-btn @click="goback();" color="primary">戻る</v-btn>
        </base-material-card>
    </v-container>
  </v-app>
</template>

    <script>
    import firebase from 'firebase';
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
    title: '今日のテニス結果',
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
	    },
	}
    },
    computed:{
	getGameURL: function() {
	    return 'https://rshkn3.web.app/' + this.$route.params.ope + '/' + this.$route.params.curgameid;
	},
	isGame: function() {
	    if(this.$route.params.ope === "game") {
		return true;
	    } else {
		return false;
	    }
	}
    },
    methods: {
	goback: function() {
	    this.$router.go(-1);
	},
	onCopy: function (e) {
	    alert('You just copied: ' + e.text)
	},
	onError: function (e) {
	    alert('Failed to copy texts')
	}	
    }
};
</script>
