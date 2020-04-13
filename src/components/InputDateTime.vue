<template>
  <div class="input-date-time">
    <v-menu
      v-model="datePicker"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="date"
          label="日付"
          single-line
          append-icon="mdi-calendar"
          type="date"
          required
          :rules="[v => /\d{4}-\d{2}-\d{2}/.test(v)]"
          @click:append="on.click"
        ></v-text-field>
      </template>
      <v-date-picker v-if="datePicker" v-model="date" scrollable @change="datePicker = false"></v-date-picker>
    </v-menu>
    <v-menu
      v-model="timePicker"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="time"
          label="時刻"
          single-line
          append-icon="mdi-clock"
          :rules="[v => /\d{2}:\d{2}(:\d{2})?/.test(v) || 'NG']"
          type="time"
          required
          step="1"
          @click:append="on.click"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="timePicker"
        v-model="time"
        scrollable
        format="24hr"
        use-seconds
        @change="timePicker = false"
      ></v-time-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Date,
      default() {
        return new Date()
      }
    }
  },
  data() {
    return {
      datetime: this.value,
      date: this.formatDate(this.value),
      time: this.formatTime(this.value),
      datePicker: false,
      timePicker: false
    }
  },
  watch: {
    value(value) {
      this.date = this.formatDate(value)
      this.time = this.formatTime(value)
    },
    date(date) {
      const d = new Date(date)
      this.datetime.setFullYear(d.getFullYear(), d.getMonth(), d.getDate())
      this.$emit('input', this.datetime)
    },
    time(time) {
      const t = this.time.split(':')
      this.datetime.setHours(t[0], t[1], t[2] ? t[2] : 0)
      this.$emit('input', this.datetime)
    }
  },
  mounted() {
    this.$emit('input', this.datetime)
  },
  methods: {
    formatDate(date) {
      const yyyy = date.getFullYear()
      const mm = ('00' + (date.getMonth() + 1)).slice(-2)
      const dd = ('00' + date.getDate()).slice(-2)
      return `${yyyy}-${mm}-${dd}`
    },
    formatTime(date) {
      const HH = ('00' + date.getHours()).slice(-2)
      const MM = ('00' + date.getMinutes()).slice(-2)
      const SS = ('00' + date.getSeconds()).slice(-2)
      return `${HH}:${MM}:${SS}`
    }
  }
}
</script>

<style scoped>
.input-date-time {
  display: flex;
}
.input-date-time > :not(:first-child) {
  margin-left: 16px;
}
</style>
