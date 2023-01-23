<style scoped>
    ion-list{
        box-shadow: 0px -5px 5px #eee;
    }
    .righttop_badge{
        margin-left:-10px;
        margin-top:-10px;
        position: relative;
    }
    .righttop_badge ion-badge{
        position: absolute;
    }
    .card_type{
        width:24px;
        height: auto;
    }
</style>
<template>
    <base-layout :pageTitle="`Оформление заказа`" pageDefaultBackLink="/order/order-list">
        <user-address-widget :deliveryTime="deliveryTime" showComment="1"></user-address-widget>

        <ion-list v-if="order">
            <ion-item-divider>Заказ #{{order?.order_id}} из "{{order?.store?.store_name}}"</ion-item-divider>
            <!--
            <ion-item>
                <ion-icon :icon="ordersIcon" slot="start" color="primary"></ion-icon>
                Номер 
                <ion-text slot="end">#{{order?.order_id}}</ion-text>
            </ion-item>            
            <ion-item>
                <ion-icon :icon="storefrontOutline" slot="start" color="primary"></ion-icon>
                Из "{{order?.store?.store_name}}"
            </ion-item>
            --> 
            <ion-item>
                <ion-textarea rows="2" placeholder="комментарий к заказу" @change="orderDescriptionChanged()" v-model="order.order_description"></ion-textarea>
            </ion-item>
            
            <ion-item>
                <label for="store_correction_allow" style="font-size:0.9em" color="medium">
                Разрешить изменять заказ
                </label>
                <ion-checkbox slot="end" id="store_correction_allow" v-model="storeCorrectionAllow"/>
            </ion-item>

            <ion-item-divider v-if="storeIsReady">Способы доставки</ion-item-divider>
            <ion-item button @click="tariffRuleSet(deliveryByCourierRule)" v-if="deliveryByCourierRule">
                <ion-icon :icon="rocketOutline" slot="start" color="primary"></ion-icon>
                <label for="delivery_by_courier">Доставит <b>{{$heap.state.settings.app_title}}</b></label>
                <div slot="end">
                    <input type="radio" name="deliveryBy" id="delivery_by_courier" value="courier"  :checked="deliveryByCourierRuleChecked">
                </div>
            </ion-item>
            <ion-item button @click="tariffRuleSet(deliveryByStoreRule)" v-if="deliveryByStoreRule">
                <ion-icon :icon="rocketOutline" slot="start"></ion-icon>
                <label for="delivery_by_store">Доставит <b>{{order?.store?.store_name}}</b></label>
                <div slot="end">
                    <input type="radio" name="deliveryBy" id="delivery_by_store" value="store" :checked="deliveryByStoreRuleChecked">
                </div>
            </ion-item>
            <ion-item button @click="tariffRuleSet(pickupByCustomerRule)" v-if="pickupByCustomerRule">
                <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
                <label for="pickup_by_customer">Самовывоз</label>
                <div slot="end">
                    <input type="radio" name="deliveryBy" id="pickup_by_customer" value="store" :checked="pickupByCustomerRuleChecked">
                </div>
            </ion-item> 



            <ion-item-divider v-if="storeIsReady">Способы оплаты</ion-item-divider>
            <ion-item button @click="paymentType='use_cash'" v-if="tariffRule.paymentByCash==1">
                <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_cash">Оплата наличными</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_cash" value="cash" :checked="paymentType == 'use_cash'">
                </div>
            </ion-item>
            <ion-item button @click="paymentType='use_cash_store'" v-if="tariffRule.paymentByCashStore==1">
                <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_cash_store">Оплата наличными продавцу</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_cash_store" value="cash" :checked="paymentType == 'use_cash_store'">
                </div>
            </ion-item>



            <div v-if="tariffRule.paymentByCard==1">
                <ion-item button @click="paymentType='use_card'">
                    <ion-icon :icon="cardOutline" slot="start" color="primary"></ion-icon>
                    <label for="payment_card">Оплата картой без привязки</label>
                    <div slot="end">
                        <input type="radio" name="paymentType" id="payment_card" value="card"  :checked="paymentType == 'use_card'">
                    </div>
                </ion-item>
                <ion-item v-if="bankCard?.card_type" button @click="paymentType='use_card_recurrent'">
                    <ion-img v-if="bankCard.card_type=='mir'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-img v-else-if="bankCard.card_type=='visa'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-img v-else-if="bankCard.card_type=='mastercard'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-icon v-else :src="cardOutline" slot="start" color="primary"/>
                    
                    <label for="use_card_recurrent">Оплата картой {{bankCard?.card_mask}}</label>
                    <div slot="end">
                        <input type="radio" name="paymentType" id="use_card_recurrent" value="registered_card"  :checked="paymentType == 'use_card_recurrent'">
                    </div>
                </ion-item>
                <ion-item v-if="recurrentPaymentAllow" button detail @click="$router.push('/user/user-cards')">
                    <ion-label v-if="bankCard?.card_type" color="medium">Выбрать другую карту</ion-label>
                    <ion-label v-else color="medium">Привязать карту</ion-label>
                </ion-item>
            </div>



            <ion-item-divider>Итог</ion-item-divider>
            <ion-item>
                <ion-icon :icon="cubeOutline" slot="start" color="primary"></ion-icon>
                Сумма заказа 
                <ion-text slot="end">{{order.order_sum_product}}{{$heap.state.currencySign}}</ion-text>
            </ion-item>

            <div v-if="deliveryByCourierRuleChecked">
                <ion-item v-if="promo" button @click="promoPick()" color="success">
                    <div slot="start">
                        <ion-icon :icon="giftOutline" color="primary" style="font-size:1.5em"></ion-icon>
                        <sup class="righttop_badge"><ion-badge v-if="promoCount>0" color="secondary">{{promoCount}}</ion-badge></sup>
                    </div>
                    {{promo.promo_name}}
                    <ion-text slot="end">-{{order.order_sum_promo}}{{$heap.state.currencySign}}</ion-text>
                </ion-item>
                <ion-item v-else button detail @click="promoPick()">
                    <div slot="start">
                        <ion-icon :icon="giftOutline" color="primary" style="font-size:1.5em"></ion-icon>
                        <sup class="righttop_badge"><ion-badge v-if="promoCount>0" color="secondary">{{promoCount}}</ion-badge></sup>
                    </div>
                    Выберите скидку 
                </ion-item>
            </div>
            <div v-else>
                <ion-item>
                    <div slot="start">
                        <ion-icon :icon="giftOutline" color="medium" style="font-size:1.5em"></ion-icon>
                    </div>
                    <ion-text color="medium">
                    Скидка доступна при доставке <b>{{$heap.state.settings.app_title}}</b>
                    </ion-text>
                </ion-item>
            </div>



            <ion-item v-if="order_sum_delivery>0">
                <ion-icon :icon="rocketOutline" slot="start" color="primary"></ion-icon>
                Доставка 
                <ion-text slot="end">{{order_sum_delivery??0}}{{$heap.state.currencySign}}</ion-text>
            </ion-item>
            <ion-item v-if="order_sum_total>0">
                <ion-icon :icon="walletOutline" slot="start" color="primary"></ion-icon>
                Итого к оплате
                <ion-text slot="end"><b>{{order_sum_total}}</b>{{$heap.state.currencySign}}</ion-text> 
            </ion-item>


            <ion-item lines="none">
                <ion-text style="font-size:0.9em">
                    Я согласен(на) с <router-link to="/page/rules-customer">офертой об оказании услуг доставки</router-link>
                </ion-text>
                <ion-checkbox slot="end" v-model="termsAccepted"/>
            </ion-item>

        </ion-list>

        <ion-card v-if="checkoutError" color="warning">
            <ion-card-content>{{checkoutError}}</ion-card-content>
        </ion-card>

        <ion-button v-if="paymentType=='use_card' || paymentType=='use_card_recurrent'" expand="block" @click="proceed()" :disabled="checkoutError">Оплатить картой</ion-button>
        <ion-button v-else expand="block" @click="proceed()" :disabled="checkoutError">Послать заказ</ion-button>

    </base-layout>
