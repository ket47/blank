<template>
  <base-layout pageTitle="Редактирование страницы">
    <ion-list>
        <ion-item>
            <ion-icon slot="start" :icon="bookmarkOutline"/>
            <ion-label position="stacked" color="primary">Заголовок статьи</ion-label>
            <ion-input v-model="page.page_title" placeholder="Заголовок статьи"/>
        </ion-item>
        <ion-item>
            <ion-icon slot="start" :icon="codeOutline"/>
            <ion-label position="stacked" color="primary">Код для ссылки</ion-label>
            <ion-input v-model="page.page_name" placeholder="Код для ссылки"/>
        </ion-item>
    </ion-list>
    <ckeditor :editor="editor" v-model="page.page_content" :config="editorConfig"></ckeditor>
    <ion-grid style="width:100%">
        <ion-row>
            <ion-col>
                <ion-button @click="$router.push('text-list')" color="light">К списку страниц</ion-button>
            </ion-col>
            <ion-col style="text-align:right">
                <ion-button @click="itemDelete()" color="danger">Удалить</ion-button>
            </ion-col>
            <ion-col style="text-align:right">
                <ion-button @click="itemSave()">Сохранить</ion-button>
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
import User     from '@/scripts/User.js';
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
      editor: ClassicEditor,
      page_id:0,
      page: {
          page_name:'',
          page_title:'',
          page_content:''
      },
      editorConfig: {
        language: "ru",
        //plugins: [ SourceEditing ],
      },
    };
  },
  created(){
//
  },
  ionViewDidEnter() {
      if(User.isAdmin()){
          this.page_id=this.$route.params.id??0
          if(this.page_id>0){
            this.itemGet()
          } else {
              this.page={
                page_name:'',
                page_title:'',
                page_content:''
              };
          }
      } else {
          this.$flash('Страница для администраторов')
          this.$router.push('/home')
      }
  },
  methods:{
      async itemGet(){
          const page_id=this.page_id
          try{
            this.page=await jQuery.post(this.$heap.state.hostname+'Page/itemGet',{page_id})
          }catch{/** */}
      },
      async itemSave(){
          const request={
              page_name:this.page.page_name,
              page_title:this.page.page_title,
              page_content:this.page.page_content
          }
          try{
            if(this.page_id>0){
                request.page_id=this.page_id
                await jQuery.post(this.$heap.state.hostname+'Page/itemUpdate',JSON.stringify(request))
                this.$flash("Страница сохранена")
            } else {
                this.page_id=await jQuery.post(this.$heap.state.hostname+'Page/itemCreate',JSON.stringify(request))
            }
          } catch{/** */}
      },
      async itemDelete(){
          if(!confirm(`Удалить страницу "${this.page.page_title}"?`)){
              return
          }
          const page_id=this.page_id
          try{
              await jQuery.post(this.$heap.state.hostname+'Page/itemDelete',{page_id})
              this.$flash("Страница удалена")
              this.$router.push('/text-list')
          } catch{/** */}
      }
  }
};
</script>
