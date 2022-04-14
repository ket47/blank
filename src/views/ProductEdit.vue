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
              v-model="fields.product_name" 
              name="product_name" 
              type="text" 
              :value="fields.product_name"
              @change="save('product_name', $event.target.value)" 
              placeholder="Название"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Код</ion-label>
            <ion-input 
              v-model="fields.product_code" 
              name="product_code" 
              type="text" 
              :value="fields.product_code"
              @change="save('product_code', $event.target.value)" 
              placeholder="Код"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Описание</ion-label>
            <ion-input 
              v-model="fields.product_description" 
              name="product_description" 
              type="text" 
              :value="fields.product_description"
              @change="save('product_description', $event.target.value)" 
              placeholder="Описание"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Цена</ion-label>
            <ion-input
              v-model="fields.product_price"
              name="product_price"
              type="numeric"
              :value="fields.product_price"
              @change="save('product_price', $event.target.value)"
              placeholder="Цена"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Вес кг/единица</ion-label>
            <ion-input
              v-model="fields.product_weight"
              name="product_weight"
              type="numeric"
              :value="fields.product_weight"
              @change="save('product_weight', $event.target.value)"
              placeholder="Вес кг/единица"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label color="primary">Производится</ion-label>
            <input  slot="end"
              type="checkbox" 
              @change="save('is_produced', $event.target.checked)"
              :checked="fields.is_produced"
            />
          </ion-item>

          <ion-item>
            <ion-label color="primary">Отключен</ion-label>
            <input  slot="end"
              type="checkbox" 
              @change="save('is_disabled', $event.target.checked)"
              :checked="fields.is_disabled*1"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked" color="primary">Остаток</ion-label>
            <ion-input
              v-model="fields.product_quantity"
              name="product_quantity"
              type="numeric"
              :value="fields.product_quantity"
              @change="save('product_quantity', $event.target.value)"
              placeholder="Остаток"
              required
            ></ion-input>
          </ion-item>

        </ion-list>

  </base-layout>
</template>

<script>
import jQuery from "jquery";
import heap from '../heap';
import imageSlider from '../components/imageSlider'




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
      productId: this.$route.params.id
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
      requestData.product_id = this.productId;
      requestData[field_name] = field_value;
      jQuery.post( heap.state.hostname + "Product/itemUpdate", JSON.stringify(requestData))
        .done(function() {
            self.error = '';
            self.getProduct();
        })
        .fail(function(err) {
            self.error = err.responseJSON.messages.error;
      });
    },
    getProduct(){
        var self = this;
        jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: self.productId })
            .done(function(response) {
                self.error = '';
                self.fields = response;
                self.storeId = response.store_id;
            })
            .fail(function(err) {
                self.error = err.responseJSON.messages.error;
            });
    },
    getStoreGroupTree(){
        var self = this;
        jQuery.post( heap.state.hostname + "Product/groupTreeGet", {store_id: self.fields.store_id})
            .done(function(response) {
                self.error = '';
                self.storeGroups = response;
                var first_group_id = Object.keys(self.storeGroups)[0];
                if(self.$refs.segment){
                  self.$refs.segment.value = first_group_id;
                  self.setActiveParentGroup(first_group_id);
                }
            })
            .fail(function(err) {
                self.error = err.responseJSON.messages.error;
            });
    },
    uploadImage(event) {
      let data = new FormData();
      data.append("files[]", event.target.files[0]); 
      data.set("image_holder_id", this.storeId); 
      jQuery.ajax(
          {
            url : heap.state.hostname + "Product/fileUpload",
            type: "POST",
            data : data,
            processData: false,
            contentType: false
          })
          .done(function() {
            self.error = '';
          })
          .fail(function(err) {
              self.error = err.responseJSON.messages.error;
          });
    }
  },
  created(){
      this.getProduct();
  },
  watch: {
      '$route'(currentRoute) {
          this.productId = currentRoute.params.id;
      }
  }
}
</script>

<style>

</style>