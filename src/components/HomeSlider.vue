<template>
      <swiper :modules="modules" :autoplay='{delay: 6000, disableOnInteraction: false}' :loop="true" >
        <swiper-slide v-for="hslide in home_slides" :key="hslide.title" :style="`background-color:${hslide.color};`">
          <img :src="hslide.image" class="home_slide_img"/>
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
  .home_slide_img{
    display: block;
    margin-left: auto;
    max-height:250px;
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
  });
</script>