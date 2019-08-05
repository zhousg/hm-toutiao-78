// 封装一个vue插件
// 作用：注册components下的所有的组件为全局组件
import MyBread from '@/components/my-bread'
import MyTest from '@/components/my-test'

// vue插件定义的规则  暴露一个对象 {} 在对象中选项 install 对应的一个函数 函数形参 Vue对象
export default {
  install (Vue) {
    // Vue.use(使用插件)  Vue就是你use前的Vue
    // Vue 全局注册组件即可
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyTest.name, MyTest)
  }
}
