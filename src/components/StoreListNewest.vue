<template>
    <ion-slides  v-if="storeList.length > 0" pager="true" :options="slideOpts" class="store-list-newest">
        <ion-slide v-for="store_item in storeList" :key="store_item.store_id" style="width: 80%">
            <ion-card>
                <router-link :to="'store-'+store_item.store_id">
                    <div class="image-container">
                        <img v-if="store_item.image_hash" :src="$heap.state.hostname + '/image/get.php/' + store_item.image_hash + '.450.450.webp'" />
                    </div>
                    <ion-card-header>
                        <ion-card-title>{{ store_item.store_name }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>{{ store_item.store_description }}</ion-card-content>
                    <ion-card-subtitle>
                        <ion-row  class="store-subinfo">
                            <ion-col v-show="store_item.willBeClosedAt">Закроется в {{ store_item.willBeClosedAt }}:00</ion-col>
                        </ion-row>
                    </ion-card-subtitle>
                </router-link>
            </ion-card>
        </ion-slide>
    </ion-slides>
</template>

<script>
import { IonSlides, IonSlide } from '@ionic/vue';
import jQuery from "jquery";
import store from '../store';

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
            storeList: []
        }
    },
    methods: {
        getStoreList(){
            var self = this;
            jQuery.post( heap.state.hostname + "Store/listGet")
                .done(function(response) {
                    self.storeList = self.prepareStoreList(response);
                })
                .fail(function(err) {
                    self.error = err.responseJSON.messages.error;
                });
        },
        prepareStoreList(storeList){
            for(var index in storeList){
                var storeItem = storeList[index];
                var date = new Date();
                storeItem.willBeClosedAt = storeItem['store_time_closes_'+date.getDay()];
                storeList[index] = storeItem;
            }
            return storeList;
        },
    },
    created(){
        this.getStoreList();
    }
};
</script>


<style>

.store-list-newest ion-slide{
    width: 80%;
    margin-bottom: 2em;
}
.store-list-newest ion-slide ion-card{
    text-align: left;
    border-radius: 15px;
}
.store-list-newest .image-container{
    max-height: 150px;
    overflow: hidden;
    border-radius: 10px;
    margin: 5px;
}
.store-list-newest ion-card-content{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 90%;
    padding: 0px 15px;
} 
.store-list-newest ion-card-subtitle{
    padding: 5px 10px 10px;
}
.store-list-newest ion-slide{
    width: 80%;
}
.store-list-newest ion-card-content img{
    min-height: 150px;
    width: auto;
    max-width: 120%;
}
.store-list-newest a{
    text-decoration: none;
    color: inherit;
}
</style>