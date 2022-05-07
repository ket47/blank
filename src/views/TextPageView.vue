<template>
    <base-layout :pageTitle="page?.page_title||$heap.state.app_title">
        <div v-if="page=='error'">
            <ion-title>Страница не найдена</ion-title>
        </div>
        <div v-else-if="page==null"></div>
        <div v-else style="padding:10px">
            <h1>{{page.page_title}}</h1>
            <ion-text v-html="page.page_content"></ion-text>
        </div>
    </base-layout>
</template>
<script>
import jQuery from "jquery";
export default {
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