<style scoped>
.store-category-container{
  position: relative;
}
.store-category-container .horizontalScroller{

  padding: 8px;
}
.store-category-container .navigation{
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
.store-category-container .navigation ion-button{
  pointer-events: all;
}
.store-category-container 
.store-category-grid{
  display: grid;
  grid-template-areas: 
            "a a b c"
            "d e f g";
  align-items: end;
  grid-template-columns: 28% 28% 28% 28% 28% 28% 28%;
  grid-gap: 0.5em;
}
.store-category-item{
  background: linear-gradient(to top, #eee, #fff);
  display: grid;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-shadow: 2px 2px 10px -5px #00000082;
}
.store-category-item .desc-section{
  padding: 5px;
}
.store-category-item .img-section{
  justify-self: end;
  text-align: right;
  align-self: end;
  margin-top: -10px;
}
.store-category-item .img-section img{
  vertical-align: bottom;
}
.store-category-item.active-item {
  background: linear-gradient(to top, #00b4bd, #08b3e8);
  color: white;
}
.store-category-item h5{
  margin: 5px;
  font-size: 13px;
  font-weight: bold;
}
.store-category-item:nth-child(1){
  grid-area: a;
  grid-template-columns: 40% 60%;
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

.store-category-item:nth-child(1) .img-section{
  margin-top: -30px;
}
.store-category-item:nth-child(2) .img-section{
  width: 70%;
}
.store-category-item:nth-child(3) .img-section,
.store-category-item:nth-child(4) .img-section,
.store-category-item:nth-child(5) .img-section{
  width: 60%;
}
.store-category-item.active-item:nth-child(2) {
  background: linear-gradient(-45deg, #c7831c, #e80f08);
  color: white;
}
.store-category-item.active-item:nth-child(3) {
  background: linear-gradient(-45deg, #367440, #000000);
  color: white;
}
.store-category-item.active-item:nth-child(4) {
  background: linear-gradient(-45deg, #1cc785, #08cc22);
  color: white;
}
.store-category-item.active-item:nth-child(5) {
  background: linear-gradient(-45deg, #d8db26, #c27400);
  color: white;
}


@media screen and (min-width: 740px) {
  
  .store-category-container 
  .store-category-grid{
    grid-gap: 1em;
  }
  .store-category-grid{
    grid-template-columns: 20% 20% 20% 20% 20% 20% 20% !important;
  }
  .store-category-item:nth-child(1){
    grid-template-columns: 60% 40%;
  }
}

</style>

<template>
  <div class="store-category-container">
    <ion-row v-if="!isMobile" class="ion-justify-content-between ion-align-items-center navigation">
      <ion-col class="ion-text-start">
        <ion-button @click="scrollSlider('prev')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon></ion-button>
      </ion-col>
      <ion-col class="ion-text-end">
        <ion-button @click="scrollSlider('next')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon></ion-button>
      </ion-col>
    </ion-row>
    <div class="horizontalScroller"  ref="catSlider">
      <div class="store-category-grid">
        <div :class="`store-category-item ${(activeGroup == store_group.group_id) ? 'active-item' : ''}`" v-for="(store_group, i) in storeGroups" @click="selectGroup(store_group.group_id)" :key="i">
          <div class="desc-section">
            <h5> {{ store_group.group_name }}</h5>
          </div>
          <div class="img-section">
            <img :src="`${$heap.state.hostname +'image/get.php/' +store_group.image_hash +'.120.120.png'}`"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  IonButton,
  IonRow,
  IonCol,
  IonIcon
}                   from "@ionic/vue";
import {  
  chevronBackOutline,
  chevronForwardOutline
 }                  from 'ionicons/icons'

export default {
  props: ['storeGroups','isBlocked'],
  components: {
    IonButton,
    IonRow,
    IonCol,
    IonIcon
  },
  setup(){
      return {
        chevronBackOutline,
        chevronForwardOutline
      }
  },
  data() {
    return {
      activeGroup: 1,
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
      if(this.isBlocked){
        return false;
      }
      this.activeGroup = val
      this.$emit('onGroupSelected', val)
    },
    scrollSlider (direction){
      let stepWidth = 330
      let scrollLeft
      if(direction == 'prev') scrollLeft = this.$refs.catSlider.scrollLeft - stepWidth;
      if(direction == 'next') scrollLeft = this.$refs.catSlider.scrollLeft + stepWidth;
      this.$refs.catSlider.scrollTo({
        top: 0,
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }
};
</script>

