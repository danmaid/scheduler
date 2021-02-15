<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>予定表</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-icon v-if="calendars.length <= 0">mdi-arrow-right</v-icon>
      <v-btn icon to="/settings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab to="/week">週表示</v-tab>
          <v-tab to="/day">日表示</v-tab>
          <v-tab v-for="[id, v] of views" :key="id" :to="{ name: 'custom', params: { value: id, options: v } }">
            <span v-text="v.name"></span>
            <v-btn icon small @click="deleteView(v)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-tab>
          <v-btn icon @click="$router.push({ name: 'custom', params: { value: 'new' } })">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-content>
      <router-view v-model="params" @save="save($event)" />
    </v-content>

    <v-footer> <v-spacer></v-spacer>&copy; 2020 男メイド </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
// import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      views: this.load(),
      params: undefined
    }
  },
  watch: {
    params(v) {
      this.save(v)
      this.$router.replace({ params: { value: v.id, options: v } })
    }
  },
  methods: {
    load() {
      const views = new Map()
      try {
        const loaded = JSON.parse(localStorage.getItem('views'))
        loaded.forEach(([id, v]) => {
          views.set(id, v)
        })
        console.log('loaded.', views)
      } catch {
        //
      }
      return views
    },
    save(v) {
      this.views.set(v.id, v)
      const views = Array.from(this.views)
      localStorage.setItem('views', JSON.stringify(views))
      console.info('saved.', this.views)
      this.views = this.load()
    },
    deleteView(v) {
      this.views.delete(v.id)
      const views = Array.from(this.views)
      localStorage.setItem('views', JSON.stringify(views))
      console.info('deleted.', this.views)
      this.views = this.load()
    }
  },
  computed: {
    ...mapState({
      // loggedin: state => state.account.loggedin,
      // me: state => state.account.me
      calendars: state => state.calendars
    })
  }
  // mounted() {
  //   this.getMe()
  // },
  // methods: {
  //   ...mapActions({
  //     login: 'account/login',
  //     logout: 'account/logout',
  //     getMe: 'account/getMe'
  //   }),
  //   debug(v) {
  //     console.debug('debug', v)
  //   }
  // }
}
</script>

<style>
:root {
  overflow-y: auto;
}
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.ms-logo {
  margin-left: 6px;
  font-family: 'Segoe UI';
  font-size: 15px;
  font-weight: 600;
  color: #5e5e5e;
} */
</style>
