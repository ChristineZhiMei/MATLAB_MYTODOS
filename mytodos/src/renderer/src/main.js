import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'

const app = createApp(App)

app.use(ElementPlus)
app.use(VueAxios, axios)
app.mount('#app')
