<template>
  <div class="home">
    <CalendarList />
  </div>
</template>

<script>
// @ is an alias to /src
import CalendarList from '@/components/CalendarList.vue'

export default {
  name: 'home',
  components: {
    CalendarList
  }
}
</script>
