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
    }
</style>

<template>
    <swiper :modules="modules" :autoplay='{delay: 3000, disableOnInteraction: false}' :loop="true" effect="fade">
        <swiper-slide v-for="image in imageList" :key="image.image_hash">
          <div class="crop-to-fit" :style="`height: ${imgHeight||300}px;`">
            <img :style="`min-height: ${imgHeight||300}px;`" :src="`${$heap.state.hostname}image/get.php/${image.image_hash}.${imgHeight*4||1200}.${imgHeight||300}.webp`"/>
          </div>
        </swiper-slide>
      </swiper>
</template>

<script>
import { EffectFade, Autoplay }   from 'swiper';
import { Swiper, SwiperSlide }    from 'swiper/vue';
import 'swiper/css/bundle';
export default({
    components: { 
      Swiper,
      SwiperSlide
    },
    props: ['imageList','imgHeight'],
    setup() {
      return {
        modules: [Autoplay,EffectFade], 
      };
    },
});
</script>