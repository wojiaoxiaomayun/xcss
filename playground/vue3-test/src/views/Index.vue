<template>
    <Header></Header>
</template>
<script setup>
    import Header from '../components/Header.vue';
    import {ref,onMounted} from 'vue';
    const seetingDialog = ref(null)
    onMounted(() => {
        console.log(seetingDialog.value)
    })
</script>