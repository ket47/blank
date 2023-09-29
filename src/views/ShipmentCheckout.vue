<style scoped>
    ion-segment{
        --background: var(--ion-color-light);
    }
    ion-segment ion-segment-button{
        padding: 10px;
        --color: var(--ion-color-medium);
        --color-checked: #fff;
        --indicator-color: var(--ion-color-primary-shade);
    }
    ion-segment ion-segment-button ion-label{
        font-weight: bold;
        --color:#000
    }
    ion-segment ion-segment-button span{
        font-size:0.8em;
    }
</style>

<template>
    <base-layout pageTitle="Оформление вызова курьера" pageDefaultBackLink="/order/order-list" ref="page">
        <ion-list  lines="none">
            <ion-item>
                <ion-label>
                    <h1>Ваш заказ</h1>
                    <p><b>Курьер</b></p>
                </ion-label>
            </ion-item>
            <ion-item detail="" lines="none" @click="descriptionPick()">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text v-if="ship?.ship_description" color="primary">{{ship.ship_description}}</ion-text>
                <ion-text v-else color="medium">Скажите нам, что нужно перевезти?</ion-text>
            </ion-item>

            <ion-item-divider>Детали перевозки</ion-item-divider>
            <!-- <ion-item >
                <ion-label><h1>Детали перевозки</h1></ion-label>
            </ion-item> -->

            <div style="border-radius:10px;margin:10px;overflow: hidden;" v-if="0">
                <yandex-map 
                    v-if="placemarkCoords" 
                    :coords="placemarkCoords" 
                    :zoom="16" 
                    :settings="mapsettings"
                    :controls="['fullscreenControl']"
                    :behaviors="[]"
                    style="height:200px;" 
                >
                    <ymap-marker :coords="placemarkCoords" :icon="placemarkIcon" marker-id="1" :properties="placemarkProperties"/>
                </yandex-map>
            </div>



            <ion-item v-if="locationStart" button @click="locationStartSelect()">
                <ion-icon color="primary" :src="locationOutline" slot="start"/>
                <ion-text><b>Откуда:</b> {{locationStart.location_address}}</ion-text>
            </ion-item>
            <ion-item v-else button :detail-icon="addOutline" @click="locationStartSelect()">
                <ion-icon color="medium" :src="locationOutline" slot="start"/>
                <ion-text color="medium">Откуда забрать?</ion-text>
            </ion-item>

            <ion-item v-if="locationFinish" button @click="locationFinishSelect()">
                <ion-icon color="primary" :src="flagOutline" slot="start"/>
                <ion-text><b>Куда:</b> {{locationFinish.location_address}}</ion-text>
            </ion-item>
            <ion-item v-else button :detail-icon="addOutline" @click="locationFinishSelect()">
                <ion-icon color="medium" :src="flagOutline" slot="start"/>
                <ion-text color="medium">Куда отвезти?</ion-text>
            </ion-item>


            <ion-item>
                <ion-segment mode="ios" value="atonce">
                    <ion-segment-button value="atonce">
                        <ion-label>Как можно скорее</ion-label>
                        <span>отвезти сразу</span>
                    </ion-segment-button>
                    <ion-segment-button value="schedule" @click="datetimePick()">
                        <ion-label><b>Ко времени</b></ion-label>
                        <span v-if="deliveryArriveDatetimeLoc">{{deliveryArriveDatetimeLoc}}</span>
                        <span v-else>выберите день и время</span>
                    </ion-segment-button>
                </ion-segment>
            </ion-item>




            
            <ion-item-divider>Способы оплаты</ion-item-divider>
            <!-- <ion-item>
                <ion-label><h1>Способы оплаты</h1></ion-label>
            </ion-item> -->
        



            <ion-item button detail="false" @click="paymentType='use_credit_store'" v-if="tariffRule.paymentByCreditStore==1">
                <ion-icon :icon="businessOutline" slot="start" color="medium"></ion-icon>
                <label for="use_credit_store">Со счета предприятия</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_credit_store" value="cash" :checked="paymentType == 'use_credit_store'">
                </div>
            </ion-item>
            <ion-item button detail="false" @click="paymentType='use_cash'" v-if="tariffRule.paymentByCash==1">
                <ion-icon :icon="cashOutline" slot="start" color="medium"></ion-icon>
                <label for="payment_cash">Оплата наличными</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_cash" value="cash" :checked="paymentType == 'use_cash'">
                </div>
            </ion-item>

            <div v-if="tariffRule.paymentByCard==1">
                <ion-item detail="false" button @click="paymentType='use_card'">
                    <ion-icon :icon="cardOutline" slot="start" color="medium"></ion-icon>
                    <label for="payment_card">Оплата картой без привязки</label>
                    <div slot="end">
                        <input type="radio" name="paymentType" id="payment_card" value="card"  :checked="paymentType == 'use_card'">
                    </div>
                </ion-item>
                <ion-item v-if="bankCard?.card_type" button detail="false" @click="paymentType='use_card_recurrent'">
                    <ion-img v-if="bankCard.card_type=='mir'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-img v-else-if="bankCard.card_type=='visa'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-img v-else-if="bankCard.card_type=='mastercard'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-icon v-else :src="cardOutline" slot="start" color="medium"/>
                    
                    <label for="use_card_recurrent">Оплата картой {{bankCard?.card_mask}}</label>
                    <div slot="end">
                        <input type="radio" name="paymentType" id="use_card_recurrent" value="registered_card"  :checked="paymentType == 'use_card_recurrent'">
                    </div>
                </ion-item>
                <ion-item v-if="recurrentPaymentAllow" button detail @click="$go('/user/user-cards')">
                    <ion-label v-if="bankCard?.card_type" color="medium">Выбрать другую карту</ion-label>
                    <ion-label v-else color="medium">Привязать карту</ion-label>
                </ion-item>
            </div>

            <ion-item-divider>Итог</ion-item-divider>
            <!-- <ion-item >
                <ion-label><h1>Итог</h1></ion-label>
            </ion-item> -->

            <ion-item v-if="ship_sum_total>0">
                <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                Итого к оплате
                <ion-text slot="end"><b>{{ship_sum_total}}</b>{{$heap.state.currencySign}}</ion-text> 
            </ion-item>


            <ion-item>
                <ion-text style="font-size:0.9em">
                    Я согласен(на) с <router-link to="/page/rules-customer">офертой об оказании услуг доставки</router-link>
                </ion-text>
                <ion-checkbox slot="end" v-model="termsAccepted" aria-label=""></ion-checkbox>
            </ion-item>

        </ion-list>

        <ion-card v-if="checkoutError" color="warning">
            <ion-card-content>{{checkoutError}}</ion-card-content>
        </ion-card>
        <ion-card v-if="isVPNon && (paymentType=='use_card' || paymentType=='use_card_recurrent')" color="light">
            <ion-card-content>Возможно включен VPN. Банк часто блокирует платежи через VPN.</ion-card-content>
        </ion-card>
        <ion-button v-if="paymentType=='use_card' || paymentType=='use_card_recurrent'" expand="block" @click="proceed()" :disabled="checkoutError">Оплатить картой</ion-button>
        <ion-button v-else expand="block" @click="proceed()" :disabled="checkoutError">Вызвать курьера</ion-button>
















    </base-layout>
