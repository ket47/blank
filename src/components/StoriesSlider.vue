<style scoped>
.horizontalScroller{
    display: flex;
}
.story-block{
    text-align: center;
}
.story-block label{
    margin: 0 auto;
    font-size: 12px;
    max-width: 60px;
    display: block;
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
    <div v-if="storyGroups.length > 0" class="ion-padding-horizontal ion-padding-bottom">
        <h5>Истории</h5>
        <div class="horizontalScroller">
            <div  v-for="(story_group, index) in storyGroups"  :key="index" class="story-block">
                <ion-avatar @click="showModal(story_group, index)" :class="`story-circle ${(story_group.is_shown) ? 'story-shown' : ''}`">
                    <img :alt="story_group.holder_name" :src="`${$heap.state.hostname}image/get.php/${story_group.avatar_hash}.400.400.webp`" />
                </ion-avatar>
                <label class="max-one-line-ellipsis">{{ story_group.holder_name }}</label>
            </div>
        </div>
        <stories-modal :story-groups="storyGroups" :start-index="modalStartIndex" :is-open="modalIsOpen" @on-close="closeModal" :slide-duration="4000"/>
    </div>
</template>

<script>
import {
  IonAvatar
}                           from "@ionic/vue";

import StoriesModal         from "@/components/StoriesModal";

import User    from '@/scripts/User.js';

import {
  closeOutline,
  chevronForwardOutline
  }                         from 'ionicons/icons';
import jQuery               from 'jquery';

import 'swiper/css/pagination';

export default{
  components: {
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
      
    };
  },
  mounted(){
    this.$topic.on('userGet',user=>{
        if( !User.isAdmin() ) return
        this.listGet()
    })
  },
  methods: {
    async listGet(){
        try{
            const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_active: 1, post_type: "story" })
            this.storyGroups  = this.composeSlides(response.post_list)
            this.checkShown()
        }catch(err){
            console.log('get post error')
        }
    },
    composeSlides(storiesRaw){
      const result = []
      let groups = storiesRaw.reduce(function(rv, x) {
        (rv[x['post_holder_id']] = rv[x['post_holder_id']] || []).push(x);
        return rv;
      }, {});
      for (const holder_id in groups) result.push({
        holder_id: holder_id,
        is_shown: false,
        holder_name: groups[holder_id][0].meta.holder_name,
        holder: groups[holder_id][0].meta.holder,
        avatar_hash: groups[holder_id][0].meta.avatar_hash,
        children: groups[holder_id]
      })
      return result
    },
    showModal(story_group, index){
        this.modalStartIndex = index
        this.modalIsOpen = true
        this.markShown(story_group.holder_id)
    },
    checkShown(){
        if(!localStorage.storiesShown){
            localStorage.storiesShown = '[]'
            return false
        }
        try{
            this.localShown = JSON.parse(localStorage.storiesShown)
            this.localShown = this.localShown.slice(this.localShown.length - 100, this.localShown.length)
        }catch(err){
            console.log('local stories parse error =(')
        }
        for(var i in this.storyGroups){
            for(var k in this.storyGroups[i].children){
                let story = this.storyGroups[i].children[k]
                if(this.localShown.includes(story.post_id*1)){
                    this.storyGroups[i].is_shown = true
                }
            }
        }
    },
    closeModal(){
        this.modalIsOpen = false
    },
    markShown(id){
        for(var i in this.storyGroups) {
            if(this.storyGroups[i].holder_id == id){ 
                let story_ids = this.storyGroups[i].children.map(e => e.post_id*1);
                localStorage.storiesShown = JSON.stringify(this.localShown.concat(story_ids));
                return this.storyGroups[i].is_shown = true 
            }
        }
    }
  }
};
</script>