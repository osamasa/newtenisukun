<template>

      <base-material-card
	icon="mdi-badminton"
        color="warning"
        class="px-5 py-6"
	title="乱数表作成"
        >
      <v-form ref="form" v-model="valid" lazy-validation v-if="isLogin">
	<v-text-field
          v-model="name"
          :rules="nameRules"
          :counter="10"
          label="場所"
          required
	  ></v-text-field>
	<v-select
          v-model="peoples"
          :items="items"
          :chips="true"
	  label="人数">
	</v-select>
	<Datetime v-model="gamedate"
		  :rules="dateTimeRules"
		  :no-value-to-custom-elem="true"
		  :minute-interval="30"
		  :format="'YYYY-MM-DD HH:mm'"
		  :overlay="true"
		  required
		  /></Datetime>
<v-spacer></v-spacer>
<div>
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="creategame"
      >
        開始
      </v-btn>
      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        クリア
      </v-btn>
</div>
</v-form>
<v-card-text v-else>
  <div class="subtitle-1 font-weight-light">
    ログインするとすぐに作成できます
  </div>
  <v-btn @click="doLogin">ログイン</v-btn>
</v-card-text>
        </base-material-card>

</template>
<script>
import Datetime from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import firebase from 'firebase';

export default {
    name: 'CreateGame',
    data: () => ({
	valid : true,
        isLogin: false,
	peoples:5,
	items:[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	valid: false,
	name: '',
	nameRules: [
	    v => !!v || '場所名はご入力ください'
	],
	dateTimeRules: [
	    v => !!v || '日時はご入力ください'
	],
        fromDateMenu: false,
        gamedate: null,
    }),
    created() {
	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
		this.isLogin = true;
		this.$store.dispatch('loadUserInfoDbAction',{'user': user});		
	    } else {
		this.isLogin = false;
	    }
	})
    },    
    components: {
	Datetime
    },
    methods: {
        reset: function() {
	    this.$refs.form.reset();
	},
	creategame: function (event) {
	    let ret=this.$refs.form.validate();

	    if(ret) {
		this.$store.dispatch('resetGames');	    
		this.$store.dispatch('createGameidAction');
		
		console.log(this.$store.getters.getCurgameid);
		
		this.$store.dispatch('setPeoplesAction',{'peoples': this.peoples});
		this.$store.dispatch('setGamedateAction',{'gamedate': this.gamedate});
    		this.$store.dispatch('setGameplaceAction',{'gameplace': this.name});
		this.$store.dispatch('setShiaiRecAction',{isRenewal:true});
		let routeData = this.$router.resolve('/game/'+this.$store.getters.getCurgameid );
		window.open(routeData.href, '_blank');
	    }
	},
	doLogin : function() {
	    this.$store.dispatch('setNextPathAction',{'path' : '/'});
	    this.$store.dispatch('doSave');
	    this.$router.push({ name: 'Signin' });
	}    
    }
}
</script>
