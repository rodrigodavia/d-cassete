<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { AWSError, Tape, TapeError } from '@/types';

const route = useRoute();
const tapeUrl = ref("");
const withTape = ref(false);
const tapePath = ref<string | null>(null)
const tape = ref<Tape | null>(null)
const headerMessage = ref("There is no tape");

const initPlayer = () => {
  const file = route.query.tape;
  if (file) {
    if (file instanceof Array)
      tapeUrl.value = file[0];
    else tapeUrl.value = file
  }
}
const getTapeAws = () => {
  try {
    // Llamada a AWS para descargar cinta
    // ...
    // tapePath.value = ""
    throw new AWSError("Not implemented yet")
    
  } catch(err) {
    if (err instanceof AWSError) {
      console.error(err)
    }
  }
}
const loadTape = () => {
  try {
    // Procesamiento de archivo .dgc obtenido de AWS
    // ...
    // tape.value = {}
    throw new TapeError("Not implemented yet")
  } catch(err) {
    if (err instanceof TapeError) {
      console.error(err)
    }
    return null;
  }
}

watch(tapeUrl, (newTapeUrl) => {
  if (newTapeUrl == "") return;
  tapeUrl.value = newTapeUrl;
  getTapeAws()
  if (tapePath.value == null) return;
  loadTape()
  if (tape.value == null) return;

  const TIME_LIMIT_h = 4;
  withTape.value = true;
  const date = new Date(tape.value.created_at);
  date.setHours(date.getHours() + TIME_LIMIT_h)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  headerMessage.value = `The tape will no longer be available at ${hours}:${minutes}`;
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