<template>
  <div id="app">
    <vHeader :seller = "seller"/>
    <div class="tab border-1px">
      <!--<div class="tab-item">-->
        <!--<router-link to="/goods">商品</router-link>-->
      <!--</div>-->
      <!--<div class="tab-item">-->
        <!--<router-link to="/ratings">评论</router-link>-->
      <!--</div>-->
      <!--<div class="tab-item">-->
        <!--<router-link to="/seller">商家</router-link>-->
      <!--</div>-->
      <div class="tab-item"
           v-for="(item,index) in tab"
           :key="index">
        <router-link :to="item.to">{{ item.item }}</router-link>
      </div>
    </div>
    <router-view :seller="seller"/>
  </div>
</template>

<script>
import vHeader from 'components/header/Header'

export default {
  name: 'App',
  data () {
    return {
      seller: {},
      tab: [
        {
          to: '/goods',
          item: '商品'
        }, {
          to: '/ratings',
          item: '评论'
        }, {
          to: '/seller',
          item: '商家'
        }
      ]
    }
  },
  beforeCreate () {
    // 使用devServer 的服务器，请求数据。不能在生产环境下使用
    this.$axios.get('/api/appData')
      .then(rep => {
        this.seller = rep.data.data.seller
      })
      .catch(error => {
        console.log(error)
      })
    // 通过代理获取数据
    // 没有服务器
    // this.$axios.get('/proxy/data')
    //   .then(rep => {
    //     console.log('通过代理获取数据')
    //     console.log(rep)
    //     this.seller = rep.data.data.seller
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  },
  components: {
    vHeader: vHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin.styl";
.tab
  display flex
  width 100%
  height 40px
  line-height 40px
  border-1px(rgba(7, 17, 27, .1))
  .tab-item
    flex 1
    text-align center
    & > a
      display block
      font-size 14px
      color rgb(77, 85, 93)
      text-decoration none
      &.active
        color rgb(240, 20, 20)
</style>
