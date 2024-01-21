export const useStorage = () => {
  return {set:setStorage,get:getStorage}
}

const setStorage = (key,value) => {
  localStorage.setItem(key,JSON.stringify(value))
}
const getStorage = (key,defaultVal) => {
  let val = localStorage.getItem(key)
  try{
    return JSON.parse(val) || defaultVal
  }catch(ex){

  }
  return defaultVal;
}