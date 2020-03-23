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

	<tbody v-for="(item,key) in mygames" :key="key">
	  <tr @click="linkurl(index)">
            <td>{{ item.gamedate }}</td>
            <td>{{ item.gameplace }}</td>
	    <td>{{ item.peoples }}</td>
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
            isLogin: false,
	    uid: null,
	    mygames: null
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
		console.log(1);
    		this.isLogin = true;
		this.uid = user.uid;
	    } else {
		console.log(2);
		this.isLogin = false;
	    }
	})
    },
    beforeMount() {
	const retval = {};
	firebase.database().ref('/games').orderByChild('users/' + this.uid).startAt(true).endAt(true).once('value',function(snapshot) {
	    if(snapshot.val()) {
		snapshot.forEach(function(childSnapshot) {
		    let childKey = childSnapshot.key;
		    let childData = childSnapshot.val();
		    retval[childKey] = childData;
		})		    
	    } else {
		console.log('[error] ' + '/games/users/' + this.uid);
	    }
	})
	this.mygames =  retval;
    },
    methods: {
	linkurl : function(i) {
	    this.$router.push('/game/' + i);
	}
    }
}
</script>
