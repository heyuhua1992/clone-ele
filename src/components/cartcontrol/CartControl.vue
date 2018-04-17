<template>
<div class="cartcontrol">
  <transition name="move">
    <div class="cart-decrease"
         v-show="food.count > 0"
         @click.stop.prevent="decreaseCart">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
  </transition>
  <div class="cart-count"
       v-show="food.count > 0">{{ food.count }}</div>
  <div class="cart-add icon-add_circle"
       @click.stop.prevent="addCart"></div>
</div>
</template>

<script>
export default {
  name: 'cart-control',
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 触发丢小球
      this.$emit('add', event.target)
    },
    decreaseCart () {
      if (this.food.count && this.food.count > 0) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.cartcontrol
  font-size 0
  box-sizing border-box
  .cart-decrease
    display inline-block
    padding 6px
    opacity 1
    transform translate3d(0, 0, 0)
    .inner
      display inline-block
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
      transition all .3s ease-in-out
      transform rotate(0)
    &.move-enter-active,
    &.move-leave-active
      transition all .3s ease-in-out
    &.move-enter,
    &.move-leave-active
      opacity 0
      transform translate3d(24px, 0 , 0)
      .inner
        transform rotate(180deg)
  .cart-count
    display inline-block
    width 12px
    vertical-align top
    padding-top 6px
    font-size 10px
    height 24px
    line-height 24px
    text-align center
    color rgb(147, 153, 159)
  .cart-add
    display inline-block
    padding 6px
    line-height 24px
    font-size 24px
    color rgb(0, 160, 220)
</style>
