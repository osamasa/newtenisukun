<template>
  <v-app v-if="isLogin">
    <v-container>
      <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">番号</th>
            <th class="text-left">名前</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="isDialog=true;nowrec=item;" v-for="item in gameusers" :key="item.no">
            <td>{{ item.no }}</td>
            <td >{{ item.displayName }}</td>
          </tr>
        </tbody>
      </template>
      </v-simple-table>
      <v-dialog v-model="isDialog" persistent max-width="450px" >
	<v-card>
	  <v-card-title>
	    <span class="headline">メンバー入力</span>
	  </v-card-title>
	  <v-card-text>
	    <v-container>
	      <tr v-for="(value, key, index) in loginusers" v-bind:key="key">
		<td>{{ value.displayName }}</td>
		<td>{{ value.photoURL }}</td>
	      </tr>
	    </v-container>
	  </v-card-text>
	  <v-card-actions>
	    <v-spacer></v-spacer>
	    <v-btn @click="isDialog=false;" color="blue darken-1">Close</v-btn>
	  </v-card-actions>
	</v-card>
      </v-dialog>  
    </v-container>
  </v-app>
  <div v-else>
  しばらくおまちください
  </div>
</template>
<script>
import firebase from 'firebase';
export default {
    data: () => {
	return {
            isLogin: false,
	    isDialog: false,
	    nowrec: {},
	}},
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('setCurgamidAction',{ curgameid: this.$route.params.curgameid });
		this.$store.dispatch('loginUserDatabaseAction');		
		this.$store.dispatch('loadGameMemberDatabaseAction');
		this.$store.dispatch('loadLoginUsersDatabaseAction');
	    } else {
		this.isLogin = false;
	    }
	})	     	
    },
    computed: {
	loginusers() {
	    var obj = this.$store.getters.getLoginUsers;
	    return this.$store.getters.getLoginUsers;
	},
	gameusers: {
	    get() {
     		return this.$store.getters.getGameUsers;
	    },
	    set() {
		this.$store.commit('setGameUsers', this.nowrec);
	    }
	}
    },
    methods: {
    }
};
</script>    
