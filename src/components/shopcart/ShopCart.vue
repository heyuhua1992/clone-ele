<template>
<div>
  <div class="shopcart">
    <div class="content"
         @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo"
               :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart"
               :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">
            {{ totalCount }}
          </div>
        </div>
        <div class="price"
             :class="{'highlight': totalPrice}">
          &yen;{{ totalPrice }}
        </div>
        <div class="desc">
          另需配送费&yen;100元
        </div>
      </div>
      <div class="content-right"
           @click.stop="pay">
        <div class="pay"
             :class="payClass"
             v-html="payDesc">
        </div>
      </div>
    </div>
    <div class="ball-content">
      <div v-for="(ball, index) in balls"
           :key="index">
        <transition name="drop"
                    @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop">
          <div class="ball"
               v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty"
                @click="empty">
            清空
          </span>
        </div>
        <div class="list-content" ref="listcontent">
          <ul>
            <li class="food"
                v-for="(food,index) in selectFoods"
                :key="index">
              <span>{{ food.name }}</span>
              <div class="price">
                <span>&yen;{{ food.price * food.count }}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <CartControl :food="food"
                             @add="addFood"/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade"><!-- 背景的HTML：跟随购物车列表显示隐藏 -->
      <div class="list-mask"
           v-show="listShow"
           @click="hideList">
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import CartControl from 'components/cartcontrol/CartControl'
export default {
  name: 'shop-cart',
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default () {
        return [
          // {
          //   price: 10,
          //   count: 1
          // }
        ]
      }
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true,
      scroll: false
    }
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        // let ball = this.balls[this.balls.length - 1 - i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop (el) { // 小球抛出之前
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 40
          let y = -(window.innerHeight - rect.top - 45)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    dropping (el, done) { // 抛出中
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterDrop (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList () { // 点击显示购物车中的商品列表
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    addFood (target) {
      this.drop(target)
    },
    empty () {
      this.selectFoods.forEach(food => {
        food.count = 0
      })
    },
    hideList () { // 购物列表出现的时候,显示隐藏图层
      this.fold = true
    },
    pay () {
      if (this.totalPrice >= this.minPrice) {
        alert('该功能还未实现')
      }
    }
  },
  computed: {
    payClass () {
      if (this.totalPrice === 0 || this.minPrice > this.totalPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    totalCount () {
      let count = 0
      if (this.selectFoods && this.selectFoods.length > 0) {
        this.selectFoods.forEach((food) => {
          count += food.count
        })
      }
      return count
    },
    totalPrice () {
      let total = 0
      if (this.selectFoods && this.selectFoods.length > 0) {
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
      }
      return total
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `&yen;${this.minPrice}起送`
      } else if (this.minPrice > this.totalPrice) {
        return `还差${this.minPrice - this.totalPrice}起送`
      } else {
        return '去结算'
      }
    },
    listShow () {
      if (!this.totalCount && this.totalCount === 0) {
        this.$set(this, 'fold', true)
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          // better-scroll
          if (!this.scroll) {
            this.$set(this, 'scroll', new BScroll(this.$refs.listcontent, {
              click: true
            }))
          }
        })
      }
      return show
    }
  },
  components: {
    CartControl
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl"
.shopcart
  position fixed
  z-index 100
  left 0
  right 0
  bottom 0
  height 48px
  .content
    display flex
    background #141d27
    color rgba(255, 255, 255, .4)
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        vertical-align text-top
        position relative
        top -10px
        padding 6px
        border-radius 50%
        background #141d27
        height 56px
        width 56px
        margin 0 16px
        box-sizing border-box
        .logo
          width 100%
          height 100%
          border-radius 50%
          background-color #2b343c
          text-align center
          &.highlight
            background-color rgb(0, 160, 220)
          .icon-shopping_cart
            line-height 44px
            font-size 24px
            color #80858a
            &.highlight
              color #FFF
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          font-size 9px
          background-color rgb(240, 20, 20)
          box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
          color #FFF
          font-weight 700
          text-align center
          border-radius 6px
      .price
        display inline-block
        vertical-align top
        padding-right 12px
        margin-top 12px
        height 24px
        line-height 24px
        font-size 16px
        font-weight 700
        box-sizing border-box
        border-right 1px solid rgba(255, 255, 255, .1)
        &.highlight
          color #FFF
      .desc
        display inline-block
        vertical-align top
        margin: 12px 0 0 12px
        line-height 24px
        font-size 10px
    .content-right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size 14px
        font-weight 700
        &.not-enough
          background-color #2b333b
        &.enough
          background-color #00b43c
          color #FFF
  .ball-content
    .ball
      position fixed
      left 44px
      bottom 36px
      z-index 200
      transition all .4s cubic-bezier(.49, -.29, .75, .41)
      .inner
        width 16px
        height 16px
        border-radius 50%
        background-color rgb(0, 160, 220)
        transition all .4s linear
  .shopcart-list
    position absolute
    left 0
    right 0
    top 0
    z-index -1
    transform translate3d(0, -100%, 0)
    &.fold-enter-active,
    &.fold-leave-active
      transition all .5s
    &.fold-enter,
    &.leave-active
      transform translate3d(0, 0, 0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background-color #f3f5f7
      border-bottom 1px solid rgba(7, 17, 27, .1)
      .title
        float left
        font-size 14px
        color rgb(7, 17, 27)
      .empty
        float right
        font-size 12px
        color rgb(0, 160, 220)
    .list-content
      padding 0 18px
      max-height 258px
      overflow hidden
      background-color #FFF
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, .1))
        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index -2
    opacity 1
    filter blur(19px)
    background-color rgba(7, 17, 27, .6)
    transition all .5s
    &.fade-enter-active,
    &.fade-leave-active
      transition all .5s
    &.fade-enter,
    &.fade-leave-active
      opacity 0
      background-color rgba(7, 17, 27, 0)
</style>
