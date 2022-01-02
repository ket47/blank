<template>
  <base-layout page-title="Order" :page-default-back-link="'/user-orders'" page-class="order-page">
    <div class="order-block" v-if="order">
      <ion-item v-if="order.store">
          <ion-label>{{ order.store.store_name }}</ion-label>
      </ion-item>
      <div  v-for="entry in order.entries"  :key="entry.entry_id" >
        <ion-item v-if="!entry.deleted_at" >
            <ion-col size="8">
              <router-link class="link" :to="'product-'+entry.product_id">
                <ion-label>{{ entry.entry_text }}</ion-label>
              </router-link>
              <ion-label class="product-price">{{ entry.entry_price }}₽</ion-label>
            </ion-col>
            <ion-col v-if="order.order_group_id == 24" size="4">
              <product-add-buttons :product-item="entry" expanded />
            </ion-col>
        </ion-item>
      </div>
      <div class="deleted-item" v-for="entry in order.entries"  :key="entry.entry_id" >
        <ion-item v-if="entry.deleted_at">
            <ion-col size="8">
              <router-link class="link" :to="'product-'+entry.product_id">
                <ion-label>{{ entry.entry_text }}</ion-label>
              </router-link>
              <ion-label class="product-price">{{ entry.entry_price }}₽</ion-label>
            </ion-col>
            <ion-col v-if="order.order_group_id == 24" size="4">
              <ion-button @click="entryRestore(entry.entry_id)">Восстановить</ion-button>
            </ion-col>
        </ion-item>
      </div>
    </div>
    <div class="order-footer"  v-if="order">
      <ion-item>
          <ion-col  v-for="(stage_title, order_stage_code) in order.stage_next" :key="order_stage_code" >
            <ion-button @click="stageCreate(order_stage_code)" expand="block" :color="(stage_title[1]) ? 'danger' : 'primary'">{{ stage_title[0] }}</ion-button>
          </ion-col>
          <ion-col size="3">
            <h3>{{ order.order_sum_total }}₽</h3>
          </ion-col>
      </ion-item>
    </div>
  </base-layout>
</template>



<script>

import { search } from 'ionicons/icons';
import jQuery from "jquery";
import store from '../store';
import OrderScript from '../scripts/Order.js';
import ProductAddButtons from '../components/ProductAddButtons'


export default  {
  components: { ProductAddButtons },
  setup() {
    return {
      search
    }
  },
  data() {
    return { 
      order: {},
      error: "",
      sliderKey: 0
    };
  },
  methods: {
      getOrder(){
        var self = this;
        jQuery.post( store.state.hostname + "Order/itemGet", {order_id: self.$route.params.id})
          .done(function(order) {
              self.order = order;
          });
      },
      stageCreate(new_stage){
        var self = this;
        jQuery.post( store.state.hostname + "Order/itemStageCreate", {order_id: self.$route.params.id, new_stage: new_stage})
          .done(function(success) {
            if(success){
              self.getOrder();
            }
            self.error = '';
          })
          .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
      },
      entryRestore(entry_id){
        var self = this;
        jQuery.post( store.state.hostname + "Entry/itemUnDelete", {entry_id: entry_id})
          .done(function(success) {
            if(success){
              OrderScript.getUserOrders();
              self.getOrder();
            }
            self.error = '';
          })
          .fail(function(err) {
            self.error = err.responseJSON.messages.error;
        });
      }
  },
  mounted(){
    console.log(this.$route.params.id);
    this.getOrder();
  }
}
</script>

<style>


.deleted-item ion-item{
  --background: rgb(230, 230, 230)
}
.deleted-item ion-item a.link, .deleted-item ion-item ion-label{
  color: gray;
}
.order-page .product-actions{
  position: relative;
  flex-flow: row;
  flex-direction: row-reverse;
}
.order-page .order-info {
  text-align: center;
}
.order-page .order-info .order-title{
  display: block;
  width: 100%;
}
.order-page .order-price{
  visibility: visible;
  font-weight: bold;
  font-size: 35px;
  color: var(--ion-primary);
}

.order-page .swiper-wrapper{
    max-height: auto;
}

.order-footer{
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>