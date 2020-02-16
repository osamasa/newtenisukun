<template>
  <v-app>
    <v-container>
      <v-card v-for="(n,index) in getResult" :key="index">
	第{{ n['id'] }}試合
	<v-row
	  class='mb-1'
	  no-gutters>
	  <v-col
	    v-for="k in 4"
	    :key="k"
	    cols="6">
	    <div v-if="k==1">
	      <v-btn>{{ n['p1'] }}</v-btn>
	      <v-btn>{{ n['p2'] }}</v-btn>
	    </div>
	    <div v-else-if="k==2">
	      <v-btn>{{ n['p3'] }}</v-btn>
	      <v-btn>{{ n['p4'] }}</v-btn>
	    </div>
	    <div v-else-if="k==3">
	      <div v-if="n['rs'] > 0">
		{{ n['rs'] ==  1 ? '○' : n['rs'] == 2 ? '☓' : '△'}}{{ n['r1'] }}
		<v-card-actions>
		  <v-btn color="primary" @click="dialog=true;nowrec=n;">結果修正</v-btn>
		</v-card-actions>
	      </div>
	      <div v-else>
		<v-card-actions>
		  <v-btn color="primary" @click="dialog=true;nowrec=n;">結果入力</v-btn>
		</v-card-actions>
	      </div>
	    </div>	      	    
	    <div v-else-if="k==4">
	      <div v-if="n['rs'] > 0">
		{{ n['rs'] ==  2 ? '○' : n['rs'] == 1 ? '☓' : '△'}}{{ n['r2'] }}
	      </div>
	    </div>
	  </v-col>
	</v-row>
      </v-card>
      <v-card>
	<v-btn :x-large=true color='secondary' :block=true @click='addRecord'>もっと試合を行う</v-btn>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="450px" v-if="dialog">
	<v-card>
	  <v-card-title>
	    <span class="headline">勝敗入力</span>
	  </v-card-title>
	  <v-card-text>
	    <v-container>
	      <div>
		<input type="radio" v-model="nowrec.rs" value="1">{{nowrec.p1}},{{nowrec.p2}}の勝ち
	      </div>
	      <div>
		<input type="radio" v-model="nowrec.rs" value="2">{{nowrec.p3}},{{nowrec.p4}}の勝ち
	      </div>
	      <div>
		<input type="radio" v-model="nowrec.rs" value="3">引き分け
	      </div>
	      <div>
		{{nowrec.p1}},{{nowrec.p2}}の点数:
		<select v-model="nowrec.r1">
		  <option disabled value="">Please select one</option>
		  <option>0</option>
		  <option>1</option>
		  <option>2</option>
		  <option>3</option>
		  <option>4</option>
		  <option>5</option>  
		  <option>6</option>
		  <option>7</option>
		  <option>8</option>  
		</select>
	      </div>
	      <div>
		{{nowrec.p3}},{{nowrec.p4}}の点数:
		<select v-model="nowrec.r2">
		  <option disabled value="">Please select one</option>
		  <option>0</option>
		  <option>1</option>
		  <option>2</option>
		  <option>3</option>
		  <option>4</option>
		  <option>5</option>  
		  <option>6</option>
		  <option>7</option>
		  <option>8</option>  
		</select>
	      </div>
	    </v-container>
	  </v-card-text>
	  <v-card-actions>
	    <v-spacer></v-spacer>
	    <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
	  </v-card-actions>
	</v-card>
      </v-dialog>      
      
    </v-container>
  </v-app>  
</template>

<script>
export default {
    data: () => {
	return {
	    dialog: false,
	    localCount: 5,
	    nowrec: {}
	}},
    computed:{
	getResult: function() {
	    return this.$store.getters.getShiairec;
        },
	getShiaiResult: function (r1,r2) {
	    if(r1==r2) {
		return '△';
	    } else if(r1 > r2) {
		return '○';
	    } else {
		return '☓'
	    }
	}	
    },
    methods: {
        setResult: function() {
//	    this.$store.dispatch('updateShiaiRec');
	    this.dialog = false;
	},		
	addRecord: function() {
	    this.$store.dispatch('setShiaiRecAction');
	}
    }
};
</script>
