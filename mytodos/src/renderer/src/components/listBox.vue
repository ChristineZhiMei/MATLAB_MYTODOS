<template>
  <div class="listTurns">
    <div ref="rListBox" class="listBox" :class="Turns">
      <div class="listHeader">
        <div style="background-color: #ffffff; width: 1%; height: 50%; border-radius: 2px"></div>
        <p style="margin: 0 0 0 25px; font-weight: bolder; font-size: 20px;user-select: none;">全部待办</p>
        <div class="weather-png">
          <weatherBox v-model:weatherData="weatherData" v-model:weatherUpdata="weatherUpdata"></weatherBox>
        </div>
      </div>
      <div class="listSelect" ref="rHListSelect">
        <p
          v-if="ifShow0"
          style="
            margin: 0;
            text-align: center;
            height: 30px;
            line-height: 30px;
            color: #ffffff;
            letter-spacing: 1px;
            user-select: none;
          "
        >
          (≧∀≦)ゞ当前没有待办哦~
        </p>
        <transition-group name="ani">
          <div v-for="(item, index) in todoList" :key="index" class="todoWord">
            <div class="chBox">
              <input
                :id="index"
                type="checkbox"
                @click="
                  () => {
                    todoList.splice(index, 1)
                  }
                "
              />
              <label :for="index" class="inputLabel"
                ><el-icon class="inputLabelEnd"><Check /></el-icon
              ></label>
            </div>
            <p class="Word">{{ item }}</p>
          </div>
        </transition-group>
      </div>
      <div class="listSheet">
        <el-tooltip
          class="box-item"
          effect="light"
          content="确认所有待办"
          placement="top-end"
          :show-after="delayTime"
        ><el-button
            color="rgba(96,96,96,0)"
            style="position: relative; right: 0; width: 33px; height: 33px; margin-right: 20px;color: #ffffff;"
            @click="() => {todoList = []}"
            ><el-icon size="24px"><Finished /></el-icon></el-button></el-tooltip>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { Check, Finished, Sunny } from "@element-plus/icons-vue";
import weatherBox from './weatherBox.vue'
const Turns = ref('rTurns')
const ifShow0 = defineModel('ifShow0')
const ifPenetrates = defineModel('ifPenetrates')
const rListBox = ref(null)
const rHListSelect = ref(null)
const delayTime = ref(400)
const lHeight = defineModel('lHeight')
const boolListShow = defineModel('boolListShow')
const weatherData = defineModel('weatherData')
const weatherUpdata = defineModel('weatherUpdata')
setTimeout(()=>{
  console.log(weatherData.value)
},1000)
watch(boolListShow, (newVal) => {
  Turns.value = newVal ? 'Turns' : 'rTurns'
})
const todoList = defineModel('todoList')
const numList = defineModel('numList')
onMounted(() => {
  Turns.value = 'listFirst'
})
watch(numList, (newVal) => {
  let timer = null
  if (newVal === 0) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      ifShow0.value = true
    }, 300)
  } else {
    ifShow0.value = false
  }
  setTimeout(()=>{
    lHeight.value = rHListSelect.value.offsetHeight
    if(lHeight.value === null){
      lHeight.value = 0
      console.log(lHeight.value)
    }
  },300)
})

</script>
<style scoped>
.Turns {
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.rTurns {
  opacity: 0;
  transition: opacity 0.3s ease-in;
}

.listTurns {
  position: relative;
  width: 95%;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
}

.listBox {
  position: absolute;
  box-shadow: 0 3px 0 #ffffff;
  background-color: #edb0b1;
  margin: 4px 0;
  width: 100%;
  border-radius: 7px;
  overflow: hidden;
}

.listHeader {
  height: 40px;
  width: 100%;
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.listSelect {
  width: 100%;
  min-height: 30px;
}

.listSheet {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.ani-enter-active,
.ani-leave-active {
  transition: all 0.5s ease;
}

.ani-enter-from,
.ani-leave-to {
  opacity: 0;
  position: absolute;
}

.ani-move {
  transition: transform 0.5s ease;
}

.todoWord {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 20px;
}

input[type='checkbox'] {
  position: relative;
  height: 20px;
  width: 20px;
  display: none;
  margin: 0;
}

.todoWord > .Word {
  width: 65%;
  position: relative;
  left: 13%;
  margin: 0;
  letter-spacing: 1px;
}

.chBox {
  position: relative;
  left: 7%;
  height: 20px;
  width: 20px;
}

.inputLabel {
  height: 100%;
  width: 100%;
  cursor: pointer;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputLabel:hover {
  background-color: #ffffff;
}

.inputLabel:hover,
.inputLabelEnd {
  color: #edb0b1;
}
.weather-png{
  height: 30px;
  width: 180px;
  margin-left: auto;
  margin-right: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
