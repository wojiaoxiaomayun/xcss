import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import XCss from '@xcss/core'
let xcss = new XCss()
console.log(xcss.parse(`
<x-card class="flex align-center md:flex hover:flex md:hover:align-center">
  <div class="w-100%">aa</div>
</x-card>
<x-card class="flex align-center"></x-card>
`))
console.log(xcss.genStyleStr(xcss.parseShortClass('flex-center',['flex','align-center','md:align-center','md:hover:flex'])))

createApp(App).mount('#app')
