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
</style>
<template>
    <base-layout :pageTitle="`Оформление заказа`"  :pageDefaultBackLink="order?`/order-${order.order_id}`:`order-list`">
        <user-address-widget :deliveryTime="deliveryTime" showComment="1"></user-address-widget>

        <ion-list v-if="order">
            <ion-item-divider>Заказ</ion-item-divider>
            <ion-item>
                <ion-icon :icon="ordersIcon" slot="start" color="primary"></ion-icon>
                Номер 
                <ion-text slot="end">#{{order?.order_id}}</ion-text>
            </ion-item>            
            <ion-item>
                <ion-icon :icon="storefrontOutline" slot="start" color="primary"></ion-icon>
                Из "{{order?.store.store_name}}"
            </ion-item>            
            <ion-item>
                <ion-textarea rows="3" placeholder="комментарий к заказу" @change="orderDescriptionChanged()" v-model="order.order_description"></ion-textarea>
            </ion-item>


            <ion-item-divider>Итог</ion-item-divider>
            <ion-item>
                <ion-icon :icon="cubeOutline" slot="start" color="primary"></ion-icon>
                Сумма заказа 
                <ion-text slot="end">{{order.order_sum_product}}{{$heap.state.currencySign}}</ion-text>
            </ion-item>
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
            <ion-item v-if="order?.order_sum_tax>0">
                <ion-icon :icon="pieChartOutline" slot="start" color="primary"></ion-icon>
                Налоги 
                <ion-text slot="end">{{order?.order_sum_tax}}{{$heap.state.currencySign}}</ion-text>
            </ion-item>
            <ion-item>
                <ion-icon :icon="rocketOutline" slot="start" color="primary"></ion-icon>
                Доставка 
                <ion-text slot="end">{{order?.order_sum_delivery??0}}{{$heap.state.currencySign}}</ion-text>
            </ion-item>
            <ion-item v-if="order?.order_sum_total>0">
                <ion-icon :icon="walletOutline" slot="start" color="primary"></ion-icon>
                Итого к оплате
                <ion-text slot="end" color="primary">{{order?.order_sum_total}}{{$heap.state.currencySign}}</ion-text>
            </ion-item>

            <ion-item-divider>Способы оплаты</ion-item-divider>
            <ion-item button @click="paymentType='payment_card'">
                <ion-icon :icon="cardOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_card">Оплата картой</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_card" value="card"  :checked="paymentType == 'payment_card'">
                </div>
            </ion-item>
            <ion-item button @click="paymentType='payment_cash'" v-if="0">
                <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_cash">Оплата наличными</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_cash" value="cash" :checked="paymentType == 'payment_cash'">
                </div>
            </ion-item>

            <ion-item lines="none">
                <ion-text style="font-size:0.9em">
                    Я согласен(на) с <a href="#/page-customer_contract" @click="$router.push('/page-customer_contract')">офертой об оказании услуг доставки</a>
                </ion-text>
                <ion-checkbox slot="end" v-model="termsAccepted"/>
            </ion-item>

        </ion-list>
        <ion-grid>
            <ion-row v-if="checkoutError">
                <ion-col>
                    <ion-card color="warning">
                        <ion-card-content>{{checkoutError}}</ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col><ion-button expand="block" color="medium" @click="cancel()">Вернуться</ion-button></ion-col>
                <ion-col><ion-button expand="block" @click="proceed()" :disabled="checkoutError">Продолжить</ion-button></ion-col>
            </ion-row>
        </ion-grid>
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
    IonCol,
    IonRow,
    IonGrid,
    IonCheckbox,
    IonCard,
    IonCardContent,
    IonBadge,
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
    IonCol,
    IonRow,
    IonGrid,
    IonCheckbox,
    IonCard,
    IonCardContent,
    IonBadge,
    },
    setup(){
        return {cardOutline,cashOutline,giftOutline,cubeOutline,walletOutline,pieChartOutline,storefrontOutline,ordersIcon,rocketOutline,documentTextOutline};
    },
    data(){
        return {
            order:null,
            promo:null,
            promoCount:0,
            deliveryTime:{},
            paymentType:'payment_card',
            termsAccepted:1,
            storeIsReady:0
        }
    },
    computed:{
        checkoutError(){
            if( !this.order ){
                return false
            }
            if(this.order.order_sum_total<this.order.order_sum_promo*2){
                return `Сумма к оплате со скидкой ${this.order.order_sum_promo}${this.$heap.state.currencySign} должна быть больше чем ${this.order.order_sum_promo*2}${this.$heap.state.currencySign}`
            }
            if(this.order.order_sum_product*1<this.order.store.store_minimal_order*1){
                return `Сумма заказа у "${this.order.store.store_name}" должна быть больше чем ${this.order.store.store_minimal_order}${this.$heap.state.currencySign}`
            }
            if(this.order.order_sum_total*1<=this.order.order_sum_delivery*1){
                return `Сумма к оплате должна быть больше чем ${this.order.order_sum_delivery}${this.$heap.state.currencySign}`
            }
            if(this.order.order_sum_total<=10){
                return `Сумма к оплате слишком маленькая`
            }
            if( this.storeIsReady==0 ){
                return `К сожалению, "${this.order.store.store_name}" не готов к заказам`
            }
            if( this.termsAccepted==0 ){
                return `К сожалению, мы не можем доставить вам заказ, без согласия с условиями`
            }
            return false
        }
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
                this.order=await jQuery.post(`${this.$heap.state.hostname}Order/itemGet`,{order_id:this.order.order_id})
                this.$heap.commit('setCurrentOrder',this.order)
            }catch{/** */}
        },
        async checkoutDataGet(){
            this.order=this.$heap.state.currentOrder;
            if( !this.order ){
                this.$flash("Заказ не найден");
                this.$router.push('/order-list')
                return
            }
            if( this.order.stage_current!="customer_confirmed" ){
                router.push('order-'+this.order.order_id);
                return;
            }
            this.storeIsReady=await this.storeReadinessCheck()
            this.deliveryTime= await this.deliveryTimeGet();
            this.promo=await this.promoGet()
            this.promoCount=await this.promoCountGet()
        },
        async storeReadinessCheck(){
            try{
                return await jQuery.post(`${this.$heap.state.hostname}Store/itemIsReady`,{store_id:this.order.order_store_id})
            } catch{
                return false
            }
        },
        async deliveryTimeGet(){
            const request={
                start_holder:'store',
                start_holder_id:this.order.order_store_id,
                finish_holder:'user',
                finish_holder_id:this.order.owner_id
            };
            try{
                const preparation=null;//use default prep time
                const distance= await jQuery.post( this.$heap.state.hostname + "Location/distanceHolderGet", request );
                return Utils.deliveryTimeCalculate(distance,preparation);
            } catch{/** */}
        },
        async orderDescriptionChanged(){
            const request={
                order_id:this.order.order_id,
                order_description:this.order.order_description
            };
            Order.api.itemUpdate(request);
        },
        async proceed(){
            if(this.paymentType=='payment_cash'){
                //
            }
            if(this.paymentType=='payment_card'){
                this.paymentFormOpen({
                    order_id:this.order.order_id,
                    order_sum_total:this.order.order_sum_total,
                    user_id:this.order.owner_id
                });
            }
        },
        async cancel(){
            // try{
            //     await Order.api.itemStageCreate(this.order.order_id, 'customer_cart');
            // } catch(err){/* */}
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
                const result= await jQuery.post( this.$heap.state.hostname + "UniPayments/paymentStatusRequest", request );
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
                    mode:'count'
                }
                return await jQuery.post(`${this.$heap.state.hostname}Promo/listGet`,request)
            }catch(err){
                //
            }
        }
    }
})
</script>