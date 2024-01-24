import { createApp } from 'vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice';
import App from './App.vue'
import { createPinia } from 'pinia'

import XCssRuntime from '@xcss/runtime'
import preset from '@xcss/preset-base'
let xCssRuntime = new XCssRuntime(document.body,{
  presets:[preset()],
  theme:{
    primary:getComputedStyle(document.body).getPropertyValue('--primary-color'),
    gray:getComputedStyle(document.body).getPropertyValue('--gray-100'),
  }
})

let app = createApp(App).use(createPinia()).use(router).use(ConfirmationService);
app.use(PrimeVue,{
  ripple: true 
});
app.mount('#app');