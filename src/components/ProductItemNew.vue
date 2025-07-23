<style scoped>

.crop-to-fit {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.crop-to-fit img{
  width: 100%;
  --min-height: 100%;
  object-fit: cover;
  z-index: 1;
  margin:1px;
}
.product-item .crop-to-fit {
  height: 250px;
}
.product-item ion-card{
  position: relative;
  margin: 0;
  box-shadow: none;
  background: transparent;
}

.absent{
    filter:grayscale(1);
    opacity: 0.5;
}
.product-item{
    border-radius: 10px;
}
.product-item.incart{
    background: linear-gradient(to top, #a3e3f7, #abfbd5);
}
.product_list_item_img{
    border: 1px solid #f5f5f5;
    height: 250px;
    width: 100%;
}
.product_list_item_img{
    border-radius: 10px;
    border: 1px solid var(--ion-color-light);
    overflow:hidden;
    align-items: center;
    justify-content: center;
    display:flex;
    position: relative;
}
.product_list_item_img .blur-image{
    position: absolute;
    z-index: 0;
    min-height:100%;
    min-width:100%;
    -filter: blur(5px);
}
.promo{
    background: linear-gradient(to top, #cff2d3, #e2feff);
}
.deleted{
    border: 4px solid red;
}
.disabled{
    border: 4px solid #666;
}
.hidden{
    border: 4px solid #fa0;
    opacity: 0.5;
}
@media screen and (max-width: 740px) {
    .product-item .crop-to-fit {
        min-height: 200px;
    }
}
</style>
<template>
    <div :class="`product-item ${item_class}`" :id="`product_list_item${productItem.product_id}`">
        <div style="position:relative" v-if="productItem.options">
            <div class="product_list_item_img" style="position:absolute;border:#9ac solid 1px;top:-4px;left:8px;z-index:-1;"></div>
            <div class="product_list_item_img" style="position:absolute;border:#cde solid 1px;top:-2px;left:4px;z-index:-1;"></div>
        </div>
        <div class="product_list_item_img" :style="productItem.options?'border:#def solid 2px;':''" @click="$go(`/catalog/product-${productItem.product_id}`)" >
            <ion-chip v-if="discount<0" style="position:absolute;right:0px;top:0px;background-color:var(--ion-color-success-tint)" outline color="success">{{discount}}%</ion-chip>
            
            <img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.10.10.png`" alt=""/>
            <div class="crop-to-fit">
                <img :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.350.350.webp`" alt=""/>
            </div>
            <div v-if="productItem.options && 0" style="position:absolute;top:3px;right:3px; z-index: 100;">
                <ion-icon :src="layersOutline" color="primary" size="large"/>
            </div>
        </div>
        <ion-card>
            <ion-card-content style="padding: 0 8px 8px ">
                <h4>
                    <span v-if="productItem.product_price*1>productItem.product_final_price*1" style="color:var(--ion-color-dark)">
                        <s>{{product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
                    </span>
                    <b style="color:var(--ion-color-primary)">
                        <span style="margin: 0; font-size: 1.4em">{{product_final_price}}</span>
                        <span style="margin: 0; font-size: 1.2em">{{$heap.state.currencySign}}</span>
                    </b>
                    /
                    <span v-if="productItem.product_unit=='порция'" style="color:var(--ion-color-medium)">{{weight_in_gramms}}г</span>
                    <span v-else-if="productItem.product_unit=='порция мл'" style="color:var(--ion-color-medium)">{{weight_in_gramms}}мл</span>
                    <span v-else-if="productItem.product_unit=='кг' && productItem.product_quantity_min<1" style="color:var(--ion-color-medium)">{{unit_in_gramms}}г</span>
                    <span v-else style="color:var(--ion-color-medium)">{{productItem.product_unit}}</span>
                </h4>
                <sub style="color:var(--ion-color-primary)">{{productItem.store?.store_name}}</sub>
                <span class="max-one-line" style="margin-bottom: 5px;font-size:10px">{{ productItem.product_name }}</span>
                <cart-add-buttons-new display="inline" buttonLayout="horizontal" :productItem="productItem"></cart-add-buttons-new>
            </ion-card-content>
        </ion-card>
    </div>
</template>
<script>
import {
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonLabel
}                        from '@ionic/vue'
import CartAddButtonsNew from '@/components/CartAddButtonsNew';
import { 
  layersOutline
}                       from "ionicons/icons";
export default {
    components:{
        IonIcon,
        IonChip,
        IonCard,
        IonCardContent,
        CartAddButtonsNew,
        IonLabel
    },
    props:['productItem'],
    setup(){
        return {layersOutline}
    },
    computed:{
        item_class(){
            if(this.productItem.deleted_at){
                return 'deleted'
            }
            if(this.productItem.is_disabled==1){
                return 'disabled'
            }
            if(this.productItem.is_hidden==1){
                return 'hidden'
            }
            if(this.productItem.is_counted==1 && !( (this.productItem.product_quantity-this.productItem.product_quantity_reserved)>0 ) ){
                return 'absent'
            }
            if(this.productItem.product_final_price!=this.productItem.product_price){
                return 'promo'
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
    }
}
</script>