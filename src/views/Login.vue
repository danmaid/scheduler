<template>
  <div class="login">
    <v-btn @click="login">login</v-btn>
    <v-btn @click="getAccessToken">getAccessToken</v-btn>
    <v-btn @click="getMe">getMe</v-btn>
    <v-btn @click="getCalendars">getCalendars</v-btn>
    <v-btn @click="getCalendarGroups">getCalendarGroups</v-btn>
    <v-btn @click="getCalendarGroupCalendars">getCalendarGroupCalendars</v-btn>
    <v-btn @click="getGroups">getGroups</v-btn>
    <v-btn @click="getGroupsCalendars">getGroupsCalendars</v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      login: 'account/login',
      getAccessToken: 'account/getAccessToken',
      getMe: 'account/getMe',
      getCalendars: 'account/getCalendars',
      getCalendarGroups: 'account/getCalendarGroups',
      getCalendarGroupCalendars: 'account/getCalendarGroupCalendars',
      getGroups: 'account/getGroups',
      getGroupsCalendars: 'account/getGroupsCalendars'
    })
  }
}
</script>
