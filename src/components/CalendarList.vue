<template>
  <div class="calendar-list">
    <strong>個人</strong>
    <Calendar
      v-for="calendar of userCalendars"
      :key="calendar.id"
      :endpoint="`${config.baseurl}/users/${calendar.userId}/calendarView`"
      :name="calendar.name"
    />
    <strong>グループ</strong>
    <Calendar
      v-for="calendar of groupCalendars"
      :key="calendar.id"
      :endpoint="`${config.baseurl}/groups/${calendar.groupId}/calendarView`"
      :name="calendar.name"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Calendar from './Calendar.vue'
import { api as config } from 'config'

export default {
  name: 'CalendarList',
  components: { Calendar },
  data() {
    return {
      config
    }
  },
  computed: {
    ...mapState({
      userCalendars: state => state.calendars.userCalendars,
      groupCalendars: state => state.calendars.groupCalendars
    })
  },
  methods: {
    ...mapActions({
      getUserCalendars: 'calendars/getUserCalendars',
      getGroupCalendars: 'calendars/getGroupCalendars'
    })
  },
  mounted() {
    this.getUserCalendars()
    this.getGroupCalendars()
  }
}
</script>
