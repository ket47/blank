<style scoped >

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
.product-item{
    border-radius: 10px;
    padding: 2px;
    height: 100%;
    display: grid;
    position: relative;
}
.product-item .crop-to-fit {
    height: 220px;
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
.product-item.incart{
    background: linear-gradient(to top, #a3e3f7, #abfbd5);
}
.incart .product-image{
    border: 2px solid #a3e3f7;
}
.product-image{
    border: 2px solid #f5f5f5;
}
.product-image{
    height: 200px;
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--ion-color-light);
    overflow:hidden;
    align-items: center;
    justify-content: center;
    display:flex;
    position: relative;
}
.product-image .blur-image{
    position: absolute;
    z-index: 0;
    min-height:100%;
    min-width:100%;
    -filter: blur(5px);
}

.product-item .bonus-container{
    position: absolute;
    top: 10px;
    left: 5px;
    z-index: 10;
}
.product-item .bonus-container .bonus-chip{
    background: #23b94f;
    color: white;
    padding: 4px 6px 4px 8px;
    border-radius: 10px;
    font-size: 1.3em;
    transform: rotate(-15deg);
}
.product-item .bonus-container .bonus-chip img{
    vertical-align: top; 
    filter: drop-shadow(0px 1px 2px #000);
}
.product-item .bonus-container .bonus-chip b{
    text-shadow: 0px 1px 3px #000000d9;
}
.product-price b{
    color: var(--ion-color-primary);
}

.promo{
    background: linear-gradient(to top, #cff2d3, #e2feff);
}
.promo .product-price b{
    color: #eb1e5c;
}
.deleted .product-image{
    border-color: 0 0 0 1px red;
}
.disabled.product-image{
    border-color: 0 0 0 1px #666;
}
.hidden{
    opacity: 0.5;
}
.hidden .product-image{
    border-color: #fa0;
}

.ribbon-container{
  position: absolute;
  right: -4px;
  height: 100%;
  top: 0;
  display: grid;
  align-content: baseline;
  pointer-events: none;
  z-index: 12;
}
.ribbon-container .ribbon{
  padding: 5px 10px 5px 0px;
  color: white;
  position: relative;
  height: 22px;
  font-size: 11px;
  margin-top: 10px;
  filter: drop-shadow(-2px 3px 2px #00000052);
  text-transform: uppercase;
  text-align: center;
  border-top-right-radius: 3px;
  min-width: 90px;
}
.ribbon-container .ribbon::before {
  height: 0;
  width: 0;
  right: 100%;
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 11px;
  top: 0;
}
.ribbon-container .ribbon::after {
  height: 0;
  width: 0;
  right: 0;
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 8px 8px 8px 0px;
  top: 100%;
}
.ribbon-container .ribbon.ribbon-orange{
  background: linear-gradient(to right, #ff7800, #fb4319);
}
.ribbon-container .ribbon.ribbon-orange::before {
  border-color: #ff7800 #ff7800 #ff7800 transparent;
}
.ribbon-container .ribbon.ribbon-orange::after {
  border-color: #a02d13 transparent transparent;
}
.ribbon-container .ribbon.ribbon-blue{
  background: linear-gradient(to right, #1ea0eb, #036eac);
}
.ribbon-container .ribbon.ribbon-blue::before {
  border-color: #1ea0eb #1ea0eb #1ea0eb transparent;
}
.ribbon-container .ribbon.ribbon-blue::after {
  border-color: #064274 transparent transparent;
}
.ribbon-container .ribbon.ribbon-purple{
  background: linear-gradient(to right, #eb1e5c, #a0123c);
}
.ribbon-container .ribbon.ribbon-purple::before {
  border-color: #eb1e5c #eb1e5c #eb1e5c transparent;
}
.ribbon-container .ribbon.ribbon-purple::after {
  border-color: #740c2b transparent transparent;
}
@media screen and (max-width: 740px) {
    .product-item .crop-to-fit {
        min-height: 180px;
    }
}
</style>
<template>
    <div :class="`product-item ${item_class}`" :id="`product_list_item${productItem.product_id}`">
        <div @click="$go(`/catalog/product-${productItem.product_id}`)" >
            <div v-if="product_ribbons.length > 0" class="ribbon-container">
                <div v-for="(ribbon, ribbon_index) in product_ribbons" :key="`ribbon_index${ribbon_index}`"  :class="`ribbon ribbon-${ribbon.color}`" >
                <span>{{ ribbon.label }}</span>
                </div>
            </div>
            <div v-if="product_bonusgain > 0" class="bonus-container">
                <div class="bonus-chip"><b>+{{ product_bonusgain }}</b> <img src="/img/crystal.png" width="14px"/></div>
            </div>
            <div class="product-image" :style="productItem.options?'border-color:#def;':''">
                <img class="blur-image" :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.10.10.png`" alt=""/>
                <div class="crop-to-fit">
                    <img :src="`${$heap.state.hostname}image/get.php/${productItem.image_hash}.350.350.webp`" alt=""/>
                </div>
                <div v-if="productItem.options" style="position: absolute; bottom: 3px; left: 0px; z-index: 100">
                    <ion-chip color="primary" style="margin-left: 0; border-top-left-radius: 0; border-bottom-left-radius: 0;">
                        <ion-label style="font-size: 12px; color: var(--ion-color-primary)"><b>Есть варианты</b></ion-label>
                        <ion-icon :src="layersOutline" color="primary"/>
                    </ion-chip>
                </div>
            </div>
            <ion-card>
                <ion-card-content style="padding: 4px 8px 8px ">
                    <div>
                        <h4 class="product-price">
                            <b >
                                <span style="font-size: 1.1em">{{product_final_price}} {{$heap.state.currencySign}}</span>
                            </b>
                            <span v-if="productItem.product_price*1>productItem.product_final_price*1" style="color:var(--ion-color-medium); margin-left: 5px;">
                                <s style="font-size: 0.9em">{{product_price}}{{$heap.state.currencySign}}</s>&nbsp;&nbsp;
                            </span>
                            <b v-if="discount != '0'" >
                                <span style="font-size: 0.9em">{{discount}}%</span>
                            </b>
                        </h4>
                        <sub v-if="productItem.store?.store_name" style="color:var(--ion-color-primary)">{{productItem.store?.store_name}}</sub>
                    </div> 
                    <div style="font-size:12px;">
                        <span class="max-two-lines" style="margin-bottom: 5px;">
                            {{ productItem.product_name }} 
                            <b v-if="productItem.product_unit !== 'шт'">
                                <span v-if="productItem.product_unit=='порция' && weight_in_gramms != 0" style="color:var(--ion-color-medium)">({{weight_in_gramms}}г)</span>
                                <span v-else-if="productItem.product_unit=='порция мл' && weight_in_gramms != 0" style="color:var(--ion-color-medium)">{{weight_in_gramms}}мл</span>
                                <span v-else-if="productItem.product_unit=='кг' && productItem.product_quantity_min < 1" style="color:var(--ion-color-medium)">{{unit_in_gramms}}г</span>
                                <span v-else style="color:var(--ion-color-medium)">{{productItem.product_unit}}</span>
                            </b>
                        </span>
                    </div> 
                    <div style="font-size:12px; display: flex; justify-content: space-between;">
                        <div>
                            <div v-if="product_reaction" class="rating" style="text-align: right; font-size: 13px">
                                <ion-icon :icon="star" style=" font-size: 15px; vertical-align: sub; margin-right: 2px;" color="warning"></ion-icon>
                                <b> {{ product_reaction }}</b>
                            </div>
                        </div>
                        <div v-if="product_comment">
                            <span>{{ product_comment }}</span>
                        </div>   
                    </div>  
                </ion-card-content>
            </ion-card>
        </div>
        <div style="align-self: end; padding: 5px;" v-if="item_class != 'deleted' && item_class != 'disabled' && item_class != 'hidden' && item_class != 'absent'">
            <cart-add-buttons-new display="inline" buttonLayout="horizontal" :productItem="productItem"></cart-add-buttons-new>
        </div>
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
  star,
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
        return {
            star,
            layersOutline
        }
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
        product_reaction(){
            return Math.round(this.product_perks.find((item) => item.perk_type == 'product_reaction')?.perk_value * 5 * 10) / 10
        },
        product_comment(){
            const count = this.product_perks.find((item) => item.perk_type == 'product_comment')?.perk_value ?? 0
            if(count == 0) return false
            const lastDigit = count % 10;
            const lastTwoDigits = count % 100;
            if (lastDigit === 1 && lastTwoDigits !== 11) {
                return `${count} отзыв`;
            } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
                return `${count} отзыва`;
            } else {
                return `${count} отзывов`;
            }
        },
        product_bonusgain(){
            return this.product_perks.find((item) => item.perk_type == 'product_bonusgain')?.perk_value
        },
        product_ribbons(){
            var result = []
            const ribbonConf = {
                product_top: {
                    color: "orange",
                    label: "Хит продаж"
                },
                product_new: {
                    color: "blue",
                    label: "Новинка"
                },
                product_promo: {
                    color: "purple",
                    label: "Акция"
                }
            }
            for(let i in this.product_perks){
                if(ribbonConf[this.product_perks[i].perk_type]){
                    result.push(ribbonConf[this.product_perks[i].perk_type])
                }
            }
            return result
        },
        product_perks() {
            var perks = []
            if(this.productItem?.perk_types == null || this.productItem?.perk_values == null){
                return perks
            }
            const perksRaw = this.productItem?.perk_types.split(',')
            const perksValues = this.productItem?.perk_values.split(',')
            
            for(var i in perksRaw){
                perks.push({
                    perk_type: perksRaw[i],
                    perk_value: perksValues[i] ?? ''
                })
            }
            return perks
        }
    },
}
</script>