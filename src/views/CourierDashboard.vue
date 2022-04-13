<style scoped>
input,textarea{
  border: none;
  padding: 5px;
  margin: 5px;
  width: 100%;
  outline: none;
}
ion-text{
  color:black;
  padding:20px;
  border-radius:10px;
  font-size: 14px;;
}
.disabled{
  background-color: var(--ion-color-light-shade);
}
.deleted{
  background-color: var(--ion-color-danger-tint);
}
.image_disabled{
  border: 4px solid #999;
  filter: grayscale(0.5);
}
</style>
<template>
  <base-layout page-title="Настройки курьера" page-default-back-link="/user-dashboard">

  <div v-if="courier===false">
    <ion-card>
      <ion-item>
        <ion-label>Пока вы не курьер</ion-label>
      </ion-item>
      <ion-item>
        <ion-note>Подайте заявку, чтобы стать курьером</ion-note>
      </ion-item>
      <ion-button expand="full" @click="itemCreate()">Стать курьером</ion-button>
    </ion-card>
  </div>

  <div v-if="courier">
    <form @change="updateCourier()">
        <ion-list>
          <ion-item lines="none" v-if="message">
            <ion-text :class="messageClass">{{message}}</ion-text>
          </ion-item>
          <ion-item lines="none" v-else>
            <ion-text style="background-color: var(--ion-color-success-tint);width:100%">Анкета активна</ion-text>
          </ion-item>
          <ion-item lines="full">
            <ion-thumbnail v-if="courier.image" slot="start">
              <ion-img style="border-radius:10px;" :class="imageClass" :src="$heap.state.hostname + 'image/get.php/'+courier.image.image_hash+'.100.100.webp'"/>
            </ion-thumbnail>
            <ion-button slot="end" @click="uploadImageTrigger()">Загрузить фото</ion-button>
            <input type="file" id="courier_foto_upload" accept="image/*" @change="uploadImage($event)" style="display:none">
          </ion-item>

          <ion-item lines="full">
            <ion-label position="stacked" color="primary">Транспорт</ion-label>
            <input v-model="courier.courier_vehicle"/>
          </ion-item>

          <ion-item lines="full">
            <ion-label position="stacked" color="primary">ИНН</ion-label>
            <input v-model="courier.courier_tax_num"/>
          </ion-item>

          <ion-item lines="full">
            <ion-label position="stacked" color="primary">Коментарий</ion-label>
            <textarea v-model="courier.courier_comment"></textarea>
          </ion-item>
          
          <ion-item v-if="courier.deleted_at" lines="full">
              <ion-button expand="full" @click="itemUnDelete()">Восстановить</ion-button>
          </ion-item>
          <ion-item v-else lines="full">
              <ion-title size="small" color="dark">Вы можете удалить анкету курьера</ion-title>
              <ion-button slot="end" color="danger" @click="itemDelete()">Удалить</ion-button>
          </ion-item>

          <ion-item v-if="showDisable" lines="full">
              <ion-title size="small" color="dark">Заблокировать анкету</ion-title>
              <ion-button slot="end" @click="itemDisable()">Отключить</ion-button>
          </ion-item>
          <ion-item v-if="showEnable" lines="full">
              <ion-title size="small" color="dark">Утвердить анкету</ion-title>
              <ion-button slot="end" @click="itemEnable()">Включить</ion-button>
          </ion-item>
        </ion-list>
    </form>
  </div>

  </base-layout>
</template>

<script>
import jQuery from "jquery";
import heap from '@/heap';
import User from '@/scripts/User.js';

import '@/theme/form.css';

export default  {
  data(){
    return {
      // courier:{
      //   courier_id:0,
      //   courier_vehicle:'',
      //   courier_tax_num:'',
      //   courier_comment:'',
      //   image:{},
      //   is_disabled:1,
      //   deleted_at:false
      // },
      courier:User.courier.data,
      isAdmin:User.isAdmin()
    }
  },
  mounted(){
    //this.load();
  },
  computed:{
    message(){
      if(this.courier.deleted_at){
        return "Анкета не активна и будет удалена. Вы можете еще отменить удаление";
      }
      if(this.courier.is_disabled==1){
        return "Анкета не активна и находится на рассмотрении у администратора";
      }
      return null;
    },
    messageClass(){
      if(this.courier.deleted_at){
        return "deleted";
      }
      if(this.courier.is_disabled==1){
        return "disabled";
      }
      return null;
    },
    imageClass(){
      if(this.courier?.image?.is_disabled==1){
        return 'image_disabled';
      }
      return '';
    },
    showDisable(){
      if( this.courier.is_disabled==0 && User.isAdmin() ){
        return true;
      }
      return false;
    },
    showEnable(){
      if( this.courier.is_disabled==1 && User.isAdmin() ){
        return true;
      }
      return false;
    },
    showDelete(){
      if( this.courier.deleted_at ){
        return false;
      }
      return true;
    },
    showUnDelete(){
      if( this.courier.deleted_at==-1 || this.courier.deleted_at ){
        return false;
      }
      return true;
    }
  },
  methods:{
    async load(){
      try{
        let courier=await User.courier.get();
        courier.image=courier.images[0];
        this.courier=courier;
      } catch(err){
        const status=JSON.parse(err.responseJSON?.status);
        if(status=="404"){
          //
        }
      }
    },
    async itemCreate(){
      try{
        await jQuery.post(heap.state.hostname + "Courier/itemCreate");
        await User.get();
        let courier=User.courier.data;
        courier.image=courier?.images?.[0];
        this.courier=courier;
      } catch(err){
        console.error(err);
        this.$flash("Не удалось зарегистрироваться как курьер")
      }
    },
    async itemDelete(){
      try{
        await jQuery.post(heap.state.hostname + "Courier/itemDelete",{courier_id:this.courier.courier_id});
        this.load();
      } catch(err){
        const message=err.responseJSON?.messages?.error;
        if(message=='invalid_status'){
          this.$flash("Надо сначала закрыть смену");
        }
      }
    },
    itemUnDelete(){
      const self=this;
      jQuery.post( heap.state.hostname + "Courier/itemUnDelete", {courier_id:this.courier.courier_id})
      .done(()=>{
        self.load();
      });
    },

    itemDisable(){
      const self=this;
      jQuery.post( heap.state.hostname + "Courier/itemDisable", {courier_id:this.courier.courier_id,is_disabled:1})
      .done(()=>{
        self.load();
      });
    },
    itemEnable(){
      const self=this;
      jQuery.post( heap.state.hostname + "Courier/itemDisable", {courier_id:this.courier.courier_id,is_disabled:0})
      .done(()=>{
        self.load();
      });
    },

    async uploadImage(event) {
      let data = new FormData();
      data.append("files[]", event.target.files[0]); 
      data.set("image_holder_id", this.courier.courier_id);
      const request={
        url : heap.state.hostname + "Courier/fileUpload",
        type: "POST",
        data : data,
        processData: false,
        contentType: false
      };
      try{
        await jQuery.ajax(request)
        this.load()
      } catch(err){
        this.$flash("Не удалось загрузить фото");
      }
    },
    uploadImageTrigger(){
      jQuery('#courier_foto_upload').trigger('click');
    },
    async updateCourier(){
      try{
        return await jQuery.post(heap.state.hostname + "Courier/itemUpdate",JSON.stringify(this.courier));
      } catch(err){
        const message=JSON.parse(err.responseJSON?.messages?.error);
        if(message.courier_tax_num){
          this.$flash("Неверный формат ИНН");
        }
      }
      
    }
  },
}
</script>