<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        md="12"
      >
	  
        <base-material-card
          color="light-blue darken-1"
          class="px-5 py-9"
        >
          <template v-slot:heading>
            <div class="display-1 font-weight-light">
              テニス乱数表くんV3
            </div>
          </template>
          <v-card-text>
	    このソフトはダブルス用テニス乱数表作成ソフトです。
	    
	    <div class="title">特徴は？</div>
	  <ul>
	    <li> 人数とコート面数から最適なダブルスの組み合わせを作る</li>
	    <li> お持ちのSNSアカウントでログインすれば試合の記録が録れる</li>
	    <li> お友達も一緒にログインすれば試合記録が録れる</li>
	    <li> あとで試合レポートも確認可能</li>
	  </ul>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <v-row>    
      <v-col
	cols="12"
	sm="6"
	lg="6"
	>
    <CreateGame></CreateGame>
      </v-col>
     <v-col
       cols="12"
       md="6"
       lg="6"
       >
       <v-spacer></v-spacer>
    <ListResults></ListResults>
     </v-col>
    </v-row>
    <v-row>
      <v-col>
	<StatisticsPair></StatisticsPair>
      </v-col>
      <v-col>
	<StatisticsWin></StatisticsWin>
      </v-col>	      
    </v-row>
  </v-container>
</template>

<script>
import ListResults from './ListResults.vue'
import CreateGame from './CreateGame.vue'
import StatisticsPair from './StatisticsPair.vue'
import StatisticsWin from './StatisticsWin.vue'  
export default {
    name: 'DashboardDashboard',
    components: {
	ListResults,
	CreateGame,
	StatisticsPair,
	StatisticsWin,	
    },
    data: () => ({

    }),    
    methods: {
    },
  }
</script>
