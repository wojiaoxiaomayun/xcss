import {defineStore} from 'pinia'
import {ref,computed} from 'vue'
export const useSettingStore = defineStore('Setting', () => {
  const theme = ref([{
    name:'primary',
    color:'red'
  }])

  function addTheme(name,color) {
    theme.value.push({
      name,color
    })
  }

  function changeTheme(index,data){
    theme.value.splice(index,1,{...data})
  }

  function deleteTheme(index){
    theme.value.splice(index,1)
  }

  return { theme, addTheme,changeTheme,deleteTheme }
})