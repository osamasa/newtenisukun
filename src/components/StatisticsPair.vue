<template>
      <base-material-card
	color="success"
	icon="mdi-chart-bar"
	title="ペアの勝率"
	class="px-5 py-3"
	>
	<div v-if="isLogin">
	<v-simple-table>
          <thead>
	    <tr>
              <th>番号</th>
              <th>名前</th>
              <th>勝率</th>
            </tr>
          </thead>
	  <tbody>
              <tr>
		<td>1</td><td>オサダ</td><td>.586</td>
              </tr>
	      <tr>			      
	      <td>1</td><td>今井</td><td>.386</td>
              </tr>
	      <tr>			      	      
		<td>1</td><td>津田</td><td>.386</td>		
	      </tr>
	  </tbody>
	</v-simple-table>
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
export default {
    name : 'StatisticsPair',
    data: () => {
	return {
            isLogin: false
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.commit('setUser',{'user' : user});
		this.$store.dispatch('loadMyGamesAction');
	    } else {
		this.isLogin = false;
	    }
	})
    },
    mounted() {
    },
    computed: {
    },
    methods: {
	doLogin : function() {
	    this.$store.dispatch('setIsLoadingAction',true);
	    this.$store.dispatch('setNextPathAction',{'path' : '/'});
	    this.$store.dispatch('doSave');
	    this.$router.push({ name: 'Signin' });
        }
    }
}
</script>
