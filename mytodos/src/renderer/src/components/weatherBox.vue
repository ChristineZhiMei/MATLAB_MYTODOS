<script setup>
import { ref, onMounted } from 'vue'
import { Cloudy, Drizzling, Lightning, Moon, MostlyCloudy, PartlyCloudy, Pouring, Sunny } from '@element-plus/icons-vue'
const iconBox = ref(null)
// import axios from 'axios'

const weatherData = defineModel('weatherData')
const weatherUpdata = defineModel('weatherUpdata')
// const cityAdcode = ref('-1')
// const weather = ref('-')
// const ip = ref('-1')
// const cityName = ref('---')
// const reportTime = ref('--:--')
// const temperature = ref('-')
const tranStyle = ref("trans")

const weatherSelect = ref({'晴':'Sunny','少云':'PartlyCloudy','晴间多云':'PartlyCloudy','多云':'MostlyCloudy','阴':'Cloudy',
  '阵雨':'Drizzling','小雨':'Drizzling','中雨':'Drizzling','大雨':'Pouring','暴雨':'Pouring','大暴雨':'Pouring','雷阵雨':'Lightning',
  '雷阵雨并伴有冰雹':'Lightning','特大暴雨':'Pouring','强阵雨':'Pouring','强雷阵雨':'Pouring','极端降雨':'Pouring','毛毛雨/细雨':'Drizzling',
  '雨':'Drizzling','小雨-中雨':'Drizzling','中雨-大雨':'Pouring','暴雨-大暴雨':'Pouring','大暴雨-特大暴雨':'Pouring','冻雨':'Pouring',
  '雨雪天气':'Drizzling','雨夹雪':'Drizzling','阵雨夹雪':'Drizzling'
})

onMounted(() => {
  // alldispose()
})
// async function requestAPI(city){
//   let api = `/v3/weather/weatherInfo?key=090dcba9180bc0acb345be887b18d1f3&city=${city}&extensions=base&output=JSON`
//   // let api = `https://restapi.amap.com/v3/weather/weatherInfo?key=090dcba9180bc0acb345be887b18d1f3&city=${city}&extensions=base&output=JSON`
//   await axios({
//     method: 'get',
//     url: '/api' + api
//   }).then(res=>{
//     weather.value = res.data.lives[0].weather
//     reportTime.value = res.data.lives[0].reporttime.match(/\d\d:\d\d/)[0]
//     temperature.value = res.data.lives[0].temperature;
//   })
// }
// async function ipAPI(){
//   const regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
//   await axios({
//     method:'get',
//     url:'/ipi' + `/ip/soip?t=${Math.random()}`,
//     // url:`http://txt.go.sohu.com/ip/soip?t=${Math.random()}`
//   }).then(res=>{
//     const matches = res.data.match(regex);
//     if (matches && matches.length > 0) {
//       ip.value = matches[0];
//     } else {
//       ip.value =  "unknown";
//     }
//   })
// }
// async function ipPostionAPI(ip){
//   await axios({
//     method: 'get',
//     url: '/api' + `v3/ip?ip=${ip}&key=090dcba9180bc0acb345be887b18d1f3`
//     // url:`https://restapi.amap.com/v3/ip?ip=${ip}&key=090dcba9180bc0acb345be887b18d1f3`
//   }).then((res) => {
//     cityAdcode.value = res.data.adcode;
//     cityName.value = res.data.city;
//
//   })
// }
//
// async function alldispose() {
//   try{
//     await ipAPI().then(()=>{console.log(ip.value)});
//     await ipPostionAPI(ip.value).then(()=>{console.log(cityName.value)});
//     await requestAPI(cityAdcode.value).then(()=>{console.log(cityAdcode.value)});
//   }catch(e){
//     console.log('未查询到天气')
//   }
// }

</script>

<template>
  <div class="weatherBox">
    <el-tooltip
      class="box-item"
      effect="light"
      :content="'最近更新时间 ' + weatherData.reportTime + ' (点击更新)'"
      placement="top"
      :show-after="400"
    >
      <div class="box" :class="tranStyle" @click="tranStyle = tranStyle === 'trans' ? 'rtrans' : 'trans';weatherUpdata = (weatherUpdata + 1) % 2;console.log(weatherData.reportTime.slice(0,2))">
        <div ref="iconBox" class="iconBox">
          <el-icon size="25px" v-if="weatherSelect[weatherData.weather] === 'Sunny' && parseInt(weatherData.reportTime.slice(0,2)) >=6 && parseInt(weatherData.reportTime.slice(0,2)) <18"><Sunny /></el-icon>
          <el-icon size="25px" v-else-if="weatherSelect[weatherData.weather] === 'PartlyCloudy'"><PartlyCloudy /></el-icon>
          <el-icon size="25px" v-else-if="weatherSelect[weatherData.weather] === 'MostlyCloudy'"><MostlyCloudy /></el-icon>
          <el-icon size="25px" v-else-if="weatherSelect[weatherData.weather] === 'Cloudy'"><Cloudy /></el-icon>
          <el-icon size="25px" v-else-if="weatherSelect[weatherData.weather] === 'Drizzling'"><Drizzling /></el-icon>
          <el-icon size="25px" v-else-if="weatherSelect[weatherData.weather] === 'Pouring'"><Pouring /></el-icon>
          <el-icon size="25px" v-else-if="weatherSelect[weatherData.weather] === 'Lightning'"><Lightning /></el-icon>
          <el-icon size="22px" v-else-if="weatherSelect[weatherData.weather] === 'Sunny' && (parseInt(weatherData.reportTime.slice(0,1)) <6 || parseInt(weatherData.reportTime.slice(0,1)) >=18)"><Moon /></el-icon>
          <el-icon size="25px" v-else><Sunny /></el-icon>
        </div>
        <div class="wordBox" :class="tranStyle">
          <p v-if="!(weatherData.reportTime === '--:--' || weatherData.reportTime ==='')">{{ weatherData.cityName }}&ensp;{{ weatherData.temperature }}℃&ensp;{{ weatherData.weather }}</p>
          <p v-else>未查询到天气</p>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>
<style scoped>
.weatherBox {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.box {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: right 1s ease;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.box.trans {
  right: -80%;
  transition: right 1s ease;
}
.box.trans:hover {
  right: 0;
  transition: right 1s ease;
}
.box.rtrans {
  right: 0;
  transition: right 1s ease;
}
.wordBox.trans {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.box:hover .wordBox.trans {
  opacity: 1;
  transition: opacity 0.4s ease 0.5s;
}

.wordBox.rtrans {
  opacity: 1;
  transition: opacity 0.4s ease 0.5s;
}

.iconBox {
  position: relative;
  height: 100%;
  width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.box p {
  margin: 0 0 0 15px;
  font-size: 15px;
  font-weight: bold;
}
.wordBox {
  height: 100%;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
}

</style>
