<template>
  <v-container class="custom" fluid>
    <v-data-table :headers="headers" :items="calendars" group-by="category" disable-sort>
      <template v-slot:header.name>
        <v-btn icon @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span style="cursor:pointer" v-text="formatDate(baseDate)" @click="goToday"></span>
        <v-btn icon @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.actions="{ value, item }">
        <v-btn icon :disabled="!item.url" :loading="item.loading" @click="getEventsFromApi(item)">
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.events="{ value, header, item }">
        <template v-for="event of showEvents(value, header)">
          <v-menu :key="event.id" :close-on-content-click="false" offset-x>
            <template v-slot:activator="{ on }">
              <v-chip
                style="width:100%"
                label
                :color="event.color"
                :disabled="item.loading"
                v-text="event.name"
                v-on="on"
              ></v-chip>
            </template>
            <v-card>
              <v-toolbar :color="event.color">
                <v-toolbar-title v-text="event.name"></v-toolbar-title>
              </v-toolbar>
              <v-list>
                <v-list-item v-for="(value, key) of event" :key="`${event.id}-${key}`">
                  <v-list-item-content v-text="key"></v-list-item-content>
                  <v-list-item-content v-text="value"></v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      headerStart: [
        {
          value: 'name',
          divider: true,
          width: 200,
          class: 'pa-1 d-flex align-center justify-space-between'
        },
        { value: 'left', sortable: false, width: 10, class: 'px-1' }
      ],
      headerEnd: [{ value: 'actions', sortable: false, width: 10 }],
      range: [],
      baseDate: new Date()
    }
  },
  computed: {
    ...mapState({
      calendars: state =>
        state.calendars.map(v => ({ ...v, loading: false, events: [] }))
    }),
    headers() {
      return [].concat(this.headerStart, this.range, this.headerEnd)
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
      const dayStart = this.baseDate
      dayStart.setHours(0, 0, 0, 0)
      this.range = this.getRange(dayStart)
      this.calendars.forEach(v => {
        this.getEventsFromApi(v)
      })
    },
    getRange(date) {
      return new Array(24).fill().map((v, i) => {
        const time = new Date(date)
        time.setHours(i, 0, 0, 0)
        const start = new Date(time)
        const end = new Date(time)
        end.setHours(end.getHours() + 1)
        end.setTime(end.getTime() - 1)
        return {
          text: this.formatTime(time),
          value: 'events',
          start,
          end,
          align: 'center',
          width: '4%'
        }
      })
    },
    formatDate(date) {
      const yyyy = date.getFullYear()
      const mm = ('00' + (date.getMonth() + 1)).slice(-2)
      const dd = ('00' + date.getDate()).slice(-2)
      const ddd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
      return `${yyyy}-${mm}-${dd}(${ddd})`
    },
    formatTime(date) {
      const HH = ('00' + date.getHours()).slice(-2)
      const MM = ('00' + date.getMinutes()).slice(-2)
      return `${HH}:${MM}`
    },
    async getEventsFromApi(v) {
      const item = v
      item.loading = true
      const url = item.url
      const res = await fetch(url)
      const text = await res.text()
      const events = JSON.parse(text, this.reviver)
      if (Array.isArray(events)) {
        item.events = events
      }
      item.loading = false
    },
    reviver(key, value) {
      return typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ? new Date(value)
        : value
    },
    showEvents(value, header) {
      return value.filter(v => v.start <= header.end && v.end >= header.start)
    },
    prev() {
      const date = new Date(this.baseDate)
      date.setDate(date.getDate() - 1)
      this.baseDate = date
      this.initialize()
    },
    next() {
      const date = new Date(this.baseDate)
      date.setDate(date.getDate() + 1)
      this.baseDate = date
      this.initialize()
    },
    goToday() {
      const date = new Date()
      this.baseDate = date
      this.initialize()
    }
  }
}
</script>
