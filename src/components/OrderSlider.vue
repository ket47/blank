<template>
    <ion-slides pager="true" :options="slideOpts" class="order-list" v-if="ordersEmptyCheck()">
        <ion-slide v-for="(order_list, order_role) in orderGroups" :key="order_role">
            <ion-card  v-if="order_list.length > 0">
                <ion-card-header>
                    <ion-card-title>{{ roleDef[order_role] }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-list>
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
                        <ion-item>
                            <ion-col size="8"></ion-col>
                            <ion-col size="4">
                                <router-link :to="'order-'">
                                    <ion-label>Посмотреть все</ion-label>
                                </router-link>
                            </ion-col>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
            </ion-card>
        </ion-slide>
    </ion-slides>
</template>

<script>
import { IonSlides, IonSlide } from '@ionic/vue';
import jQuery from "jquery";


const slideOpts = {  
    slidesPerView: 'auto',
    centeredSlides: false, 
    initialSlide: 0,
    speed: 400,
    grabCursor: true,
    touchStartForcePreventDefault: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
};

export default{
    components: { IonSlides, IonSlide },
    setup() {
       return { 
           slideOpts 
        }
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
    computed:{
        
    },
    methods: {
        getOrderList(){
            var self = this;
            jQuery.post( self.$store.state.hostname + "Order/listPreviewGet")
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
.order-list{
    background: linear-gradient(to left, #2a2135, #442475);
}
.order-list ion-slide{
    width: 80%;
    margin-bottom: 2em;
}
.order-list ion-slide ion-card{
    text-align: left;
    border-radius: 15px;
    width: 100%;
}
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