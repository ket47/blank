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
}
.disabled{
  background-color: var(--ion-color-light);
}
.deleted{
  background-color: var(--ion-color-danger-tint);
}
.image_disabled{
  border: 4px solid #999;
  filter: grayscale(0.5);
}
.courier-grid{
  min-height: 350px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: bottom;
}
</style>
<template>
  <base-layout page-title="Анкета курьера"  pageDefaultBackLink="/user">
    <div v-if="courier==null">
      
    </div>
    <div  v-else-if="courier?.courier_id">
      <ion-card lines="none" v-if="message">
        <ion-card-content :class="messageClass">
          {{message}}
        </ion-card-content>
      </ion-card>
      <ion-card lines="none" v-else color="success">
        <ion-card-content>
        Анкета активна. Вы можете получать заказы.
        </ion-card-content>
      </ion-card>
      <ion-card lines="none">
        <ion-card-content>
          <ul>
            <li>Пользователь: {{ courier.user_name }}</li>
            <li>Телефон: <a :href="`tel:+${courier.user_phone}`">+{{ courier.user_phone }}</a></li>
            <li>Статус: {{ courier?.member_of_groups?.group_names }}</li>
            <li>Рейтинг: {{ Math.round(courier.rating_score*5*100)/100 }}⭐</li>
            <ion-chip @click="$go(`/user/courier-statistics?courier_id=${other_courier_id}`)">
              <ion-icon :icon="pieChartOutline"></ion-icon>
              <ion-label>Перейти к статистике курьера</ion-label>
            </ion-chip>
          </ul>
        </ion-card-content>
      </ion-card>

      <form @ionChange="updateCourier()">
        <ion-list>
          <ion-item>
            <ion-icon :src="trashOutline" color="primary" slot="start"/>
            Удалено
            <ion-toggle slot="end" v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)"></ion-toggle>
          </ion-item>
          <ion-item>
            <ion-icon :src="ribbonOutline" color="primary" slot="start"/>
            На модерации
            <ion-toggle slot="end" v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)"></ion-toggle>
          </ion-item>


          <ion-item lines="full">
            <ion-icon :src="notificationsOutline" color="primary" slot="start"/>
            <ion-select v-model="courier.courier_parttime_notify"  interface="popover" label="Подработка" :interface-options="{
                header:'Заказы вне смены',
                message: 'Присылать уведомления о свободных заказах',
              }">
              <ion-select-option value="ringtone">
                🔔 Рингтон
              </ion-select-option>
              <ion-select-option value="push">
                💬 Сообщение
              </ion-select-option>
              <ion-select-option value="silent">
                🔇 Без звука
              </ion-select-option>
              <ion-select-option value="off">
                🚫 Отключено
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item-divider>
            <ion-label>Информация о курьере</ion-label>
          </ion-item-divider>
          <ion-item lines="full">
            <ion-input v-model="courier.courier_name" placeholder="" label="Имя для клиентов" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-select v-model="courier.courier_vehicle"  interface="popover" label="Транспорт" label-placement="stacked" :interface-options="customPopoverOptions">
              <ion-select-option value="auto_private">
                🚗 Автомобиль личный
              </ion-select-option>
              <ion-select-option value="moped_private">
                🏍️ Мопед личный
              </ion-select-option>
              <ion-select-option value="moped_rent">
                🛵 Мопед аренда
              </ion-select-option>
              <ion-select-option value="electro_bike">
                🛴 Электросамокат
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item lines="full">
            <ion-textarea v-model="courier.courier_comment" placeholder="" label="Комментарий" label-placement="stacked"></ion-textarea>
          </ion-item>

          <ion-item-divider>
            <ion-label>Реквизиты для выплат</ion-label>
          </ion-item-divider>
          <ion-item lines="full">
            <ion-input v-model="courier.courier_full_name" placeholder="" label="ФИО самозанятого" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-input v-model="courier.courier_tax_num" placeholder="" label="ИНН самозанятого" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-input v-model="courier.courier_bank_account" placeholder="" label="Счет" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-input v-model="courier.courier_bank_id" placeholder="" label="Бик банка" label-placement="stacked"/>
          </ion-item>
          <ion-item lines="full">
            <ion-textarea v-model="courier.courier_bank_assignment" placeholder="" label="Назначение платежа" label-placement="stacked"></ion-textarea>
          </ion-item>
        </ion-list>
      </form>
      <ion-item-divider>
        <ion-label>Фотографии</ion-label>
      </ion-item-divider>
      <ion-list v-if="courier">
        <image-tile-comp :images="courier.images" image_holder="courier" :image_holder_id="courier.courier_id" controller="Courier" ref="courierImgs" :title="'Фото лица для клиентов'"></image-tile-comp>
        <ion-button @click="$refs.courierImgs.take_photo()" expand="block" color="light">
          <ion-icon :src="cameraOutline" slot="start"/> Добавить своё фото
        </ion-button>
      </ion-list>
      <ion-list v-if="courier">
        <image-tile-comp :images="courier.passport_images" image_holder="courier_passport" :image_holder_id="courier.courier_id" controller="Courier" ref="courierPassImgs" :title="'Фото паспорта для выплат'"></image-tile-comp>
        <ion-button @click="$refs.courierPassImgs.take_photo()" expand="block" color="light">
          <ion-icon :src="cameraOutline" slot="start"/> Загрузить фото паспорта
        </ion-button>
      </ion-list>

      <ion-list>
        <ion-item lines="none" button detail @click="$go('/page/rules-courier')">
          <ion-icon :src="documentTextOutline" slot="start"></ion-icon>
          <router-link to="/page/rules-courier">Правила пользования для курьера</router-link>
        </ion-item>
      </ion-list>
    </div>
    <div v-else style="background: linear-gradient(to top, #009dcd, #79c8e2);">
      <ion-grid class="courier-grid" style="background-image: url('/img/courier_tezkel.png')">
        <ion-row class="ion-align-items-center" >
          <ion-col size-md="6" size-xs="12" size-sm="12" class="ion-padding" style="color: var(--ion-color-primary-contrast)">
            <h3><b>Хотите стать нашим курьером?</b></h3>
            <h6><b>Заполняйте анкету и присоединяйтесь к нашей дружной команде!</b></h6>
          </ion-col>
          <ion-col size-md="6" size-xs="12" size-sm="12" style="min-height: 350px;">
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-card color="light" style="margin: 0;">
        <ion-card-header>
          <ion-card-title class="ion-text-center">Мы предлагаем</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size-xs="12" size-md="4">
                <ion-card color="primary">
                  <ion-card-header>
                    <ion-card-title>1. Без стажировки</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Никаких испытательных сроков, вы с первого дня погружаетесь в работу
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col size-xs="12" size-md="4">
                <ion-card color="primary">
                  <ion-card-header>
                    <ion-card-title>2. Гибкий график</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Можно подгонять и совмещать рабочее время так, как удобно именно Вам.
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col size-xs="12" size-md="4">
                <ion-card color="primary">
                  <ion-card-header>
                    <ion-card-title>3. Трудовой договор</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Есть возможность официально оформить трудовые отношения.
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size-xs="12" size-md="4">
                <ion-card color="primary">
                  <ion-card-header>
                    <ion-card-title>4. Автоматизация</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Работа автоматизирована с помощью приложения.
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col size-xs="12" size-md="4">
                <ion-card color="primary">
                  <ion-card-header>
                    <ion-card-title>5. Компенсация</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Мы выплачеваем компенсацию затрат на топливо, затраченное в рабочее время
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col size-xs="12" size-md="4">
                <ion-card color="primary">
                  <ion-card-header>
                    <ion-card-title>6. Рабочий отдых</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    Вы можете отдохнуть в нашей комнате отдыха для персонала
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-item lines="none">
            <ion-text>
              Подавая заявку вы даете согласие на условия 
              <router-link to="/page/rules-courier">Оферта об оказании услуг доставки</router-link>
            </ion-text>
            <ion-checkbox slot="end" v-model="contractAccepted"/>
          </ion-item>
        <ion-button expand="block" @click="itemCreate()" :disabled="!contractAccepted">Подать заявку</ion-button>
        </ion-card-content>
      </ion-card>
    </div>

  </base-layout>
