<template>
  <v-container class="day" fluid>
    <schedule-grid
      :value="calendars"
      :ranges="ranges"
      :label="label"
      @prev="prev"
      @next="next"
      @home="goToday"
      @refresh="getEventsFromApi"
    ></schedule-grid>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import ScheduleGrid from '../components/ScheduleGrid.vue'
import { formatDate } from '../libs/formatter'

export default {
  components: { ScheduleGrid },
  props: {
    date: {
      type: String,
      default: undefined
    }
  },
  computed: {
    ...mapState({
      calendars: state =>
        state.calendars.map(v => ({ ...v, loading: false, events: [] }))
    }),
    baseDate() {
      return this.date ? new Date(this.date) : new Date()
    },
    label() {
      // eslint-disable-next-line no-template-curly-in-string
      return formatDate(this.baseDate, '${yyyy}-${mm}-${dd}(${ddd})')
    },
    ranges() {
      const start = new Date(this.baseDate)
      start.setHours(0, 0, 0, 0)

      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      end.setTime(end.getTime() - 1)

      const points = new Array(24).fill().map((v, i) => {
        const date = new Date(start)
        date.setHours(date.getHours() + i)
        // eslint-disable-next-line no-template-curly-in-string
        const text = formatDate(date, '${HH}:${MM}')
        return { text, date }
      })

      return [{ start, end, points }]
    }
  },
  watch: {
    $route() {
      this.initialize()
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      this.calendars.forEach(v => {
        this.getEventsFromApi(v)
      })
    },
    async getEventsFromApi(v, trigger) {
      const item = v
      item.loading = true
      const url = item.url
      const res = await fetch(url)
      const text = await res.text()
      const events = JSON.parse(text, this.reviver)
      setTimeout(() => {
        if (Array.isArray(events)) {
          item.events = events.map(v => ({ ...v, trigger }))
        }
        item.loading = false
      }, 3000)
    },
    reviver(key, value) {
      return typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ? new Date(value)
        : value
    },
    prev() {
      const date = new Date(this.baseDate)
      date.setDate(date.getDate() - 1)
      this.$router.push({
        // eslint-disable-next-line no-template-curly-in-string
        params: { date: formatDate(date, '${yyyy}-${mm}-${dd}') }
      })
    },
    next() {
      const date = new Date(this.baseDate)
      date.setDate(date.getDate() + 1)
      this.$router.push({
        // eslint-disable-next-line no-template-curly-in-string
        params: { date: formatDate(date, '${yyyy}-${mm}-${dd}') }
      })
    },
    goToday() {
      const date = new Date()
      this.$router.push({
        // eslint-disable-next-line no-template-curly-in-string
        params: { date: formatDate(date, '${yyyy}-${mm}-${dd}') }
      })
    }
  }
}
</script>
