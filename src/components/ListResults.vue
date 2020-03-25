<template>
      <base-material-card
	color="success"
	icon="mdi-play-circle"
	title="試合結果"
	class="px-5 py-3"
	>
	<div v-if="isLogin">
	<v-simple-table>
          <thead>
    <tr>
               <th>番号</th>
              <th>試合日時</th>
              <th>場所</th>
              <th>人数</th>
            </tr>
          </thead>
	  <tbody>
              <tr v-for="(item,key) in mygames" :key="key" @click="linkurl(item.id);">
    <td>{{ key+1 }}</td>
              <td>{{ item.gamedate }}</td>
              <td>{{ item.gameplace }}</td>
	      <td>{{ item.peoples }}</td>
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
export default {
    name : 'ListResults',
    data: () => {
	return {
            isLogin: false,
	    uid: null,
            page: 1,
	    nowcount : 0,
            length: 6,
	    limit : 5,
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('loadMyGamesCountAction');
		let a=Math.floor(this.$store.getters.getMyGamesCount / this.limit);
		let b=this.$store.getters.getMyGamesCount % this.limit > 0 ? 1 : 0;

		this.length = a + b;
		
		this.$store.dispatch('loadMyGamesAction',{
		    'page' : this.page,
		    'limit' : this.limit
		});
	    } else {
		this.isLogin = false;
	    }
	})
    },
    mounted() {
    },
    computed: {
	mycount : function () {
	    this.nowcount = this.nowcount + 1;
	    return this.nowcount;
	},
	mygames : function () {
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
        },
	getNumber : function(number){
	    this.page = number;
	    this.$store.dispatch('loadMyGamesAction',{'page' : this.page,
						      'limit' : this.limit
						     });
	}
    }
}
</script>
