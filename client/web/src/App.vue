<script setup lang="ts">
import { RouterView } from 'vue-router';
import "@/assets/styles/index.css"
import Loader from './components/Loader.vue';

</script>
<template>
  <div class="page">
    <RouterView />
  </div>
  <Loader />
</template>
<style lang="css"></style>
