<template>
  <base-layout :pageTitle="`Условия доставки ${store.store_name}`"  :pageDefaultBackLink="`/catalog/store-edit-${store_id}`">
    <ckeditor :editor="editor" v-model="store_delivery_methods" :config="editorConfig"></ckeditor>
    <ion-grid style="width:100%">
        <ion-row>
            <ion-col style="text-align:right">
                <ion-button @click="itemDelete()" color="danger" fill="outline" expand="block">Удалить</ion-button>
            </ion-col>
            <ion-col style="text-align:right">
                <ion-button @click="itemUpdate()" expand="block">Сохранить</ion-button>
            </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <h6>Изображения</h6>
            <image-tile-comp :images="images" :image_holder="'store_dmethods'" :image_holder_id="store_id" controller="Store" title="Картинка к методам доставки" ref="storeDmethodsImgs"></image-tile-comp>
            <ion-button @click="$refs.storeDmethodsImgs.take_photo()" color="light" expand="block">
              <ion-icon :src="cameraOutline" slot="start"/> Добавить изображение 5шт
            </ion-button>
          </ion-col>
        </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "@ckeditor/ckeditor5-build-classic/build/translations/ru";
import {documentTextOutline,cameraOutline} from 'ionicons/icons';


import imageTileComp        from '@/components/ImageTileComp.vue'

import { 
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
}               from '@ionic/vue'
import jQuery   from "jquery";

export default {
  components: {     
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    imageTileComp,
    ckeditor: CKEditor.component
  },
  setup() {
    return { documentTextOutline, cameraOutline};
  },
  data() {
    return {
      store_id:this.$route.params.id??0,
      store:{},
      store_delivery_methods:'',
      editor: ClassicEditor,
      editorConfig: {
        language: "ru",
        toolbar: [ 'heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList' ]
      },
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
      async itemUpdate(){
        const maximumLength=3000
        if(this.store_delivery_methods.length>maximumLength){
          alert(`Текст слишком длинный. Сохранится только первые ${maximumLength} символов`)
        }
        const request={
          store_id:this.store_id,
          store_delivery_methods:this.store_delivery_methods
        }
        try{
          await jQuery.post(`${this.$heap.state.hostname}Store/itemUpdate`,JSON.stringify(request))
          this.$flash("Сохранено")
        } catch{/** */}
      },
      async itemDelete(){
          if(!confirm(`Удалить условия доставки?`)){
              return
          }
          this.store_delivery_methods=''
          this.itemUpdate()
      }
  }
};
</script>
