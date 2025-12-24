<script setup lang="ts">
import { useLoader } from '@/composables/useLoader';

const { isLoading } = useLoader()

</script>
<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isLoading" class="overlay">
                <div class="spinner"></div>
            </div>
        </Transition>
    </Teleport>
</template>
<style lang="css" scoped>
    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid white;
        border-top: 4px solid black;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
        transition: transform 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
</style>