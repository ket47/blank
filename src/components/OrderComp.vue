<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="orderData">
        <ion-item detail button @click="storeOpen()" lines="none">
            <ion-avatar v-if="orderData?.store?.image_hash" slot="start">
                <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData?.store?.image_hash}.80.80.webp`" style="border-radius:100px"/>
            </ion-avatar>
            <ion-icon v-else slot="start" :icon="storefrontOutline"></ion-icon>
            <ion-label>{{orderData?.store?.store_name}}</ion-label>
        </ion-item>


        <ion-list>
            <ion-item lines="full">
                <ion-label v-if="orderData.order_id>0" color="medium">

                </ion-label>
                <ion-label v-else color="medium">
                Корзина
                </ion-label>

                <ion-chip color="primary" slot="end" v-if="orderData.stage_current_name">
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    <ion-label color="dark">{{orderData.stage_current_name}}</ion-label>
                </ion-chip>
            </ion-item>
            <ion-item v-for="entry in orderData?.entries"  :key="entry.product_id" :class="entry.deleted_at?'entry-deleted':''" lines="full" style="padding-top:10px;">
                <ion-thumbnail slot="start" v-if="entry.image_hash" @click="productOpen(entry.product_id)">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${entry.image_hash}.150.150.webp`" style="border-radius:10px"/>
                </ion-thumbnail>
                <div style="display:grid;grid-template-columns:auto 135px;width:100%;gap:5px;">
                    <div style="grid-column: 1 / span 2">
                        {{ entry.entry_text }}
                    </div>
                    <div>
                        <ion-label color="primary">
                            {{ entry.entry_price }}{{$heap.state.currencySign}}
                        </ion-label>
                    </div>
                    <div v-if="entry.product_id"  style="position:relative;min-height:40px;">
                        <cart-add-buttons v-if="isEditable" buttonLayout="horizontal" :entry="entry" :orderData="orderData"></cart-add-buttons>
                        <ion-text v-else color="primary"> 
                            <b style="font-size:16px">{{entry.entry_quantity}}</b>
                            <span v-if="entry.product_unit=='порция'"> по {{entry.product_weight*1000}}г</span>
                            <span v-else-if="entry.product_unit=='порция мл'"> по {{entry.product_weight*1000}}мл</span>
                            <span v-else> {{entry.product_unit}}</span>
                        </ion-text>
                    </div>


                    <div v-if="atCorrection" style="grid-column: 1 / span 2">
                        <ion-chip v-if="entry.entry_discount>0" color="success">
                            <ion-label @click="itemDiscountEdit(entry)">-{{entry.entry_discount}}{{$heap.state.currencySign}} скидка</ion-label>
                            <ion-icon color="medium" :src="trash" @click="itemDiscountEdit(entry,'remove')"/>
                        </ion-chip>
                        <ion-chip v-else color="success" @click="itemDiscountEdit(entry)">+ Сделать скидку</ion-chip>
                    </div>
                    <div v-else-if="entry.entry_discount>0" style="grid-column: 1 / span 2">
                        <ion-label color="success">-{{entry.entry_discount}}{{$heap.state.currencySign}} скидка</ion-label>
                    </div>

                    <div v-if="isEditable" style="grid-column: 1 / span 2">
                        <ion-chip v-if="entry.entry_comment" color="medium">
                            <ion-icon color="medium" :src="chatboxEllipsesOutline"/> <ion-note @click="itemCommentEdit(entry)">{{ entry.entry_comment }}</ion-note>
                            <ion-icon color="medium" :src="trash" @click="itemCommentEdit(entry,'remove')"/>
                        </ion-chip>
                        <ion-chip v-else color="medium"  @click="itemCommentEdit(entry)">+ Комментарий</ion-chip>
                    </div>
                    <div v-else-if="entry.entry_comment" style="grid-column: 1 / span 2">
                        <ion-icon color="medium" :src="chatboxEllipsesOutline"/> <ion-note>{{ entry.entry_comment }}</ion-note>
                    </div>

                    
                </div>
            </ion-item>
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header">
                        <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                        <ion-text color="medium">Итого: </ion-text>
                        <ion-label slot="end" color="primary"><b>{{ orderData.order_sum_total||orderTotal }}{{$heap.state.currencySign}}</b></ion-label>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item lines="none">
                            <ion-icon :icon="cubeOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Стоимость заказа: </ion-text>
                            <ion-label slot="end" color="medium">{{ orderTotal }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none" v-if="orderData.order_sum_delivery>0">
                            <ion-icon :icon="rocketOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Доставка: </ion-text>
                            <ion-label slot="end" color="medium">{{ orderData.order_sum_delivery }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none" v-if="orderData.order_sum_promo>0">
                            <ion-icon :icon="giftOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Скидка: </ion-text>
                            <ion-label slot="end" color="medium">{{ orderData.order_sum_promo }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none" v-if="orderData?.info?.payment_card_fixate_sum>0">
                            <ion-icon :icon="cardOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Предоплата: </ion-text>
                            <ion-label slot="end" color="medium"><b>{{ orderData?.info?.payment_card_fixate_sum }}{{$heap.state.currencySign}}</b></ion-label>
                        </ion-item>
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>
        </ion-list>

        <ion-card v-if="orderData?.stage_current=='supplier_start' && ['supplier','admin'].includes(orderData?.user_role)" color="medium">
            <ion-card-header>
                <ion-card-title>Фото заказа</ion-card-title>
            </ion-card-header>
            <ion-card-content>Рекомендуем делать фотографии товара до упаковки.  Ответственность, в случае претензий со стороны Покупателя к качеству и комплектности, лежит на <b>Продавце</b>.</ion-card-content>
        </ion-card>

        <ion-card color="primary"  v-if="orderData.order_description">
            <ion-card-header>
                <ion-card-title>Комментарий</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{orderData.order_description}}</ion-card-content>
        </ion-card>

        <ion-card color="warning"  v-if="orderData.order_objection">
            <ion-card-header>
                <ion-card-title>Проблема с заказом</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{orderData.order_objection}}</ion-card-content>
        </ion-card>

        <ion-card color="light"  v-if="orderData?.info?.tariff_info">
            <ion-card-header>
                <ion-card-title>Оплата и доставка</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-text v-html="orderData.info.tariff_info"></ion-text>
            </ion-card-content>
        </ion-card>

        <ion-grid>
            <ion-row>
                <ion-col  v-for="(stage_title, order_stage_code) in nextStageButtons" :key="order_stage_code" >
                    <ion-button 
                    v-if="stage_title[0]" 
                    @click="stageCreate(orderData.order_id, order_stage_code, stage_title[1])" 
                    expand="block" 
                    :color="stage_title[1]??'primary'"
                    :fill="stage_title[2]??'solid'"
                    >
                        <ion-icon slot="start" :src="stage_title.icon"></ion-icon>
                        {{ stage_title[0] }}
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
    </div>
    <div v-else>
        <ion-item detail button lines="none">
            <ion-icon slot="start" :icon="storefrontOutline"></ion-icon>
            <ion-skeleton-text animated style="width: 200px"></ion-skeleton-text>
        </ion-item>
        <ion-list>
            <ion-item v-for="i in [1,2,3]" :key="i">
                <ion-thumbnail style="background-color:var(--ion-color-light)"></ion-thumbnail>
                <ion-grid>
                    <ion-col>
                        <ion-row><ion-skeleton-text animated style="width: 100%"></ion-skeleton-text></ion-row>
                        <ion-row><ion-label color="primary"><ion-skeleton-text animated style="width: 100px"></ion-skeleton-text></ion-label></ion-row>
                    </ion-col>
                </ion-grid>
                <div slot="end" style="position:relative;width:120px;min-height:48px;background-color:var(--ion-color-light)">
                </div>
            </ion-item>
        </ion-list>
        <ion-grid>
            <ion-row>
                <ion-col  v-for="i in [1,2]" :key="i">
                    <ion-button color="light" style="width:100%"></ion-button>
                </ion-col>
            </ion-row>
        </ion-grid>
    </div>

</template>

<script>
import {
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonImg,
    IonThumbnail,
    IonNote,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonSkeletonText,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonAvatar,
    IonAccordionGroup,
    IonAccordion,
}                       from '@ionic/vue';
import { 
    add,
    remove, 
    trash, 
    rocketOutline, 
    storefrontOutline,
    checkmarkOutline,
    cubeOutline,
    walletOutline,
    banOutline,
    giftOutline,
    cardOutline,
    ribbonOutline,
    chatboxEllipsesOutline,
}                       from 'ionicons/icons';
import CartAddButtons   from '@/components/CartAddButtons.vue';
import jQuery           from "jquery";
import Order            from "@/scripts/Order.js"
export default({
    props:['orderData'],
    components: {
    CartAddButtons,
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonImg,
    IonThumbnail,
    IonNote,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonSkeletonText,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonAvatar,
    IonAccordionGroup,
    IonAccordion,
    },
    setup() {
        return { 
            add, 
            remove, 
            trash, 
            rocketOutline, 
            storefrontOutline, 
            checkmarkOutline,    
            cubeOutline, 
            banOutline,
            walletOutline,
            giftOutline,
            cardOutline,
            ribbonOutline,
            chatboxEllipsesOutline,
        };
    },
    data(){
        return {
        };
    },
    computed:{
        orderTotal(){
            let total=0;
            for(let k in this.orderData?.entries){
                let entry=this.orderData?.entries[k];
                if( !entry || !entry.entry_quantity || !entry.entry_price ){
                    continue;
                }
                total+= (entry.entry_quantity) * (entry.entry_price) - (entry.entry_discount||0);
            }
            return Math.round(total);
        },
        isEditable(){
            return this.atCorrection || this.atCart
        },
        atCorrection(){
            if( 
                (this.orderData.user_role=='supplier' || this.orderData.user_role=='admin') 
                && ['supplier_corrected'].includes(this.orderData.stage_current) 
                ){
                return true
            }
            return false;
        },
        atCart(){
            if(
                (this.orderData.user_role=='customer' || this.orderData.user_role=='admin')
                && ['customer_cart'].includes(this.orderData.stage_current) 
                ){
                return true
            }
            return false
        },
        nextStageButtons(){
            let buttons={};
            for(let i in this.orderData.stage_next){
                if(this.orderData.stage_next[i][0]){
                    buttons[i]=this.orderData.stage_next[i];
                    buttons[i].icon=checkmarkOutline
                    if(i.includes('admin')){
                        buttons[i].icon=ribbonOutline
                    } else 
                    if(i.includes('delivery')){
                        buttons[i].icon=rocketOutline
                    } else 
                    if(i.includes('supplier')){
                        buttons[i].icon=storefrontOutline
                    }
                }
            } 
            return buttons;
        },
    },
    methods:{
        storeOpen(){
            this.$go(`/catalog/store-${this.orderData.order_store_id}`);
            this.parentClose();
        },
        productOpen(product_id){
            this.$go(`/catalog/product-${product_id}`);
            this.parentClose();
        },
        parentClose(){
            this.$topic.publish('dismissModal')
        },
        stageCreate(order_id, order_stage_code, severity){
            if( severity=='danger' ){
                if(!confirm("Вы уверены?")){
                    return
                }
            }
            this.$emit('stageCreate',order_id, order_stage_code);
        },
        async itemCommentEdit(entry, mode="edit"){
            let new_comment=''
            if(mode=="edit"){
                new_comment=prompt("Комментарий к товару",entry.entry_comment??'')
                if(new_comment===null){
                    return
                }
            }
            if(this.orderData.order_id>0){
                const request={
                    order_id:entry.order_id,
                    entry_id:entry.entry_id,
                    entry_comment:new_comment
                }
                try{
                    const result=await jQuery.post( `${this.$heap.state.hostname}Entry/itemUpdate`, JSON.stringify(request) );
                    this.$emit('orderRefresh');
                }catch{/** */}
            } else {
                entry.entry_comment=new_comment
                Order.cart.entryUpdate(entry)
            }
        },
        async itemDiscountEdit(entry, mode="edit"){
            let new_discount=0
            if(mode=="edit"){
                new_discount=prompt(`Скидка на товар в ${this.$heap.state.currencySign}`,entry.entry_discount??'')??0
            }
            if(new_discount){
                new_discount=new_discount.replace(',','.').replace(/[^\d.]/img,'')
            }
            const request={
                order_id:entry.order_id,
                entry_id:entry.entry_id,
                entry_discount:new_discount
            }
            try{
                const result=await jQuery.post( `${this.$heap.state.hostname}Entry/itemUpdate`, JSON.stringify(request) );
                this.$emit('orderRefresh');
            }catch{
                this.$flash("Не удалось изменить скидку")
            }
        }
    }
})
</script>
