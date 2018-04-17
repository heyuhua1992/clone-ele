<template>
<div class="ratingselect">
  <div class="rating-type">
    <span class="block all"
          :class="{'active': selectType === 2 }"
          @click="select(2)">
      {{ desc.all }}
      <span class="count">
        {{ ratings.length }}
      </span>
    </span>
    <span class="block positive"
          :class="{'active': selectType === 0 }"
          @click="select(0)">
      {{ desc.positive }}
      <span class="count">
        {{ positives.length }}
      </span>
    </span>
    <span class="block nagative"
          :class="{'active': selectType === 1 }"
          @click="select(1)">
      {{ desc.nagative }}
      <span class="count">
        {{ nagatives.length }}
      </span>
    </span>
  </div>
  <div class="switch"
       @click="toggleContent" :class="{'on': onlyContent}">
    <span class="icon-check_circle"></span>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script>
const ALL = 2
// 推荐评价
const POSITIVE = 0
// 吐槽评价
const NEGATIVE = 1
export default {
  name: 'rating-select',
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '推荐',
          nagative: '吐槽'
        }
      }
    }
  },
  methods: {
    select (type) {
      this.$emit('select', type)
    },
    toggleContent () {
      this.$emit('toggle')
    }
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        // 去掉不满足条件的
        return rating.rateType === POSITIVE
      })
    },
    nagatives () {
      return this.ratings.filter((rating) => {
        // 去掉不满足条件的
        return rating.rateType === NEGATIVE
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl"
.ratingselect
  .rating-type
    padding 18px 0
    border-1px(rgba(7, 17, 27, .1))
    font-size 0
    .block
      display inline-block
      padding 8px 12px
      margin-right 8px
      line-height 16px
      font-size 12px
      color rgb(77, 85, 93)
      border-radius 2px
      &.active
        color #FFF
        .count
          margin-left 2px
          font-size 8px
          color #FFF
      &.all
        background-color rgba(0, 130, 180, .2)
        &.active
          background-color rgba(0, 160, 220, 1)
      &.positive
        background-color rgba(0, 160, 220, .2)
        &.active
          background-color rgba(0, 160, 220, .5)
      &.nagative
        background-color rgba(77, 85, 93, .2)
        &.active
          background-color rgba(77, 85, 93, 1)
  .switch
    padding 12px 0
    line-height 24px
    border-bottom 1px solid rgba(7, 17, 27, .1)
    color rgb(147, 153, 159)
    font-size 0
    &.on
      .icon-check_circle
        color #00c850
    .icon-check_circle
      display inline-block
      margin-right 4px
      font-size 24px
      vertical-align top
    .text
      display inline-block
      font-size 12px
</style>
