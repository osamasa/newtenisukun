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
	    このソフトは、仲間同士でテニスのダブルスするときに、組み合わせを決定するのに役立つ乱数表作成ソフトです。
	    
	    <div class="title">特徴は？</div>
	  <ul>
	    <li> 人数とコート面数から最適なダブルスの組み合わせを作れます</li>
	    <li> お持ちのSNSアカウントでログインすれば、試合の記録が録れます。</li>
	    <li> お友達もログインすれば一緒に試合記録が録れます。</li>
	    <li> あとで試合レポートも確認できます</li>
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
	<v-spacer></v-spacer>
        <base-material-card
	  icon="mdi-asterisk"
          color="info"
          class="px-5 py-6"
	  title="お知らせ"
          >
          <v-card-text>
	    ベータ版公開開始(2020/03/28)
	  </v-card-text>
        </base-material-card>	  
      </v-col>
      <v-col
	cols="12"
	sm="6"
	lg="6"
	>
	<v-spacer></v-spacer>
        <base-material-card
	  icon="mdi-auto-fix"
          color="alert"
          class="px-5 py-6"
	  title="使い方"
          >
          <v-card-text>
	    ---工事中---
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
  </v-container>
</template>

<script>
    import ListResults from './ListResults.vue'
    import CreateGame from './CreateGame.vue'  
    export default {
    name: 'DashboardDashboard',
    components: {
	ListResults,
	CreateGame
    },
    data () {
	return {
      }
    },
    methods: {
    },
  }
</script>
