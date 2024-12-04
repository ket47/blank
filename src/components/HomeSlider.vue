<template>
  <swiper 
    v-if="slides"
    :modules="modules" 
    :autoplay='{delay: 6000, disableOnInteraction: false}' 
    :loop="true" 
    class="home-swiper">
    <swiper-slide v-for="slide in slides" :key="slide.title" @click="go(slide.post_route)">
      <img :src="`${$heap.state.hostname}image/get.php/${slide.image_hash}.1000.1000.webp`" class="home_slide_img"/>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
  .home-swiper{
    margin: 5px 10px;
    border-radius: 10px;
  }
  .home_slide{
    position:absolute;
    top:0px;
    color:white;
    margin-left:40%;
    text-align:left;
    text-shadow: 0px 0px 3px #000000;
  }
  .home_slide_img{
    display: block;
    margin: 0 auto;
    max-height: 250px;
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
            const response = await jQuery.post( this.$heap.state.hostname+"Post/listGet")
            this.slides = this.listPrepare(response.post_list)
          }catch(err){
            console.log('get post error')
            /** */
          }
        },
        listPrepare(listRaw){
          let result = []
          let slides = listRaw.filter((el) => {return (el.post_type == 'homeslide')})
          for(var i in slides){
            if(slides[i].started_at == '0000-00-00 00:00:00') slides[i].started_at = null
            if(slides[i].finished_at == '0000-00-00 00:00:00') slides[i].finished_at = null

            if(!slides[i].started_at && !slides[i].finished_at){ 
              result.push(slides[i]); 
              continue;
            }
            if(slides[i].started_at  && new Date() > new Date(slides[i].started_at)) result.push(slides[i])
            if(slides[i].finished_at && new Date() < new Date(slides[i].finished_at)) result.push(slides[i])
          }
          return result
        },
        go(link){
          if(!link) return
          if(link.indexOf('tel') !== -1 || link.indexOf('mailto') !== -1){
            location.href = link
            return
          }
          if(!link){
            return
          }
          this.$go(link)
        }
    },
  });
</script>