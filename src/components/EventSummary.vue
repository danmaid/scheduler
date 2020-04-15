<template>
  <div class="event-summary">
    <v-menu :key="id" :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ on }">
        <v-chip
          class="event-summary__chip"
          label
          :color="color"
          :disabled="disabled"
          v-text="`${formatDate(start, '${HH}:${MM}')} ${name}`"
          v-on="on"
        ></v-chip>
      </template>
      <v-card>
        <v-toolbar :color="color">
          <v-toolbar-title v-text="name"></v-toolbar-title>
        </v-toolbar>
        <v-list>
          <v-list-item>
            <v-list-item-content>id</v-list-item-content>
            <v-list-item-content v-text="id"></v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>start</v-list-item-content>
            <v-list-item-content v-text="start"></v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>end</v-list-item-content>
            <v-list-item-content v-text="end"></v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { formatDate } from '../libs/formatter'

export default {
  name: 'Event',
  props: {
    value: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: this.value.id,
      start: this.value.start,
      end: this.value.end,
      name: this.value.name,
      color: this.value.color
    }
  },
  methods: {
    formatDate
  }
}
</script>

<style scoped>
.event-summary {
  overflow: hidden;
}
.event-summary__chip {
  width: 100%;
}
</style>
