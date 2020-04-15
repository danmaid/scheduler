<template>
  <v-container class="custom" fluid>
    <schedule-grid :value="calendars" :ranges="ranges[page]" @refresh="getEventsFromApi">
      <template v-slot:navigation>
        <v-btn icon :disabled="page <= 0" @click="page--">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span v-text="`ページ ${page + 1}`"></span>
        <v-btn icon :disabled="page >= ranges.length - 1" @click="page++">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>

      <template v-slot:header="{ header }">
        <div
          style="display: grid"
          :style="{ 'grid-template-columns': `repeat(${header.points.length}, 1fr)`}"
        >
          <template v-for="(point, i) of header.points">
            <span
              v-if="i % 2 === 0"
              :key="formatDate(point.date)"
              style="grid-row: 1"
              :style="{ 'grid-column': `${i + 1} / span 2`}"
              v-text="formatDate(point.date)"
            ></span>
            <span :key="point.date.getTime()" style="grid-row: 2" v-text="point.text"></span>
          </template>
        </div>
      </template>

      <template v-slot:actions>
        <v-btn icon @click="dialog = editor">
          <v-icon small>mdi-cog</v-icon>
        </v-btn>
      </template>
    </schedule-grid>

    <v-dialog v-if="dialog" :value="true" persistent>
      <component
        :is="dialog"
        :value="ranges"
        :name="name"
        @close="dialog = null"
        @input="save($event)"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import ScheduleGrid from '../components/ScheduleGrid.vue'
import defaultRange from '../presets/default'
import { v4 as uuid } from 'uuid'
import { formatDate } from '../libs/formatter'

export default {
  components: { ScheduleGrid },
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      id: this.value,
      ranges: this.load(this.value),
      page: 0,
      name: this.options.name || 'カスタム',
      dialog: null,
      editor: () => import('../components/CustomEditor.vue')
    }
  },
  computed: {
    ...mapState({
      calendars: state =>
        state.calendars.map(v => ({ ...v, loading: false, events: [] }))
    })
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
      this.id = this.value
      if (this.options.name) this.name = this.options.name
      if (this.value === 'new') {
        this.id = uuid()
        this.dialog = this.editor
      }
      this.ranges = this.load(this.id)
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
    load(id) {
      try {
        const loaded = JSON.parse(localStorage.getItem(id), this.reviver)
        console.log('loaded', loaded, id)
        const { ranges } = loaded
        return ranges || defaultRange()
      } catch {
        return defaultRange()
      }
    },
    save(v) {
      console.info('view saved.', this.id, v)
      const settings = { id: this.id, ...v }
      localStorage.setItem(this.id, JSON.stringify(settings))
      this.$emit('save', settings)
      this.ranges = settings.ranges
    },
    formatDate(v) {
      // eslint-disable-next-line no-template-curly-in-string
      return formatDate(v, '${yyyy}-${mm}-${dd}(${ddd})')
    }
  }
}
</script>
