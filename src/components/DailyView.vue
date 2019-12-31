<template>
  <div class="dayly-view">
    <div class="d-flex justify-space-between align-baseline calendar">
      <div class="title">
        <v-btn icon @click="gotoPrevious">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn text @click="gotoToday">今日</v-btn>
        <v-btn icon @click="gotoNext">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <div
        v-for="i in days"
        :key="i.toString()"
        class="day"
      >{{ ('00' + i.getHours()).slice(-2) }}:{{ ('00' + i.getMinutes()).slice(-2) }}</div>
    </div>
    <strong>個人</strong>
    <div v-for="calendar of userCalendars" :key="calendar.id" class="calendar">
      <div class="d-flex justify-space-between align-baseline">
        <div class="title">{{ calendar.name }}</div>
        <Events
          :baseUrl="`${config.baseurl}/users/${calendar.userId}`"
          :start="start"
          :end="end"
          v-slot="props"
          class="grid"
        >
          <div
            v-for="event in props.events"
            :key="event.id"
            :style="{
              'grid-column-start': getStartPos(event.start),
              'grid-column-end': getEndPos(event.end),
              display: getStartPos(event.start) === getEndPos(event.end) ? 'none' : 'block'
            }"
            class="event"
          >{{ event.subject }}</div>
        </Events>
      </div>
    </div>
    <strong>グループ</strong>
    <div v-for="calendar of groupCalendars" :key="calendar.id" class="calendar">
      <div class="d-flex justify-space-between align-baseline">
        <div class="title">{{ calendar.name }}</div>
        <Events
          :baseUrl="`${config.baseurl}/groups/${calendar.groupId}`"
          :start="start"
          :end="end"
          v-slot="props"
          class="grid"
        >
          <div
            v-for="event in props.events"
            :key="event.id"
            :style="{
              'grid-column-start': getStartPos(event.start),
              'grid-column-end': getEndPos(event.end),
              display: getStartPos(event.start) === getEndPos(event.end) ? 'none' : 'block'
            }"
            class="event"
          >{{ event.subject }}</div>
        </Events>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Events from '@/components/Events.vue'
import { api as config } from 'config'

export default {
  name: 'DailyView',
  components: { Events },
  props: {
    value: {
      type: Date,
      default() {
        return new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  },
  data() {
    return {
      config
    }
  },
  computed: {
    ...mapState({
      userCalendars: state => state.calendars.userCalendars,
      groupCalendars: state => state.calendars.groupCalendars
    }),
    baseDate: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    start() {
      const newdate = new Date(this.baseDate)
      return newdate
    },
    end() {
      const newdate = new Date(this.baseDate)
      newdate.setDate(newdate.getDate() + 1)
      return newdate
    },
    days() {
      return [...Array(24).keys()].map(i => {
        const newdate = new Date(this.baseDate)
        newdate.setHours(newdate.getHours() + i)
        return newdate
      })
    }
  },
  methods: {
    ...mapActions({
      getUserCalendars: 'calendars/getUserCalendars',
      getGroupCalendars: 'calendars/getGroupCalendars'
    }),

    gotoToday() {
      this.baseDate = new Date(new Date().setHours(0, 0, 0, 0))
    },
    gotoNext() {
      const newdate = new Date(this.baseDate)
      newdate.setDate(newdate.getDate() + 1)
      this.baseDate = newdate
    },
    gotoPrevious() {
      const newdate = new Date(this.baseDate)
      newdate.setDate(newdate.getDate() - 1)
      this.baseDate = newdate
    },

    getStartPos(date) {
      const start = Array.from(this.days)
        .reverse()
        .findIndex(v => v <= date)
      return start >= 0 ? this.days.length - start : 1
    },
    getEndPos(date) {
      const end = this.days.findIndex(v => date <= v) + 1
      return end > 0 ? end : -1
    },
    getGridPos(startDate, endDate) {
      const startRev = Array.from(this.days)
        .reverse()
        .findIndex(v => v <= startDate)
      const start = startRev >= 0 ? this.days.length - startRev : 1
      const end = this.days.findIndex(v => endDate <= v) + 1
      return `${start} / ${end}`
    }
  },
  mounted() {
    this.getUserCalendars()
    this.getGroupCalendars()
  }
}
</script>

<style scoped>
.calendar {
  border-bottom: 1px solid #000;
}
.title {
  flex: 0 0 200px;
}
.day {
  flex: 1 1 100%;
  border-left: 1px solid #000;
}
.grid {
  flex: 1 1 100%;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
}
.event {
  background: cyan;
  border: 1px solid;
}
</style>
