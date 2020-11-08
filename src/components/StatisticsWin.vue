<template>
      <base-material-card
	color="success"
	icon="mdi-chart-bar"
	title="自分の勝率"
	class="px-5 py-3"
	>
	<div v-if="isLogin">
	<v-simple-table>
          <thead>
	    <tr>
              <th>試合数</th>
              <th>勝ち数</th>
              <th>負け数</th>	      
              <th>引き分</th>	      
              <th>勝率</th>	      
            </tr>
          </thead>
	  <tbody>
              <tr>
		<td>{{ getMyshiaiCount}}</td><td>{{ getMywinCount }}</td><td>{{ getMyshiaiCount - ( getMydrawCount +  getMywinCount) }}</td><td>{{ getMydrawCount }}</td><td>.{{ Math.floor(getMywinCount / (getMyshiaiCount-getMydrawCount) * 1000) }}</td>
              </tr>
	  </tbody>
	</v-simple-table>
	<v-simple-table>
	  <thead><th>ペア名前</th><th>試合数</th><th>勝ち数</th><th>負け数</th><th>引き分</th><th>勝率</th></thead>
	  <tbody>
	  <tr v-for="(item,key) in this.getMyPairshiaiCountAll" v-if="key>=start && key<end">
	    <td>{{ item.name }}</td>
	    <td>{{ item.shiaicount }}</td>
	    <td>{{ item.wincount }}</td>
	    <td>{{ item.shiaicount-(item.drawcount+item.wincount) }}</td>
	    <td>{{ item.drawcount }}</td>
	    <td>.{{ Math.floor(item.wincount / (item.shiaicount-item.drawcount) * 1000) }}</td>
          </tr>
	  </tbody>	  
	</v-simple-table>
	<v-pagination
	  v-model="page"
	  :length="length"
          @input = "getNumber"
          ></v-pagination>	
	</div>	
	<v-card-text v-else>
          <div class="subtitle-1 font-weight-light">
            自分の今までの履歴を確認できます
          </div>
          <v-container class="pa-0" fluid >
	    <v-btn @click="doLogin">ログイン</v-btn>
          </v-container>
        </v-card-text>
      </base-material-card>
</template>
<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex'
export default {
    name : 'StatisticsWin',
    data: () => {
	return {
            isLogin: false,
            page: 1,
	    start: 0,
	    end: 5,
	    nowcount: 0,
	    limit : 5	    
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.commit('setUser',{'user' : user});
		this.$store.dispatch('loadMyGamesWinResultsPairAction');
	    } else {
		this.isLogin = false;
	    }
	})
    },
    mounted() {
    },
    computed: {
	...mapGetters([
	    'getMyPairshiaiCountAll'
	]),
    	length : function () {
	    return Math.floor(this.getMyPairshiaiCountAll.length / this.limit) + (this.getMyPairshiaiCountAll.length % this.limit > 0 ? 1 : 0);
	},
	getMyshiaiCount : function() {
	    let _shiainum=0;
	    let _self=this;	    
	    Object.keys(this.getMyPairshiaiCountAll).forEach( v => {
		_shiainum = _shiainum + _self.getMyPairshiaiCountAll[v].shiaicount;
	    })
	    return _shiainum;
	},
	getMywinCount : function() {
	    let _winnum=0;
	    let _self=this;
	    Object.keys(this.getMyPairshiaiCountAll).forEach( v => {
		_winnum = _winnum + _self.getMyPairshiaiCountAll[v].wincount;
	    })
	    return _winnum;	    
	},
	getMydrawCount : function() {
	    let _drawnum=0;
	    let _self=this;
	    Object.keys(this.getMyPairshiaiCountAll).forEach( v => {
		_drawnum = _drawnum + _self.getMyPairshiaiCountAll[v].drawcount;
	    })
	    return _drawnum;	    
	}	
    },
    methods: {
	doLogin : function() {
	    this.$store.dispatch('setIsLoadingAction',true);
	    this.$store.dispatch('setNextPathAction',{'path' : '/'});
	    this.$store.dispatch('doSave');
	    this.$router.push({ name: 'Signin' });
        },
	getNumber : function(number){
	    this.page = number;
	    this.start = (number-1) * this.limit;
	    this.end = this.start + this.limit;	    
	}	
    }
}
</script>
