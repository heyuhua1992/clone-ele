<template>
<div class="goods">
  <div class="menu_wrapper" ref="menuwrapper">
    <ul>
      <li v-for="(item,index) in goods"
          :key="index"
          class="menu_item"
          :class="{'current': currentIndex === index}"
          ref="menuList"
          @click="selectMenu(index)">
        <span class="text">
          <span class="icon"
                v-if="item.type > 0"
                :class="classMap[item.type]"></span>
          {{ item.name }}
        </span>
      </li>
    </ul>
  </div>
  <div class="foods_wrapper" ref="foodswrapper">
    <ul>
      <li v-for="(item,index) in goods"
          :key="index"
          class="food-list"
          ref="foodList">
        <h1 class="title">{{ item.name }}</h1>
        <ul>
          <li v-for="(food,foodIndex) in item.foods"
              :key="foodIndex"
              class="food-item border-1px" @click="selectFood(food)">
            <div class="icon">
              <img :src="food.icon" width="57" height="57"/>
            </div>
            <div class="content">
              <h2 class="name">{{ food.name }}</h2>
              <p class="desc">{{ food.description }}</p>
              <div class="extra">
                <span class="count">
                  月售{{ food.sellCount }}份
                </span><span>
                  好评率{{ food.rating }}%
                </span>
              </div>
              <div class="price">
                <span class="now">
                  &yen;{{ food.price }}
                </span><span v-if="food.oldPrice" class="old">
                  &yen;{{ food.oldPrice}}
                </span>
              </div>
              <div class="cartcontral-wrapper">
                <CartControl :food="food"
                             @add="addFood"/>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <!--购物车-->
  <ShopCart :deliveryPrice="seller.deliveryPrice"
            :minPrice="seller.minPrice"
            :selectFoods="selectFoods"
            ref="shopcart"/>
  <Food ref="food" :food="selectedFood" @add="addFood"/>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import CartControl from 'components/cartcontrol/CartControl'
import ShopCart from 'components/shopcart/ShopCart'
import Food from 'components/food/Food'
// 传递数据成功时
const ERR_OK = 0
const debug = process.env.NODE_ENV !== 'prodiction'
export default {
  name: 'goods',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  beforeCreate () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    const url = debug ? '/api/appData' : 'http://ustbhuangyi.com/sell/api/goods'
    this.$axios.get(url)
      .then(rep => {
        if (ERR_OK === rep.data.errno) {
          this.goods = rep.data.data.goods
          // 保证先刷新页面,然后再进行计算
          this.$nextTick()
            .then(() => {
              // 初始化better-scroll对象
              this._initScroll()
              this._calculateHeight()
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuwrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
        probeType: 3,
        click: true
      })
      this.foodsScroll.on('scroll', (pos) => {
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y)) // abs 取绝对值 round四舍五入
        }
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _followScroll (index) {
      let menuList = this.$refs.menuList
      this.menuScroll.scrollToElement(menuList[index], 300, 0, true)
    },
    selectMenu (index) {
      let foodList = this.$refs.foodList
      this.foodsScroll.scrollToElement(foodList[index], 300, 0, 1)
    },
    addFood (target) {
      this._drop(target)
    },
    _drop (target) {
      this.$refs.shopcart.drop(target)
    },
    selectFood (food) {
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  computed: {
    currentIndex () {
      let scrollHeight = this.scrollY
      for (let i = 1; i < this.listHeight.length; i++) {
        if (scrollHeight >= this.listHeight[i - 1] && scrollHeight < this.listHeight[i]) {
          this._followScroll(i - 1)
          return i - 1
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count && food.count > 0) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  components: {
    CartControl,
    ShopCart,
    Food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl";
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100vw
    overflow hidden
    .menu_wrapper
      flex 0 0 80px
      width 80px
      background-color #f3f5f7
      .menu_item
        display table // 设置为table 不管有几行都可以垂直居中
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #FFF
          font-weight 700
          .text // 高亮情况下的text
            border-none()
        .text // 正常情况下的text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px
          .icon
            display inline-block
            width 12px
            height 12px
            margin-right 2px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image ('decrease_3')
            &.discount
              bg-image ('discount_3')
            &.guarantee
              bg-image ('guarantee_3')
            &.invoice
              bg-image ('invoice_3')
            &.special
              bg-image ('special_3')
    .foods_wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background-color #f3f5f7
      .food-item
        display flex
        margin 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
            font-weight bold
          .desc,
          .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 34px
            margin-bottom 18px
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
            right 0
            bottom 8px
</style>
