<script setup>
  import Splitter from 'primevue/splitter';
  import SplitterPanel from 'primevue/splitterpanel';
  import InputText from 'primevue/inputtext';
  import {ref,watchEffect,watch,onMounted} from 'vue'
  import Prism from 'prismjs';
  import 'prismjs/plugins/toolbar/prism-toolbar.min.js'
  import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
  import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js'



  import {XCss} from '@xcss/runtime'
  import preset from '@xcss/preset-base'
  
  let xcss = new XCss({
    presets:[preset()],
    theme:{
      primary:getComputedStyle(document.body).getPropertyValue('--primary-color'),
      gray:getComputedStyle(document.body).getPropertyValue('--gray-100'),
    }
  })

  import { useThemeModelStore } from '../store/SettingStore';
  import {formatCode} from '../util/format'
  
  const className = ref('test')
  const code = ref(`.${className.value}{width:100%;}`)
  const codeHighLight = ref('')
  
  watch(() => code.value,async () => {
    codeHighLight.value = Prism.highlight(await formatCode(code.value),Prism.languages.css,'css')
  },{immediate:true})
 

  import * as monaco from 'monaco-editor'
  import {loadTips,validate,defineXCssLanguage} from '../util/editor'
  const themeModelStore = useThemeModelStore();
  watchEffect(async () => {
    let link = document.getElementById('code-high-light')
    if(!link){
      link = document.createElement('link')
      link.setAttribute('id','code-high-light')
      link.setAttribute('rel','stylesheet')
      document.head.append(link)
    }
    if(themeModelStore.themeModel == 'dark'){
      link.setAttribute('href','/themes/codehighlight/prism-tomorrow.min.css')
    }else{
      link.setAttribute('href','/themes/codehighlight/prism.min.css')
    }
    monaco.editor.setTheme(`vs${themeModelStore.themeModel == 'dark'?'-dark':''}`)
  })
  let editor = null
  function initEditor(){
            // 初始化编辑器，确保dom已经渲染
    // defineXCssLanguage(xcss)
    loadTips(xcss.getTips());
    editor = monaco.editor.create(document.getElementById('container'), {
        value: '',
        language:'sql',
        automaticLayout: true,
        theme:`vs${themeModelStore.themeModel == 'dark'?'-dark':''}`,
        minimap:{
          enabled:false
        }
    });
    
    editor.getModel().onDidChangeContent((e) => {
      validate(editor,xcss,className.value)
      parseCode()
    })
    watch(() => className.value,() => {
      validate(editor,xcss,className.value)
      parseCode()
    })
  }
  onMounted(() => {
    initEditor()
  })

  function parseCode(){
    let value = editor.getValue();
    if(value){
      code.value = xcss.genStyleStr(xcss.parseShortClass(className.value,value.split(/\s/g)).map(e => {
        e.style = e.style.replace(/\s/g,'')
        return e;
      }))
    }else{
      code.value = `.${className.value}{width:100%;}`
    }
  }
</script>
<template>
  <div class="flex-c gap-8 margin-b-8">
    <label for="className">ClassName</label>
    <InputText id="className" type="text" v-model="className" class="w-50% margin-b-8" placeholder="请输入ClassName"/>
  </div>
  <div class="flex-c gap-8">
      <label for="className">ParseArea</label>
      <Splitter style="height: 300px" class="mb-5">
        <SplitterPanel class="w-0 over-v">
          <div id="container" class="w-100% h-100%"></div>
        </SplitterPanel>
        <SplitterPanel class="code-panel w-0">
            <pre 
              class="language-css w-100% h-100% padding-tb-8 padding-lr-16 margin-0! "
              data-prismjs-copy="拷贝"
              data-prismjs-copy-error="拷贝失败"
              data-prismjs-copy-success="拷贝成功"
            ><code class="language-css" v-html="codeHighLight"></code></pre>
        </SplitterPanel>
      </Splitter>
  </div>

</template>
<style scoped>
  :deep(.code-panel .code-toolbar){
    height: 100%;
  }
</style>