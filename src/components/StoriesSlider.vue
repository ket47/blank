<style scoped>
.horizontalScroller{
    display: flex;
}
.story-block{
    text-align: center;
}
.story-block label{
    font-size: 12px;
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
    <div v-if="stories.length > 0" class="ion-padding-horizontal ion-padding-bottom">
        <h5>Истории</h5>
        <div class="horizontalScroller">
            <div  v-for="(story_group, index) in stories"  :key="index" class="story-block">
                <ion-avatar @click="showModal(story_group)" :class="`story-circle ${(story_group.is_shown) ? 'story-shown' : ''}`">
                    <img :alt="story_group.user_name" :src="`${$heap.state.hostname}image/get.php/${story_group.image_hash}.400.400.webp`" />
                </ion-avatar>
                <label><b>{{ story_group.user_name }}</b></label>
            </div>
        </div>
        <stories-modal :stories="modalStories" :is-open="modalIsOpen" @on-close="closeModal" :slide-duration="4000"/>
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
      stories: [],
      modalStories: [],
      modalIsOpen: false,
      localShown: []
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
          if(this.stories.length > 0){
            return
          }
          try{
            const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_active: 1, post_type: "wellcomeslide,story" })
            this.stories = this.listPrepare(response.post_list)
            this.checkShown()
          }catch(err){
            console.log('get post error')
          }
        },
        listPrepare(listRaw){
            let result = []
            let groupByField = 'wellcomeslide'
            let list = listRaw.reduce(function (r, a) {
                r[a[groupByField]] = r[a[groupByField]] || [];
                r[a[groupByField]].push(a);
                return r;
            }, Object.create(null));
            for(var i in list){
                result.push({
                    id: i,
                    user_name: this.$heap.state.settings.app_title,
                    image_hash: list[i][0].image_hash,
                    items: list[i],
                    is_shown: true
                })
            }
            return result
        },
        showModal(story_group){
            this.modalStories = story_group.items
            this.modalIsOpen = true
            this.markShown(story_group.id)
        },
        checkShown(){
            if(!localStorage.storiesShown){
                localStorage.storiesShown = '[]'
                return false
            }
            try{
                this.localShown = JSON.parse(localStorage.storiesShown)
            }catch(err){
                console.log('local stories parse error =(')
            }
            for(var i in this.stories){
                for(var k in this.stories[i].items){
                    let story = this.stories[i].items[k]
                    if(!this.localShown.includes(story.post_id*1)){
                        this.stories[i].is_shown = false
                    }
                }
            }
        },
        closeModal(){
            this.modalIsOpen = false
        },
        markShown(id){
            for(var i in this.stories) {
                if(this.stories[i].id == id){ 
                    let story_ids = this.stories[i].items.map(e => e.post_id*1);
                    localStorage.storiesShown = JSON.stringify(this.localShown.concat(story_ids));
                    return this.stories[i].is_shown = true 
                }
            }
        }
  }
};
</script>