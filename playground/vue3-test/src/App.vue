<script setup>
import { RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="App__wrap">
    <RouterView></RouterView>
  </div>
</template>
<style scoped>
  .App__wrap{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
<style>
  html,body{
    width: 100vw;
    height: 100vh;
    margin: 0px;
    padding: 0px;
  }
  #app{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