</template>

<script>
import Order    from '@/scripts/Order.js';
import Utils    from '@/scripts/Utils.js';
import Topic    from '@/scripts/Topic.js';
import router   from '@/router';
import jQuery   from 'jquery';

import ordersIcon   from "@/assets/icons/orders.svg";
import { 
    cardOutline,
    cashOutline,
    giftOutline,
    cubeOutline,
    walletOutline,
    pieChartOutline,
    storefrontOutline,
    rocketOutline,
    documentTextOutline
    }                           from 'ionicons/icons';
import { 
    modalController,
    IonTextarea,
    IonItemDivider,
    IonIcon,
    IonItem,
    IonList,
    IonText,
    IonButton,
    IonCheckbox,
    IonCard,
    IonCardContent,
    IonBadge,
    IonImg,
    IonLabel,
}                               from "@ionic/vue";
import UserAddressWidget        from '@/components/UserAddressWidget.vue';
import OrderPaymentCardModal    from '@/components/OrderPaymentCardModal.vue';
import PromoPickerComp          from '@/components/PromoPickerComp.vue'

export default({
    components: { 
    UserAddressWidget,
    IonTextarea,
    IonItemDivider,
    IonIcon,
    IonItem,
    IonList,
    IonText,
    IonButton,
    IonCheckbox,
    IonCard,
    IonCardContent,
    IonBadge,
    IonImg,
    IonLabel,
    },
    setup(){
        return {
            cardOutline,
            cashOutline,
            giftOutline,
            cubeOutline,
            walletOutline,
            pieChartOutline,
            storefrontOutline,
            ordersIcon,
            rocketOutline,
            documentTextOutline
            };
    },
    data(){
        return {
            order_id:this.$route.params.id,
            order:null,
            order_sum_delivery:0,

            storeCorrectionAllow:(localStorage.storeCorrectionAllow==0?0:1),

            promo:null,
            promoCount:0,
            deliveryTime:{},
            termsAccepted:1,
            storeIsReady:0,
            errNotfound:0,

            paymentType:'use_card',
            bankCard:null,
            recurrentPaymentAllow:this.$heap.state.settings?.other?.recurrentPaymentAllow==1?1:0,
            tariffRule:{},
            tariffRuleList:[],
        }
    },
    computed:{
        checkoutError(){
            if( !this.order ){
                return false
            }
            if(this.order_sum_total<this.order.order_sum_promo*2){
                return `Сумма к оплате со скидкой ${this.order.order_sum_promo}${this.$heap.state.currencySign} должна быть больше чем ${this.order.order_sum_promo*2}${this.$heap.state.currencySign}`
            }
            if(this.order.order_sum_product*1<this.order?.store?.store_minimal_order*1){
                return `Сумма заказа у "${this.order?.store?.store_name}" должна быть больше чем ${this.order?.store?.store_minimal_order}${this.$heap.state.currencySign}`
            }
            if(this.order_sum_total*1<=this.order_sum_delivery*1){
                return `Сумма к оплате должна быть больше чем ${this.order_sum_delivery}${this.$heap.state.currencySign}`
            }
            if(this.order_sum_total<=10){
                return `Сумма к оплате слишком маленькая`
            }
            if( this.storeIsReady==0 ){
                return `К сожалению, ${this.order?.store?.store_name||'продавец'} не готов к заказам`
            }
            if( this.termsAccepted==0 ){
                return `К сожалению, мы не можем доставить вам заказ, без согласия с условиями`
            }
            if( this.errNotfound==1 ){
                return `Заказ удален`
            }
            if( this.tariffRule.deliveryByCourier==1 && this.tariffRule.deliveryIsReady==0 ){
                return `К сожалению, нет доступных курьеров`;
            }
            return false
        },

        order_sum_total(){
            return this.order.order_sum_product-this.order.order_sum_promo+this.order_sum_delivery
        },

        deliveryByCourierRule(){
            return this.tariffRuleList?.filter(rule=>rule.deliveryByCourier==1).shift()
        },
        deliveryByCourierRuleChecked(){
            return this.tariffRule.deliveryByCourier==1
        },

        deliveryByStoreRule(){
            return this.tariffRuleList?.filter(rule=>rule.deliveryByStore==1).shift()
        },
        deliveryByStoreRuleChecked(){
            return this.tariffRule.deliveryByStore==1
        },

        pickupByCustomerRule(){
            return this.tariffRuleList?.filter(rule=>rule.pickupByCustomer==1).shift()
        },
        pickupByCustomerRuleChecked(){
            return this.tariffRule.pickupByCustomer==1
        }, 
    },
    mounted(){
        this.checkoutDataGet();
    },
    ionViewDidEnter(){
        this.checkoutDataGet();
    },
    methods:{
        async itemLoad(){
            try{
                this.order=await jQuery.post(`${this.$heap.state.hostname}Order/itemGet`,{order_id:this.order_id})
                if( this.order_sum_delivery==0 ){
                    this.order_sum_delivery==this.order.order_sum_delivery
                }
                this.$heap.commit('setCurrentOrder',this.order)
            }catch(err){/** */}
        },
        async checkoutDataGet(){
            this.order=this.$heap.state.currentOrder;
            if( !this.order ){
                await this.itemLoad()
            }
            if( !this.order ){
                this.$flash("Заказ не найден");
                //this.$router.push('/order/order-list')
                return
            }
            if( this.order.stage_current!="customer_confirmed" ){
                this.$router.push('order-'+this.order.order_id);
                return;
            }
            try{
                const bulkResponse=await jQuery.post(`${this.$heap.state.hostname}Order/itemCheckoutDataGet`,{order_id:this.order.order_id})
                this.deliveryTime=Utils.deliveryTimeCalculate(bulkResponse.Location_distanceHolderGet,null)
                this.promo=bulkResponse.Promo_itemLinkGet
                this.promoCount=bulkResponse.Promo_listGet
                this.storeIsReady=Array.isArray(bulkResponse.Store_deliveryOptions)?1:0
                this.bankCard=bulkResponse?.bankCard;
                this.tariffRuleList=bulkResponse.Store_deliveryOptions
                this.tariffRuleSet(this.tariffRuleList[0]||{})
            }
            catch(err){
                const exception=err?.responseJSON;
                if(!exception){
                  return false;
                }
                const exception_code=exception.messages.error;
                switch(exception_code){
                    case 'not_ready':
                    case 'no_tariff':
                        this.storeIsReady=0
                        break;
                    default:
                        this.errNotfound=1
                }
                return false
            }
        },
        tariffRuleSet( tariffRule ){
            this.tariffRule=tariffRule
            this.order_sum_delivery=tariffRule.order_sum_delivery
            this.paymentType='use_card'
            if(this.bankCard?.card_type){
                this.paymentType='use_card_recurrent'
            }
            if(tariffRule.paymentByCashStore==1){
                this.paymentType='use_cash_store'
            } else
            if(tariffRule.paymentByCash==1){
                this.paymentType='use_cash'
            }
            if(tariffRule.deliveryByCourier!=1 && this.promo!=null){
                this.promoLink({order_id:this.order_id})//unlinking promo if exists
                this.promo=null
            }
            
        },
        async orderDescriptionChanged(){
            const request={
                order_id:this.order.order_id,
                order_description:this.order.order_description
            };
            Order.api.itemUpdate(request);
        },
        async proceed(){
            const orderData={
                order_id:this.order.order_id,
                tariff_id:this.tariffRule.tariff_id,
                deliveryByStore:this.deliveryByStoreRuleChecked?1:0 ,
                deliveryByCourier:this.deliveryByCourierRuleChecked?1:0,
                pickupByCustomer:this.pickupByCustomerRuleChecked?1:0,
                paymentByCard:this.paymentType=='use_card'?1:0,
                paymentByCardRecurrent:this.paymentType=='use_card_recurrent'?1:0,
                paymentByCash:this.paymentType=='use_cash'?1:0,
                paymentByCashStore:this.paymentType=='use_cash_store'?1:0,
                storeCorrectionAllow:this.storeCorrectionAllow?1:0
            }
            localStorage.storeCorrectionAllow=this.storeCorrectionAllow?1:0;
            try{
                await jQuery.post(`${this.$heap.state.hostname}Order/itemCheckoutDataSet`,JSON.stringify(orderData))

            } catch(err){
                const exception=err?.responseJSON;
                if(!exception){
                  return false;
                }
                const exception_code=exception.messages.error;
                this.$flash("С заказом возникла проблема")
                return false
            }
            if(orderData.paymentByCard==1){
                this.paymentFormOpen({
                    order_id:this.order.order_id,
                    order_sum_total:this.order_sum_total,
                    user_id:this.order.owner_id
                });
                return;
            }
            if(orderData.paymentByCardRecurrent==1){
                const request={
                    order_id:this.order.order_id,
                    card_id:this.bankCard.card_id
                }
                try{
                    await jQuery.post(`${this.$heap.state.hostname}CardAcquirer/paymentDo`,request)
                } catch(err){
                    this.$flash("Оплата привязанной картой не удалась")
                    return false
                }
            }
            try{
                await Order.api.itemStageCreate(this.order.order_id,'customer_start');
                this.$router.push('/order/order-'+this.order.order_id);
            } catch(err){
                    const exception_code=err?.responseJSON?.messages?.error;
                    switch(exception_code){
                        case 'order_is_empty':
                            this.$alert("К сожалению, товара не осталось в наличии &#9785;","Заказ пуст");
                            break;
                        case 'address_not_set':
                            this.$flash("Необходимо добавить адрес доставки")
                            this.$topic.publish('dismissModal')
                            this.$router.push('/user/user-addresses')
                            break;
                    }
                    return false
            }
        },
        async cancel(){
            this.$router.push('order-'+this.order.order_id);
        },
        async paymentFormOpen( order_data ) {
            const self=this;
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                initialBreakpoint: 0.85,
                breakpoints: [0, 0.85, 0.95]
                });
            const dismissFn=function(){
                modal.dismiss();
            };
            Topic.on('dismissModal',dismissFn);

            modal.onDidDismiss().then(()=>{
                self.paymentStatusCheck();
            })
            return modal.present();
        },
        async paymentStatusCheck(){
            const request={
                order_id:this.order.order_id
            };
            try{
                const result= await jQuery.post( this.$heap.state.hostname + "CardAcquirer/statusGet", request );
                if(result=='OK'){
                    router.push('order-'+this.order.order_id)
                }
            } catch(err){
                this.$flash("Данный заказ не может быть оплачен");
                const message=err.responseJSON?.messages?.error;
                if(message=='wrong_status'){
                    router.push('order-'+this.order.order_id);
                }
            }
        },
        async promoPick() {
            const modal = await modalController.create({
                component: PromoPickerComp,
                showBackdrop:true,
                backdropDismiss:true,
                initialBreakpoint: 0.6,
                breakpoints: [0, 0.6, 0.75],
                // componentProps:{
                //     promo_order_id:this.order.order_id
                // },
            });
            modal.present();
            this.$topic.on('dismissModal',()=>{
                modal.dismiss();
            });
            const selectedPromo=await modal.onDidDismiss()
            this.promoLink(selectedPromo.data)
            if( selectedPromo?.data?.promo_id ){
                this.promo=selectedPromo.data
            } else {
                this.promo=null
            }
        },
        async promoLink(selectedPromo){
            try{
                const request={
                    promo_id:selectedPromo?.promo_id,
                    order_id:this.order.order_id
                }
                await jQuery.post(`${this.$heap.state.hostname}Promo/itemLink`,request)
                this.itemLoad()
            } catch(err){
                //
            }
        },
        async promoGet(){
            try{
                const request={
                    order_id:this.order.order_id
                }
                return await jQuery.post(`${this.$heap.state.hostname}Promo/itemLinkGet`,request)
            }catch(err){
                //
            }
        },
        async promoCountGet(){
            try{
                const request={
                    mode:'count',
                    type:'active',
                    user_id:this.$heap.state.user.user_id
                }
                return await jQuery.post(`${this.$heap.state.hostname}Promo/listGet`,request)
            }catch(err){
                //
            }
        },
    }
})
</script>