<style scoped>
.product-category-swiper{
  padding: 0 0.5em;
}
.product-category-item{
  margin-right: 10px;
  justify-content: center;
}
.product-category-item .img-section{
  background: white;
  position: relative;
}
.product-category-item .img-section .img-container{
  overflow: hidden;
  box-shadow: 0px 0px 0px 1px #eee;
  border-radius: 50px;
  padding: 2px;
  position: relative;
}
.product-category-swiper .swiper-slide:nth-child(1){
  margin-left: 5px;
}
.product-category-item .img-section ion-icon{
  position: absolute;
  bottom: 25%;
  right: 25%;
  width: 50%;
  height: 50%;
  color: white;
}
.product-category-item.active-item .img-section .img-container{
  box-shadow: 0px 0px 0px 1px #eee;
}
.product-category-item.active-item .img-container:after{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--ion-color-primary);
  opacity: 0.5;
}
.product-category-item .desc-section{
  text-align: center;
}
.product-category-item h5{
  margin: 5px;
  font-size: 10px;
  font-weight: bold;
}
.selected-categories > ion-chip{
  margin-left: 10px;
}

.selected-categories > ion-chip ion-label{
  font-size: 11px;
  font-weight: bold;
}
.swiper-slide {
  width: 80px;
}
</style>

<template>
  <div class="product-category-grid">
      <ion-item class="ion-justify-content-between ion-align-items-center" lines="none"  style="--background: transparent;--padding-start: 10px;">
        <h5 slot="start" class="ion-no-margin section-title">Категории </h5><ion-badge v-if="selectedCount > 0" style="margin-left: 10px;">{{ selectedCount }}</ion-badge>
        <a slot="end"  @click="clearActive() ">
          <ion-item lines="none" :style="`cursor: pointer;`" v-if="selectedCount > 0">
            Очистить
          </ion-item>
        </a>
      </ion-item>
      <swiper :slides-per-view="'auto'" class="product-category-swiper">
        <swiper-slide v-for="(product_group, i) in productGroups" :key="i" @click="selectGroup(product_group.group_id)">
          <div :class="`product-category-item ${(activeGroups[product_group.group_id]) ? 'active-item' : ''}`" >
            <div class="img-section">
              <div class="img-container">
                <img v-if="product_group.image_hash" :src="`${$heap.state.hostname +'image/get.php/' +product_group.image_hash +'.80.80.png'}`"/>
                <img v-else :src="`/img/perks/${product_group.image_url}`"/>
              </div>
              <ion-icon v-if="activeGroups[product_group.group_id]" :icon="checkmark" ></ion-icon>
            </div>
            <div class="desc-section">
              <h5> {{ product_group.group_name }}</h5>
            </div>
            
          </div>
      </swiper-slide>
    </swiper>
    <div class="horizontalScroller selected-categories">
      <ion-chip v-for="(activeGroup, activeGroupId) in activeGroups" :key="activeGroupId"  >
        <ion-avatar>
          <img v-if="activeGroup.image_hash"  :src="`${$heap.state.hostname +'image/get.php/' +activeGroup.image_hash +'.50.50.png'}`"/>
          <img v-else :src="`/img/perks/${activeGroup.image_url}`"/>
        </ion-avatar>
        <ion-label>{{ activeGroup.group_name }}</ion-label>
        <ion-icon :icon="closeCircle" @click="selectGroup(activeGroupId)"></ion-icon>
      </ion-chip>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  IonBadge,
  IonItem,
  IonChip,
  IonAvatar,
  IonLabel,
  IonIcon
}                   from "@ionic/vue";
import { 
  closeCircle,
  checkmark
}                              from "ionicons/icons";

import 'swiper/css/bundle';

export default {
  components: {
    Swiper,
    SwiperSlide,
    IonBadge,
    IonItem,
    IonChip,
    IonAvatar,
    IonLabel,
    IonIcon
  },
  setup(){
      return {
        closeCircle,
        checkmark
      }
  },
  props: ['productGroups', 'storeGroup'],
  data() {
    return {
      activeGroups: {},
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
    };
  },
  computed: {
    selectedCount(){
      return Object.keys(this.activeGroups).length
    }
  },
  methods: {
    selectGroup(val) {
      if(this.activeGroups[val]) { 
        delete this.activeGroups[val]
      } else {
        this.activeGroups[val] = this.productGroups.find((item) => item.group_id == val)
      }
      setTimeout(() => {this.$emit('onProductGroupSelected', Object.keys(this.activeGroups))}, 10)
      
    },
    clearActive() {
      this.activeGroups = {}
      this.$emit('onProductGroupSelected', Object.keys(this.activeGroups))
    }
  },
  watch:{
    'storeGroup'(){
      this.activeGroups = {}
    },
  }
};
</script>

