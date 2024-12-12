<template>
  <div>
    <stories-modal :story-groups="storyGroups" :start-index="0" :is-open="isOpen" :slide-duration="4000"/>
  </div>
</template>

<script>
import jQuery               from 'jquery';
import StoriesModal         from "@/components/StoriesModal";

import User    from '@/scripts/User.js';

export default{
  components: {
    StoriesModal
  },
  data(){
    return {
      isOpen: false,
      storyGroups: [],
      delaySeconds: 0
    };
  },
  created(){
    
    if(localStorage.storiesStartupModalShown){
      let diff = Date.now() - localStorage.storiesStartupModalShown
      if(diff < this.delaySeconds*1000 ) return
    }
    this.$topic.on('userGet',user=>{
        if( !User.isAdmin() ) return
        this.listGet()
    })
  },
  methods: {
    async listGet(){
      try{
        const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_popup: 1, is_active: 1, post_type: "story" })
        this.storyGroups = this.composeSlides(response.post_list)
        this.preloadFirstImage(this.storyGroups[0].children[0].image_hash);
      }catch(err){
        console.log('get post error')
      }
    },
    preloadFirstImage(image_hash) {
      var image = new Image()
      image.src = `${this.$heap.state.hostname}image/get.php/${image_hash}.1000.1000.webp`
      image.onload = () => {
        this.isOpen = true
        localStorage.storiesStartupModalShown=Date.now()
      }
    },
    composeSlides(storiesRaw){
      const result = []
      /*REDO!*/
      const holders = [
        {
          holder_id: 1,
          holder: '',
          holder_name: 'Tezkel',
          avatar_hash: '079cc810e1b1813474e727e9d23d2c6f'
        }, 
        {
          holder_id: 2,
          holder: 'store',
          holder_name: 'Yaem',
          avatar_hash: '11847ffd9b06d9c9d8298579a4692cce'
        }
      ];
      const list = []
      for(const story of storiesRaw){
        let slide = story
        let activeHolder = holders[Math.floor(Math.random() * 2)];
        slide.holder_id = activeHolder.holder_id
        slide.holder = activeHolder.holder
        slide.meta = activeHolder
        list.push(slide)
      }
      /*REDO!*/
      let groups = list.reduce(function(rv, x) {
        (rv[x['holder_id']] = rv[x['holder_id']] || []).push(x);
        return rv;
      }, {});
      for (const holder_id in groups) result.push({
        holder_id: holder_id,
        holder_name: groups[holder_id][0].meta.holder_name,
        holder: groups[holder_id][0].meta.holder,
        avatar_hash: groups[holder_id][0].meta.avatar_hash,
        children: groups[holder_id]
      })
      return result
    }
  }
};
</script>