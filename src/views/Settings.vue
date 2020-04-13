<template>
  <v-container fluid class="settings">
    <v-row>
      <v-col cols="12" class="py-0">
        <v-label>データ取得元</v-label>
      </v-col>
      <v-col v-for="source of sources" :key="source.value" class="d-flex align-baseline">
        <v-switch v-model="source.enabled" hide-details class="mr-2">
          <template v-slot:label>
            <v-badge
              :value="!!source.enabled"
              :content="getBadge(source.calendars)"
            >{{ source.text }}</v-badge>
          </template>
        </v-switch>
        <component v-if="source.enabled" :is="source.component" v-model="source.calendars"></component>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-overlay v-model="loading" absolute>
          <v-progress-circular indeterminate size="64" />
        </v-overlay>
        <v-label>利用可能</v-label>
        <v-data-table
          v-model="selected"
          :items="fetched"
          :headers="headers"
          show-select
          group-by="category"
        >
          <template v-slot:item.source="{ value }">{{ getSourceName(value) }}</template>
        </v-data-table>
      </v-col>
      <v-col cols="12" sm="6">
        <v-label>表示中</v-label>
        <v-data-table :items="selected" :headers="usedHeaders" group-by="category"></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: 'カレンダー名', value: 'name' },
        { text: '所有者', value: 'owner' },
        { text: '取得元', value: 'source' }
      ],
      usedHeaders: [
        { text: 'カレンダー名', value: 'name' },
        { text: '所有者', value: 'owner' }
      ],
      sources: [
        {
          text: 'サンプル',
          value: 'sample',
          component: () => import('../components/SampleData.vue'),
          enabled: false
        },
        { text: 'Office 365', value: 'o365', enabled: false }
      ]
    }
  },
  computed: {
    ...mapState({
      used: state => state.calendars
    }),
    fetched() {
      return [].concat(
        ...this.sources
          .filter(v => v.enabled && Array.isArray(v.calendars))
          .map(v => v.calendars.map(c => ({ source: v.value, ...c })))
      )
    },
    selected: {
      get() {
        return this.$store.state.calendars
      },
      set(value) {
        this.$store.commit('setCalendars', value)
      }
    }
  },
  mounted() {
    this.used.forEach(v => {
      const source = this.sources.find(s => s.value === v.source)
      if (source) source.enabled = true
    })
  },
  methods: {
    ...mapActions({
      getAccessToken: 'account/getAccessToken'
    }),
    getBadge(v) {
      return Array.isArray(v) ? String(v.length) : '0'
    },
    getSourceName(v) {
      const { text } = this.sources.find(s => s.value === v)
      return text
    }
  }
}
</script>
