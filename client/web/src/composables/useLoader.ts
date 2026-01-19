import { ref, readonly } from "vue"

const isLoading = ref(false)

export function useLoader() {
    const show = () => {
        isLoading.value = true
    }
    const hide = () => {
        isLoading.value = false
    }

    return {
        isLoading: readonly(isLoading),
        show,
        hide
    }
}