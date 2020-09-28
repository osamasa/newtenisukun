<template>
<v-app v-if="isLogin">
  <v-alert v-if="getErrorno" type="error">
    {{ getErrorno }}:{{ getErrormsg }}
  </v-alert>  
    <base-material-card
      icon="mdi-animation-play"
      color="info"
      class="px-5 py-9"
      :title="thisTitle"
      >      
      <div align="right">
	<a target="_blank" :href="getMyURL"><img src="@/assets/line.png"/></a>
      </div>
      <div align="right">      
	<v-btn @click="showqrcodepage" dark x-small  color="deep-orange"><v-icon>mdi-qrcode</v-icon>QRコードで知らせる</v-btn>
      </div>	
      <v-card v-for="(n,index) in getResult" :key="index" @click="nowTouch = index"
	      v-bind:class="{ active: isActive(index) }"
	      >
	<v-card-title>
	<v-icon v-show="index==nowTouch">mdi-checkbox-marked-circle</v-icon>第{{ n['id'] }}試合
	</v-card-title>	
	<v-card-text>	
	  <v-row
	    no-gutters>
	    <v-col
	      v-for="k in 4"
	      :key="k"
	      cols="6">
	      <div v-if="k==1">
		<v-btn height="60" @click="nowrec=n;isDialog=true">{{ getMyName(n['p1']) }}</br>{{ n['p1'] }}</v-btn>
		<v-btn height="60" @click="nowrec=n;isDialog=true">{{ getMyName(n['p2']) }}</br>{{ n['p2'] }}</v-btn>
	      </div>
	      <div v-else-if="k==2">
		<v-btn height="60" @click="nowrec=n;isDialog=true;">{{ getMyName(n['p3']) }}</br>{{ n['p3']}}</v-btn>
		<v-btn height="60" @click="nowrec=n;isDialog=true;">{{ getMyName(n['p4']) }}</br>{{ n['p4'] }}</v-btn>
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
	      <v-btn color="primary" @click="isDialog=true;nowrec=n;">結果修正</v-btn>
	    </v-card-actions>
	    <v-card-actions v-else>
	      <v-btn color="primary" @click="isDialog=true;nowrec=n;">結果入力</v-btn>
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
	    <v-row><v-col>
		<p>{{getMyNameLong(nowrec.p1)}},{{getMyNameLong(nowrec.p2)}}の点数:</p>
		<v-select v-model="nowrec.r1"
			  outlined
			  label="点数を選択してください2"
			  :items="[0,1,2,3,4,5,6,7,8,9,10]"		
			  >
		</v-select>
	    </v-col></v-row>				
	    <v-row><v-col>
		<p>{{getMyNameLong(nowrec.p3)}},{{getMyNameLong(nowrec.p4)}}の点数:</p>
		<v-select v-model="nowrec.r2"
			  outlined
			  label="点数を選択してください2"
			  :items="[0,1,2,3,4,5,6,7,8,9,10]"		
			  >
		</v-select>
    </v-col></v-row>

	  </v-card-text>
	  <v-card-actions>
	    <v-spacer></v-spacer>
	    <v-btn color="warning" @click="setResult">閉じる</v-btn>
	  </v-card-actions>
	</v-card>
      </v-dialog>
    </base-material-card>
  <v-btn
    bottom
    large
    color="pink"
    dark
    fab
    fixed
    right
    @click="addRecord"
    >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
  
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
      <v-btn value="メンバー割" @click="assignmember">
        <span>メンバー割</span>
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
  
      <v-btn value="結果確認" @click="showresult">
        <span>結果を確認する</span>
        <v-icon>mdi-check-circle</v-icon>
    </v-btn>

      <v-btn value="修正" @click="showmodpage">
        <span>修正</span>
        <v-icon>mdi-pencil</v-icon>
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
import { mapGetters, mapMutations } from 'vuex'
export default {
    title: 'テニス試合中', 
    data: () => {
	return {
	    nowTouch:0,
            isLogin: false,
	    isDialog: false,
	    nowrec: {}
	}},
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if ( user ) {
    		this.isLogin = true;
		this.$store.commit('setCurgamid',{'curgameid': this.$route.params.curgameid});
		this.$store.commit('setUser',{'user':user});
		this.$store.dispatch('updateUserInfoDbAction');
		this.$store.dispatch('storeGamesUsersDbAction');
		this.$store.dispatch('loadGameDbAction');
		if(!this.$store.getters.getShiairecNum) {
  		    this.$store.dispatch('loadGameDatabaseAction');
    	        }
		this.$store.dispatch('loadGameMemberDatabaseAction');
	    } else {
		this.isLogin = false;
	    }
	})	     	
    },
    mounted() {
    },
    computed:{
	...mapGetters([
	    'getErrorno',
	    'getErrormsg'
	]),
	getMyName: function() {
	    return function(n) {
		let d = this.$store.getters.getGameUsers;
		if(!d) {
		    return n;
		} else {
		    let s = d.find(m => parseInt(m.no) == parseInt(n));
		    return s && s.displayName && s.displayName !== '名無し' ? (s.displayName.length > 2 ? s.displayName.substr(0,2) + '..' : s.displayName) : '';
		}
	    }
	},
	getMyNameLong: function() {
	    return function(n) {
		let d = this.$store.getters.getGameUsers;
		if(!d) {
		    return n;
		} else {
		    let s = d.find(m => parseInt(m.no) == parseInt(n));
		    return s && s.displayName && s.displayName !== '名無し' ? s.displayName + '(' + s.no + ')' : n;
		}
	    }
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
	    let self = this;
	    return function (p1,p2) {
		function getMyNameLong(n) {
		    let d = self.$store.getters.getGameUsers;
		    if(!d) {
			return n;
		    } else {
			let s = d.find(m => parseInt(m.no) == parseInt(n));
			return s && s.displayName && s.displayName !== '名無し' ? s.displayName + '(' + s.no + ')' : n;
		    }
		}		
		return getMyNameLong(p1) + ',' + getMyNameLong(p2) + 'の勝ち';
	    }
        },
        thisTitle: function() {
	    return this.$store.getters.getGameplace + ' (' + this.$store.getters.getGamedate + ') ' + this.$store.getters.getPeoples + '人';
	},
	getResult: function() {
	    return this.$store.getters.getShiairec;
        },
	getMyURL : function() {
	    return encodeURI("https://line.me/R/msg/text/?" + this.$store.getters.getGameplace + ' (' + this.$store.getters.getGamedate + ') ' + "のゲームに参加していただける場合は下記のリンクをクリック\r\n\r\nhttps://rshkn3.web.app" + this.$route.path + "\r\n\r\n" + "--\r\nテニス乱数表君V3\r\nhttps://rshkn3.web.app/\r\n");
	}
    },
    methods: {
	...mapMutations([
	    'setErrorno',
	    'setErrormsg'
	]),	
	assignmember: function() {
	    this.$router.push('/assignmember/' + this.$store.getters.getCurgameid);
	},
	showqrcodepage: function() {
	    this.$router.push('/qrvcode/game/' + this.$store.getters.getCurgameid);
	},	
	showmodpage: function() {
	    this.$router.push('/modpage/' + this.$store.getters.getCurgameid);
	},
	showresult: function() {
	    this.$router.push('/gameresult/' + this.$store.getters.getCurgameid);
	},
	setResult: function() {
	    if((this.nowrec.r1 > 0) || (this.nowrec.r2 > 0)) {
		if(this.nowrec.r1 > this.nowrec.r2) {
		    this.nowrec.rs = 1;
		} else if(this.nowrec.r2 > this.nowrec.r1) {
		    this.nowrec.rs = 2;
		} else if(this.nowrec.r1 === this.nowrec.r2) {
		    this.nowrec.rs = 3;
		}
	    }
	    this.$store.dispatch('updateShiaiRecAction',this.nowrec);
	    this.isDialog = false;
	},
	addRecord: function() {
	    this.$store.dispatch('setShiaiRecAction',{isRenewal:false});
	}
    }
}
</script>
