<template>
  <div class="event-summary">
    <v-menu :key="id" :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ on }">
        <v-badge :value="updated && !loop && !motion" dot overlap color="red" style="width: 100%">
          <v-chip
            style="width: 100%"
            :style="{ opacity: motion || disabled ? 0.4 : 1, transition: loop && 'opacity 2s' }"
            label
            :color="color"
            :disabled="disabled"
            v-text="`${formatDate(start, '${HH}:${MM}')} ${name}`"
            v-on="on"
          ></v-chip>
        </v-badge>
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

    <cursor-loop v-if="loop" v-model="loop"></cursor-loop>
    <cursor-motion v-if="motion" v-model="motion" @ended="loop = true"></cursor-motion>
  </div>
</template>

<script>
import { formatDate } from '../libs/formatter'
import CursorMotion from './CursorMotion.vue'
import CursorLoop from './CursorLoop.vue'

export default {
  components: { CursorMotion, CursorLoop },
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
      color: this.value.color,
      motion: undefined,
      loop: true,
      updated: false
    }
  },
  watch: {
    value({ trigger }) {
      console.log('<<watch>>')
      if (trigger instanceof Event) {
        console.log('trigger', trigger)
        const { target } = trigger
        if (target instanceof Element) {
          this.updated = true
          console.log('target', target instanceof Element, target)
          const source = target.getClientRects()[0]
          const destination = this.$el.getClientRects()[0]
          console.log('s to d', source, destination)

          this.motion = {
            x1: source.left,
            y1: source.bottom,
            x2: destination.right,
            y2: destination.top
          }
        }
      }
    },
    disabled(bool) {
      if (!bool) {
        this.internalDisabled = bool
      }
    }
  },
  methods: {
    formatDate
  }
}
</script>

<style scoped>
.event-summary {
  /* overflow: hidden; */
  position: relative;
  animation: fade-in 2s;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
