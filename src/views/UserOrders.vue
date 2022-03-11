<template>
  <base-layout page-title="Order" :page-default-back-link="'/user-dashboard'" page-class="orders-page">
    
        <order-slider></order-slider>





    <ion-segment  v-if="ordersEmptyCheck()">
        <ion-segment-button @click="segmentChanged($event)" :value="order_role" v-for="(order_list, order_role) in orderGroups" :key="order_role">
            <ion-label>{{ roleDef[order_role] }}</ion-label>
        </ion-segment-button>
    </ion-segment>
    <div pager="true"  class="order-list" v-if="ordersEmptyCheck()">
        <div v-for="(order_list, order_role) in orderGroups" :key="order_role" :ref="'tab-content-'+order_role" hidden>
            <ion-list v-if="order_list.length > 0">
                <ion-item v-for="order_item in order_list" :key="order_item.order_id">
                    <ion-col size="2">
                        <ion-label>{{order_item.order_id}}</ion-label>
                    </ion-col>
                    <ion-col size="5">
                        <ion-label>{{order_item.created_at}}</ion-label>
                    </ion-col>
                    <ion-col size="3">
                        <ion-label>{{order_item.order_total_sum}}</ion-label>
                    </ion-col>
                    <ion-col size="2">
                        <router-link :to="'order-'+order_item.order_id">
                            <ion-label>Открыть</ion-label>
                        </router-link>
                    </ion-col>
                </ion-item>
            </ion-list>
        </div>
    </div>
  </base-layout>
</template>

<script>
import jQuery from "jquery";

  import OrderSlider from '../components/OrderSlider';

export default{
    components: {
        OrderSlider
    },
    data(){
        return {
            error: "",
            orderGroups: {},
            roleDef: {
                'guest': 'Гостевые заказы',
                'customer': 'Заказы покупателя',
                'courier': 'Заказы курьера',
                'supplier': 'Заказы поставщика',
                'admin': 'Администратор'
            }
        }
    },
    methods: {
        segmentChanged($event){
            console.log($event.target._value);
            for(var i in this.$refs){
                this.$refs[i].hidden = true;
            }
            this.$refs['tab-content-'+$event.target._value].hidden = false;
            
        },
        getOrderList(){
            var self = this;
            jQuery.post( self.$heap.state.hostname + "Order/listPreviewGet")
                .done(function(response) {
                    self.orderGroups = response;
                })
                .fail(function(err) {
                    self.error = err.responseJSON.messages.error;
                });
        },
        ordersEmptyCheck(){
            for(var i in this.roleDef){
                if(this.orderGroups[i] && this.orderGroups[i].length > 0){
                    return true;
                }
            }
            return false;
        }
    },
    created(){
        this.getOrderList();
    },
    watch: {
        '$route'(currentRoute) {
            if(currentRoute.path == '/home'){
                this.getOrderList();
            }
        }
    }
};
</script>


<style>
.order-list .image-container{
    max-height: 150px;
    overflow: hidden;
    border-radius: 10px;
    margin: 5px;
}
.order-list ion-card-header{
    padding-bottom: 0px;
}
.order-list ion-card-content{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    padding: 0px 15px;
} 
.order-list ion-card-subtitle{
    padding: 5px 10px 10px;
}
.order-list ion-card-content img{
    min-height: 150px;
    width: auto;
    max-width: 120%;
}
.order-list ion-item{
    --padding-start: 0px;
    --padding-end-inner: 0px;
}
.order-list ion-label{
    font-size: 13px !important;
}
.order-list ion-item:last-child{
    --inner-border-width: 0;
}
.order-list a{
    text-decoration: none;
    color: inherit;
}
</style>