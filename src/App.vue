<template>
  <div id="app">
    <navbar></navbar>
    <router-view />
  </div>
</template>

<script>
import Navbar from './views/Navbar'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  created () {
    this.$store.dispatch('loadGerechtenAndLijsten')
  }
}
</script>

<style>
</style>
