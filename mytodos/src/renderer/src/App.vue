<template>
  <div class="app" :class="appHeight" :style="appStyle" ref="app">
    <headerBox v-model:boolShow="boolShow" v-model:boolListShow="boolListShow" v-model:numList="numList" v-model:ifClosed="ifClosed" v-model:ifPenetrates="ifPenetrates" ></headerBox>
    <inputBox v-model:boolShow="boolShow" v-model:todoList="todoList" v-model:ifPenetrates="ifPenetrates" ></inputBox>
    <listBox v-model:weatherUpdata="weatherUpdata"  v-model:weatherData="weatherData" v-model:boolListShow="boolListShow" v-model:todoList="todoList" v-model:numList="numList" v-model:ifShow0="ifShow0" v-model:ifPenetrates="ifPenetrates" v-model:lHeight="lHeight"></listBox>
  </div>
</template>
<script setup>
import { ref , watch , onMounted } from 'vue'
import inputBox from './components/inputBox.vue'
import headerBox from './components/headerBox.vue'
import axios from 'axios'
const boolShow = ref(false)
const boolListShow = ref(true)
const appHeight = ref('appHeight-Show')
const todoList = ref([])
const appStyle = ref()
const rHeight = ref(80)
const lHeight = ref(0)
const numList = ref(10)
const ifClosed = ref(false)
const ifShow0 = ref(false)
const ifPenetrates = ref(true)
const app = ref(null)

const weatherUpdata = ref(0)
const weatherData = ref({'cityAdcode':'-','cityName':'---','ipdata':'-','reportTime':'--:--','temperature':'--','weather':'--'})

const splitString = (str, delimiter) => {
  return str.split(delimiter);
};
onMounted(() => {
  numList.value = todoList.value.length
  let temp = async () => {
    let x = await myAPI.readFile()
    x = splitString(x, '<todos-list>').filter((item) => item!== '')
    todoList.value = [...x]
  }
  temp()
  numList.value = 1
  if (boolListShow.value){
    let tempHight = endHight()
    appStyle.value = `height: ${rHeight.value + tempHight}px;`
    retHeight()
  }

  let temp1 = () => {
    myAPI.weatherRequest().then(res => {
      weatherData.value = res
    })
  }
  temp1()
})
import listBox from './components/listBox.vue'

watch(weatherUpdata,(newValue)=>{
  if(newValue === 0){
    console.log("更新天气")
    let temp1 = () => {
      myAPI.weatherRequest().then(res => {
        weatherData.value = res
      })
    }
    temp1()
  }
})

watch(todoList, (newValue) => {
  numList.value = newValue.length
  let temp = ''
  for (let i = 0; i < todoList.value.length; i++) {
    temp += todoList.value[i].trim().replaceAll('\n','') + "<todos-list>"
  }
  myAPI.writeFile(temp)
}, {deep: true})
watch(ifClosed, () => {
  myAPI.closeWindow()
})
watch(boolShow,()=>{
  let temp = endHight()
  if(boolShow.value){
    retHeight(rHeight.value + temp)
    appStyle.value = `height: ${rHeight.value + temp}px;`
  }
  else{
    setTimeout(()=>{
      appStyle.value = `height: ${rHeight.value + temp}px;transition: height .8s ease;`
      retHeight(rHeight.value + temp)
    },300)
  }

})

watch(boolListShow,()=>{
  let temp = endHight()
  if(boolListShow.value){
    retHeight(rHeight.value + temp)
    appStyle.value = `height: ${rHeight.value + temp}px;`
  }
  else{
    setTimeout(()=>{
      appStyle.value = `height: ${rHeight.value + temp}px;`
    },300)
    setTimeout(()=>{
      retHeight(rHeight.value + temp)
    },300)
  }
})
watch(numList,(newValue,oldValue)=>{
  if(newValue > oldValue) {
    appStyle.value = `height: 2000px;`
    retHeight(2000)
  }
  setTimeout(()=>{
    let temp = endHight()
    appStyle.value = `height: ${rHeight.value + temp}px;`
    retHeight(rHeight.value + temp)
  },400)
})
function endHight(){
  let temp = 0
  if(boolShow.value){
    temp +=210
  }
  if(boolListShow.value){
    if(numList.value === 0){
      temp +=  160
    }
    else{
      temp += 170 + lHeight.value
    }
  }
  return temp
}
function retHeight(data){
  myAPI.heightWindow(data)
}

</script>
<style scoped>
html,body {
  margin: 0;
  padding: 0;
  pointer-events: none;
}
.appHeight-Show{
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  pointer-events: auto;
}

</style>
