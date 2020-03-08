<template>
  <v-app v-if="isLogin">
    <v-container>
      <v-card
	max-width="500"
	class="mx-auto"
	>
	<v-toolbar
	  color="teal"
	  dark
	  >
	  <v-app-bar-nav-icon></v-app-bar-nav-icon>

	  <v-toolbar-title>試合結果</v-toolbar-title>

	  <v-spacer></v-spacer>

	  <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
	  </v-btn>
	</v-toolbar>

	<v-list>
	  <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
	    >
            <template v-slot:activator>
              <v-list-item-content>
		<v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="subItem in item.items"
              :key="subItem.title"
              @click=""
              >
              <v-list-item-content>
		<v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
	  </v-list-group>
	</v-list>
      </v-card>
    </v-container>
  </v-app>
  <div v-else>
    しばらくおまちください
  </div>
</template>
<script>
import firebase from 'firebase';

export default {
    name: 'ViewResult',
    data: () => ({
        isLogin: false,
	items: [
		{
		    action: '長田将司',
		    title: '3勝2負1分',
		    items: [
			{ title: '第一試合 ◎1,2 vs ☓3,4' },
			{ title: '第三試合 ◎1,2 vs ☓3,4' },			
		    ],
		},
		{
		    action: 'restaurant',
		    title: 'Dining',
		    active: true,
		    items: [
			{ title: 'Breakfast & brunch' },
			{ title: 'New American' },
			{ title: 'Sushi' },
		    ],
		},
		{
		    action: 'school',
		    title: 'Education',
		    items: [
			{ title: 'List Item' },
		    ],
		},
		{
		    action: 'directions_run',
		    title: 'Family',
		    items: [
			{ title: 'List Item' },
		    ],
		},
		{
		    action: 'healing',
		    title: 'Health',
		    items: [
			{ title: 'List Item' },
		    ],
		},
		{
		    action: 'content_cut',
		    title: 'Office',
		    items: [
			{ title: 'List Item' },
		    ],
		},
		{
		    action: 'local_offer',
		    title: 'Promotions',
		    items: [
			{ title: 'List Item' },
		    ],
		},
            ],

	}
    ),
    created() {
    	firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
    		this.isLogin = true;
		this.$store.dispatch('setUserAction',user);
		this.$store.dispatch('setCurgamidAction',{ curgameid: this.$route.params.curgameid });
		this.$store.dispatch('loginUserDatabaseAction');
		this.$store.dispatch('loadGameMemberDatabaseAction');
		this.$store.dispatch('loadLoginUsersDatabaseAction');
	    } else {
		this.isLogin = false;
	    }
	})	     	
    },    
    components: {
    },
    methods: {
    }
}
</script>    
