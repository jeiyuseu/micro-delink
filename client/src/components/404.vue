<template>
  <div>
    <card>
      <div slot="card-title">404 Page Not Found!</div>
      <div slot="card-text">Back to <v-btn to="/" text>Dashboard</v-btn></div>
    </card>
  </div>
</template>

<script>
import Card from '@/components/Card'

export default {
  components: {
    Card,
  },
  data() {
    return {}
  },
  methods: {},
  computed: {},
}
</script>
