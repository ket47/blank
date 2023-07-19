<style scoped>
.promo-label{
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
}
ion-card{
  border-radius: 10px;
}
.section-title{
  margin: 0;
}
.promo-image{
    border-radius: 10px;
    border: 2px solid var(--ion-color-light);
    width:125px;
    height:125px;
    overflow:hidden;
    align-items: center;
    justify-content: center;
    display:flex;
    position: relative;
}
.promo-image .blur-image{
    position: absolute;
    z-index: -1;
    min-height:100%;
    min-width:100%;
    filter: blur(5px);
}


 @media screen and (min-width: 740px) {
 }
</style>

<template>
  <div class="promo-slider-container ion-margin-top" v-if="promo_list && promo_list.length > 0">
    <ion-grid class="ion-justify-content-between ion-align-items-center" style="padding: 0 16px;">
      <ion-row>
        <ion-col size="12">
          <h5 class="section-title">Акция</h5>
        </ion-col>
      </ion-row>
    </ion-grid>
    <swiper class="promo-slider"
      :speed="200"
      :spaceBetween="20"
      :navigation="false"
    >
      <swiper-slide v-for="(productItem, productItemIndex) in promo_list"  :key="productItemIndex" style="width: 120px; height: 190px;">
        <div @click="$go(`/catalog/product-${productItem.product_id}`)" button detail="false" lines="none">
          <ion-card class="promo-image" style="width: 120px; height: 120px;">
            <ion-chip class="promo-label" style="background: var(--ion-color-success); color: white"><b>{{ productItem.perk_label }}</b></ion-chip>
            <img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.10.10.png`"/>
            <ion-img @click="$go(`/catalog/product-${productItem.product_id}`)" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.150.150.webp`"/>
          </ion-card>
          <div lines="none" class="promo-title" style="color:black;height:3em;font-size:11px;overflow:hidden; line-height:1.4em; font-weight: bold;">
              <b>{{productItem.perk_title}}</b>
            </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import {
  IonImg,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonCard
}                   from "@ionic/vue";
import {  
  timeOutline, 
  searchOutline
 }                  from 'ionicons/icons'
 
import { 
  Swiper,
  SwiperSlide 
 }                  from 'swiper/vue';


export default {
  components: {
    Swiper,
    SwiperSlide,
    IonImg,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonCard
  },
  setup(){
      return {
        timeOutline,
        searchOutline
      }
  },
  props: ['storeList', 'limit'],
  computed: {
    promo_list () {
      return this.filterSubstract(this.storeList).slice(0, this.limit);
    }
  },
  methods: {
    filterSubstract(storeList){
      let result = []
      for(var i in storeList){
        if (storeList[i].perks.length > 0) {
          let promo_products = storeList[i].perks.filter( (perk) => {
            if(perk.product_id) return true;
          })
          result = result.concat(promo_products)
        }
      }
      return result;
    }
  }
};
</script>

