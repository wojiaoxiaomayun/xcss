<template>
  <div class="w-100% h-48 fixed shadow-light flex align-center justify-between">
    <div class="margin-l-18 magin-r-18">
      XCss
    </div>
    <div class="flex-gap-8 margin-r-18">
      <Button :icon="theme == 'dark'?'pi pi-moon':'pi pi-sun'" severity="secondary" size="small" outlined text raised class="w-auto padding-6"  @click="changeTheme"/>
      <a href="https://github.com/wojiaoxiaomayun/xcss" target="_blank">
        <Button icon="pi pi-github" severity="secondary" size="small" outlined text  raised class="w-auto padding-6" />
      </a>
      <Button icon="pi pi-cog" severity="secondary" size="small" outlined text  raised class="w-auto padding-6" @click="settingDialog.toggle()"/>
      <Setting ref="settingDialog"></Setting>
    </div>
  </div>
</template>
<script setup>
  import Button from 'primevue/button';
  import Setting from './Setting.vue';
  import {ref} from 'vue'
  

  const theme = ref('dark')
  const settingDialog = ref(null)

  import { usePrimeVue } from 'primevue/config';
  const PrimeVue = usePrimeVue();
  function changeTheme(){
    let tempTheme = theme.value;
    theme.value = theme.value == 'dark'?'light':'dark'
    PrimeVue.changeTheme(`lara-${tempTheme}-green`, `lara-${theme.value}-green`, `theme-link`, () => {});
  }
</script>