<style scoped>
.slide-container{
  position: relative;
  overflow: hidden;
}
.crop-to-fit{
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.crop-to-fit img{
  min-width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}
.swiper-actions{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
.swiper-actions .top-actions{
  display: flex;
  justify-content: end;
  padding: 16px;
  pointer-events: all;
}
.swiper-actions .bottom-actions{
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  padding: 0;
  height: 100%;
}
.swiper-actions .bottom-actions > div{
  width: 20%;
  height: 40%;
  pointer-events: all;
}
.slide-content{
  position: absolute;
  left: 0;
  bottom: 50px;
  padding: 16px;
  color: white;
}
.slide-container:before{
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  opacity: 0.7;
  background: linear-gradient(to top, black, transparent);
}
.slide-content ion-button{
  position: relative;
  z-index: 100;
}
.autoplay-progress {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  color: white;
  width: 100%;
}
.autoplay-progress > div{
  height: 4px;
  background-color: white;
  animation: progress 4s linear;
  display: none;
}
.autoplay-progress > div.active-progress{
  display: block;
}
@keyframes progress {
  from {width: 0%}
  to {width: 100%}
}
@media screen and (max-width: 740px) {
  .crop-to-fit{
    width: 100vw;
    height: 100vh;
  }
}
@media screen and (min-width: 600px) {
  ion-modal {
    --height: 90vh;
    --width: calc(90vh / 2.13);
  }
}
</style>

<template>
  <div>
    <ion-modal :is-open="isOpen"  :initial-breakpoint="1">
        <div class="autoplay-progress">
          <div :class="`progress ${(progress) ? 'active-progress' : ''}`" ></div>
        </div>
        
        <swiper 
            ref="welcomeSlider"
            v-if="slides"
            :modules="modules"  
            :pagination="{clickable: true}"
            :autoplay="{
              delay: 4000,
              disableOnInteraction: false,
            }"
            style="max-width: 100%;"
            @slideChange="onSlideChange">
            <swiper-slide v-for="slide in slides" :key="slide.title" 
              :style="`background-color:${slide.color};`">
              <div class="slide-container">
                <div class="slide-content">
                    <h2 style="margin: 0">{{slide.post_title}}</h2>
                    <p style="margin: 0">{{slide.post_content}}</p>
                    <ion-button v-if="slide.post_route" @click="go(slide.post_route)">Подробнее<ion-icon :icon="chevronForwardOutline"></ion-icon></ion-button>
                </div>
                <div class="crop-to-fit">
                  <img class="" :src="`${$heap.state.hostname}image/get.php/${slide.image_hash}.1000.1000.webp`"/>
                </div>
              </div>
            </swiper-slide>
        </swiper>
        
        <div class="swiper-actions">
          <div class="top-actions">
            <ion-button @click="closeModal()" fill="clear" color="light"><ion-icon slot="icon-only" :icon="closeOutline" size="large"></ion-icon></ion-button>
          </div>
          <div class="bottom-actions">
              <div @click="(currentSlide > 0) ? prevSlide() : closeModal()" class="prev-slide"></div>
              <div @click="(currentSlide < slides.length-1) ? nextSlide() : closeModal()"  class="next-slide"></div>
          </div>
        </div>
    </ion-modal>
  </div>
</template>

<script>
import {
  modalController,
  IonIcon,
  IonContent,
  IonModal,
  IonButton
}                           from "@ionic/vue";
import {
  closeOutline,
  chevronForwardOutline
  }                         from 'ionicons/icons';
import jQuery               from 'jquery';
import { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css/pagination';

export default{
  components: {
    IonIcon,
    IonContent,
    IonModal,
    IonButton,
    Swiper,
    SwiperSlide,
  },
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return {  modules: [Autoplay, Pagination], closeModal, closeOutline, chevronForwardOutline};
  },
  data(){
    return {
      isOpen: 0,
      slides: [],
      currentSlide: 0,
      progress: 1,
      delaySeconds: 7200
    };
  },
  mounted(){
    if(localStorage.welcomeModalShown){
      let diff = Date.now() - localStorage.welcomeModalShown
      if(diff < this.delaySeconds*1000 ) return
    }
    this.listGet()
    setTimeout(()=>{
        this.isOpen = 1
        localStorage.welcomeModalShown=Date.now()
    },1000)
  },
  methods: {
    async listGet(){
          if(this.slides.length > 0){
            return
          }
          try{
            const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet")
            this.slides = this.listPrepare(response.post_list)
          }catch(err){
            console.log('get post error')
          }
        },
        listPrepare(listRaw){
          let result = []
          let slides = listRaw.filter((el) => {return (el.post_type == 'wellcomeslide')})
          for(var i in slides){
            if(slides[i].started_at == '0000-00-00 00:00:00') slides[i].started_at = null
            if(slides[i].finished_at == '0000-00-00 00:00:00') slides[i].finished_at = null

            if(slides[i].started_at  && new Date() > new Date(slides[i].started_at)) result.push(slides[i])
            else if(slides[i].finished_at && new Date() < new Date(slides[i].finished_at)) result.push(slides[i])
            else result.push(slides[i])
          }
          return result
        },
        go(link){
          modalController.dismiss();
          if(link.indexOf('tel') !== -1 || link.indexOf('mailto') !== -1) return location.href = link
          if(!link) return
          this.$go(link)
        },
        onSlideChange(swiper){
          this.currentSlide = swiper.activeIndex
          this.onAutoplayTimeLeft()
        },
        nextSlide(){
          this.$refs.welcomeSlider.$el.swiper.slideNext()
          this.currentSlide = this.$refs.welcomeSlider.$el.swiper.activeIndex
        },
        prevSlide(){
          this.$refs.welcomeSlider.$el.swiper.slidePrev()
          this.currentSlide = this.$refs.welcomeSlider.$el.swiper.activeIndex
        },
        onAutoplayTimeLeft (s, time, progress){
            this.progress = 0;
            setTimeout(() => {this.progress = 1}, 0)
        },
        
  }
};
</script>