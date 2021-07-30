<template>
  <header class="py-4 border-b">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-3xl font-bold">Vannsl's Notion like Form</h1>
      <BaseButton size="md" @clicked="saveBlocks">Save</BaseButton>
    </div>
  </header>
  <BaseSpacer />
  <article class="container mx-auto">
    <EditableForm />
  </article>
</template>

<script setup>
  import BaseButton from './components/BaseButton.vue'
  import BaseSpacer from './components/BaseSpacer.vue'
  import EditableForm from './components/EditableForm.vue'
  import { useBlocks } from './composables/useBlocks'

  const { saveBlocks } = useBlocks()
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
