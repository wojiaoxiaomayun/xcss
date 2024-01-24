<template>
    <Header></Header>
    <div class="margin-t-50 h-auto overflow-hidden">
        <div class="w-1200 h-auto over-hidden margin-auto margin-t-12">
            <PlayGround></PlayGround>
        </div>
    </div>
</template>
<script setup>
    import Header from '../components/Header.vue';
    import PlayGround from '../components/PlayGround.vue';
    import {ref,onMounted} from 'vue';
    const seetingDialog = ref(null)
    onMounted(() => {
        console.log(seetingDialog.value)
    })
</script>