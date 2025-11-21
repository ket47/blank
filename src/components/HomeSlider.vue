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
    
    <swiper-slide  v-if="isEditable"  @click="editSlide()" class="add-post">
      <ion-icon slot="start"  :icon="addOutline"></ion-icon>
      Добавить слайд
    </swiper-slide>
    <swiper-slide v-for="slide in slides" :key="slide.title">
      <img v-if="slide.is_published==0 || slide.is_disabled==1" style="filter: grayscale(1);" :src="`${$heap.state.hostname}image/get.php/${slide.image_hash}.1000.1000.webp`" class="home_slide_img" @click="go(slide.post_route)"/>
      <img v-else :src="`${$heap.state.hostname}image/get.php/${slide.image_hash}.1000.1000.webp`" class="home_slide_img" @click="go(slide.post_route)"/>
      <div v-if="isEditable" color="light" @click="editSlide(slide.post_id)" style="position: absolute; top: 10px; right: 10px;z-index: 10">
        <ion-icon  slot="icon-only" :icon="settingsSharp" color="primary"></ion-icon>
      </div>
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
.add-post{
  border-radius: 10px;
  background-color:var(--ion-color-light);
  min-height:120px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


<script>
import {
  IonIcon,
}                               from "@ionic/vue";
import {
  addOutline,
  settingsSharp
}                               from 'ionicons/icons';
import { defineComponent, }     from 'vue';
import { Autoplay }             from 'swiper';
import { Swiper, SwiperSlide }  from 'swiper/vue';

import jQuery                   from "jquery";
import 'swiper/css/bundle';

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    IonIcon,
  },
  setup() {
    return {
      modules: [Autoplay], addOutline, settingsSharp
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
    console.log(this.holderId)
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
          const response = await this.$post( this.$heap.state.hostname+"Post/listGet", filter)
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
        this.$go(`/wall/post-user-edit-${postId}`)
      },
      closeEditModal(){
        this.modalEditIsOpen = false; 
        this.listGet()
      }
  }
});
</script>