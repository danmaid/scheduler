<template>
  <div class="events">
    <slot :events="events" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Events',
  props: {
    baseUrl: {
      type: String,
      required: true
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      events: undefined
    }
  },
  methods: {
    ...mapActions({
      getCalendarView: 'calendars/getCalendarView'
    }),
    getEvents() {
      clearTimeout(this.delay)
      this.delay = setTimeout(async () => {
        this.events = await this.getCalendarView({
          baseUrl: this.baseUrl,
          startDateTime: this.start,
          endDateTime: this.end
        })
      }, 50)
    }
  },
  computed: {
    updateTrigger() {
      return { start: this.start, end: this.end }
    }
  },
  watch: {
    updateTrigger() {
      this.getEvents()
    }
  },
  async mounted() {
    this.getEvents()
  }
}
</script>
