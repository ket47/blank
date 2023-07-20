<template>
      <swiper 
        :modules="modules" 
        :autoplay='{delay: 6000, disableOnInteraction: false}' 
        :loop="true" 
        class="home-swiper">
        <swiper-slide v-for="hslide in home_slides" :key="hslide.title" 
          :style="`background-color:${hslide.color};`"
          @click="go(hslide.link)">
          <ion-img :src="hslide.image" class="home_slide_img" :alt="hslide.alt"/>
          <div class="home_slide">
            <h1 style="font-size:3em">{{hslide.title}}</h1>
            <p>{{hslide.description}}</p>
          </div>
        </swiper-slide>
      </swiper>
</template>

<style scoped>
  .home-swiper{
    margin: 8px 16px;
    border-radius: 8px;
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
    margin-left: auto;
    -max-height:250px;
  }
</style>


<script>
  import jQuery from "jquery";
  import { defineComponent } from 'vue';
  import { Autoplay } from 'swiper';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import {IonImg} from '@ionic/vue'

  import 'swiper/css/bundle';
  export default defineComponent({
    components: {
      Swiper,
      SwiperSlide,
      IonImg
    },
    setup() {
      return {
        modules: [Autoplay], 
      };
    },
    data(){
      return {
        home_slides:[],
        error:""
      };
    },
    created(){
        this.getSlideList();
    },
    methods: {
        async getSlideList(){
          try{
            const response=await jQuery.get( "/assets/homeslider/conf.json")
            this.home_slides=response.slides
          }catch{
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