<template>
  <v-app>    
    <v-container 
      id="regular-tables"
      fluid
      tag="section"
      >
      <base-v-component
	heading="試合結果"
      link="components/simple-tables"
    />

    <base-material-card
      icon="mdi-information"
      color="orange"
      title="試合情報"
      class="px-5 py-3"
    >
      <v-card-text>
        <v-container class="pa-0" fluid >
	  <v-row >
            <v-col>
	      <div>場所: {{this.getGame('gameplace')}}</div>
	      <div>日時: {{this.getGame('gamedate')}}から</div>
	      <div>人数: {{this.getGame('peoples')}}人</div>	      	      
            </v-col>
	  </v-row>
      	  <v-row  justify="end">
    <v-col cols=3>
	<a target="_blank" :href="getMyURL"><img src="@/assets/line.png"/></a>    
        </v-col>
	</v-row>
        </v-container>
      </v-card-text>
    </base-material-card>

    <div class="py-3" />    

    <base-material-card
      icon="mdi-account-multiple"
      color="lime"      
      title="参加選手"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th class="primary--text">
              番号
            </th>
            <th class="primary--text">
              名前
            </th>
            </th>
            <th class="primary--text">
              勝ち
            </th>
            <th class="primary--text">
              負け
            </th>
            <th class="primary--text">
              引き分け 
            </th>	    	    	    
          </tr>
        </thead>
        <tbody v-for="(n,index) in this.getGameusers()" :key="index">
          <tr>
            <td>{{ n['no'] }} </td>
            <td>{{ n['displayName']}}</td>
	    <td>{{ getWinNum(n['no'])}}</td>
	    <td>{{ getLoseNum(n['no'])}}</td>
	    <td>{{ getDrawNum(n['no'])}}</td>
	  </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>

    <div class="py-3" />

    <base-material-card
      color="success"
      icon="mdi-play-circle"
      title="試合結果"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th>試合番号</th>
            <th>第１ペア</th>
            <th></th>
            <th>第２ペア</th>
          </tr>
        </thead>

	<tbody v-for="(n,index) in this.getShiairec()" :key="index">
          <tr v-if="n['rs']" >
            <td>{{ n['id'] }}</td>
            <td>{{getShiaiResult(n['r1'],n['r2'])}} {{ n['p1'] }},{{ n['p2'] }}</td>
            <td>{{ n['r1'] }} VS {{ n['r2'] }}</td>
            <td>{{getShiaiResult(n['r2'],n['r1'])}} {{ n['p3'] }},{{ n['p4'] }}</td>
            <td></td>
          </tr>
        </tbody>
      </v-simple-table>
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
          color="orange"
          @click="playgame"
        >
          <v-icon>mdi-badminton</v-icon>
    </v-btn>
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
      </v-speed-dial>    
    </v-fab-transition>    
          </v-layout>

	</v-col>	
    </v-row>

</v-footer>
    
  </v-app>
</template>
<script>
import firebase from 'firebase';
export default {
    data: () => {
	return {
	}
    },
    title: '今日のテニス結果',    
    created() {
    	this.$store.dispatch('setCurgamidAction',{ curgameid: this.$route.params.curgameid });
	this.$store.dispatch('loadGameDbAction');
	this.$store.dispatch('loadGameDatabaseAction');
	this.$store.dispatch('loadGameMemberDatabaseAction');
	this.isLogin = false;
    },
    methods: {
    assignmember: function() {
	this.$router.push('/assignmember/' + this.$store.getters.getCurgameid);
    },	
        playgame: function() {
	    this.$router.push('/game/' + this.$store.getters.getCurgameid);
	},
        showqrcode: function() {
	    this.$router.push('/viewqrcode/gameresult/' + this.$store.getters.getCurgameid);
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
	getGame : function(n) {
	    return this.$store.getters.getGame[n];
	},
        getGameusers : function(n) {
	    return this.$store.getters.getGameUsers;
	},
	getShiairec : function() {
	    return this.$store.getters.getShiairec
	},
    	getWinNum: function(no) {
	    return this.$store.getters.getShiairec.filter(function(item, index){
		if (((item.p1 == no) || (item.p2 == no)) && (item.rs ==1)) {
		    return true;
		} else if(((item.p3 == no) || (item.p4 == no)) && (item.rs ==2)) {
		    return true;		    
		}
	    }).length;
	},
    	getLoseNum: function(no) {
	    return this.$store.getters.getShiairec.filter(function(item, index){
		if (((item.p1 == no) || (item.p2 == no)) && (item.rs ==2)) {
		    return true;
		} else if(((item.p3 == no) || (item.p4 == no)) && (item.rs ==1)) {
		    return true;		    
		}
	    }).length;
	},
    	getDrawNum: function(no) {
	    return this.$store.getters.getShiairec.filter(function(item, index){
		if (((item.p1 == no) || (item.p2 == no) || (item.p3 == no) || (item.p4 == no)) && (item.rs ==3)) {
		    return true;		    
		}
	    }).length;
	},
	goback: function() {
	    this.$router.push('/game/' + this.$route.params.curgameid);
	}	
    },
    computed: {
	getMyURL : function() {
  	  return encodeURI("https://line.me/R/msg/text/?ゲームの結果を確認する場合は下記をクリック\r\n\r\nhttps://mytenisransuuhyoukunv3.firebaseapp.com/" + this.$route.path + "\r\n\r\n");	
	}
    }
}
</script>
