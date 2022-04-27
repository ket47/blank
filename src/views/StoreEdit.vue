<template>
  <base-layout page-title="Мой магазин"  :page-default-back-link="'/store-'+this.storeId">
        <image-tile-comp :images="storeItem.images" :image_holder_id="storeItem.store_id" controller="Store"></image-tile-comp>

    <form @change="saveForm">
      <ion-list lines="full">
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Предприятие</ion-label>
        </ion-item-divider>

        <ion-item>
          <ion-label position="stacked" color="primary">Название действующее</ion-label>
          <ion-text>{{storeItem.store_name}}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Название новое</ion-label>
          <ion-input v-model="storeItem.store_name_new" name="store_name_new"/>
        </ion-item>

        <ion-item>
          <ion-label position="stacked" color="primary">Описание действующее</ion-label>
          <ion-text>{{storeItem.store_description}}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Описание новое</ion-label>
          <ion-textarea v-model="storeItem.store_description_new" name="store_description_new"></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="stacked" color="primary">Предприятие действующее</ion-label>
          <ion-text>{{storeItem.store_company_name}}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label position="stacked" color="primary">Предприятие новое</ion-label>
          <ion-textarea v-model="storeItem.store_company_name_new" name="store_company_name_new"></ion-textarea>
        </ion-item>
        
        <ion-item>
          <ion-label position="stacked" color="primary">Телефон</ion-label>
          <ion-input
            v-model="storeItem.store_phone"
            name="store_phone"
            type="tel"
            inputmode="tel"
            placeholder="x(xxx)-xxx-xx-xx"
            spellcheck="false"
            autocapitalize="off"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked" color="primary">Электронная почта</ion-label>
          <ion-input v-model="storeItem.store_email" name="store_email"/>
        </ion-item>

        
        <ion-item>
          <ion-row>
            <ion-col>
              <ion-label position="stacked" color="primary">Мин. заказ</ion-label>
              <ion-input v-model="storeItem.store_minimal_order" name="store_minimal_order"/>
            </ion-col>
            <ion-col>
              <ion-label position="stacked" color="primary">Подготовка заказа</ion-label>
              <ion-input v-model="storeItem.store_time_preparation" name="store_time_preparation"/>
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-item-group>
      </ion-list>

      <ion-list>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>Время работы</ion-label>
        </ion-item-divider>


        




        <ion-item>
          
          <ion-row>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Понедельник</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_0"
                name="store_time_opens_0"
                type="numeric"
                :value="storeItem.store_time_opens_0"
                @change="save('store_time_opens_0', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_0"
                name="store_time_closes_0"
                type="numeric"
                :value="storeItem.store_time_closes_0"
                @change="save('store_time_closes_0', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Вторник</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_1"
                name="store_time_opens_1"
                type="numeric"
                :value="storeItem.store_time_opens_1"
                @change="save('store_time_opens_1', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_1"
                name="store_time_closes_1"
                type="numeric"
                :value="storeItem.store_time_closes_1"
                @change="save('store_time_closes_1', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Среда</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_2"
                name="store_time_opens_2"
                type="numeric"
                :value="storeItem.store_time_opens_2"
                @change="save('store_time_opens_2', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_2"
                name="store_time_closes_2"
                type="numeric"
                :value="storeItem.store_time_closes_2"
                @change="save('store_time_closes_2', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Четверг</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_3"
                name="store_time_opens_3"
                type="numeric"
                :value="storeItem.store_time_opens_3"
                @change="save('store_time_opens_3', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_3"
                name="store_time_closes_3"
                type="numeric"
                :value="storeItem.store_time_closes_3"
                @change="save('store_time_closes_3', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Пятница</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_4"
                name="store_time_opens_4"
                type="numeric"
                :value="storeItem.store_time_opens_4"
                @change="save('store_time_opens_4', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_4"
                name="store_time_closes_4"
                type="numeric"
                :value="storeItem.store_time_closes_4"
                @change="save('store_time_closes_4', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Суббота</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_5"
                name="store_time_opens_5"
                type="numeric"
                :value="storeItem.store_time_opens_5"
                @change="save('store_time_opens_5', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_5"
                name="store_time_closes_5"
                type="numeric"
                :value="storeItem.store_time_closes_5"
                @change="save('store_time_closes_5', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="12">
              <ion-label position="stacked" color="primary">Воскресенье</ion-label>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_opens_6"
                name="store_time_opens_6"
                type="numeric"
                :value="storeItem.store_time_opens_6"
                @change="save('store_time_opens_6', $event.target.value)"
                placeholder="Открыто"
                required
              ></ion-input>
            </ion-col>
            <ion-col size="6">
              <ion-input
                v-model="storeItem.store_time_closes_6"
                name="store_time_closes_6"
                type="numeric"
                :value="storeItem.store_time_closes_6"
                @change="save('store_time_closes_6', $event.target.value)"
                placeholder="Закрыто"
                required
              ></ion-input>
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-item-group>
      </ion-list>
    </form>
  </base-layout>
