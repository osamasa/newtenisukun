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
              <th>勝率</th>	      
            </tr>
          </thead>
	  <tbody>
              <tr>
		<td>{{ getMyshiaiCount}}</td><td>{{ getMywinCount }}</td><td>.{{ Math.floor(getMywinCount / getMyshiaiCount * 1000) }}</td>
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
import { mapGetters } from 'vuex'
export default {
    name : 'StatisticsWin',
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
		this.$store.dispatch('loadMyGamesWinResultsAction');
	    } else {
		this.isLogin = false;
	    }
	})
    },
    mounted() {
    },
    computed: {
	...mapGetters([
	    "getMyshiaiCount",
	    "getMywinCount"
	])
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
