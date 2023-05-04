<style scoped>
.swiper  .cropper.crop-to-fit{
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.swiper .cropper.crop-to-fit img {
  min-width: 100%;
  min-height: 100%;
  height: auto !important;
}
.swiper .cropper.save-aspect-ratio{
  display: block;
  height: auto !important;
  padding: 0%;
}
.swiper .cropper.save-aspect-ratio img{
  margin: 0 auto;
  display: block;
  max-height:50vh;
  min-height: unset !important;
  max-width: 100% !important;
}

    
@media screen and (max-width: 740px) {
  .swiper .cropper.crop-to-fit img {
      max-height:50vh !important;
  }
}
@media screen and (min-width: 740px) {
  .swiper .crop-to-fit img {
      max-height:100vh !important;
  }
}


.blur-image{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  -overflow: hidden;
}
.blur-image img{
  width: 100%;
  filter: blur(30px);
}
</style>

<template>
  <swiper :modules="modules" :autoplay='{delay: 3000, disableOnInteraction: false}' :loop="true" effect="fade" :fadeEffect="{ crossFade: true }"  :style="`height: ${imgHeight||'100%'};`" >
    <swiper-slide v-for="image in imageList" :key="image.image_hash">
      <div :class="`${(mode) ? mode: ''} cropper`" :style="`height: ${imgHeight+'px'||'100%'}`">
        <div class="blur-image">
          <img :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.${imgHeight*4||1200}.${imgHeight*4||1200}.webp`"/>
        </div>
        <img :style="``" :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.${imgHeight*4||1200}.${imgHeight*4||1200}.webp`"/>
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

}                                 from '@ionic/vue'
import { EffectFade, Autoplay }   from 'swiper';
import { Swiper, SwiperSlide }    from 'swiper/vue';
import 'swiper/css/bundle';
export default({
    components: { 
      Swiper,
      SwiperSlide,
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