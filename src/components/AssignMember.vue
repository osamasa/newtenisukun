<template>
  <v-app v-if="isLogin">
    <v-container>
      <v-simple-table>
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
    </v-simple-table>
    <v-container>
      <v-btn @click="goback();" color="primary">戻る</v-btn>
    </v-container>      
      <v-dialog v-model="isDialog" persistent max-width="450px" >
	<v-card>
	  <v-card-title>
	    <span class="headline">メンバー入力</span>
	  </v-card-title>
	  <v-card-text>
	    <v-container>
    <v-list>
      <v-list-item
        v-for="(item,key) in loginusers"
	:key="key"
	@click="setData(item,key);isDialog=false"
         >
        <v-list-item-content>
          <v-list-item-title v-text="item.displayName"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-avatar>
          <v-img :src="item.photoURL"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
    
      <v-text-field
        v-model="nowrec.displayName"
        :counter="10"
        label="手入力の名前"
      ></v-text-field>
	    </v-container>
	  </v-card-text>
	  <v-card-actions>
	    <v-spacer></v-spacer>
	    <v-btn @click="setData(null,null);isDialog=false;" color="blue darken-1">閉じる</v-btn>	    
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
	    nowrec: {}
	}},
   created() {
       firebase.auth().onAuthStateChanged((user) => {
	   let retval = {};
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('setCurgamidAction',{ curgameid: this.$route.params.curgameid });
		
		this.$store.dispatch('loadGameMemberDatabaseAction');
	    }
	})
   },
    methods: {
	setData: function(v,k) {
	    this.$store.dispatch('setGameUsersOneAction', {
		nowrec: this.nowrec,
		key: k,
		value: v
	    })
	},
	goback: function() {
	    this.$router.go(-1);
	}
    },
    computed: {
	gameusers : function() {
	    return this.$store.getters.getGameUsers;
	},
	loginusers : function() {
	    const retval = {};
	    firebase.database().ref('/userinfo').orderByChild('games/' + this.$route.params.curgameid).startAt(true).endAt(true).once('value', function(snapshot) {
		if(snapshot.val()) {
		    snapshot.forEach(function(childSnapshot) {
			let childKey = childSnapshot.key;
			let childData = childSnapshot.val();
			retval[childKey] = childData;
		    })
		}
	    })
	    return retval;
	}
    }
};
</script>    
