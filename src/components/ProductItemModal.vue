<style scoped>
ion-card{
    max-height: 80vh;
    overflow: auto;
}

.absent{
    filter:grayscale(1);
    
}
.incart .product_item_img{
    border: 2px solid var(--ion-color-primary) !important;
}
.deleted .product_item_img{
    border: 4px solid red;
}
.disabled .product_item_img{
    border: 4px solid #666;
}
.promo .product_item_img{
    /** */
}
.product-price{
  color: var(--ion-color-primary);
}
</style>
<template>
    <div :class="item_class">
        <ion-card class="ion-text-center">
            <img class="product_item_img" :alt="productItem.product_name" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.380.380.webp`" />
            <ion-card-header class="ion-text-left">
                <ion-card-title>{{ productItem.product_name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content class="ion-text-left">
                {{ productItem.product_description }}
                <div>
                    <div v-if="productItem.options">
                        <ion-chip v-for="option in productItem.options" :key="option.product_id" color="primary">
                        <ion-label>{{option.product_option}}</ion-label>&nbsp;<ion-label v-if="option.product_final_price>0">{{option.product_final_price}}{{$heap.state.currencySign}}</ion-label>
                        </ion-chip>
                    </div>
                    <div class="product-price ion-text-right">
                        <span>
                            <b v-if="productItem.product_net_price>0" style="font-weight: bold; margin: 5px; font-size: 1.8em">{{productItem.product_net_price}}</b>
                            <b v-else style="font-weight: bold; margin: 5px; font-size: 1.8em">{{productItem.product_final_price}}</b>
                            <b style="font-weight: bold; margin: 0; font-size: 1.5em">{{$heap.state.currencySign}}</b>
                        </span>
                        
                        <span v-if="productItem.product_unit=='порция'" style="color:var(--ion-color-medium)">
                            / {{productItem.weight_in_gramms}}г
                        </span>
                        <span v-else style="color:var(--ion-color-medium)">
                        /
                        <span v-if="productItem.product_unit=='порция'" > {{productItem.weight_in_gramms}}г</span>
                        <span v-else-if="productItem.product_unit=='порция мл'"> {{productItem.weight_in_gramms}}мл</span>
                        <span v-else-if="productItem.product_unit=='кг' && productItem.product_quantity_min<1" > {{productItem.unit_in_gramms}}г</span>
                        <span v-else> {{productItem.product_unit}}</span>
                        </span>
                    </div>
                </div>
            </ion-card-content>
        </ion-card> 
    </div>
    <ion-button fill="clear" expand="block" @click="closeModal();" color="light" size="large" >
        <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
    </ion-button>
</template>
<script>
import {
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonLabel,
  IonButton,
  modalController
}                       from '@ionic/vue'
import { 
  layersOutline,
  closeOutline
}                       from "ionicons/icons";
export default {
    components:{
        IonIcon,
        IonChip,
        IonCard,
        IonCardContent,
        IonCardTitle,
        IonCardHeader,
        IonLabel,
        IonButton
    },
    props:['productItem'],
    setup(){
        return {layersOutline, closeOutline}
    },
    computed:{
        item_class(){
            if(this.productItem.deleted_at){
                return 'deleted'
            }
            if(this.productItem.product_final_price!=this.productItem.product_price){
                return 'promo'
            }
            if(this.productItem.is_disabled==1){
                return 'disabled'
            }
            if(this.productItem.is_counted==1 && !( (this.productItem.product_quantity-this.productItem.product_quantity_reserved)>0 ) ){
                return 'absent'
            }
            return ''
        },
        discount(){
            return Math.round(this.productItem.product_final_price/this.productItem.product_price*100-100)
        },
        weight_in_gramms(){
            return this.productItem.product_weight*1000
        },
        unit_in_gramms(){
            return Math.round(this.productItem.product_quantity_min*1000)
        },
        product_price(){
            if(this.productItem.product_unit=='кг' && this.productItem.product_quantity_min<1){
                return Math.round(this.productItem.product_price*this.productItem.product_quantity_min)
            }
            return this.productItem.product_price;
        },
        product_final_price(){
            if(this.productItem.product_unit=='кг' && this.productItem.product_quantity_min<1){
                return Math.round(this.productItem.product_final_price*this.productItem.product_quantity_min)
            }
            return this.productItem.product_final_price;
        },
    },
    methods: {
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>