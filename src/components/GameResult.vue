<template>
  <v-app v-if="isLogin">    
    <v-container 
      id="regular-tables"
      fluid
      tag="section"
      >
      <base-v-component
	heading="試合結果"
      link="components/simple-tables"
    />

    <base-material-card
      icon="mdi-information"
      color="orange"
      title="試合情報"
      class="px-5 py-3"
    >
      <v-card-text>
        <v-container class="pa-0" fluid >
	  <v-row >
            <v-col cols="1" md="6" >
	      <div>場所: {{this.getGame('gameplace')}}</div>
	      <div>日時: {{this.getGame('gamedate')}}から</div>
	      <div>人数: {{this.getGame('peoples')}}人</div>	      	      
            </v-col>
	  </v-row>
        </v-container>
      </v-card-text>
    </base-material-card>

    <div class="py-3" />    

    <base-material-card
      icon="mdi-account-multiple"
      color="lime"      
      title="参加選手"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th class="primary--text">
              番号
            </th>
            <th class="primary--text">
              名前
            </th>
            </th>
            <th class="primary--text">
              勝ち
            </th>
            <th class="primary--text">
              負け
            </th>
            <th class="primary--text">
              引き分け 
            </th>	    	    	    
          </tr>
        </thead>

        <tbody v-for="(n,index) in this.getGameusers()" :key="index">

          <tr>
            <td>{{ n['no'] }} </td>
            <td>{{ n['displayName']}}</td>
            <td>1</td>
            <td>2</td>
            <td>2</td>	    
	  </tr>
	  
        </tbody>
      </v-simple-table>
    </base-material-card>

    <div class="py-3" />

    <base-material-card
      color="success"
      icon="mdi-play-circle"
      title="試合結果"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>City</th>
            <th class="text-right">
              Salary
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Dakota Rice</td>
            <td>Niger</td>
            <td>Oud-Turnhout</td>
            <td class="text-right">
              $36,738
            </td>
          </tr>

          <tr>
            <td>2</td>
            <td>Minverva Hooper</td>
            <td>Curaçao</td>
            <td>Sinaas-Waas</td>
            <td class="text-right">
              $23,789
            </td>
          </tr>

          <tr>
            <td>3</td>
            <td>Sage Rodriguez</td>
            <td>Netherlands</td>
            <td>Baileux</td>
            <td class="text-right">
              $56,142
            </td>
          </tr>

          <tr>
            <td>4</td>
            <td>Philip Chaney</td>
            <td>Korea, South</td>
            <td>Overland Park</td>
            <td class="text-right">
              $38,735
            </td>
          </tr>

          <tr>
            <td>5</td>
            <td>Doris Greene</td>
            <td>Malawi</td>
            <td>Feldkirchen in Kärnten</td>
            <td class="text-right">
              $63,542
            </td>
          </tr>

          <tr>
            <td>6</td>
            <td>Mason Porter</td>
            <td>Chile</td>
            <td>Gloucester</td>
            <td class="text-right">
              $78,615
            </td>
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
	    isLogin: false
	}
    },
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('setCurgamidAction',{ curgameid: this.$route.params.curgameid });
		this.$store.dispatch('loadGameDatabaseAction');
		this.$store.dispatch('loadGameMemberDatabaseAction');
	    } else {
		this.isLogin = false;
	    }
	})
    },
    methods: {
	getShiaiResult: function (r1,r2) {
	    if(r1==r2) {
		return '△';
	    } else if(r1 > r2) {
		return '○';
	    } else {
		return '☓'
	    }
	},
	getGame : function(n) {
	    return this.$store.getters.getGame[n];
	},
        getGameusers : function(n) {
	    return this.$store.getters.getGameUsers;
	}
    }

}
</script>
