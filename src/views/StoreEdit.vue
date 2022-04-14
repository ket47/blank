<template>
  <base-layout page-title="Мой магазин"  :page-default-back-link="'/store-'+this.storeId" :errorMessage="error" page-class="store-edit-page">
        <ion-list>
          
          <image-slider :imageList="fields.images" :key="sliderKey"/>
          <ion-item>
            <ion-label position="stacked" color="primary">Загрузить изображение</ion-label>
            <input type="file" accept="image/*" @change="uploadImage($event)" id="file-input">
          </ion-item>
          <ion-item>
            <ion-label position="stacked" color="primary">Название</ion-label>
            <ion-input 
              v-model="fields.store_name_new" 
              name="store_name_new" 
              type="text" 
              :value="fields.store_name_new"
              @change="save('store_name_new', $event.target.value)" 
              placeholder="Название"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Описание</ion-label>
            <ion-input 
              v-model="fields.store_description_new" 
              name="store_description_new" 
              type="text" 
              :value="fields.store_description_new"
              @change="save('store_description_new', $event.target.value)" 
              placeholder="Описание"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Предприятие</ion-label>
            <ion-input 
              v-model="fields.store_company_name_new" 
              name="store_company_name_new" 
              type="text" 
              :value="fields.store_company_name_new"
              @change="save('store_company_name_new', $event.target.value)" 
              placeholder="Предприятие"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked" color="primary">Телефон</ion-label>
            <ion-input
              v-model="fields.store_phone"
              name="store_phone"
              type="numeric"
              inputmode="tel"
              :value="fields.store_phone"
              @input="$event.target.value = phoneValidate($event);"
              @change="save('store_phone', $event.target.value)"
              placeholder="7(978)-000-00-00"
              spellcheck="false"
              autocapitalize="off"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Электронная почта</ion-label>
            <ion-input 
              v-model="fields.store_email" 
              name="store_email" 
              type="email" 
              :value="fields.store_email"
              @change ="save('store_email', $event.target.value)" 
              placeholder="Электронная почта"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-row>
              <ion-col>
                <ion-label position="stacked" color="primary">Мин. заказ</ion-label>
                <ion-input
                  v-model="fields.store_minimal_order"
                  name="store_minimal_order"
                  type="numeric"
                  :value="fields.store_minimal_order"
                  @change="save('store_minimal_order', $event.target.value)"
                  placeholder="Мин. заказ"
                  required
                ></ion-input>
              </ion-col>
              <ion-col>
                <ion-label position="stacked" color="primary">Подготовка заказа</ion-label>
                <ion-input
                  v-model="fields.store_time_preparation"
                  name="store_time_preparation"
                  type="numeric"
                  :value="fields.store_time_preparation"
                  @change="save('store_time_preparation', $event.target.value)"
                  placeholder="Подготовка заказа"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Время работы</ion-label>
            <ion-row>
              <ion-col size="12">
                <ion-label position="stacked" color="primary">Понедельник</ion-label>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_opens_0"
                  name="store_time_opens_0"
                  type="numeric"
                  :value="fields.store_time_opens_0"
                  @change="save('store_time_opens_0', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_0"
                  name="store_time_closes_0"
                  type="numeric"
                  :value="fields.store_time_closes_0"
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
                  v-model="fields.store_time_opens_1"
                  name="store_time_opens_1"
                  type="numeric"
                  :value="fields.store_time_opens_1"
                  @change="save('store_time_opens_1', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_1"
                  name="store_time_closes_1"
                  type="numeric"
                  :value="fields.store_time_closes_1"
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
                  v-model="fields.store_time_opens_2"
                  name="store_time_opens_2"
                  type="numeric"
                  :value="fields.store_time_opens_2"
                  @change="save('store_time_opens_2', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_2"
                  name="store_time_closes_2"
                  type="numeric"
                  :value="fields.store_time_closes_2"
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
                  v-model="fields.store_time_opens_3"
                  name="store_time_opens_3"
                  type="numeric"
                  :value="fields.store_time_opens_3"
                  @change="save('store_time_opens_3', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_3"
                  name="store_time_closes_3"
                  type="numeric"
                  :value="fields.store_time_closes_3"
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
                  v-model="fields.store_time_opens_4"
                  name="store_time_opens_4"
                  type="numeric"
                  :value="fields.store_time_opens_4"
                  @change="save('store_time_opens_4', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_4"
                  name="store_time_closes_4"
                  type="numeric"
                  :value="fields.store_time_closes_4"
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
                  v-model="fields.store_time_opens_5"
                  name="store_time_opens_5"
                  type="numeric"
                  :value="fields.store_time_opens_5"
                  @change="save('store_time_opens_5', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_5"
                  name="store_time_closes_5"
                  type="numeric"
                  :value="fields.store_time_closes_5"
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
                  v-model="fields.store_time_opens_6"
                  name="store_time_opens_6"
                  type="numeric"
                  :value="fields.store_time_opens_6"
                  @change="save('store_time_opens_6', $event.target.value)"
                  placeholder="Открыто"
                  required
                ></ion-input>
              </ion-col>
              <ion-col size="6">
                <ion-input
                  v-model="fields.store_time_closes_6"
                  name="store_time_closes_6"
                  type="numeric"
                  :value="fields.store_time_closes_6"
                  @change="save('store_time_closes_6', $event.target.value)"
                  placeholder="Закрыто"
                  required
                ></ion-input>
              </ion-col>
            </ion-row>
          </ion-item>

        </ion-list>

  </base-layout>
