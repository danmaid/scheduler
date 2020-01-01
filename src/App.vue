<template>
  <v-app>
    <v-app-bar app>
      <v-spacer />
      <template v-if="loggedin == true">
        <v-chip v-if="me" outlined pill>
          <v-img src="./assets/ms-symbollockup_mssymbol_19.svg" />
          {{ me.displayName }}
        </v-chip>
        <v-btn text class="d-flex align-center" outlined tile @click="logout">
          <v-img src="./assets/ms-symbollockup_mssymbol_19.svg" />
          <span class="ms-logo">サインアウト</span>
        </v-btn>
      </template>
      <template v-else>
        <v-btn text class="d-flex align-center" outlined tile @click="login">
          <v-img src="./assets/ms-symbollockup_mssymbol_19.svg" />
          <span class="ms-logo">サインイン</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      loggedin: state => state.account.loggedin,
      me: state => state.account.me
    })
  },
  methods: {
    ...mapActions({
      login: 'account/login',
      logout: 'account/logout',
      getMe: 'account/getMe'
    })
  },
  mounted() {
    this.getMe()
  }
}
</script>

<style lang="scss">
:root {
  overflow-y: auto;
}
#app {
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
}
</style>
