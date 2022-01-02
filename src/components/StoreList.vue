<template>
    <ion-list class="store-list">
        <ion-card class="store-item" v-for="store_item in storeList" :key="store_item.store_id">
                <router-link :to="'store-'+store_item.store_id">
                    <img class="store-image" v-if="store_item.image_hash" :src="$store.state.hostname + '/image/get.php/' + store_item.image_hash + '.450.450.webp'" />
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
    </ion-list>

    
</template>

<script>
import { 
    IonList,
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle 
} from '@ionic/vue';
import jQuery from "jquery";
import store from '../store';


export default {
    components: { 
        IonList,
        IonCardContent, 
        IonCardHeader, 
        IonCardSubtitle, 
        IonCardTitle 
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
            jQuery.post( store.state.hostname + "Store/listGet")
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

.store-list a{
    text-decoration: none;
    color: inherit;
}
.store-item{
    visibility: visible;
    padding: 15px;
    margin: 0;
    box-shadow: none;
}
.store-item ion-card-header{
    padding: 10px;
}
.store-item ion-card-subtitle{
    padding: 0px 5px;
}
.store-image{
    border-radius: 10px;
}
</style>