<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
const props = defineProps(['to'])
const displayValue = ref(0)

onMounted(() => {
  const duration = 2000
  const start = 0
  const end = parseInt(props.to)
  if (start === end) return

  const startTime = performance.now()
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out quart
    const ease = 1 - Math.pow(1 - progress, 4)
    
    displayValue.value = Math.floor(start + (end - start) * ease)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
})
</script>