</template>

<script>
import { 
  IonTextarea,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonText,
  IonItemDivider,
  IonToggle,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonChip,
}                    from "@ionic/vue";
import {
  cameraOutline,
  trashOutline,
  documentTextOutline,
  ribbonOutline,
  notificationsOutline,
  pieChartOutline
}                     from 'ionicons/icons'

import jQuery           from 'jquery';
import heap           from '@/heap';
import User           from '@/scripts/User.js';
import imageTileComp  from '@/components/ImageTileComp.vue'

export default  {
  components: {
  imageTileComp,
  IonTextarea,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonButton,
  IonList,
  IonCheckbox,
  IonText,
  IonItemDivider,
  IonToggle,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonChip,

  },
  setup(){
    return {
      cameraOutline,
      trashOutline,
      documentTextOutline,
      ribbonOutline,
      notificationsOutline,
      pieChartOutline,
    }
  },
  data(){
    return {
      other_courier_id:this.$route?.query?.courier_id,
      courier: null,
      isAdmin:User.isAdmin(),
      contractAccepted:0,
      is_deleted:0,
      is_disabled:0,
      customPopoverOptions :{
        message: 'Тип транспорта определяет радиус доставки',
      }
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
    this.itemGet()
  },
  computed:{
    message(){
      if(this.courier?.deleted_at){
        return "Анкета не активна и будет удалена. Вы можете еще отменить удаление";
      }
      if(this.courier?.is_disabled==1){
        return "Анкета пока не активна. Свяжитесь по контактному телефону с администратором, чтобы записаться на собеседование. Телефон и адрес офиса на странице Контакты";
      }
      return null;
    },
    messageClass(){
      if(this.courier?.deleted_at){
        return "deleted";
      }
      if(this.courier?.is_disabled==1){
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
      if(this.other_courier_id>0){
        try{
          this.courier=await this.$post( heap.state.hostname + "Courier/itemGet",{courier_id:this.other_courier_id})
        } catch( err ){
          this.$flash("Не удалось загрузить анкету")
        }
      } else {
        this.courier=heap.state.courier || {}
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
        await this.$post(heap.state.hostname + "Courier/itemCreate");
        await User.get('full');
        this.courier=User.courier.data;
      } catch {
        this.$flash("Не удалось зарегистрироваться как курьер")
      }
    },
    async itemDelete( is_deleted ){
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await this.$post( heap.state.hostname + "Courier/"+remoteFunction, { courier_id: this.courier.courier_id })
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
        await this.$post( heap.state.hostname + "Courier/itemDisable", { courier_id: this.courier.courier_id, is_disabled })
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
      this.$post('#courier_foto_upload').trigger('click');
    },
    async updateCourier(){
      try{
        const request={
          courier_id:this.courier.courier_id,
          courier_name:this.courier.courier_name,
          courier_vehicle:this.courier.courier_vehicle,
          courier_comment:this.courier.courier_comment,
          courier_parttime_notify:this.courier.courier_parttime_notify,

          courier_full_name:this.courier.courier_full_name,
          courier_tax_num:this.courier.courier_tax_num,
          courier_bank_account:this.courier.courier_bank_account,
          courier_bank_id:this.courier.courier_bank_id,
          courier_bank_assignment:this.courier.courier_bank_assignment,
        }
        const result=await this.$post(heap.state.hostname + "Courier/itemUpdate",JSON.stringify(request));
        this.$flash("💾 Сохранено");
        return result
      } catch(err){
        const message=JSON.parse(err.responseJSON?.messages?.error);
        if(message.courier_tax_num){
          this.$flash("⛔ Неверный формат ИНН (10 или 12 цифр)");
        }
        if(message.courier_bank_account){
          this.$flash("⛔ Неверный формат номер счета (20 цифр)");
        }
        if(message.courier_bank_id){
          this.$flash("⛔ Неверный формат БИК (9 цифр)");
        }
        this.itemGet()
      }
      
    },
  },
}
</script>