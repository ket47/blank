<template>

  <ion-item v-if="items?.length>0"  class="ion-justify-content-between ion-align-items-center" lines="none"  style="--background: transparent;--padding-start: 10px;">
    <h5 slot="start" class="ion-no-margin section-title">Лучшее для вас</h5>
  </ion-item>
  <div class="ion-padding">
    <product-list v-if="items?.length>0" :productList="items"/>
  </div>
  <br/>
</template>

<script>
import {
  IonItem
}                   from "@ionic/vue";

import ProductList          from "@/components/ProductList";
import jquery               from 'jquery'

export default {
  components: {
    ProductList,
    IonItem
  },
  data(){
    return {
      items:[],
    }
  },
  methods:{
    async listNearGet(loc){
      try{
          if(!loc){
            loc=this.$heap.state.user.location_current??this.$heap.state.user.location_main
          }
          if(!loc || this.is_loading==1){
            return
          }
          this.is_loading=1
          let items

          let request={
              location_id:loc.location_id,
              location_latitude:loc.location_latitude,
              location_longitude:loc.location_longitude,
              offset:this.items.length,
              limit:24
          }
          const products=await jquery.post(`${this.$heap.state.hostname}Product/listNearGet`,request)
          items=products

          this.items=this.items.concat(items)
          this.is_loading=0
          if(products.length<request.limit){
            return false
          }
          return true
      } catch(err){
        //console.log(err)
      }
    }
  },
  mounted(){
    setTimeout(()=>{
      this.$topic.on('userMainLocationSet',loc=>this.listNearGet(loc))
      this.$topic.on('userCurrentLocationSet',loc=>this.listNearGet(loc))
    },3000)
    //this.listNearGet();
  },
};
</script>