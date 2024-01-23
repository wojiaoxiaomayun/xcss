import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useStorage } from '../util'
const {set:setStorage,get:getStorage} = useStorage();
export const useRulesStore = defineStore('Rules',() => {
  const rules = ref(getStorage('xcss-rules',[]))
  function addRules(name,value,tips) {
    rules.value.push({
      name,value,tips
    })
    saveToStorage()
  }

  function changeRules(index,data){
    console.log(index,data)
    rules.value.splice(index,1,{...data})
    saveToStorage()
  }

  function deleteRules(index){
    rules.value.splice(index,1)
    saveToStorage()
  }

  function saveToStorage(){
    setStorage('xcss-rules',rules.value)
  }

  return { rules, addRules,changeRules,deleteRules }
})
export const useThemeStore = defineStore('Theme', () => {
  const theme = ref(getStorage('xcss-theme',[]))

  function addTheme(name,value) {
    theme.value.push({
      name,value
    })
    saveToStorage()
  }

  function changeTheme(index,data){
    theme.value.splice(index,1,{...data})
    saveToStorage()
  }

  function deleteTheme(index){
    theme.value.splice(index,1)
    saveToStorage()
  }

  function saveToStorage(){
    setStorage('xcss-theme',theme.value)
  }

  return { theme, addTheme,changeTheme,deleteTheme }
})
export const usePseudoClassStore = defineStore('PseudoClass', () => {
  const pseudoClass = ref(getStorage('xcss-pseudoClass',[]))

  function addPseudoClass(name,value) {
    pseudoClass.value.push({
      name,value
    })
    saveToStorage()
  }

  function changePseudoClass(index,data){
    pseudoClass.value.splice(index,1,{...data})
    saveToStorage()
  }

  function deletePseudoClass(index){
    pseudoClass.value.splice(index,1)
    saveToStorage()
  }

  function saveToStorage(){
    setStorage('xcss-pseudoClass',pseudoClass.value)
  }

  return { pseudoClass, addPseudoClass,changePseudoClass,deletePseudoClass }
})
export const useResponsiveStore = defineStore('Responsive', () => {
  const responsive = ref(getStorage('xcss-responsive',[]))

  function addResponsive(name,value) {
    responsive.value.push({
      name,value
    })
    saveToStorage()
  }

  function changeResponsive(index,data){
    responsive.value.splice(index,1,{...data})
    saveToStorage()
  }

  function deleteResponsive(index){
    responsive.value.splice(index,1)
    saveToStorage()
  }

  function saveToStorage(){
    setStorage('xcss-responsive',responsive.value)
  }

  return { responsive, addResponsive,changeResponsive,deleteResponsive }
})
export const useShortClassStore = defineStore('ShortClass',() => {
  const short = ref(getStorage('xcss-short',[]))
  function addShort(name,value) {
    short.value.push({
      name,value
    })
    saveToStorage()
  }

  function changeShort(index,data){
    short.value.splice(index,1,{...data})
    saveToStorage()
  }

  function deleteShort(index){
    short.value.splice(index,1)
    saveToStorage()
  }

  function saveToStorage(){
    setStorage('xcss-short',short.value)
  }

  return { short, addShort,changeShort,deleteShort }
})

export const useThemeModelStore = defineStore('ThemeModel',() => {
  const themeModel = ref(getStorage('xcss-theme-model','dark'))
  function setThemeModel(model){
    themeModel.value = model
    saveToStorage()
  }
  function saveToStorage(){
    setStorage('xcss-theme-model',themeModel.value)
  }
  return {themeModel,setThemeModel}
})