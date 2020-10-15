<template>
  <v-app>
    <v-container>
      <base-material-card
	color="success"
	icon="mdi-pencil-circle"
	title="ゲーム情報修正"
	class="px-5 py-8"
	>

      <v-form ref="form">
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
        color="success"
        class="mr-4"
        @click="updategame"
      >
        更新
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
      </base-material-card>
    </v-container>
    <v-container>
    <v-btn @click="goback();" color="primary">戻る</v-btn>
        </base-material-card>
    </v-container>
  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
    computed:{
    },
    data: () => ({    
	valid : true,
        isLogin: false,
	items:[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	valid: false,
	nameRules: [
	    v => !!v || '場所名はご入力ください'
	],
	dateTimeRules: [
	    v => !!v || '日時はご入力ください'
	],
	name: null,
        date: null,
        time: null,	
	menu : false,
	peoples : 0,
	modal2 : false
    }),
    created() {
	[this.date,this.time] = this.$store.getters.getGamedate.split(' ');
	this.name = this.$store.getters.getGameplace;
	this.peoples = this.$store.getters.getPeoples;
    },    
    methods: {
        reset: function() {
	    [this.date,this.time] = this.$store.getters.getGamedate.split(' ');
	    this.name = this.$store.getters.getGameplace;
	    this.peoples = this.$store.getters.getPeoples;
	},	
	goback: function() {
	    this.$router.go(-1);
	},
	updategame: function() {
	    const payload = {};
	    payload['gamedate'] = this.date + ' ' + this.time;
	    payload['gameplace'] = this.name;
	    if(this.peoples != this.$store.getters.getPeoples) {
		let tmp = [];
	    	for(let i=0;i<this.peoples;i++) {
		    tmp.push({
		    no:(i+1),
			userid: this.$store.getters.getGameUsers[i] && this.$store.getters.getGameUsers[i].userid || '',
			displayName: this.$store.getters.getGameUsers[i] && this.$store.getters.getGameUsers[i].displayName || '名無し',
			photoURL: this.$store.getters.getGameUsers[i] && this.$store.getters.getGameUsers[i].photoURL || ''
		    });
		}
		payload['peoples'] = this.peoples;
		payload['gameusers'] = tmp;
		this.$store.dispatch('storeGameUsersDb',payload);
//		this.$store.dispatch('removeShiairec',payload);
		this.$store.dispatch('setShiaiRecAction',payload);
	    }
	    this.$store.dispatch('updateGameData',payload);
	    this.$router.go(-1);
	}
    }
};
</script>
