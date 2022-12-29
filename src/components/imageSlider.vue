<style scoped>
    .swiper  .cropper.crop-to-fit{
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 100%;
    }
    .swiper .cropper:not(.crop-to-fit) {
      padding: 10%;
    }
    .swiper .cropper.crop-to-fit img {
      min-width: 100%;
    }
    .swiper .cropper.save-aspect-ratio{
      display: block;
      height: auto !important;
    }
    .swiper .cropper.save-aspect-ratio img{
      max-width: 400px;
      margin: 0 auto;
      display: block;
    }

    
  @media screen and (max-width: 740px) {
      .swiper .cropper.crop-to-fit img {
        max-width: unset;
        min-width: 120%;
      }
      .swiper .cropper.save-aspect-ratio img{
        min-height: unset !important;
        max-width: 100% !important;
      }
    }

</style>

<template>
  <div v-if="expanded" style="position: relative;">
    <div v-for="image in imageList" :key="image.image_hash" style="border:2px solid var(--ion-color-primary)">
      <img :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.1000.1000.webp`"/>
    </div>
    <ion-fab horizontal="end" vertical="top"  slot="fixed">
      <ion-fab-button color="light">
      <ion-icon :src="contract" size="large" @click="minimize()"/>
      </ion-fab-button>
    </ion-fab>
  </div>
  <swiper v-else :modules="modules" :autoplay='{delay: 3000, disableOnInteraction: false}' :loop="true" effect="fade"  :style="`height: ${imgHeight||'100%'};`" >
    <swiper-slide v-for="image in imageList" :key="image.image_hash">
      <div :class="`${(mode) ? mode: ''} cropper`" :style="`height: ${imgHeight+'px'||'100%'};`">
        <img :style="`min-height: ${imgHeight+'px;'||'100%; max-width: 400px;'}`" :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.${imgHeight*4||1200}.${imgHeight*4||1200}.webp`"/>
      </div>
    </swiper-slide>
  </swiper>
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
    props: ['imageList','imgHeight', 'mode'],
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