<template>
  <div id="app">
    <MenuBar />
    <Content />
  </div>
</template>

<script>
import MenuBar from './components/layout/MenuBar.vue'
import Content from './components/layout/Content.vue'

export default {
  name: 'app',
  components: {
    Content,
    MenuBar
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #d7e0f4;
  width: 100%;
}
</style>
