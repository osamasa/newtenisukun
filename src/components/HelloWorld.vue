<template>
  <v-app v-if="isLogin">
    <base-material-card
      icon="mdi-animation-play"
      color="info"
      class="px-5 py-9"
      :title="thisTitle"
      >
      <div align="right">
	<a target="_blank" :href="getMyURL"><img src="@/assets/line.png"/></a>
      </div>
      <v-card v-for="(n,index) in getResult" :key="index" @click="nowTouch = index"
	      v-bind:class="{ active: isActive(index) }"
	      >
	<v-card-title>
	<v-icon v-show="index==nowTouch">mdi-checkbox-marked-circle</v-icon>第{{ n['id'] }}試合
	</v-card-title>	
	<v-card-text>	
	  <v-row
	    class='mb-1'
	    no-gutters>
	    <v-col
	      v-for="k in 4"
	      :key="k"
	      cols="6">
	      <div v-if="k==1">
		<v-btn @click="isDialog=true;nowrec=n;">{{ n['p1'] }}</v-btn>
		<v-btn @click="isDialog=true;nowrec=n;">{{ n['p2'] }}</v-btn>
	      </div>
	      <div v-else-if="k==2">
		<v-btn @click="isDialog=true;nowrec=n;">{{ n['p3'] }}</v-btn>
		<v-btn @click="isDialog=true;nowrec=n;">{{ n['p4'] }}</v-btn>
	      </div>
	      <div v-else-if="k==3">
		<div v-if="n['rs'] > 0">
		  {{ n['rs'] ==  1 ? '○' : n['rs'] == 2 ? '☓' : '△'}}{{ n['r1'] }}	      </div>
	      </div>	      	    
	      <div v-else-if="k==4">
		<div v-if="n['rs'] > 0">
		  {{ n['rs'] ==  2 ? '○' : n['rs'] == 1 ? '☓' : '△'}}{{ n['r2'] }}
		</div>
	      </div>
	    </v-col>
	  </v-row>
	</v-card-text>
	<v-row>
	  <v-col cols=1>
	    <v-card-actions v-if="n['rs'] > 0">
	      <v-btn color="primary" @click="isDialog=true;nowrec=n;">結果修正&メモ入力</v-btn>
	    </v-card-actions>
	    <v-card-actions v-else>
	      <v-btn color="primary" @click="isDialog=true;nowrec=n;">結果入力&メモ入力</v-btn>
	    </v-card-actions>	
	  </v-col>
	</v-row>      
      </v-card>

      <v-dialog v-model="isDialog" persistent max-width="640px" v-if="isDialog">
	<v-card>
	  <v-card-title>
	    <span class="headline">勝敗入力</span>
	  </v-card-title>
	  <v-card-text>
	    <v-row>
	      <v-col>
		<v-radio-group v-model="nowrec.rs" row>
		  <v-radio label="なし" value="radio-1"></v-radio>
		  <v-radio :label="this.getRadioLabel(nowrec.p1,nowrec.p2)" value="1"></v-radio>
		  <v-radio :label="this.getRadioLabel(nowrec.p3,nowrec.p4)" value="2"></v-radio>
		  <v-radio label="引き分け" value="3"></v-radio>		     
		</v-radio-group>
	      </v-col>
	    </v-row>
	    <v-row><v-col>
		{{nowrec.p1}},{{nowrec.p2}}の点数:
		<v-select v-model="nowrec.r1"
			  outlined
			  label="点数を選択してください2"
			  :items="[0,1,2,3,4,5,6,7,8,9,10]"		
			  >
		</v-select>
	    </v-col></v-row>				
	    <v-row><v-col>
		{{nowrec.p3}},{{nowrec.p4}}の点数:
		<v-select v-model="nowrec.r2"
			  outlined
			  label="点数を選択してください2"
			  :items="[0,1,2,3,4,5,6,7,8,9,10]"		
			  >
		</v-select>
    </v-col></v-row>
    	  <v-row v-show="!isAnonymous">
	    <v-col>
	      <v-text-field
		label="メモを入力（他の人には見られません）"
		dense
		@change="chgMemos(nowrec.id-1)"
		v-model="getMyMemos[nowrec.id-1]"
		></v-text-field>
	    </v-col>
	  </v-row>
	  </v-card-text>
	  <v-card-actions>
	    <v-spacer></v-spacer>
	    <v-btn color="warning" @click="setResult">閉じる</v-btn>
	  </v-card-actions>
	</v-card>
      </v-dialog>
    </base-material-card>  
    <v-footer
      padless
      fixed
    >
    <v-row>
    <v-col
        cols="12"
        class="pa-0"
    >
    <v-bottom-navigation
      dark
    >
      <v-btn value="試合追加" @click='addRecord'>
        <span>試合追加</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
  
      <v-btn value="メンバー割" @click="assignmember">
        <span>メンバー割</span>
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
  
      <v-btn value="結果確認" @click="showresult">
        <span>結果を確認する</span>
        <v-icon>mdi-check-circle</v-icon>
    </v-btn>

      <v-btn value="QRコード" @click="showqrcode">
        <span>QRコード表示</span>
        <v-icon>mdi-qrcode</v-icon>
      </v-btn>
    </v-bottom-navigation>
    </v-col>
      </v-row>
    </v-footer>
  </v-app>
  <div v-else>
    しばらくおまちください
  </div>
