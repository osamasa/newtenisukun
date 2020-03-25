<template>
  <v-app>
    <v-container>
      <base-material-card
	color="success"
	icon="mdi-play-circle"
	title="試合結果"
	class="px-5 py-3"
	 >
	<v-simple-table v-if="isLogin">
          <thead>
            <tr>
              <th>試合日時</th>
              <th>場所</th>
              <th>人数</th>
            </tr>
          </thead>
	  <tbody>
	    <tr v-for="(item,key) in mygames" :key="key" @click="linkurl(key);">
              <td>{{ item.gamedate }}</td>
              <td>{{ item.gameplace }}</td>
	      <td>{{ item.peoples }}</td>
            </tr>
          </tbody>
	</v-simple-table>
	<v-card-text v-else>
          <div class="subtitle-1 font-weight-light">
            自分の今までの履歴を確認できます
          </div>
          <v-container class="pa-0" fluid >
	    <v-btn @click="doLogin">ログイン</v-btn>
          </v-container>
        </v-card-text>
      </base-material-card>
    </v-container>
  </v-app>
</template>
<script>
import firebase from 'firebase';
export default {
    name : 'ListResults',
    data: () => {
	return {
            isLogin: false,
	    uid: null	    
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('loadMyGamesAction');		
	    } else {
		this.isLogin = false;
	    }
	})
    },
    computed: {
	mygames: function () {
	    return this.$store.getters.getMyGames;
	}
    },
    methods: {
	linkurl : function(i) {
	    let routeData = this.$router.resolve('/game/'+i );
	    window.open(routeData.href, '_blank');
	},
	doLogin : function() {
	    this.$store.dispatch('setNextPathAction',{'path' : '/'});
	    this.$store.dispatch('doSave');
	    this.$router.push({ name: 'Signin' });
	}
    }
}
</script>
