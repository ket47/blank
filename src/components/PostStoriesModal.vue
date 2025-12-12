<style scoped>
.swiper-wrapper{
  transform: none !important;
}
ion-modal{
  --background: transparent;
  backdrop-filter: blur(3px);
}
.story{
  display: none;
}
.story.is-active{
  display: block;
}
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
.story-toolbar{
  position: absolute;
  top:20px;
  width: 100%;
  padding: 16px;
  pointer-events: all;
  display: flex;
  justify-content: space-between;
  z-index: 100;
}
.story-toolbar > div{
  display: flex;
  color: white;
  align-items: center;
}
.story-toolbar > div ion-avatar{
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.crop-to-fit img{
  min-width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  pointer-events: none;
}
.story-nav{
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 20%;
  left: 0;
  height: 80%;
  width: 100%;
  z-index: 10;
  -webkit-transform:translate3d(0,0,200px);
  transform: translate3d(0, 0, 200px);
}
.story-nav > .prev-story{
  width: 30%;
  height: 100%;
}
.story-nav > .next-story{
  width: 70%;
  height: 100%;
}
.slide-content{
  position: absolute;
  left: 0;
  bottom: 50px;
  padding: 16px;
  color: white;
  z-index: 100;
  -webkit-transform:translate3d(0,0,200px);
  transform: translate3d(0, 0, 200px);
  text-align: center;
  width: 100%;
}
.slide-content h2{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 5px;
}
.slide-content h2 > span{
  background: black;
  border-radius: 5px;
  padding: 3px 7px;
  margin: 0px -3px;
}
.slide-content p{
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  justify-content: center;
}
.slide-content p > span{
  background: black;
  border-radius: 5px;
  padding: 3px 7px;
  margin: -1px -3px;
}
.slide-container:before{
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  opacity: 0.7;
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
  overflow: hidden;
}
.autoplay-progress > .progress-container > div{
  height: 4px;
  background-color: white;
  display: none;
  border-radius: 3px;
}
.autoplay-progress > .progress-container > .progress{
  display: block;
}
.autoplay-progress > .progress-container > .progress.active{
  transition: 0.2s all;
}
@media screen and (max-width: 740px) {
  .crop-to-fit{
    width: 100vw;
    height: 100vh;
  }
}
@media screen and (min-width: 740px) {
  ion-modal {
    --height: 90vh;
    --width: calc(90vh / 1.77);
  }
}
</style>

<template>
  <div>
    <ion-modal :is-open="isOpen"  :initial-breakpoint="1" @willDismiss="willClose"  @willPresent="willPresent">
        <swiper 
            ref="storiesSlider"
            v-if="groups"
            :pagination="{clickable: true}"
            @slideChange="onSlideChange"
            @touchStart="touchStart"
            @touchEnd="touchEnd"
            style="max-width: 100%;height:100%">
            <swiper-slide v-for="(slideGroup, slideGroupIndex) in groups" :key="slideGroupIndex" >
              <div class="stories" style="height:100%">
                  <div class="autoplay-progress">
                    <div class="progress-container" v-for="story in slideGroup.children" :key="`pr_${story.title}`" >
                      <div :class="`progress ${story.progressClass}`" :style="`width: ${(story.isActive) ? autoplayProgress : story.progress}%`" ></div>
                    </div>
                  </div>
                  <div :class="`story ${(story.isActive) ? 'is-active' : ''}`" v-for="story in slideGroup.children" :key="story.title" style="height:100%">
                    <div class="slide-container" 
                      :style="`height:100%;background-image:url('${$heap.state.hostname}image/get.php/${story.image_hash}.10.20.webp');background-size: cover`">
                      <div class="story-toolbar">
                        <div @click="(slideGroup.holder == 'store') ? go(`/catalog/store-${slideGroup.holder_id}`) : null">
                          <ion-avatar v-if="slideGroup.avatar_hash">
                            <img :src="`${$heap.state.hostname}image/get.php/${slideGroup.avatar_hash}.150.150.webp`" />
                          </ion-avatar>
                          <ion-label><b>{{slideGroup.holder_name}}</b></ion-label>
                        </div>
                        <ion-buttons>
                          <ion-button v-if="story.is_writable && isEditable" @click="closeModal(); editStory(story.post_id)" fill="clear" color="light"><ion-icon slot="icon-only" :icon="settingsSharp" size="large"></ion-icon></ion-button>
                          <ion-button @click="closeModal()" fill="clear" color="light"><ion-icon slot="icon-only" :icon="closeSharp" size="large"></ion-icon></ion-button>
                        </ion-buttons>
                      </div>
                      <div class="story-nav">
                          <div @mouseover="action = 'prev'" @touchstart="action = 'prev'" class="prev-story"></div>
                          <div @mouseover="action = 'next'" @touchstart="action = 'next'" class="next-story"></div>
                      </div>
                      <div class="slide-content">
                          <h2 v-if="story.post_title !== ''">
                            <span v-for="title in story.descriptions?.title" :key="`storyTitle${title}`"> {{ title }}</span>
                          </h2>
                          <p v-if="story.post_content !== ''">
                            <span v-for="content in story.descriptions?.content" :key="`storyContent${content}`"> {{ content }}</span>
                          </p>
                          <ion-button v-if="story.post_route" 
                            @mouseover="action = 'link'; actionData = story.post_route" 
                            @touchstart="action = 'link'; actionData = story.post_route" 
                            >Подробнее<ion-icon :icon="chevronForwardOutline"></ion-icon></ion-button>
                          <div v-if="story.reaction_tags" >
                            <ion-button v-if="story.reacted_tags_splitted?.includes('challenge')" color="success"><ion-icon :icon="checkmarkOutline" ></ion-icon> Вы участвуете</ion-button>
                            <ion-button v-else
                              @mouseover="action = ''; createReaction(story.post_id, 'challenge')"
                              @touchstart="action = ''; createReaction(story.post_id, 'challenge')"
                            >
                              <ion-icon :icon="add"></ion-icon> Хочу участвовать
                            </ion-button>
                          </div>
                      </div>
                      <div>
                        <img :src="`${$heap.state.hostname}image/get.php/${story.image_hash}.1500.3000.webp`"/>
                      </div>
                    </div>
                  </div>
              </div>
            </swiper-slide>
        </swiper>
    </ion-modal>
  </div>
</template>

<script>
import {
  modalController,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonModal,
  IonButton,
  IonButtons
}                               from "@ionic/vue";
import {
  add,
  closeSharp,
  checkmarkOutline,
  chevronForwardOutline,
  settingsSharp
  }                             from 'ionicons/icons';
import { Swiper, SwiperSlide }  from 'swiper/vue';

import 'swiper/css/pagination';

export default{
  components: {
    IonIcon,
    IonModal,
    IonButton,
    IonButtons,
    IonAvatar,
    IonLabel,
    Swiper,
    SwiperSlide,
  },
  emits: ['onClose', 'onChange'],
  props: ['storyGroups', 'isOpen', 'slideDuration', 'startIndex', 'isEditable'],
  setup() {
      const closeModal = function(){
          modalController.dismiss();
      };
      return {  closeModal, add, checkmarkOutline, closeSharp, chevronForwardOutline, settingsSharp};
  },
  data(){
    return {
      activeStoryIndex: 0,
      activeStoryGroupIndex: 0,
      progress: [],
      groups: [],
      closeTimout: null,
      changeTimeout: null,
      isPaused: false,
      autoplayProgress: 0,
      action: '',
      actionData: '',
      touchStartTimestamp: 0,
      modalEditIsOpen: false,
      activePostId: 0
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
      this.activeStoryGroupIndex = swiper.activeIndex
      this.resetStories()
    },
    startAutoplay(progress = 0){
      clearInterval(this.changeTimeout)
      this.autoplayProgress = progress
      const self = this
      const autoplaySteps = 120
      const totalWidth = self.slideDurationfalse;
      this.changeTimeout = setInterval(function() {
        if(self.autoplayProgress >= 100){
          self.nextSlide()
          return;
        }
        if(!self.isPaused) {
          self.autoplayProgress += 100 / autoplaySteps;
        }
      }, self.slideDuration / autoplaySteps+3 );
    },
    nextSlide(){
      if(!this.$refs.storiesSlider) return
      if(this.activeStoryIndex >= this.groups[this.activeStoryGroupIndex].children.length-1) {
        if(this.activeStoryGroupIndex >= this.groups.length-1){
          return this.closeModal()
        }
        return this.$refs.storiesSlider.$el.swiper.slideNext()
      }
      this.setActiveIndex(this.activeStoryIndex+1) 
      this.startAutoplay()
    },
    prevSlide(){
      if(!this.$refs.storiesSlider) return
      clearTimeout(this.changeTimeout)
      if(this.activeStoryIndex <= 0){
        if(this.activeStoryGroupIndex <= 0){
          return this.closeModal()
        }
        return this.$refs.storiesSlider.$el.swiper.slidePrev()
      }
      this.setActiveIndex(this.activeStoryIndex-1) 
    },  
    setActiveIndex(index){
      this.resetActiveIndex()
      this.activeStoryIndex = index
      this.groups[this.activeStoryGroupIndex].children[this.activeStoryIndex].isActive = true
      this.markShown(this.groups[this.activeStoryGroupIndex].children[this.activeStoryIndex].post_id)
    },
    resetActiveIndex(){
      this.groups[this.activeStoryGroupIndex].children.forEach((story, index, stories) => {
        stories[index].isActive = false
      })
    },
    willPresent(){
      this.groups = this.storyGroups
      this.activeStoryGroupIndex = this.startIndex
      this.$refs.storiesSlider.$el.swiper.slideTo(this.activeStoryGroupIndex)
      this.resetStories()
    },
    willClose(){
      clearTimeout(this.changeTimeout)
      clearTimeout(this.closeTimout)
      this.$emit('onClose', true)
    },
    touchStart(swiper, event){
      this.touchStartTimestamp = event.timeStamp
      clearInterval(this.changeTimeout)
    },
    touchEnd(swiper, event){
      event.preventDefault()
      this.startAutoplay(this.autoplayProgress)
      if((event.timeStamp - this.touchStartTimestamp) < 200){
        this.handleClick()
      }
    },
    handleClick(){
      if(this.action == 'prev') return this.prevSlide()
      if(this.action == 'next') return this.nextSlide()
      if(this.action == 'link') return this.go(this.actionData)
    },
    setProgress(){
      const self = this
      this.groups[this.activeStoryGroupIndex].children.forEach((story, index, stories) => {
        stories[index].descriptions = self.explodeDescriptions(stories[index])
        stories[index].reacted_tags_splitted = stories[index].reacted_tags?.split(',') ?? []
        if(index < this.activeStoryIndex){
            stories[index].progressClass = ''
            stories[index].progress = 100
        } else if(index == this.activeStoryIndex){
            stories[index].progressClass = 'active'
            stories[index].progress = this.autoplayProgress
        } else if(index > this.activeStoryIndex){
            stories[index].progressClass = ''
            stories[index].progress = 0
        }
      })
    },
    explodeDescriptions(story){
      return {
        title: story.post_title?.split(' ') ?? [],
        content: story.post_content?.split(' ') ?? []
      }
    },
    editStory(postId){
      this.$go(`/wall/post-user-edit-${postId}`)
    },
    markShown(id){
      try{
        let localShown = JSON.parse(localStorage.storiesShown)
        localShown = localShown.slice(localShown.length - 100, localShown.length)
        if(localShown.indexOf(id) === -1){
          localShown.push(id)
          localStorage.storiesShown = JSON.stringify(localShown)
        }
      }catch(err){
        console.log('markShown stories error =(')
      }
    },
    resetStories(){
      this.setActiveIndex(0) 
      clearTimeout(this.changeTimeout)
      this.setProgress()
      this.startAutoplay()
    },
    onChange(){
      this.$emit('onChange', true)
    },
    async createReaction(targetId, targetTag){
      const request={
        tagQuery: `post:${targetId}:user:${targetTag}`,
        is_like: true,
        is_dislike: false,
        comment: ''
      }
      try{
        await this.$post("Reaction/itemSave", request)
        this.groups[this.activeStoryGroupIndex].children[this.activeStoryIndex].reacted_tags_splitted.push(targetTag)
      }catch(err){/** */}
    },
  },
  watch: {
    'activeStoryIndex'(index){
      this.setProgress()
      this.startAutoplay()
    }
  }
};
</script>