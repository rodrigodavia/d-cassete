<script setup lang="ts">
import type { Song } from '@/types';

defineProps<{
    item: Song
}>()

</script>
<template>
    <div>{{ item.title }}</div>
</template>
<style lang="css" scoped>

</style>