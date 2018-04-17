import Vue from 'vue'
import VueRouter from 'vue-router'
import Seller from '../components/seller/Seller'
import Ratings from '../components/ratings/Ratings'
import Goods from '../components/goods/Goods'

Vue.use(VueRouter)

let routes = [
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/goods',
    component: Goods
  },
  {
    path: '/seller',
    component: Seller
  },
  {
    path: '/ratings',
    component: Ratings
  }
]
export default new VueRouter({
// 默认的 linkActiveClass 为 router-link-active ,现在把他改为active
  linkActiveClass: 'active',
  mode: 'history',
  routes: routes
})
