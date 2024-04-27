<template>
  <base-layout :pageTitle="`Условия доставки ${store.store_name||''}`">
    <div v-if="store_delivery_methods" v-html="store_delivery_methods" class="ion-padding"></div>
    <div v-else class="ion-padding">Для уточнения условий доставки свяжитесь с продавцом <a :href="`tel:${store.store_phone}`">{{store.store_phone}}</a></div>
  </base-layout>
</template>

<script>
import jQuery   from "jquery";

export default {
  components: {     
  },
  setup() {
    return {};
  },
  data() {
    return {
      store_id:this.$route.params.id??0,
      store:{},
      store_delivery_methods:'',
    };
  },
  mounted(){
    this.itemGet()
  },
  methods:{
      async itemGet(){
        const request={
          store_id:this.store_id
        }
        try{
          this.store=await jQuery.post(`${this.$heap.state.hostname}Store/itemGet`,request)
          if( this.store.store_delivery_methods ){
            this.store_delivery_methods=this.store.store_delivery_methods
          }
        }catch{/** */}
      },
  }
};
</script>
