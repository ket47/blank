<style scoped>
.horizontalScroller{
    display: flex;
}
.story-block{
    text-align: center;
}
.story-block label b{
    margin: 5px auto;
    font-size: 10px;
    max-width: 60px;
    text-wrap: auto;
}
.story-block .story-circle{
    border: 2px solid white;
    box-shadow: 0px 0px 0px 2px var(--ion-color-primary);
    margin: 2px 4px;
    animation: progress 1s ease infinite alternate;
}
.story-block .story-circle.story-shown{
    animation: none;
    box-shadow:  0px 0px 0px 1px var(--ion-color-medium);
}
@keyframes progress {
  0% { box-shadow: 0px 0px 0px 2px var(--ion-color-primary); }
  60% { box-shadow: 0px 0px 0px 2px var(--ion-color-success); }
}
</style>

<template>
  <div v-if="!isLoading">
    <div v-if="storyGroups.length > 0" class="ion-padding-horizontal ion-padding-bottom">
        <h5>Истории</h5>
        <div class="horizontalScroller">
            <div v-for="(story_group, index) in storyGroups"  :key="index" class="story-block">
                <ion-avatar @click="showModal(story_group, index)" :class="`story-circle ${(story_group.is_shown) ? 'story-shown' : ''}`">
                    <img :src="`${$heap.state.hostname}image/get.php/${(story_group.avatar_hash) ? story_group.avatar_hash : story_group.children[0].image_hash}.200.200.webp`" />
                </ion-avatar>
                <label><b class="max-two-lines">{{ story_group.holder_name }}</b></label>
            </div>
        </div>
        <stories-modal :story-groups="storyGroups" :start-index="modalStartIndex" :is-open="modalIsOpen" @on-close="closeModal" :slide-duration="4000"/>
    </div>
  </div>
  <div v-else class="ion-padding-horizontal ion-padding-bottom">
    <h5><ion-skeleton-text style="width: 50%" :animated="true"></ion-skeleton-text></h5>
    <div class="horizontalScroller">
        <div class="story-block">
          <ion-avatar  class="story-circle story-shown">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-avatar>
          <label><b class="max-two-lines"><ion-skeleton-text :animated="true"></ion-skeleton-text></b></label>
        </div>
        <div class="story-block">
          <ion-avatar  class="story-circle story-shown">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-avatar>
          <label><b class="max-two-lines"><ion-skeleton-text :animated="true"></ion-skeleton-text></b></label>
        </div>
        <div class="story-block">
          <ion-avatar  class="story-circle story-shown">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-avatar>
          <label><b class="max-two-lines"><ion-skeleton-text :animated="true"></ion-skeleton-text></b></label>
        </div>
    </div>
  </div>
</template>

<script>
import {
  IonSkeletonText,
  IonAvatar
}                           from "@ionic/vue";

import StoriesModal         from "@/components/StoriesModal";

import {
  closeOutline,
  chevronForwardOutline
  }                         from 'ionicons/icons';
import jQuery               from 'jquery';

import 'swiper/css/pagination';

export default{
  components: {
    IonSkeletonText,
    IonAvatar,
    StoriesModal
  },
  setup() {
      return { closeOutline, chevronForwardOutline};
  },
  data(){
    return {
      storyGroups: [],
      modalStartIndex: 0,
      modalIsOpen: false,
      localShown: [],
      isLoading: true
      
    };
  },
  mounted(){
    this.listGet()
  },
  created(){
      this.$topic.on('dismissModal',()=>this.modalIsOpen=false);
  },
  methods: {
    async listGet(){
        try{
            this.isLoading = true
            const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_active: 1, post_type: "story" })
            this.storyGroups  = this.composeSlides(response.post_list)
            this.checkShown()
            this.isLoading = false
        }catch(err){
            console.log('get post error')
        }
    },
    composeSlides(storiesRaw){
      const result = []
      let groups = storiesRaw.reduce(function(rv, x) {
        (rv[x.post_holder_id ?? 0] = rv[x.post_holder_id ?? 0] || []).push(x);
        return rv;
      }, {});
      for (const holder_id in groups) result.push({
        holder_id: holder_id,
        holder: groups[holder_id][0].post_holder,
        holder_name: groups[holder_id][0].meta?.holder_name ?? 'Избранное',
        avatar_hash: groups[holder_id][0].meta?.avatar_hash ?? '',
        children: groups[holder_id],
        is_shown: false
      })
      return result
    },
    showModal(story_group, index){
        this.modalStartIndex = index
        this.modalIsOpen = true
        this.checkShown()
    },
    checkShown(){
        if(!localStorage.storiesShown){
            localStorage.storiesShown = '[]'
            return false
        }
        try{
            this.localShown = JSON.parse(localStorage.storiesShown)
            
            for(var i in this.storyGroups){
                for(var k in this.storyGroups[i].children){
                    let story = this.storyGroups[i].children[k]
                    if(this.localShown.includes(story.post_id)){
                        this.storyGroups[i].is_shown = true
                    }
                }
            }
        }catch(err){
            console.log('local stories parse error =(')
        }
    },
    closeModal(){
        this.modalIsOpen = false
    },
  }
};
</script>