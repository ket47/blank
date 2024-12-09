<template>
  <div>
    <stories-modal :stories="slides" :is-open="isOpen" :slide-duration="4000"/>
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
      slides: [],
      delaySeconds: 7200
    };
  },
  mounted(){
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
          if(this.slides.length > 0) return
          try{
            const response=await jQuery.post( this.$heap.state.hostname+"Post/listGet", { is_actual: 1, is_popup: 1, is_active: 1, post_type: "wellcomeslide" })
            this.slides = response.post_list
            this.preloadFirstImage(this.slides[0].image_hash);
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
        }
        
  }
};
</script>