</template>

<script>
    import firebase from 'firebase';

export default {
    title: 'テニス試合中', 
    data: () => {
	return {
	    nowTouch:0,
            isLogin: false,
	    isDialog: false,
	    nowrec: {},
	}},
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if ( user ) {
    		this.isLogin = true;
		this.$store.dispatch('loadUserInfoDbAction',{'user': user});
		this.$store.dispatch('setCurgamidAction',{'curgameid': this.$route.params.curgameid});
		this.$store.dispatch('storeGamesUsersDbAction');
		this.$store.dispatch('setUserInfoDbGameAction');		
		this.$store.dispatch('loadGameDbAction');
  		this.$store.dispatch('loadMyMemosDatabaseAction');		
		if(!this.$store.getters.getShiairecNum) {
  		    this.$store.dispatch('loadGameDatabaseAction');
    	        }
	    } else {
		this.isLogin = false;
	    }
	})	     	
    },
    mounted() {
    },
    computed:{
        getMyMemos: function() {
	    return this.$store.getters.getMyMemos;
	},
        isActive: function() {
            return function(i) {
		return (i === this.nowTouch);
	    }
	},
	isAnonymous : function() {
	    this.$store.getters.getUser.isAnonymous;
	},
        getRadioLabel: function() {
	    return function (p1,p2) {
		return p1 + ','  + p2 + 'の勝ち'
	    }
        },
        thisTitle: function() {
	    return this.$store.getters.getGameplace + ' (' + this.$store.getters.getGamedate + ') ' + this.$store.getters.getPeoples + '人';
	},
	getResult: function() {
	    return this.$store.getters.getShiairec;
        },
	getMyURL : function() {
	    return encodeURI("https://line.me/R/msg/text/?" + this.$store.getters.getGameplace + ' (' + this.$store.getters.getGamedate + ') ' + "のゲームに参加していただける場合は下記のリンクをクリック\r\n\r\nhttps://rshkn3.web.app" + this.$route.path + "\r\n\r\n");
	}
    },
    methods: {
        chgMemos: function(index) {
	    this.$store.dispatch('updateMyMemoAction',{'id': index});
	},
	assignmember: function() {
	    this.$router.push('/assignmember/' + this.$store.getters.getCurgameid);
	},
	showqrcode: function() {
	    this.$router.push('/viewqrcode/game/' + this.$store.getters.getCurgameid);
	},
	showresult: function() {
	    this.$router.push('/gameresult/' + this.$store.getters.getCurgameid);
	},
	setResult: function() {
	    this.$store.dispatch('updateShiaiRecAction',this.nowrec);
	    this.isDialog = false;
	},		
	addRecord: function() {
	    this.$store.dispatch('setShiaiRecAction',{isRenewal:false});
	}
    }
}
</script>
