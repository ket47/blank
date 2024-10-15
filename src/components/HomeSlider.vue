<template>
  <swiper 
    v-if="home_slides"
    :modules="modules" 
    :autoplay='{delay: 6000, disableOnInteraction: false}' 
    :loop="true" 
    class="home-swiper">
    <swiper-slide v-for="hslide in home_slides" :key="hslide.title" 
      :style="`background-color:${hslide.color};`"
      @click="go(hslide.link)">
      <img :src="hslide.image" class="home_slide_img" :alt="hslide.alt"/>
      <div class="home_slide">
        <h1 style="font-size:3em">{{hslide.title}}</h1>
        <p>{{hslide.description}}</p>
      </div>
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
        home_slides:null,
        error:""
      };
    },
    created(){
      this.getSlideList();
    },
    methods: {
        async getSlideList(){
          try{
            if(this.home_slides){
              return
            }
            const response=await jQuery.get( this.$heap.state.hostname+"etc/homeslider/conf.json")
            this.home_slides=response.slides
          }catch(err){
            console.log(err)
            /** */
          }
        },
        go(link){
          if(!link){
            return
          }
          this.$go(link)
        }
    },
  });
</script>