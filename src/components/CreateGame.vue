<template>
  <v-app v-if="isLogin">
    <v-container>
      <v-form v-model="valid">
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
		  :no-value-to-custom-elem="(true|false)"
		  :minute-interval="30"
		  :format="'YYYY-MM-DD HH:mm'"
		  :overlay="true"
		  /></Datetime>
	<v-btn color="primary" @click="creategame">開始</v-btn>
      </v-form>
    </v-container>
  </v-app>
  <div v-else>
しばらくおまちください
  </div>
</template>
<script>
import Datetime from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import md5 from 'md5';
import firebase from 'firebase';

export default {
    name: 'CreateGame',
    data: () => ({
        isLogin: false,
	curgameid: '',
	peoples:5,
	items:[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	valid: false,
	name: '',
	nameRules: [
	    v => !!v || 'Name is required',
	    v => v.length <= 256 || 'Name must be less than 256 characters'
	],
        fromDateMenu: false,
        gamedate: null,
    }),
    created() {
	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
		this.isLogin = true;
	    } else {
		this.isLogin = false;
	    }
	})
    },    
    components: {
	Datetime
    },
    methods: {
	creategame: function (event) {
	    this.curgameid = md5(this.name + this.gamedate + this.peoples);
	    this.$store.dispatch('setCurgamidAction',{'curgameid': this.curgameid});
	    this.$store.dispatch('setPeoplesAction',{'peoples': this.peoples});
	    this.$store.dispatch('setGamedateAction',{'gamedate': this.gamedate});
	    this.$store.dispatch('setShiaiRecAction',{isRenewal:true});

	    this.$router.push('/game/' + this.curgameid);
	}
    }
}

</script>
