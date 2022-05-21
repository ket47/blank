<style scoped>
    .crop-to-fit {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 100%;
    }
    .crop-to-fit img {
      flex-shrink:0;
      min-width:100%;
      max-width: unset;
    }
</style>

<template>
  <div v-if="expanded">
    <div v-for="image in imageList" :key="image.image_hash" style="border:2px solid var(--ion-color-primary)">
      <img :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.1000.1000.webp`"/>
    </div>
  </div>
  <swiper v-else :modules="modules" :autoplay='{delay: 3000, disableOnInteraction: false}' :loop="true" effect="fade">
    <swiper-slide v-for="image in imageList" :key="image.image_hash">
      <div class="crop-to-fit" :style="`height: ${imgHeight||300}px;`">
        <img :style="`min-height: ${imgHeight||300}px;`" :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.${imgHeight*4||1200}.${imgHeight*4||1200}.webp`"/>
      </div>
    </swiper-slide>
  </swiper>
  <ion-fab horizontal="end" vertical="top"  slot="fixed">
    <ion-fab-button color="light">
    <ion-icon v-if="expanded" :src="contract" size="large" @click="minimize()"/>
    <ion-icon v-else :src="expand" size="large" @click="maximize()"/>
    </ion-fab-button>
  </ion-fab>
</template>

<script>
import {
  expand,
  contract
}                                 from 'ionicons/icons'
import {
  IonFab,
  IonFabButton,
  IonIcon
}                                 from '@ionic/vue'
import { EffectFade, Autoplay }   from 'swiper';
import { Swiper, SwiperSlide }    from 'swiper/vue';
import 'swiper/css/bundle';
export default({
    components: { 
      Swiper,
      SwiperSlide,
      IonFab,
      IonFabButton,
      IonIcon
    },
    props: ['imageList','imgHeight'],
    setup() {
      return {
        modules: [Autoplay,EffectFade],
        expand,
        contract
      };
    },
    data(){
      return {
        expanded:false,
        vh:0,
        vw:0
      }
    },
    methods:{
      maximize(){
        this.expanded=true
        this.vh=document.getElementsByTagName('ion-content')[0].clientHeight
        this.vw=document.getElementsByTagName('ion-content')[0].clientWidth
        //document.getElementsByTagName('ion-content')[0].style.backdropFilter="blur(5px)"
      },
      minimize(){
        this.expanded=false
        this.vh=document.getElementsByTagName('ion-content')[0].clientHeight
        this.vw=document.getElementsByTagName('ion-content')[0].clientWidth
      }
    }
});
</script>