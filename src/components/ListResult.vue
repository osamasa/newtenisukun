<template>
  <v-app v-if="isLogin">    
    <base-material-card
      color="success"
      icon="mdi-play-circle"
      title="試合結果"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th>試合日時</th>
            <th>場所</th>
            <th>人数</th>
          </tr>
        </thead>

	<tbody v-for="(n,index) in this.mygames" :key="index">
    <tr @click="linkurl(index)">
            <td>{{ n['gamedate'] }}</td>
            <td>{{ n['gameplace'] }}</td>
    <td>{{ n['peoples'] }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
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
	    mygames : {},
	    isLogin: false
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		firebase.database().ref('/games').orderByChild('users/' + user.uid).startAt(true).endAt(true).once('value',function(snapshot) {
		    if(snapshot.val()) {
			this.mygames = snapshot.val();
		    } else {
			console.log('error');
		    }
		})
	    } else {
		this.isLogin = false;
	    }
	})
    },
    computed: {
    },
    methods: {
	linkurl : function(i) {
	    this.$store.dispatch('resetGames');
	    this.$router.push('/game/' + i);
	}
    }
}
</script>
