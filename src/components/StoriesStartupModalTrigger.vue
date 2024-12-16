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
      delaySeconds: 7200
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
        const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_popup: 1, is_active: 1, post_type: "story", is_promoted: 1 })
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
    }
  }
};
</script>