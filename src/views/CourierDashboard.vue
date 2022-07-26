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
  font-size: 12px;;
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
  <base-layout page-title="Анкета курьера" page-default-back-link="/user-dashboard">
    <div v-if="!courier">
      <ion-card>
        <ion-item>
          <ion-label>Подача заявки</ion-label>
        </ion-item>
        <ion-item>
          <ion-text>
          Подавая заявку вы даете согласие на условия 
          <a href="#/page-courier_contract" @click="$router.push('/page-courier_contract')">Оферта об оказании услуг доставки</a>
          </ion-text>
          <ion-checkbox v-model="contractAccepted" slot="end"/>
        </ion-item>
        <ion-button expand="full" @click="itemCreate()" :disabled="!contractAccepted">Стать курьером</ion-button>
      </ion-card>
    </div>

    <div v-if="courier">
      <ion-card lines="none" v-if="message">
        <ion-card-content :class="messageClass">
          {{message}}
        </ion-card-content>
      </ion-card>
      <ion-card lines="none" v-else>
        <ion-card-content style="background-color: var(--ion-color-success-tint);">
        Анкета активна. Вы можете открыть смену для приема заказов.
        </ion-card-content>
      </ion-card>
      
      <form @change="updateCourier()">
        <ion-list>
          <ion-item>
            <ion-icon :src="trashOutline" color="primary" slot="start"/>
            Удалено
            <ion-toggle slot="end" v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)"></ion-toggle>
          </ion-item>
          <ion-item>
            <ion-icon :src="searchOutline" color="primary" slot="start"/>
            На модерации
            <ion-toggle slot="end" v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)"></ion-toggle>
          </ion-item>

          <ion-item-divider>
            <ion-label>Основные настройки</ion-label>
          </ion-item-divider>
          <ion-item lines="full">
            <ion-label position="stacked" color="primary">Транспорт</ion-label>
            <ion-input v-model="courier.courier_vehicle" placeholder="автомобиль, мопед, велосипед"/>
          </ion-item>
          <ion-item lines="full">
            <ion-label position="stacked" color="primary">ИНН</ion-label>
            <ion-input v-model="courier.courier_tax_num" placeholder="Ваш ИНН"/>
          </ion-item>
          <ion-item lines="full">
            <ion-label position="stacked" color="primary">Коментарий</ion-label>
            <ion-textarea v-model="courier.courier_comment" placeholder="Цвет, номер авто"></ion-textarea>
          </ion-item>
        </ion-list>
      </form>
      <ion-list v-if="courier">
        <ion-item-divider>
          <ion-label>Ваше фото</ion-label>
        </ion-item-divider>
        <image-tile-comp :images="courier.images" :image_holder_id="courier.courier_id" controller="Courier" ref="courierImgs"></image-tile-comp>
        <ion-button @click="$refs.courierImgs.take_photo()" size="small" expand="full" color="medium">
          <ion-icon :src="cameraOutline"/> Добавить
        </ion-button>
      </ion-list>

      <ion-list>
        <ion-item-divider>
          <ion-label>Информация</ion-label>
        </ion-item-divider>
        <ion-item lines="none" button detail @click="$router.push('/page-rules-courier')">
          <ion-icon :src="documentTextOutline" slot="start"></ion-icon>
          <router-link :to="page-rules-courier">Правила пользования для курьера</router-link>
        </ion-item>
      </ion-list>
    </div>
  </base-layout>
</template>

<script>
import { 
  IonTextarea,
  IonInput,
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonText,
  IonItemDivider,
  IonToggle,
  IonIcon,
}                    from "@ionic/vue";
import {
  cameraOutline,
  trashOutline,
  searchOutline,
  documentTextOutline
}                     from 'ionicons/icons'
import jQuery         from "jquery";
import heap           from '@/heap';
import User           from '@/scripts/User.js';
import imageTileComp  from '@/components/ImageTileComp.vue'

export default  {
  components: {
  imageTileComp,
  IonTextarea,
  IonInput,
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonText,
  IonItemDivider,
  IonToggle,
  IonIcon,
  },
  setup(){
    return {
  cameraOutline,
  trashOutline,
  searchOutline,
  documentTextOutline
    }
  },
  data(){
    return {
      other_courier_id:this.$route?.query?.courier_id,
      courier:null,
      isAdmin:User.isAdmin(),
      contractAccepted:0,
      is_deleted:0,
      is_disabled:0,
    }
  },
  ionViewDidEnter(){
    if(this.other_courier_id==this.$route?.query?.courier_id){
      return
    }
    this.other_courier_id=this.$route?.query?.courier_id
    this.itemGet()
  },
  mounted(){
    this.itemGet();
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
      if(this.courier?.images[0]?.is_disabled==1){
        return 'image_disabled';
      }
      return '';
    },
  },
  methods:{
    async itemGet(){
      if(this.other_courier_id){
        this.courier=await jQuery.post( heap.state.hostname + "Courier/itemGet",{courier_id:this.other_courier_id})
      } else {
        this.courier=await User.courier.get();
      }
      this.itemParseFlags()
    },
    itemParseFlags(){
      if(!this.courier){
        return
      }
      this.is_deleted   = this.courier.deleted_at==null?0:1
      this.is_disabled  = this.courier.is_disabled==0?0:1
    },
    async itemCreate(){
      try{
        await jQuery.post(heap.state.hostname + "Courier/itemCreate");
        await User.get('full');
        this.courier=User.courier.data;
      } catch {
        this.$flash("Не удалось зарегистрироваться как курьер")
      }
    },
    async itemDelete( is_deleted ){
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( heap.state.hostname + "Courier/"+remoteFunction, { courier_id: this.courier.courier_id })
        this.courier.deleted_at=is_deleted?1:null;
      }catch{
        this.itemGet()
      }
    },
    async itemDisable( is_disabled ){
      if(this.courier.is_disabled==is_disabled){
        return
      }
      try{
        await jQuery.post( heap.state.hostname + "Courier/itemDisable", { courier_id: this.courier.courier_id, is_disabled })
        this.courier.is_disabled=is_disabled;
      }catch{
        this.itemGet()
      }
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
        this.itemGet()
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
      
    },
  },
}
</script>