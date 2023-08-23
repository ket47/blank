<style scoped>
ion-card{
  border-radius: 10px;
}
.section-title{
  margin: 0;
  color: white;
}
.fake-label{
  border-radius: 5px;
  padding: 5px;
}
.promo-slider{
  display: flex;
}
.promo-slider-container{
  position: relative;
}

.promo-slider-container .scroller-navigation{
  position: absolute;
  width: 100%;
  height: 100%;
}
.promo-slider-container .scroller-navigation ion-button{
  position: relative;
  z-index: 100;
  --padding-start: 8px;
  --padding-end: 8px;
}

.promo-slider .promo-item{
  width: 330px;
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
.promo-title{
  height: 3.2em;
  white-space: initial;
  color:black;
  font-size:11px;
  overflow: hidden;
  text-align: center;
}
.promo-label{
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
}
</style>

<template>
  <div class="promo-slider-container ion-margin-vertical" v-if="promo_list && promo_list.length > 0">
    <ion-item lines="none"  style="--background: transparent;--padding-start: 10px;">
      <h5 slot="start" class="section-title"><span class="fake-label" :style="`background-color: ${titleColor}`">#Акция</span></h5>
    </ion-item>
    <ion-row v-if="!isMobile" class="ion-justify-content-between ion-align-items-center">
      <ion-col class="ion-text-start">
        <ion-button @click="scrollSlider('prev')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon></ion-button>
      </ion-col>
      <ion-col class="ion-text-end">
        <ion-button @click="scrollSlider('next')" shape="round" color="light"><ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon></ion-button>
      </ion-col>
    </ion-row>
    <div class="horizontalScroller promo-slider" style="overflow-y: hidden;" ref="promoSlider">
      <div v-for="(productItem, productItemIndex) in promo_list"  :key="productItemIndex" style="width: 120px;" class="promo-item ion-margin-horizontal">
        <div @click="$go(`/catalog/product-${productItem.product_id}`)" style="position:relative">

            <ion-chip class="promo-label" style="background: var(--ion-color-success); color: white"><b>{{ productItem.perk_label }}</b></ion-chip>

          <ion-card class="promo-image" style="width: 120px; height: 120px; margin: 0;border-radius:1000000px">
            <img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.10.10.png`"/>
            <ion-img @click="$go(`/catalog/product-${productItem.product_id}`)" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.150.150.webp`"/>
          </ion-card>
          <div class="promo-title">
              <b>{{productItem.perk_title}}</b>
          </div>
          <div class="promo-title" style="color:var(--ion-color-primary);font-size:1.2em">
            <span v-if="productItem.product_price!=productItem.product_final_price" style="color:var(--ion-color-danger);font-size:0.5em">
                <s>{{productItem.product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
            </span>
            {{productItem.product_final_price}}{{$heap.state.currencySign}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  IonImg,
  IonChip,
  IonGrid,
  IonRow,
  IonButton,
  IonIcon,
  IonCol,
  IonCard,
  IonLabel,
  IonItem,
}                   from "@ionic/vue";
import {  
  chevronBackOutline,
  chevronForwardOutline
}                  from 'ionicons/icons'
 
export default {
  components: {
    IonImg,
    IonChip,
    IonGrid,
    IonRow,
    IonIcon,
    IonButton,
    IonCol,
    IonCard,
    IonLabel,
  IonItem,
  },
  setup(){
      return {
        chevronBackOutline,
        chevronForwardOutline
      }
  },
  props: ['storeList', 'titleColor', 'limit'],
  data() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
    };
  },
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
    },
    scrollSlider (direction){
      let stepWidth = 330
      let scrollLeft
      if(direction == 'prev') scrollLeft = this.$refs.promoSlider.scrollLeft - stepWidth;
      if(direction == 'next') scrollLeft = this.$refs.promoSlider.scrollLeft + stepWidth;
      this.$refs.promoSlider.scrollTo({
        top: 0,
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }
};
</script>

