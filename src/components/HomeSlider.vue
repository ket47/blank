<template>
  <swiper 
    v-if="slides"
    :modules="modules" 
    :autoplay='{delay: 6000, disableOnInteraction: false}' 
    :centeredSlides="true"
    :breakpoints="{
      768: {
        slidesPerView: 1
      },
      1024: {
        slidesPerView: 1.6
      }
    }"
    class="home-swiper">
    <swiper-slide v-for="slide in slides" :key="slide.title" @click="go(slide.post_route)">
      <img :src="`${$heap.state.hostname}image/get.php/${slide.image_hash}.1000.1000.webp`" class="home_slide_img"/>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
  .home-swiper{
    margin: 5px 10px;
  }
  .home_slide{
    position:absolute;
    top:0px;
    color:white;
    margin-left:40%;
    text-align:left;
    text-shadow: 0px 0px 3px #000000;
    overflow: hidden;
    border-radius: 10px;
  }
  .home_slide_img{
    display: block;
    margin: 0 auto;
    border-radius: 10px;
    transition: 0.5s all;
    max-height: 250px;
  }
  .swiper-slide:not(.swiper-slide-active) .home_slide_img{
    opacity: 0.5;
    filter: blur(1px);
    transform: scale(0.9);
  }
</style>


<script>
  import jQuery from "jquery";
  import { defineComponent } from 'vue';
  import { Autoplay } from 'swiper';
  import { Swiper, SwiperSlide } from 'swiper/vue';

  import 'swiper/css/bundle';
  export default defineComponent({
    components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      return {
        modules: [Autoplay], 
      };
    },
    data(){
      return {
        slides: []
      };
    },
    mounted(){
      this.listGet();
    },
    methods: {
        async listGet(){
          if(this.slides.length > 0){
            return
          }
          try{
            const response = await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_active: 1, post_type: "homeslide" })
            this.slides = response.post_list
          }catch(err){
            console.log('get post error')
          }
        },
        go(link){
          if(!link) return
          if(link.indexOf('tel') !== -1 || link.indexOf('mailto') !== -1) return location.href = link
          this.$go(link)
        }
    },
  });
</script>