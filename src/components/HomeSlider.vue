<template>
  <swiper 
    v-if="slides || isEditable"
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
    
   
    <swiper-slide v-for="slide in slides" :key="slide.title" >
      <img :src="`${$heap.state.hostname}image/get.php/${slide.image_hash}.1000.1000.webp`" class="home_slide_img" @click="go(slide.post_route)"/>
      <ion-button size="small" v-if="isEditable" color="primary" @click="editSlide(slide.post_id)"  style="position: absolute; top: 10px; right: 10px;z-index: 10">
        <ion-icon  slot="icon-only" :icon="settingsOutline"></ion-icon>
      </ion-button>
    </swiper-slide>
  </swiper>
  <ion-button v-if="isEditable" fill="outline" expand="block" color="medium" @click="editSlide()" style="--border-radius: 10px; margin: 5px 10px;">
    <ion-icon slot="start"  :icon="addOutline"></ion-icon>
    Добавить слайд
  </ion-button>
  <slide-edit-modal :is-open="modalEditIsOpen" :post-id="activePostId" @on-close="closeEditModal"/>
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
.add-post{
  min-width: 100px;
  display: grid;
  padding: 1px;
  align-self: center;
}
.add-post > div{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(var(--ion-color-medium-rgb), 0.08);
  color: var(--ion-color-medium-shade);
  border-radius: 10px;
  border: 2px solid white;
  box-shadow:  0px 0px 0px 1px var(--ion-color-medium);
  padding: 1em;
}
.add-post ion-icon{
  font-size: 2.3em;
}
</style>


<script>
import jQuery from "jquery";
import {
  IonIcon,
  IonButton,
}                           from "@ionic/vue";
import { defineComponent, } from 'vue';
import { Autoplay }         from 'swiper';
import {  Swiper, SwiperSlide }  from 'swiper/vue';

import {
  addOutline,
  settingsOutline
}                   from 'ionicons/icons';
import 'swiper/css/bundle';
import SlideEditModal         from "@/components/SlideEditModal";

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    IonButton,
    IonIcon,
    SlideEditModal
  },
  setup() {
    return {
      modules: [Autoplay], addOutline, settingsOutline
    };
  },
  props: ['holderId','isEditable','isPromoted'],
  data(){
    return {
      slides: [],
      activePostId: 0,
      modalEditIsOpen: false
    };
  },
  mounted(){
    this.listGet();
  },
  methods: {
      async listGet(){
        const filter = {
          is_actual: 1, 
          is_active: 1, 
          post_type: "slide" 
        }
        if(this.holderId){
          filter.post_holder_id = this.holderId
          filter.post_holder = 'store'
        }
        if(this.isPromoted){
          filter.is_promoted = 1
        } 
        try{
          const response = await jQuery.post( this.$heap.state.hostname+"Post/listGet", filter)
          this.slides = response.post_list
        }catch(err){
          //console.log('get post error')
        }
      },
      go(link){
        if(!link) return
        if(link.indexOf('tel') !== -1 || link.indexOf('mailto') !== -1) return location.href = link
        this.$go(link)
      },
      editSlide(postId = 0){
        this.activePostId = postId
        this.modalEditIsOpen = true  
      },
      closeEditModal(){
        this.modalEditIsOpen = false; 
        this.listGet()
      }
  }
});
</script>