</template>
<script>
import {
    modalController,
    IonText,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonImg,
    IonCard,
    IonCardContent,
    IonButton,
    IonCheckbox,
    IonItemDivider,
}                               from '@ionic/vue'
import {
    cubeOutline,
    locationOutline,
    flagOutline,
    chevronDown,
    addOutline,
    checkmark,
    cardOutline,
    cashOutline,
    businessOutline,
    walletOutline,
}                               from 'ionicons/icons';
import {
    yandexMap,
    ymapMarker,
    loadYmap 
}                               from "vue-yandex-maps";
import Utils                    from '@/scripts/Utils'
import jQuery                   from 'jquery'
import UserAddressesModal       from '@/components/UserAddressesModal.vue';
import DateRangePicker          from '@/components/DateRangePicker.vue'
import ShipDescriptionPicker    from '@/components/ShipDescriptionPicker.vue'

export default {
    components:{
    yandexMap,
    ymapMarker,
    IonText,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonImg,
    IonCard,
    IonCardContent,
    IonButton,
    IonCheckbox,
    IonItemDivider,
    },
    setup(){
        return {
            cubeOutline,
            locationOutline,
            flagOutline,
            chevronDown,
            addOutline,
            checkmark,
            cardOutline,
            cashOutline,
            businessOutline,
            walletOutline,
        };
    },
    data(){
        return {
            presentingElement: null,
            isDatePickerOpen:false,
            deliveryArriveRange:{},
            deliveryArriveRangeHours:[],
            deliveryArriveDatetime:null,

            ship_id:this.$route.params.id,
            ship:null,
            shipAutoloadClock:null,
            ship_sum_delivery:0,
            termsAccepted:1,

            iplocation:null,
            paymentType:'use_card',
            bankCard:null,
            recurrentPaymentAllow:this.$heap.state.settings?.other?.recurrentPaymentAllow==1?1:0,
            tariffRule:{},
            tariffRuleList:[],
            errorCode:null,
            locationStart:null,
            locationFinish:null,


            mapsettings:null,
            placemarkCoords: null,
            placemarkProperties:{},
            placemarkIcon:{
                layout:'default#imageWithContent',
                content: 'some content here',
                contentLayout: '<div class="placemarkBaloon">$[properties.iconContent]</div>',
                contentOffset: [45, 10],
                imageHref:`/img/tezkel-placemark.png`,
                imageSize:[50, 50],
                imageOffset:[-25, -50]
            },
        }
    },
    computed:{
        deliveryArriveDatetimeLoc(){
            if(!this.deliveryArriveDatetime){
                return null
            }
            const event = new Date(Date.parse(this.deliveryArriveDatetime));
            const options = { month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        checkoutError(){
            if( this.errorCode=='no_input' ){
                return "Выберите адрес забора и доставки посылки"
            }
            if( this.errorCode=='no_courier' ){
                return "Нет доступных курьеров"
            }
            if( this.termsAccepted==0 ){
                return `К сожалению, мы не можем доставить вам заказ, без согласия с условиями`
            }
            return null
        },
        isVPNon(){
            if( !this.iplocation || ['UA','RU','???'].includes(this.iplocation.country_code??'???') ){
                return false
            }
            return true
        },
        ship_sum_total(){
            return this.ship_sum_delivery
        },
    },
    methods:{
        deliveryTimeAllowed( dateString ){
            const date = new Date(dateString);
            const utcDay = date.getUTCDay();
            return true;
        },
        async itemLoad(){
            this.itemCheckoutDataGet()
        },
        async itemCheckoutDataGet(){
            try{
                let bulkResponse=await Utils.prePost(`${this.$heap.state.hostname}Shipment/itemCheckoutDataGet`,{ship_id:this.ship_id})
                this.itemCheckoutDataUse(bulkResponse)
                bulkResponse=await Utils.post(`${this.$heap.state.hostname}Shipment/itemCheckoutDataGet`,{ship_id:this.ship_id})
                this.ship=bulkResponse.ship
                this.itemCheckoutDataUse(bulkResponse)
            }
            catch(err){
                this.is_checkout_data_loaded=1
                this.errorCode=err?.responseJSON?.messages?.error
                console.log(this.errorCode)
                return false
            }
        },
        async itemCheckoutDataUse(bulkResponse){
            if( !bulkResponse ){
                return
            }
            this.deliveryTime=Utils.deliveryTimeCalculate(bulkResponse.Location_distanceGet,0)
            this.deliveryArriveRange=bulkResponse.deliveryArriveRange

            this.locationStart=bulkResponse.Ship_locationStart
            this.locationFinish=bulkResponse.Ship_locationFinish
            this.bankCard=bulkResponse?.bankCard;
            this.tariffRuleList=bulkResponse.Ship_deliveryOptions
            this.tariffRuleSet(this.tariffRuleList?.[0]||{})
            this.is_checkout_data_loaded=1

            //this.customerIpLocationGet()
        },
        async itemCheckoutDataSet(){
            const shipData={
                ship_id:this.ship_id,
                ship_start_location_id:this.locationStart?.location_id,
                ship_finish_location_id:this.locationFinish?.location_id,
                ship_arrive_time:this.deliveryArriveDatetime,
                ship_description:this.ship.ship_description,
            }
            try{
                const response=await jQuery.post(`${this.$heap.state.hostname}Shipment/itemCheckoutDataSet`,JSON.stringify(shipData))
            } catch(err){
                console.log(err)
            }
        },
        tariffRuleSet( tariffRule ){
            
            this.tariffRule=tariffRule

            this.ship_sum_delivery=tariffRule.ship_sum_delivery
            this.paymentType='use_card'
            if(this.bankCard?.card_type){
                this.paymentType='use_card_recurrent'
            }
            if(tariffRule.paymentByCreditStore==1){
                this.paymentType='use_credit_store'
            } else
            if(tariffRule.paymentByCash==1){
                this.paymentType='use_cash'
            }
        },
        async locationSelect(){
            const presEl=document.querySelector('ion-router-outlet');
            const modal = await modalController.create({
                component: UserAddressesModal,
                canDismiss:true,
                backdropDismiss:true,
                keyboardClose:true,
                presentingElement:presEl
            });
            modal.present()
            const { data, role } = await modal.onWillDismiss();
            return data
        },
        async locationStartSelect(){
            this.locationStart=await this.locationSelect()
        },
        async locationFinishSelect(){
            this.locationFinish=await this.locationSelect()
        },
        async datetimePick(){
            this.deliveryArriveRange.defaultValue=this.deliveryArriveDatetime??null
            const modal = await modalController.create({
                component: DateRangePicker,
                initialBreakpoint:'0.5',
                showBackdrop:true,
                componentProps:{dateRange:this.deliveryArriveRange},
            });
            modal.present()
            const data=await modal.onDidDismiss()
            if(data.role=="confirm"){
                this.deliveryArriveDatetime=data.data
            }
        },
        async descriptionPick(){
            const ship_description=this.ship?.ship_description
            const modal = await modalController.create({
                component: ShipDescriptionPicker,
                initialBreakpoint:'0.5',
                showBackdrop:true,
                componentProps:{ship_description},
            });
            modal.present()
            const data=await modal.onDidDismiss()
            if(data.role=="confirm"){
                this.ship.ship_description=data.data
                this.itemCheckoutDataSet()
            }
        },
        async customerIpLocationGet(){
            try{
                const response = await fetch("https://geolocation-db.com/json/");
                this.iplocation = await response.json();
            }catch{/** */}
        },




        async proceed(){
            const shipData={
                ship_id:this.ship.ship_id,
                tariff_id:this.tariffRule.tariff_id,
                paymentByCard:this.paymentType=='use_card'?1:0,
                paymentByCardRecurrent:this.paymentType=='use_card_recurrent'?1:0,
                paymentByCash:this.paymentType=='use_cash'?1:0,
                paymentByCreditStore:this.paymentType=='use_credit_store'?1:0
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Order/itemCheckoutDataSet`,JSON.stringify(shipData))
            } catch(err){
                const exception=err?.responseJSON;
                if(!exception){
                  return false;
                }
                const exception_code=exception.messages.error;
                this.$flash("Не удается оформить заказ, обратитесь на горячую линию")
                this.$router.go(-1);
                return false
            }
            if(shipData.paymentByCard==1){
                this.paymentFormOpen({
                    ship_id:this.ship.ship_id,
                    ship_sum_total:this.ship_sum_total,
                    user_id:this.ship.owner_id
                });
                return;
            }
            if(shipData.paymentByCardRecurrent==1){
                const request={
                    ship_id:this.ship.ship_id,
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
                this.$router.replace('/order/order-'+this.order.order_id);
            } catch(err){
                    const exception_code=err?.responseJSON?.messages?.error;
                    switch(exception_code){
                        case 'order_is_empty':
                            this.$alert("К сожалению, товара не осталось в наличии &#9785;","Заказ пуст");
                            break;
                        case 'address_not_set':
                            this.$flash("Необходимо добавить адрес доставки")
                            this.$topic.publish('dismissModal')
                            this.$go('/modal/user-addresses')
                            break;
                    }
                    return false
            }
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
                    this.$router.replace('/order/order-'+this.order.order_id)
                }
            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='wrong_status'){
                    this.$flash("Данный заказ не может быть оплачен");
                    this.$router.replace('/order/order-'+this.order.order_id);
                }
                if(message=='not_authorized'){
                    this.$flash("Оплата не удалась, возможно не достаточно средств");
                    this.$router.replace('/order/order-'+this.order.order_id);
                }
                if(message=='waiting'){
                    this.$flash("Ваш платеж на ожидании");
                    this.$router.replace('/order/order-'+this.order.order_id);
                }
            }
        },





        // async ymapInit(locSettings){
        //     this.mapsettings={
        //         apiKey: locSettings.ymapApiKey,
        //         lang: "ru_RU",
        //         coordorder: "latlong",
        //         version: "2.1",
        //     }
        //     this.placemarkCoords=JSON.parse(locSettings.mapCenter)
        //     await loadYmap();
        // },
    },
    mounted(){
        this.itemLoad()
        let settings=this.$heap.state.settings;
        if(settings?.location){
            this.ymapInit(settings.location)
        }
        this.$topic.on('settingsGet',async settings=>{
            this.ymapInit(settings.location)
        })
        this.presentingElement = this.$refs.page.$el;
    },
    ionViewDidEnter(){
        this.itemLoad()
    }

}
</script>