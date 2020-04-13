<template>
  <v-container class="custom" fluid>
    <v-data-table :headers="headers" :items="calendars" group-by="category" disable-sort>
      <template v-slot:header.actions>
        <v-btn icon @click="dialog = editor">
          <v-icon small>mdi-cog</v-icon>
        </v-btn>
      </template>
      <template v-slot:header.left>
        <v-btn icon :disabled="page <= 0" @click="page--">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:header.right>
        <v-btn icon :disabled="page >= ranges.length - 1" @click="page++">
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
import defaultRange from '../presets/default'
import { v4 as uuid } from 'uuid'

export default {
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
      headerStart: [
        { text: 'カレンダー名', value: 'name', divider: true, width: 200 }
      ],
      headerEnd: [{ value: 'actions', sortable: false, width: 10 }],
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
    }),
    headers() {
      const headers = [...this.headerStart]
      const ranges = this.ranges
      if (Array.isArray(ranges) && ranges.every(v => Array.isArray(v))) {
        headers.push({
          value: 'left',
          sortable: false,
          width: 10,
          class: 'px-1'
        })
        headers.push(
          ...ranges[this.page].map((v, i, arr) => ({
            ...v,
            align: 'center',
            width: `${100 / arr.length}%`
          }))
        )
        headers.push({
          value: 'right',
          sortable: false,
          width: 10,
          class: 'px-1'
        })
      } else {
        headers.push(...ranges)
      }
      return headers.concat(...this.headerEnd)
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
      this.id = this.value
      if (this.options.name) this.name = this.options.name
      if (this.value === 'new') {
        this.id = this.genId()
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
    showEvents(value, header) {
      return value.filter(v => v.start <= header.end && v.end >= header.start)
    },
    genId: uuid,
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
    }
  }
}
</script>
