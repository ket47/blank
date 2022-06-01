<template>
    <base-layout :pageTitle="page?.page_title||$heap.state.settings.app_title">
        <div v-if="page=='error'" style="padding:20px">
            <h6>Страница не найдена</h6>
        </div>
        <div v-else-if="page==null" style="padding:20px">
            <ion-skeleton-text animated  style="height:2em;width:40%"></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <br>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
            <ion-skeleton-text animated ></ion-skeleton-text>
        </div>
        <div v-else style="padding:10px">
            <ion-text v-html="page.page_content"></ion-text>
        </div>
    </base-layout>
</template>
<script>
import {
  IonText,
  IonSkeletonText
} from "@ionic/vue";
import jQuery from "jquery";
export default {
  components: {
  IonText,
  IonSkeletonText
  },
   data(){
        return{
            page:null
        }
    },
    created(){
        this.page_id=this.$route.params.id??0
        this.itemGet(this.page_id)
    },
    methods:{
      async itemGet(){
          let page_id=null
          let page_name=null
          if(Number.isInteger(this.page_id)){
            page_id=this.page_id
          } else {
              page_name=this.page_id
          }
          try{
            this.page=await jQuery.post(this.$heap.state.hostname+'Page/itemGet',{page_id,page_name})
          }catch{
              this.page='error'
          }
      },
    }
}
</script>