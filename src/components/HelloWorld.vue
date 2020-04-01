<template>
      
  <v-app v-if="isLogin">

    <v-container>

      <base-material-card
	icon="mdi-animation-play"
        color="info"
        class="px-5 py-9"
	:title="thisTitle"
        >
	<div align="right">
	<a target="_blank" :href="getMyURL"><img src="@/assets/line.png"/></a>
	</div>
      <v-card v-for="(n,index) in getResult" :key="index">
	第{{ n['id'] }}試合
	<v-row
	  class='mb-1'
	  no-gutters>
	  <v-col
	    v-for="k in 4"
	    :key="k"
	    cols="6">
	    <div v-if="k==1">
	      <v-btn>{{ n['p1'] }}</v-btn>
	      <v-btn>{{ n['p2'] }}</v-btn>
	    </div>
	    <div v-else-if="k==2">
	      <v-btn>{{ n['p3'] }}</v-btn>
	      <v-btn>{{ n['p4'] }}</v-btn>
	    </div>
	    <div v-else-if="k==3">
	      <div v-if="n['rs'] > 0">
		{{ n['rs'] ==  1 ? '○' : n['rs'] == 2 ? '☓' : '△'}}{{ n['r1'] }}
		<v-card-actions>
		  <v-btn color="primary" @click="isDialog=true;nowrec=n;">結果修正</v-btn>
		</v-card-actions>
	      </div>
	      <div v-else>
		<v-card-actions>
		  <v-btn color="primary" @click="isDialog=true;nowrec=n;">結果入力</v-btn>
		</v-card-actions>
	      </div>
	    </div>	      	    
	    <div v-else-if="k==4">
	      <div v-if="n['rs'] > 0">
		{{ n['rs'] ==  2 ? '○' : n['rs'] == 1 ? '☓' : '△'}}{{ n['r2'] }}
	      </div>
	    </div>
	  </v-col>
	</v-row>
      </v-card>
<!--      <v-card>
    <v-btn :x-large=true color='secondary' :block=true @click='addRecord'>もっと試合を行う</v-btn>
    </v-card>
-->
      <v-dialog v-model="isDialog" persistent max-width="640px" v-if="isDialog">
	<v-card>
	  <v-card-title>
	    <span class="headline">勝敗入力</span>
	  </v-card-title>
	  <v-card-text>
	    <v-container>
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
	    </v-container>
	  </v-card-text>
	  <v-card-actions>
	    <v-spacer></v-spacer>
	    <v-btn color="warning" @click="setResult">閉じる</v-btn>
	  </v-card-actions>
	</v-card>
      </v-dialog>
          </base-material-card>  
    </v-container>
    <v-footer
     padless
fixed
      >    
      <v-row>
	<v-col
	  cols="12"
	  class="pa-0"
	  >
	  <v-layout>
    <v-fab-transition>
 <v-speed-dial
        fab
	absolute
        bottom
	large
        right
        open-on-hover
      >
        <template v-slot:activator>
          <v-btn
            color="blue darken-2"
            dark
            fab
          >
            <v-icon>mdi-apple-keyboard-command</v-icon>	  
           </v-btn>
        </template>
        <v-btn
          fab
          dark
          small
          color="green"
	  @click="assignmember"	  
        >
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="indigo"
  	  @click="showqrcode"	  

        >
           <v-icon>mdi-qrcode</v-icon>	  	
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
	  @click="showresult"
        >
           <v-icon>mdi-check-circle</v-icon>	  		
        </v-btn>
        <v-btn                    
                    color="pink"
                    fab
                    dark
                    small
                    @click='addRecord'
                  >
                    <v-icon>mdi-plus</v-icon>
    </v-btn>
	
      </v-speed-dial>    
    </v-fab-transition>    
          </v-layout>

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
            isLogin: false,
	    isDialog: false,
	    localCount: 5,
	    scrollY : 0,
	    nowrec: {}
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
		if(!this.$store.getters.getShiairecNum) {
  		    this.$store.dispatch('loadGameDatabaseAction');
    	        }
	    } else {
		this.isLogin = false;
	    }
	})	     	
    },
    mounted() {
	window.addEventListener('scroll', this.calculateScrollY);
    },
    beforeDestroy() {
	window.removeEventListener('scroll', this.calculateScrollY);
    },
    computed:{
	isLoading: function() {
             this.$store.getters.getIsLoading();
	},
        getRadioLabel: function() {
	  return function (p1,p2) {
             return p1 + ','  + p2 + 'の勝ち'
	     }
        },
        thisTitle: function() {
	    return this.$store.getters.getGameplace + ' (' + this.$store.getters.getGamedate + ') ' + this.$store.getters.getPeoples + '人';
	},
	getShiairecNum: function() {
	    return this.$store.getters.getShiairecNum;
	},
	getResult: function() {
	    return this.$store.getters.getShiairec;
        },
	getShiaiResult: function (r1,r2) {
	    if(r1==r2) {
		return '△';
	    } else if(r1 > r2) {
		return '○';
	    } else {
		return '☓'
	    }
	},
	getMyURL : function() {

  	  return encodeURI("https://line.me/R/msg/text/?ゲームに参加していただける場合は下記のリンクをクリック\r\n\r\nhttps://mytenisransuuhyoukunv3.firebaseapp.com/" + this.$route.path + "\r\n\r\n");
	}
    },
methods: {
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
	},
	calculateScrollY: function() {
	    const scrollHeight = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	    );

	    const pageMostBottom = scrollHeight - window.innerHeight;

	    if((this.scrollY <= window.scrollY) && ((( window.scrollY / pageMostBottom) * 100) > 95)) {
		this.hidden = false;
	    } else {
		this.hidden = true;
	    }
	    this.scrollY = window.scrollY;
	}
    }
};
</script>
