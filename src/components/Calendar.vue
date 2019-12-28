<template>
  <div class="calendar">
    <span>{{ name }}</span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    endpoint: {
      type: String,
      required: true
    },
    name: {
      type: String,
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
      getAccessToken: 'account/getAccessToken'
    }),
    async getCalendar() {
      const accessToken = await this.getAccessToken()
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const url = new URL(this.endpoint)
      url.searchParams.append('startDateTime', '2019-12-20T00:00:00+09:00')
      url.searchParams.append('endDateTime', '2019-12-30T00:00:00+09:00')
      const res = await fetch(url, { headers })
      const data = await res.json()
      this.events = data.value
    }
  },
  async mounted() {
    this.getCalendar(this.endpoint)
  }
}
</script>
