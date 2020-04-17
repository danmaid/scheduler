<template>
  <v-container class="standard" fluid>
    <v-data-table :headers="headers" :items="value" group-by="category" disable-sort>
      <template v-slot:header.name>
        <slot name="navigation">
          <v-btn icon @click="$emit('prev')">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span v-if="label" style="cursor:pointer" v-text="label" @click="$emit('home')"></span>
          <v-btn icon @click="$emit('next')">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </slot>
      </template>

      <template v-slot:header.events="{ header }">
        <slot name="header" :header="header">
          <div
            style="display: grid"
            :style="{ 'grid-template-columns': `repeat(${header.points.length}, 1fr)`}"
          >
            <template v-for="point of header.points">
              <span :key="point.date.getTime()" v-text="point.text"></span>
            </template>
          </div>
        </slot>
      </template>

      <template v-slot:header.actions="{ header }">
        <slot name="actions" :header="header"></slot>
      </template>

      <template v-slot:item.events="{ value, header, item }">
        <div
          class="event-grid"
          :style="{ 'grid-template-columns': `repeat(${header.points.length}, 1fr)`}"
        >
          <template v-for="event of getEvents(value, header, header.rows.get(item.id))">
            <event-summary
              :key="event.id"
              :value="event"
              :disabled="item.loading"
              :style="getStyle(event, { points: header.points, rows: header.rows.get(item.id) })"
            ></event-summary>
          </template>
        </div>
      </template>
      <template v-slot:item.actions="{ value, item }">
        <v-btn icon :loading="item.loading" @click="refresh(item, $event)">
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import EventSummary from '../components/EventSummary.vue'

export default {
  components: { EventSummary },
  props: {
    value: {
      type: Array,
      validator: v => v.every(({ id }) => id),
      required: true
    },
    label: {
      type: String,
      default: undefined
    },
    ranges: {
      type: Array,
      validator: v =>
        v.every(
          ({ start, end, points }) =>
            start instanceof Date &&
            end instanceof Date &&
            (!points ||
              (Array.isArray(points) &&
                points.every(({ date }) => date instanceof Date)))
        ),
      required: true
    }
  },
  computed: {
    headers() {
      const ranges = this.ranges.map(v => ({
        value: 'events',
        class: 'hoge',
        width: `${100 / this.ranges.length}%`,
        divider: true,
        rows: new Map(
          this.value.map(({ id }) => [id, new Array(v.points.length).fill(0)])
        ),
        ...v
      }))
      return [
        {
          value: 'name',
          divider: true,
          width: 200,
          class: 'pa-1 d-flex align-center justify-space-between'
        },
        ...ranges,
        { value: 'actions', sortable: false, width: 10 }
      ]
    }
  },
  methods: {
    getEvents(events, { start, end, points }, rows) {
      if (
        !Array.isArray(events) ||
        !Array.isArray(points) ||
        !Array.isArray(rows)
      ) {
        return []
      }
      rows.fill(0)
      const { spaned, single } = events
        .filter(e => e.start <= end && e.end >= start)
        .reduce(
          (a, e) => {
            points.some(p => e.start < p.date && p.date < e.end)
              ? a.spaned.push(e)
              : a.single.push(e)
            return a
          },
          { spaned: [], single: [] }
        )
      spaned.sort((a, b) =>
        a.start < b.start ? -1 : a.start > b.start ? 1 : 0
      )
      single.sort((a, b) =>
        a.start < b.start ? -1 : a.start > b.start ? 1 : 0
      )
      const list = [].concat(spaned, single)
      return list
    },
    getStyle({ start, end }, { points, rows }) {
      const style = {}
      const s = points.findIndex(p => p.date > start)
      if (points[0].date > start) {
        style['grid-column-start'] = 1
        style['margin-left'] = '-8px'
      } else {
        style['grid-column-start'] = s < 0 ? points.length : s
      }

      const e = points.findIndex(p => p.date > end)
      if (points[points.length - 1].date < end) {
        style['grid-column-end'] = -1
        style['margin-right'] = '-8px'
      } else {
        style['grid-column-end'] = e + 1
      }

      const columns = []
      for (
        let i = style['grid-column-start'] - 1;
        i + 1 <=
        (style['grid-column-end'] > 0
          ? style['grid-column-end'] - 1
          : rows.length);
        i++
      ) {
        columns.push(i)
      }
      const row = Math.max(...columns.map(i => rows[i])) + 1
      style['grid-row'] = row
      columns.forEach(i => {
        rows[i] = row
      })
      return style
    },
    refresh(item, e) {
      this.$emit('refresh', item, e)
      console.log(e)
    }
  }
}
</script>

<style scoped>
.event-grid {
  display: grid;
  /* overflow-x: hidden; */
  align-content: start;
  height: 100%;
}
</style>
