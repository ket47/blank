<template>
    <swiper :modules="modules" :autoplay='{delay: 3000, disableOnInteraction: false}' :loop="true" class="store-image-slider">
        <swiper-slide v-for="image in imageList" :key="image.image_hash"  style="max-height:50vh">
          <img  class="slide_img" style="width:100%" :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.${imgWidth||300}.${imgHeight||300}.webp`"/>
        </swiper-slide>
      </swiper>
</template>

<style>
    .store-image-slider{
        overflow: hidden;
        max-height: 300px;
        min-height: 250px;
    }
    .slide_img{
        display: block;
        margin-left: auto;
        width: 100%;
        height: auto;
        min-height: 300px;
    }
</style>

<script>
import { defineComponent } from 'vue';
import { EffectFade, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

export default defineComponent({
    components: { 
      Swiper,
      SwiperSlide
    },
    props: ['imageList','imgHeight','imgWidth','maxHeight'],
    setup() {
      return {
        modules: [Autoplay,EffectFade], 
      };
    },
});
</script>