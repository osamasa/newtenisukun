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
              <th>削除</th>	      
            </tr>
          </thead>
	  <tbody>
              <tr v-for="(item,key) in mygames" :key="key" v-if="key>=start && key<end">
    <td @click="linkurl(item.id)" >{{ key+1 }}</td>
              <td @click="linkurl(item.id)" >{{ item.gamedate }}</td>
              <td @click="linkurl(item.id)" >{{ item.gameplace }}</td>
	      <td @click="linkurl(item.id)" >{{ item.peoples }}</td>
	      <td><v-btn @click="curitem=item;dialog=true" icon><v-icon>mdi-delete</v-icon></v-btn></td>
	      
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

        <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">削除しますか？</v-card-title>
          <v-card-text>
	  
	 <div>日付：{{ curitem.gamedate }}</div>
	 <div>場所：{{ curitem.gameplace }}</div>
	 <div>人数：{{ curitem.peoples }}人</div>
	  </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">NO</v-btn>
            <v-btn color="green darken-1" text @click="dialog = false;deletegame(curitem.id);">YES</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>      
      
      </base-material-card>
</template>
<script>
import firebase from 'firebase';
export default {
    name : 'ListResults',
    data: () => {
	return {
	    curitem: {},
	    dialog:false,
            isLogin: false,
	    uid: null,
            page: 1,
	    start: 0,
	    end: 5,
	    nowcount: 0,
	    limit : 5,
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
    	length : function () {
	    return Math.floor(this.$store.getters.getMyGamesCount / this.limit) + (this.$store.getters.getMyGamesCount % this.limit > 0 ? 1 : 0);
	},
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
	    let routeData = this.$router.resolve('/gameresult/'+i );
	    window.open(routeData.href, '_blank');
	},
	deletegame : function(_id) {
            this.$store.dispatch('removeGamedata', {'curgameid': _id})
	    this.$store.dispatch('loadMyGamesAction');	    
	},
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
