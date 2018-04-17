<template>
<div class="ratings">
  <div class="ratings-content">
    <div class="overview">
      <div class="overview-left">
        <h1 class="score">{{ seller.score }}</h1>
        <div class="title">
          综合评分
        </div>
        <div class="rank">
          高于周边商家{{ seller.rankRate }}%
        </div>
      </div>
      <div class="overview-right">
        <div class="score-wrapper">
          <span class="title">服务态度</span>
          <Star :size="36" :score="seller.serviceScore"></Star>
          <span class="score">{{ seller.serviceScore }}</span>
        </div>
        <div class="score-wrapper">
          <span class="title">商品评分</span>
          <Star :size="36" :score="seller.foodScore"></Star>
          <span class="score">{{ seller.foodScore }}</span>
        </div>
        <div class="delivery-wrapper">
          <span class="title">送达时间</span>
          <span class="delivery">{{ seller.deliveryTime }}分钟</span>
        </div>
      </div>
    </div>
    <Split />
    <RatingSelect :selectType="selectType"
                  :onlyContent="onlyContent"
                  :desc="desc"
                  :ratings="ratings"
                  @select="selectRating"
                  @toggle="toggleContent"/>
  </div>
</div>
</template>

<script>
import Star from 'components/star/Star'
import Split from 'components/split/Split'
import RatingSelect from 'components/ratingselect/RatingSelect'
const ALL = 2
export default {
  name: 'ratings',
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        nagative: '不满意'
      }
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  beforeCreate () {
    this.$axios.get('/api/appData')
      .then(rep => {
        this.ratings = rep.data.data.ratings
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
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
    }
  },
  components: {
    Star,
    Split,
    RatingSelect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.ratings
  position absolute
  top 180px
  bottom 0
  right 0
  left 0
  overflow hidden
  .ratings-content
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px /*设置固定宽度*/
        width 137px /*安卓浏览器必须再设置一下宽度，否则有问题*/
        padding 6px 0
        border-right 1px solid rgba(7, 17, 27, .1)
        text-align center
        @media only screen and (max-width 320px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)

      .overview-right
        flex 1
        padding 6px 24px 6px 24px
        @media only screen and (max-width 320px)
          margin-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
            vertical-align top
          .star
            display inline-block
            line-height 18px
            vertical-align top
          .score
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .delivery
            margin-left 12px
            font-size 12px
            color: rgb(147, 153, 159)
</style>
