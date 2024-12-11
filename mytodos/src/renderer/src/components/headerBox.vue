<template>
  <div class="head" :class="header">
    <el-icon size="24px" style="margin: 0 0 0 20px;" ><Checked /></el-icon>
    <el-button style="margin: 0 0 0 10px;box-shadow: 0 0 0 0 #606060;color: #fff;font-weight: bolder;-webkit-app-region: no-drag;"
               color="#B0ADAD3E" @click="boolListShow = !boolListShow">
      <b>
        <span v-if="numList === 0" style="user-select: none;">(*´･д･)? 没有待办了</span>
        <span v-else>{{ numList }}个待办事项</span>
      </b>
    </el-button>
    <el-tooltip
      class="box-item"
      effect="light"
      :content="fixed"
      placement="bottom"
      :show-after="delayTime"
    ><el-button color="rgba(96,96,96,0)" style="width:38px;height: 38px;-webkit-app-region: no-drag;margin-left: auto" @click="header = header === 'header-fixed' ? 'header' : 'header-fixed';fixed = fixed === '固定' ? '取消固定' : '固定'"><el-icon size="24px" class="BottomLeft" :class="header"><BottomLeft /></el-icon></el-button></el-tooltip>
    <el-tooltip
      class="box-item"
      effect="light"
      content="添加待办"
      placement="bottom-end"
      :show-after="delayTime"
    ><el-button color="rgba(96,96,96,0)" style="width:38px;height: 38px;-webkit-app-region: no-drag;" @click="boolShow = !boolShow"><el-icon size="24px"><Edit /></el-icon></el-button></el-tooltip>
    <el-tooltip
      class="box-item"
      effect="light"
      content="隐藏待办"
      placement="bottom-end"
      :show-after="delayTime"
    ><el-button color="rgba(96,96,96,0)" style="width:38px;height: 38px;margin-right: 15px;-webkit-app-region: no-drag;" @click="ifClosed = !ifClosed"><el-icon size="23px"><SemiSelect /></el-icon></el-button></el-tooltip>
  </div>
</template>


<script setup>
import { BottomLeft, Checked, CloseBold, Edit, SemiSelect, Sunny } from "@element-plus/icons-vue";
import { ref } from "vue";
const boolShow = defineModel('boolShow')
const boolListShow = defineModel('boolListShow')
const numList = defineModel('numList')
const ifClosed = defineModel('ifClosed')
const delayTime = ref(400)
const ifPenetrates = defineModel('ifPenetrates')
const header = ref('header-fixed')
const fixed = ref("固定")
</script>
<style>
.head.header{
  height: 50px;
  background-color: #edb0b1;
  margin: 10px;
  width: 95%;
  border-radius: 7px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-app-region: no-drag;
}

.head.header-fixed{
  height: 50px;
  background-color: #edb0b1;
  margin: 10px;
  width: 95%;
  border-radius: 7px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-app-region: drag;
}
.BottomLeft.header-fixed{
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}
.BottomLeft.header{
  transform: rotate(-45deg);
  transition: transform 0.2s ease;
}
</style>
