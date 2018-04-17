<template>
<div>
  <transition name="move">
    <div class="food" ref="food" v-if="showFlag">
      <div class="food-content">
        <div class="image-header">
          <!--异步加载都要是v-bind的形式 如:src-->
          <img :src="food.image"/>
          <div class="back"
               @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">
            {{ food.name }}
          </h1>
          <div class="detail">
            <span class="sell-count">
              月售{{ food.sellCount }}份
            </span
            ><span class="rating">
              好评率{{ food.rating }}%
            </span>
          </div>
          <div class="price">
            <span class="now">
              &yen;{{ food.price }}
            </span
            ><span v-if="food.oldPrice" class="old">
              &yen;{{ food.oldPrice}}
            </span>
          </div>
          <div class="cartcontral-wrapper"
               v-show="food.count && food.count != 0">
            <CartControl :food="food"
                         @add="addFood"/>
          </div>
          <div>
            <transition name="fade">
              <div class="buy"
                   v-show="!food.count || food.count === 0"
                   @click.stop.prevent="addFirst">
                加入购物车
              </div>
            </transition>
          </div>
        </div>
        <Split v-show="food.info"/>
        <div class="info"
             v-show="food.info">
          <h1 class="title">
            商品介绍
          </h1>
          <p class="text">
            {{ food.info }}
          </p>
        </div>
        <Split />
        <div class="rating">
          <h1 class="title">商品介绍</h1>
          <RatingSelect :selectType="selectType"
                        :onlyContent="onlyContent"
                        :desc="desc"
                        :ratings="food.ratings"
                        @select="selectRating"
                        @toggle="toggleContent"/>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length > 0">
              <li class="rating-item border-1px"
                  v-for="(rating,index) in food.ratings"
                  :key="index"
                  v-show="needShow(rating.rateType,rating.text)">
                <div class="user">
                  <!--用户名字-->
                  <span class="name">
                    {{ rating.username }}
                  </span>
                  <!--用户头像-->
                  <img class="avatar"
                       :src="rating.avatar"
                       width="12"
                       height="12">
                </div>
                <!--发表时间-->
                <div class="time">
                  <!--{{ (new Date(rating.rateTime)).toLocaleDateString().replace(/\//g,'-') }}-->
                  <!--{{ (new Date(rating.rateTime)).toLocaleTimeString() }}-->
                  {{ rating.rateTime | formatDate }}
                </div>
                <p class="text">
                    <span :class="iconThumb(rating)">
                    </span>
                  {{ rating.text }}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || food.ratings.length <= 0">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import CartControl from 'components/cartcontrol/CartControl'
import Split from 'components/split/Split'
import RatingSelect from 'components/ratingselect/RatingSelect'
import BScroll from 'better-scroll'
import {formatDate} from 'common/js/date'
const ALL = 2
export default {
  name: 'food',
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        nagative: '吐槽'
      }
    }
  },
  methods: {
    show () {
      // 下面两句和data设定的一样，目的是强调一下
      this.selectType = ALL
      this.onlyContent = true
      this.showFlag = true
      // 保证加载完毕
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.food, {
          click: true
        })
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst (even) {
      this.$emit('add', even.target)
      this.$set(this.food, 'count', 1)
    },
    addFood (target) {
      this.$emit('add', target)
    },
    iconThumb (rating) {
      return {
        'icon-thumb_up': rating.rateType === 0,
        'icon-thumb_down': rating.rateType === 1
      }
    },
    selectRating (type) {
      this.selectType = type
      // 下面的感觉可以不要
      this.$nextTick()
        .then(() => {
          this.scroll.refresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    toggleContent () {
      this.onlyContent = !this.onlyContent
      // 下面的感觉可以不要
      this.$nextTick()
        .then(() => {
          this.scroll.refresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    needShow (type, text) {
      if (this.onlyContent === true && !text) {
        return false
      } else if (this.selectType === ALL) {
        return true
      } else if (this.selectType === type) {
        return true
      }
    }
  },
  filters: { // 过滤器
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    CartControl,
    Split,
    RatingSelect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl"
.food
  position fixed
  left 0
  right 0
  top 0
  bottom 48px
  background-color #fff
  z-index 30
  transform translate3d(0, 0, 0)
  &.move-enter-active,
  &.move-leave-active
    transition all .2s linear
  &.move-enter,
  &.move-leave-active
    transform translate3d(100%, 0, 0)
  .food-content
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        right 0
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #FFF
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        font-size 14px
        font-weight 700
        color: rgb(7, 17, 27)
        margin-bottom 8px
      .detail
        height 10px
        line-height 10px
        font-size 0
        margin-bottom 18px
        .sell-count,
        .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontral-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        border-radius 12px
        font-size 10px
        color #FFF
        background-color rgb(0, 160, 220)
        opacity 1
        box-sizing border-box
        &.fade-enter-active,
        &.fade-leave-active
          transition all .5s ease-in-out
        &.fade-enter,
        &.fade-leave-active
          opacity 0
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        font-weight 700
        color: rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)
    .rating
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        font-weight 700
        color: rgb(7, 17, 27)
      .rating-wrapper
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27,.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              margin-right 6px
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up,
            .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