</template>

<script>
import {
  IonInput,
  IonTextarea
  }                   from '@ionic/vue'
import imageTileComp  from '@/components/ImageTileComp.vue'
import jQuery         from "jquery";
import heap           from '../heap';



var storeTypes = {
  'foodstore': 'Продуктовый магазин',
  'restaraunt': 'Ресторан'
};

export default  {
  name: 'SignIn',
  components: { IonInput,IonTextarea,imageTileComp },
  data(){
    return {
      config: {
        phoneMask: '+0(000)-000-00-00'
      },
      storeId: this.$route.params.id,
      storeItem: {},
    }
  },
  computed: {
    isPhoneValid() {
      return this.storeItem.user_phone.replace(/\D/g,"").length == 11;
    }
  },
  created(){
      this.itemGet();
  },
  methods:{
    async itemGet(){
      try{
        this.storeItem=await jQuery.post( heap.state.hostname + "Store/itemGet", { store_id: this.storeId })
      }catch(err){
        //
      }
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.storeItem[field_name]
      this.save(field_name,field_value)
    },
    async save(field_name, field_value) {
      if(field_name == 'user_phone'){
        if(!this.isPhoneValid){
          return false;
        }
        field_value = field_value.replace(/\D/g,"");
      }
      var requestData = {};
      requestData.store_id = this.storeId;
      requestData[field_name] = field_value;
      try{
        await jQuery.post( heap.state.hostname + "Store/itemUpdate", JSON.stringify(requestData))
      } catch(err){
        this.$flash("Не удалось сохранить изменение")
        this.itemGet()
      }
    },
    prepareStore(storeItem){
      if(storeItem.member_of_groups.group_types){
        var group_types_array = storeItem.member_of_groups.group_types.split(',');
        for(var i in group_types_array){
          group_types_array[i] = storeTypes[group_types_array[i]];
        }
        storeItem.store_types = group_types_array.join(', ')
      }
      return storeItem;
    },
    isPhoneValidate(ev) {
      this.storeItem.store_phone = ev.target.value;
      this.storeItem.store_phone = this.storeItem.store_phone.replace(/\D/g,"");
      if(this.storeItem.store_phone.length > 11){
        this.storeItem.store_phone = this.storeItem.store_phone.substring(0, 11);
      }
      let result = '';
      let numberIndex = 0; 
      for(let index in this.config.phoneMask){
        if(!this.storeItem.store_phone[numberIndex]){
          break;
        }
        let character = this.config.phoneMask[index];
        if(character == '0'){
          result += this.storeItem.store_phone[numberIndex];
          numberIndex++;
        } else {
          result += character
        }
      }
      this.storeItem.store_phone = result;
      return this.storeItem.store_phone;
    },
  },
}
</script>

<style>

.store-edit-page .swiper-wrapper{
    max-height: 250px;
}
</style>