import { createApp } from 'vue'
import router from './router'
import PrimeVue from 'primevue/config';
import App from './App.vue'

import XCss from '@xcss/core'
import preset from '@xcss/preset-base'
console.log(preset())
let xcss = new XCss({
  presets:[preset()]
})
console.log(xcss.genStyleStr(xcss.parseHtml(`<div class="flex"></div>`)))



let app = createApp(App).use(router);
app.use(PrimeVue,{
  ripple: true 
});
app.mount('#app');