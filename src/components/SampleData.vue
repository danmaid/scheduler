<template>
  <v-icon>mdi-check</v-icon>
</template>

<script>
import { v4 as uuid } from 'uuid'

export default {
  data() {
    return {
      calendars: this.genTestData()
    }
  },
  mounted() {
    this.$emit('input', this.calendars)
  },
  destroyed() {
    this.$emit('input', null)
  },
  methods: {
    genTestData() {
      const g = () =>
        `data:application/json,${encodeURIComponent(
          JSON.stringify(this.genTestEvents())
        )}`

      return [
        { id: '1', name: 'いち', owner: '一', category: '個人', url: g() },
        { id: '2', name: 'に', owner: '二', category: '個人', url: g() },
        { id: '3', name: 'さん', owner: '三', category: 'グループ', url: g() },
        { id: '4', name: 'よん', owner: '四', category: 'グループ', url: g() },
        { id: '5', name: 'ご', owner: '五', category: 'グループ', url: g() }
      ]
    },
    genTestEvents() {
      const names = [
        'Meeting',
        'Holiday',
        'PTO',
        'Travel',
        'Event',
        'Birthday',
        'Conference',
        'Party'
      ]
      const colors = [
        'blue',
        'indigo',
        'deep-purple',
        'cyan',
        'green',
        'orange',
        'grey darken-1'
      ]

      const min = new Date()
      min.setHours(0, 0, 0, 0)
      min.setDate(min.getDate() - 7)
      const max = new Date(min)
      max.setTime(max.getTime() - 1)
      max.setDate(max.getDate() + 5 * 8)

      const events = []
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 10)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          id: this.genId(),
          name: names[this.rnd(0, names.length - 1)],
          start: first,
          end: second,
          color: colors[this.rnd(0, colors.length - 1)]
        })
      }

      return events
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    genId: uuid
  }
}
</script>
