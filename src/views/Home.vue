<template>
  <div class="home">
    <v-select v-model="selected" :items="views" />
    <component :is="selected.component" v-model="date" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(new Date().setHours(0, 0, 0, 0)),
      views: [
        {
          text: '日',
          value: 'day',
          component: () => import('../components/DailyView.vue')
        },
        {
          text: '週',
          value: 'week',
          component: () => import('../components/WeeklyView.vue')
        }
      ]
    }
  },
  computed: {
    selected: {
      get() {
        return this.views.find(v => v.value === this.$route.params.view)
      },
      set(value) {
        this.$router.push({ name: this.$route.name, params: { view: value } })
      }
    }
  }
}
</script>

<style>
</style>
