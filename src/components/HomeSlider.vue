<template>
      <swiper :modules="modules" :autoplay='{delay: 3000, disableOnInteraction: false}' :loop="true" effect="fade">
        <swiper-slide class="home_slider" v-for="hslide in home_slides" :key="hslide.title" :style="`background-color:${hslide.color};`">
          <img  :src="hslide.image" style="margin-right:0%;max-height:250px"/>
          <div class="home_slide">
            <h1 style="font-size:3em">{{hslide.title}}</h1>
            <p>{{hslide.description}}</p>
          </div>
        </swiper-slide>
      </swiper>
</template>

<style scoped>
  .home_slide{
    position:absolute;
    top:0px;
    color:white;
    margin-left:40%;
    text-align:left;
    text-shadow: 0px 0px 3px #000000;
  }
  .home_slider{
    text-align:right
  }
</style>


<script>
  import jQuery from "jquery";
  import { defineComponent } from 'vue';
  import { EffectFade, Autoplay } from 'swiper';
  import { Swiper, SwiperSlide } from 'swiper/vue';

  import 'swiper/css/bundle';
  export default defineComponent({
    components: {
      Swiper,
      SwiperSlide,
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
        getSlideList(){
            var self = this;
            jQuery.get( "/assets/homeslider/conf.json")
            .done(function(response) {
              self.home_slides=response.slides;
            })
            .fail(function(err) {
                self.error = err.responseJSON.messages.error;
            });
        }
    },
    setup() {
      return {
        modules: [Autoplay,EffectFade], 
      };
    },
  });
</script>