<template>
  <div>
    <stories-modal :story-groups="storyGroups" :start-index="0" :is-open="isOpen" :slide-duration="4000" :is-editable="true"/>
  </div>
</template>

<script>
import jQuery               from 'jquery';
import StoriesModal         from "@/components/PostStoriesModal";

export default{
  components: {
    StoriesModal
  },
  data(){
    return {
      isOpen: false,
      storyGroups: [],
      localShown: []
    };
  },
  created(){
    this.listGet()
  },
  methods: {
    async listGet(){
      try{
        const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_active: 1, post_type: "story", is_promoted: 1 })
        this.storyGroups = this.composeSlides(response.post_list)
        if(this.storyGroups.length > 0){
          this.preloadFirstImage(this.storyGroups[0].children[0].image_hash);
        }
      }catch(err){
        //console.log('get post error')
      }
    },
    preloadFirstImage(image_hash) {
      var image = new Image()
      image.src = `${this.$heap.state.hostname}image/get.php/${image_hash}.1500.3000.webp`
      image.onload = () => {
        this.isOpen = true
        localStorage.storiesStartupModalShown=Date.now()
      }
    },
    composeSlides(storiesRaw){
      const result = []
      if(this.getShown()){
        storiesRaw = storiesRaw.filter(item => this.localShown.indexOf(item.post_id) === -1);
      }
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
    getShown(){
        if(!localStorage.storiesShown){
            localStorage.storiesShown = '[]'
            return false
        }
        try{
            this.localShown = JSON.parse(localStorage.storiesShown)
            return true
        }catch(err){
            console.log('startup modal stories parse error =(')
            return false;
        }
        
    },
  }
};
</script>