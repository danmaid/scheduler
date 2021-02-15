<template>
  <v-dialog :value="true" width="400">
    <v-card>
      <v-toolbar>Microsoft (Office 365)</v-toolbar>
      <v-card-text>
        <v-form></v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="account" class="d-flex align-baseline" @click="logout">
          <v-img src="../assets/ms-symbollockup_mssymbol_19.svg" />
          <span class="pl-2">{{ account.name }}</span>
          <v-icon right>mdi-logout</v-icon>
        </v-btn>
        <v-btn v-else class="d-flex align-center" :loading="loading" @click="login">
          <v-img src="../assets/ms-symbollockup_mssymbol_19.svg" />
          <span class="ms-logo">サインイン</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as msal from '@azure/msal-browser'

export default {
  data() {
    return {
      clientId: '209c5b80-d738-40bf-838f-13cb8b2fd392',
      msalInstance: undefined,
      loading: false,
      account: undefined
    }
  },
  methods: {
    async login() {
      this.loading = true
      const config = { auth: { clientId: this.clientId } }
      this.msalInstance = new msal.PublicClientApplication(config)
      const res = await this.msalInstance.loginPopup({})
      console.log('res', res)
      this.account = res.account
      this.loading = false
    },
    async logout() {
      const res = await this.msalInstance.logout()
      console.log('res', res)
    }
  }
}
</script>

<style scoped>
.ms-logo {
  margin-left: 6px;
  font-family: 'Segoe UI';
  font-size: 15px;
  font-weight: 600;
}
</style>
