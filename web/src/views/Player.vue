<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { type Tape } from '@/types';

const route = useRoute();
const tapeUrl = ref<string | null>(null);
const tapePath = ref<string | null>(null)
const tape = ref<Tape | null>(null)
const withTape = ref(false);
const headerMessage = ref("There is no tape");

const initPlayer = () => {
  const file = route.query.tape;
  if (file) {
    if (file instanceof Array)
      tapeUrl.value = file[0] ?? "";
    else tapeUrl.value = file
  }
}
const getTapeAws = () => {
  if (tapeUrl.value == null) throw new Error("Ref not loaded");

  // Llamada a AWS para descargar cinta
  // ...
  // tapePath.value = ""
  throw new Error("Not implemented yet")
}
const loadTape = () => {
  if (tapePath.value == null) throw new Error("Ref not loaded");

  // Procesamiento de archivo .dgc obtenido de AWS
  // ...
  // tape.value = {}
  throw new Error("Not implemented yet")
}
const loadPlayer = () => {
  if (tape.value == null) throw new Error("Ref not loaded");

  const TIME_LIMIT_h = 4;
  withTape.value = true;
  const date = new Date(tape.value.created_at);
  date.setHours(date.getHours() + TIME_LIMIT_h)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  headerMessage.value = `The tape will no longer be available at ${hours}:${minutes}`;
}

watch(tapeUrl, (newTapeUrl) => {
  try {
    if (newTapeUrl == "") throw new Error("No tape");
    tapeUrl.value = newTapeUrl;
    getTapeAws()
    loadTape()
    loadPlayer()
  } catch(err) {
    console.error(err)
  }
});

onMounted(() => {
  initPlayer();
})
</script>
<template>
  <header>
    <div class="danger">
      <span class="message">{{ headerMessage }}</span>
    </div>
  </header>
  <main v-if="withTape">
  </main>
  <footer v-if="withTape">
  </footer>
</template>
<style lang="css" scoped>
header {
  background-color: white;
  display: flex;
  justify-content: center;
  padding: 20px;
  align-items: center;
}
.danger {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: var(--color-dangerBg);
  padding: 10px;
  border: 1px solid var(--color-danger);
}
</style>