</template>

<script>
import jQuery from "jquery";
import heap from '../heap';
import imageSlider from '../components/imageSlider'



var storeTypes = {
  'foodstore': 'Продуктовый магазин',
  'restaraunt': 'Ресторан'
};

export default  {
  name: 'SignIn',
  components: { imageSlider },
  data(){
    return {
      error: '',
      submitted: false,
      config: {
        phoneMask: '+0(000)-000-00-00'
      },
      fields: [],
      storeId: this.$route.params.id,
      storeItem: [],
      storeProducts: [] ,
      storeGroups: [],
    }
  },
  computed: {
    phoneValid() {
      return this.fields.user_phone.replace(/\D/g,"").length == 11;
    }
  },
  methods:{
    save(field_name, field_value) {
      var self = this;
      this.submitted = true;
      if(field_name == 'user_phone'){
        if(!this.phoneValid){
          return false;
        }
        field_value = field_value.replace(/\D/g,"");
      }
      var requestData = {};
      requestData.store_id = this.storeId;
      requestData[field_name] = field_value;
      jQuery.post( heap.state.hostname + "Store/itemUpdate", JSON.stringify(requestData))
        .done(function() {
            self.getStore();
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
      });
    },
    passwordReset(){
      var self = this;
      var requestData = {
        user_phone: this.fields.user_phone.replace(/\D/g,""),
        user_email: this.fields.user_email,
        user_name: this.fields.user_name,
      };
      jQuery.post( heap.state.hostname + "User/passwordReset", requestData)
        .done(function(response) {
            self.error = response;
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
    },
    getStore(){
        var self = this;
        jQuery.post( heap.state.hostname + "Store/itemGet", { store_id: self.storeId })
            .done(function(response) {
                self.fields = self.prepareStore(response);
                self.storeId = response.store_id;
            })
            .fail(function(err) {
                self.error = err.responseJSON.messages.error;
            });
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
    phoneValidate(ev) {
      this.fields.store_phone = ev.target.value;
      this.fields.store_phone = this.fields.store_phone.replace(/\D/g,"");
      if(this.fields.store_phone.length > 11){
        this.fields.store_phone = this.fields.store_phone.substring(0, 11);
      }
      let result = '';
      let numberIndex = 0; 
      for(let index in this.config.phoneMask){
        if(!this.fields.store_phone[numberIndex]){
          break;
        }
        let character = this.config.phoneMask[index];
        if(character == '0'){
          result += this.fields.store_phone[numberIndex];
          numberIndex++;
        } else {
          result += character
        }
      }
      this.fields.store_phone = result;
      return this.fields.store_phone;
    }, 
    uploadImage(event) {
      let data = new FormData();
      data.append("files[]", event.target.files[0]); 
      data.set("image_holder_id", this.storeId); 
      jQuery.ajax(
          {
            url : heap.state.hostname + "Store/fileUpload",
            type: "POST",
            data : data,
            processData: false,
            contentType: false
          })
          .fail(function(err) {
              self.error = err.responseJSON.messages.error;
          });
    }
  },
  created(){
      this.getStore();
  },
  watch: {
      '$route'(currentRoute) {
          this.storeId = currentRoute.params.id;
      }
  }
}
</script>

<style>

.store-edit-page .swiper-wrapper{
    max-height: 250px;
}
</style>