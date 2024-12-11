<template>
  <div class="inputTurns" :class="Turns">
    <div class="inputBox">
      <div class="inputHeader">
        <div style="background-color: #ffffff;width: 1%;height: 50%;border-radius:2px;"></div>
        <p style="margin: 0 0 0 25px;font-weight: bolder;font-size: 20px; user-select:none;">添加新待办</p>
        <el-tooltip
          class="box-item"
          effect="light"
          content="确认添加"
          placement="bottom-end"
          :show-after="delayTime"
        ><el-button color="rgba(96,96,96,0)" style="width:35px;height: 35px;margin-left: auto" @click="() => {if (input != null){todoList.push(input);}input=null;}" :disabled="todoList.length >= 14"><el-icon size="24px"><Check /></el-icon></el-button></el-tooltip>
        <el-tooltip
          class="box-item"
          effect="light"
          content="删除内容"
          placement="bottom-end"
          :show-after="delayTime"
        ><el-button color="rgba(96,96,96,0)" style="width:35px;height: 35px;margin-right: 30px" @click="() => {boolShow = false;input=null;}"><el-icon size="21px"><Delete /></el-icon></el-button></el-tooltip>
      </div>
      <div class="inputWord">
        <p style="margin: 0 0 6px 0;font-weight: bold;font-size: 15px;">请输入待办内容</p>
        <el-input v-model="input"  style="width: 100%;font-size: 15px;" id="custom-input"
                  type="textarea" placeholder="" resize=none :input-style="styleInput.common"
                  :rows="rows" maxlength=60
                  ref="inputEl"
                  @focus="focusStyle($event)"
                  @blur="focusStyle($event)"
                  @mouseover="focusStyle($event)"
                  @keyup.enter ="(e)=>{
                    if (e.keyCode === 13 && e.shiftKey) {
                      if (input != null){
                        todoList.push(input);
                      }
                      input=null;
                    }
                  }"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref , watch , onMounted  } from 'vue'
import {Check, Delete} from "@element-plus/icons-vue";
const input = ref(null)
const ifPenetrates = defineModel('ifPenetrates')
const rows = ref(3)
const inputEl = ref(null)
const delayTime = ref(400)
const focusStyle = ref((e) => {
  e.target.style.boxShadow = '0 0 0 1px #f0c9cf inset'
  e.target.style.borderRadius = '6px'
})
const styleInput = ref({
  common: {
    background: '#f07c82',
    color: '#ffffff',
    borderColor: '#ffffff',
    overflow: 'hidden'
  },
})
const Turns = ref("rTurns")
const boolShow = defineModel('boolShow')
const todoList = defineModel('todoList')
watch(boolShow,(newVal) => {
  Turns.value = newVal ? "Turns" : "rTurns";
})
onMounted(() => {
  Turns.value = 'inputFirst'
})
</script>
<style scoped>

.inputBox{
  position: absolute;
  height: 200px;
  box-shadow:  0 3px 0  #ffffff;
  background-color: #edb0b1;
  margin: 4px 0;
  width: 100%;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.inputTurns{
  position: relative;
  width: 95%;
  height: 215px;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.inputFirst{
  width: 0;
  height: 0;
}
.Turns{
  animation: showTurns 0.3s ease-out;
  margin: 0;
}
.rTurns{
  animation: showRTurns 0.3s ease-in;
  height: 0;
}
@keyframes showTurns{
  from{
    height: 0;
  }
  to{
    height: 215px;
  }
}
@keyframes showRTurns{
  from{
    height: 215px;
  }
  to{
    height: 0;
  }
}
.inputBox > .inputHeader{
  height: 40px;
  width: 100%;
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.inputBox > .inputWord{
  width: 85%;
}
</style>
