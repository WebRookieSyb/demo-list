import { createApp } from './app'

//路由解析完成时将app挂载到#app之下
const { app, router } = createApp()
router.onReady(() => {
    app.$mount('#app')
})