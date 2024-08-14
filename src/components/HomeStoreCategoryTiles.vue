<style scoped>
.store-category-container{
  position: relative;
}
.store-category-container 
.store-category-grid{
  display: grid;
  align-items: end;
  grid-template-columns: calc(-10px + 50%) calc(-10px + 50%);
  grid-gap: 10px;
  padding-bottom: 10px;
}

.swiper-slide {
  width: 60%;
  max-width: 250px;
}
.swiper-slide:nth-child(1) .store-category-grid{
  grid-template-areas: 
            "a a"
            "b c";
  margin-left: 10px;
}
.swiper-slide:nth-child(2) .store-category-grid{
  grid-template-areas: 
            "a b"
            "c d";
}
.swiper-slide:last-child .store-category-grid{
  margin-right: 10px;
}
.store-category-item{
  background: #f4f5f8;
  display: grid;
  border-radius: 10px;
  overflow: hidden;
  height: 100px;
  width: 100%;
  position: relative;
}
.store-category-item .desc-section{
  padding: 5px;
}
.store-category-item .img-section{
  justify-self: end;
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
}
.store-category-item .img-section img{
  vertical-align: bottom;
}
.store-category-item h5{
  margin: 5px;
  font-size: 13px;
  font-weight: bold;
}
.store-category-item:nth-child(1){
  grid-area: a;
}
.store-category-item:nth-child(2){
  grid-area: b;
}
.store-category-item:nth-child(3){
  grid-area: c;
}
.store-category-item:nth-child(4){
  grid-area: d;
}
.store-category-item:nth-child(5){
  grid-area: e;
}
.store-category-item:nth-child(6){
  grid-area: f;
}
.store-category-item:nth-child(7){
  grid-area: g;
}

.store-category-item .img-section{
  width: 70%;
}
 .swiper-slide:nth-child(1) .store-category-item:nth-child(1) .img-section{
  width: 100%;
}

.swiper-slide:nth-child(1) .store-category-item:nth-child(1) .img-section img{
  max-width: 120px;
}
.swiper-slide:nth-child(1) .store-category-item.active-item {
  background: linear-gradient(to top, #00b4bd, #08b3e8);
  color: white;
}
.swiper-slide:nth-child(1)  .store-category-item.active-item:nth-child(2) {
  background: linear-gradient(-45deg, #c7831c, #e80f08);
  color: white;
}
.swiper-slide:nth-child(1) .store-category-item.active-item:nth-child(3) {
  background: linear-gradient(-45deg, #367440, #000000);
  color: white;
}
.swiper-slide:nth-child(2) .store-category-item.active-item:nth-child(1) {
  background: linear-gradient(-45deg, #1cc785, #08cc22);
  color: white;
}
.swiper-slide:nth-child(2) .store-category-item.active-item:nth-child(2) {
  background: linear-gradient(-45deg, #d8db26, #c27400);
  color: white;
}
.swiper-slide:nth-child(2) .store-category-item.active-item:nth-child(3) {
  background: linear-gradient(to top, #5868fc, #622fee);
  color: white;
}
.swiper-slide:nth-child(2) .store-category-item.active-item:nth-child(4) {
  background: linear-gradient(to top, #27c080, #2080a7);
  color: white;
}
.swiper-slide:nth-child(3) .store-category-item.active-item:nth-child(1) {
  background: linear-gradient(to top, #d4386c, #860a1f);
  color: white;
}
.swiper-slide:nth-child(3) .store-category-item.active-item:nth-child(2) {
  background: linear-gradient(to top, #00b4bd, #08b3e8);
  color: white;
}
.swiper-slide:nth-child(3) .store-category-item.active-item:nth-child(3) {
  background: linear-gradient(-45deg, #1cc785, #08cc22);
  color: white;
}


@media screen and (min-width: 740px) {
  .swiper-slide {
    max-width: 400px;
  }
  .store-category-item{
    height: 120px;
  }
  .store-category-item .img-section{
    width: 50%;
  }
}

</style>

<template>
  <div class="store-category-container">
      <swiper :slides-per-view="'auto'" class="store-category-swiper">
        <swiper-slide v-for="(group, i) in this.storeGroupsGrouped" :key="i">
            
            <div class="store-category-grid">
              <div :class="`store-category-item ${(activeGroup == store_group.group_id) ? 'active-item' : ''}`" v-for="(store_group, k) in group" @click="selectGroup(store_group.group_id)" :key="k">
                <div class="desc-section">
                  <h5> {{ store_group.group_name }}</h5>
                </div>
                <div class="img-section">
                  <img :src="`${$heap.state.hostname +'image/get.php/' +store_group.image_hash +'.180.180.png'}`"/>
                </div>
              </div>
            </div>
        </swiper-slide>
      </swiper>  
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useRoute, useRouter } from 'vue-router';

import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'

import 'swiper/css/bundle';

export default {
  props: ['storeGroups'],
  components: {
    Swiper,
    SwiperSlide
  },
  setup(){
      const route = useRoute();
      const router = useRouter();
      return {
        route,
        router,
        chevronBackOutline,
        chevronForwardOutline
      }
  },
  data() {
    return {
      activeGroup: 0,
      storeGroupsGrouped: [],
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent),
      imgConfig: {
        6: '/img/categories/tezkel_category_burger.png',
        5: '/img/categories/tezkel_category_flowers.png',
        1: '/img/categories/tezkel_category_products.png',
        3: '/img/categories/tezkel_category_restaurant.png',
        4: '/img/categories/tezkel_category_halal.png'
      }
    };
  },
  methods: {
    selectGroup(val) {
      this.router.push({ hash: '#cat='+val })
    },
    groupStoreGroups(){
      this.storeGroupsGrouped = []
      var batch = []
      for(var i in this.storeGroups){
        batch.push(this.storeGroups[i])
        if((this.storeGroupsGrouped.length == 0 && batch.length == 3) || (batch.length == 4)){
          this.storeGroupsGrouped.push(batch)
          batch = []
        } 
      }
      if(batch.length > 0) this.storeGroupsGrouped.push(batch)
    }
  },
  watch:{
    'storeGroups'(){
      this.activeGroup = this.route.hash.split('=')[1] ?? this.storeGroups[0].group_id
      setTimeout(() => {this.$emit('onGroupSelected', this.activeGroup)}, 10)
      this.groupStoreGroups()
    },
    'route.hash'(){
      var group_id = this.route.hash.split('=')[1]
      this.activeGroup = group_id; 
      setTimeout(() => {this.$emit('onGroupSelected', group_id)}, 10)
    }
  },
  mounted(){
    if(this.storeGroups.length > 0) {
      this.activeGroup = this.route.hash.split('=')[1] ?? this.storeGroups[0].group_id
      setTimeout(() => {this.$emit('onGroupSelected', this.activeGroup)}, 10)
    }
    this.groupStoreGroups()
  }
};
</script>

