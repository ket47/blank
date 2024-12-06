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
  top: 4px;
  left: 0px;
  z-index: 10;
  color: white;
  width: 100%;
  display: flex;
  height: 4px;
}
.autoplay-progress > .progress-container{
  background: #ffffff45;
  width: 100%;
  margin: 0 5px;
  border-radius: 4px;
}
.autoplay-progress > .progress-container > div{
  height: 4px;
  background-color: white;
  animation: progress 4s linear;
  display: none;
  border-radius: 3px;
}
.autoplay-progress > .progress-container > div.active-progress{
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
    <ion-modal :is-open="isOpen"  :initial-breakpoint="1" @willDismiss="willClose" @didPresent="didPresent">
        <div class="autoplay-progress">
          <div class="progress-container" v-for="(progress_item, index) in progress" :key="`pr_${index}`" >
            <div :class="`progress ${(progress_item.animated) ? 'active-progress' : ''}`" :style="`animation-duration: ${progress_item.animationDuration}ms`" ></div>
          </div>
        </div>
        <swiper 
            ref="storiesSlider"
            v-if="stories"
            :modules="modules"  
            :pagination="{clickable: true}"
            :autoplay="{
              delay: slideDuration,
              stopOnLastSlide: true,
              disableOnInteraction: false
            }"
            @slideChangeTransitionStart="slideChangeTransitionStart"
            @slideChangeTransitionEnd="slideChangeTransitionEnd"
            @slideChange="onSlideChange"
            style="max-width: 100%;">
            <swiper-slide v-for="slide in stories" :key="slide.title" 
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
              <div @click="(currentSlide < stories.length-1) ? nextSlide() : closeModal()"  class="next-slide"></div>
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
    IonModal,
    IonButton,
    Swiper,
    SwiperSlide,
  },
  emits: ['onClose'],
  props: ['stories', 'isOpen', 'slideDuration'],
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return {  modules: [Autoplay, Pagination], closeModal, closeOutline, chevronForwardOutline};
  },
  data(){
    return {
      currentSlide: 0,
      progress: [],
      closeTimout: null
    };
  },
  methods: {
    go(link){
      modalController.dismiss();
      if(link.indexOf('tel') !== -1 || link.indexOf('mailto') !== -1) return location.href = link
      if(!link) return
      this.$go(link)
    },
    onSlideChange(swiper){
      this.currentSlide = swiper.activeIndex
      if(swiper.isEnd){
        this.closeTimout = setTimeout(() => {
          this.closeModal()
        }, this.slideDuration+500)
      }
    },
    nextSlide(){
      clearTimeout(this.closeTimout)
      this.$refs.storiesSlider.$el.swiper.slideNext()
      this.currentSlide = this.$refs.storiesSlider.$el.swiper.activeIndex
    },
    prevSlide(){
      clearTimeout(this.closeTimout)
      this.$refs.storiesSlider.$el.swiper.slidePrev()
      this.currentSlide = this.$refs.storiesSlider.$el.swiper.activeIndex
    },  
    didPresent(){
      this.progress = [];
      for(var i in this.stories){
        if(i == 0){
          this.progress.push({animated: true})
        } else {
          this.progress.push({animationDuration: this.slideDuration,animated: false})
        }
        
      }
      this.$refs.storiesSlider?.$el.swiper.autoplay.start()
    },
    willClose(){
        clearTimeout(this.closeTimout)
        this.currentSlide = 0
        this.$emit('onClose', true)
    },
    slideChangeTransitionStart(swiper){
      this.progress[swiper.activeIndex].animationDuration = 0;
      this.progress[swiper.activeIndex].animated = false;
      this.setProgress(swiper.activeIndex)
    },
    slideChangeTransitionEnd(swiper){
      this.progress[swiper.activeIndex].animationDuration = this.slideDuration;
      this.progress[swiper.activeIndex].animated = true;
    },
    setProgress(index){
       
      for(var i in this.progress){
          if(i < index){
            this.progress[i].animationDuration = 0;
            this.progress[i].animated = true;
          } 
          if(i >= index){
            this.progress[i].animationDuration = this.slideDuration;
            this.progress[i].animated = false;
          }
      }
    },
  }
};
</script>