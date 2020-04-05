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
    <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              label="日付を選択"
              :rules="dateTimeRules"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>

 <v-dialog
          ref="dialog"
          v-model="modal2"
          :return-value.sync="time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="time"
              label="時刻を選択"
              :rules="dateTimeRules"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modal2"
            v-model="time"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
          </v-time-picker>
        </v-dialog>

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
	name: '某所',
	nameRules: [
	    v => !!v || '場所名はご入力ください'
	],
	dateTimeRules: [
	    v => !!v || '日時はご入力ください'
	],
        date: null,
        time: null,	
	menu : false,
	modal2 : false
    }),
    created() {
        const hourcont = ['01','02', '03' , '04', '05','06','07', '08' , '09']
    	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth() < 9 ? '0' + (d.getMonth()+1) : d.getMonth()+1
	const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	let minutes = (d.getMinutes() < 31) && (d.getMinutes() > 0) ? '30' : '00';
	let hour = ((d.getMinutes() > 30) && (d.getMinutes() < 60)) ? d.getHours() : d.getHours()-1;

	this.date = `${ year }-${ month }-${ day }`;
	this.time = `${ hourcont[hour] ? hourcont[hour] : hour+1 }:${ minutes }`
	
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
		this.$store.dispatch('setPeoplesAction',{'peoples': this.peoples});
		this.$store.dispatch('setGamedateAction',{'gamedate': this.date + ' ' + this.time});
    		this.$store.dispatch('setGameplaceAction',{'gameplace': this.name});
		this.$store.dispatch('setShiaiRecAction',{isRenewal:true});
		let routeData = this.$router.resolve('/game/'+this.$store.getters.getCurgameid );
		window.open(routeData.href, '_blank');
	    }
	},
	doLogin : function() {
	    this.$store.dispatch('setIsLoadingAction',true);
	    this.$store.dispatch('setNextPathAction',{'path' : '/'});
	    this.$store.dispatch('doSave');
	    this.$router.push({ name: 'Signin' });
	}    
    }
}
</script>
