<template>
  <base-layout :pageTitle="`Условия доставки ${store.store_name}`"  :pageDefaultBackLink="`/catalog/store-edit-${store_id}`">
    <ckeditor :editor="editor" v-model="store.store_delivery_methods" :config="editorConfig"></ckeditor>
    <ion-grid style="width:100%">
        <ion-row>
            <ion-col style="text-align:right">
                <ion-button @click="itemDelete()" color="danger" fill="outline" expand="block">Удалить</ion-button>
            </ion-col>
            <ion-col style="text-align:right">
                <ion-button @click="itemUpdate()" expand="block">Сохранить</ion-button>
            </ion-col>
        </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "@ckeditor/ckeditor5-build-classic/build/translations/ru";
//import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import {documentTextOutline,codeOutline,bookmarkOutline} from 'ionicons/icons';

import { 
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,

}               from '@ionic/vue'
import jQuery   from "jquery";

export default {
  components: {     
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    ckeditor: CKEditor.component
  },
  setup() {
    return { documentTextOutline, codeOutline, bookmarkOutline };
  },
  data() {
    return {
      store_id:this.$route.params.id??0,
      store:{},
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
        }catch{/** */}
      },
      async itemUpdate(){
        const maximumLength=3000
        if(this.store.store_delivery_methods.length>maximumLength){
          alert(`Текст слишком длинный. Сохранится только первые ${maximumLength} символов`)
        }
        const request={
          store_id:this.store_id,
          store_delivery_methods:this.store.store_delivery_methods
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
          this.store.store_delivery_methods=''
          this.itemUpdate()
      }
  }
};
</script>
