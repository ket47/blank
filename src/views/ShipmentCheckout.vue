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
    <base-layout pageTitle="Оформление вызова курьера" :pageDefaultBackLink="`/order/shipment-draft`" ref="page">
        <ion-list  lines="none">
            <ion-item-divider style="margin-top:0px;box-shadow:none;">Детали перевозки</ion-item-divider>
            <ion-item>
                Курьер отвезет вашу посылку
            </ion-item>
            <ion-item>
                {{order?.order_description}}
            </ion-item>


            <ion-card v-if="routePlan.deliveryDelay=='downtime'" color="light">
                <ion-card-header>
                    <ion-card-title>
                        Запланировать заказ
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p>Доставка сегодня попадает за пределы рабочего времени курьерской службы</p>
                </ion-card-content>
            </ion-card>
            <ion-card v-else-if="routePlan.deliveryDelay=='inqueue'" color="light">
                <ion-card-header>
                    <ion-card-title>
                        Высокая загруженность курьеров
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p>Исполним ваш заказ, как только освободятся курьеры</p>
                </ion-card-content>
            </ion-card>
            <ion-item>
                <ion-segment mode="ios" v-model="deliveryStartMode">
                    <ion-segment-button value="atonce" :disabled="isAtonceDisabled" @click="deliveryStartScheduled=null">
                        <ion-label>Отвезти сразу</ion-label>
                        <span>как можно скорее</span>
                    </ion-segment-button>
                    <ion-segment-button value="schedule" @click="datetimePick()">
                        <ion-label><b>Запланировать</b></ion-label>
                        <span v-if="deliveryStartLocal">{{deliveryStartLocal}}</span>
                        <span v-else>выберите день и время</span>
                    </ion-segment-button>
                </ion-segment>
            </ion-item>




            
            <ion-item-divider>Способы оплаты</ion-item-divider>
            <!-- <ion-item>
                <ion-label><h1>Способы оплаты</h1></ion-label>
            </ion-item> -->
        


            <ion-radio-group v-model="paymentType">
            <ion-item button detail="false" @click="paymentType='use_credit_store'" v-if="tariffRule.paymentByCreditStore==1">
                <ion-icon :icon="businessOutline" slot="start" color="medium"></ion-icon>
                <ion-radio value="use_credit_store">
                    Со счета предприятия
                    <div style="font-size:0.7em;color:var(--ion-color-medium)">{{tariffRule.storeCreditName}} {{tariffRule.storeCreditBalance}}{{$heap.state.currencySign}}</div>                        
                </ion-radio>
            </ion-item>
            <ion-item button detail="false" @click="paymentType='use_cash'" v-if="tariffRule.paymentByCash==1">
                <ion-icon :icon="cashOutline" slot="start" color="medium"></ion-icon>
                <ion-radio value="use_cash">
                    Оплата наличными
                </ion-radio>
            </ion-item>

            <div v-if="tariffRule.paymentByCard==1">
                <ion-item detail="false" button @click="paymentType='use_card'">
                    <ion-icon :icon="cardOutline" slot="start" color="medium"></ion-icon>
                    <ion-radio value="use_card">
                        Оплата картой
                    </ion-radio>
                </ion-item>
                <ion-item v-if="bankCard?.card_type" button detail="false" @click="paymentType='use_card_recurrent'">
                    <ion-img v-if="bankCard.card_type=='mir'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-img v-else-if="bankCard.card_type=='visa'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-img v-else-if="bankCard.card_type=='mastercard'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                    <ion-icon v-else :src="cardOutline" slot="start" color="medium"/>
                    <ion-radio value="use_card_recurrent">
                        Оплата картой
                    </ion-radio>
                </ion-item>
                <ion-item v-if="recurrentPaymentAllow" button detail @click="$go('/user/user-cards')">
                    <ion-label v-if="bankCard?.card_type" color="medium">Выбрать другую карту</ion-label>
                    <ion-label v-else color="medium">Привязать карту</ion-label>
                </ion-item>
            </div>
            </ion-radio-group>

            <ion-item-divider>Итог</ion-item-divider>
            <ion-accordion-group value="total">
                <ion-accordion value="total">
                    <ion-item slot="header" >
                        <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                        <ion-text color="medium">Итого: </ion-text>
                        <ion-label slot="end" color="primary">{{ tariffRule.deliverySum }}{{$heap.state.currencySign}}</ion-label>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item lines="none">
                            <ion-icon :icon="rocketOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Вызов курьера</ion-text>
                            <ion-label slot="end" color="medium">{{ tariffRule.deliveryCost }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none">
                            <ion-icon :icon="mapOutline" slot="start" color="medium"></ion-icon>
                            <ion-text color="medium">Расстояние по карте {{ deliveryDistanceKm }}км</ion-text>
                            <ion-label slot="end" color="medium">{{ deliveryFeeTotal }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>

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
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonCheckbox,
    IonItemDivider,
    IonRadioGroup,
    IonRadio,
    IonAccordion,
    IonAccordionGroup,
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
    alertCircleOutline,
    mapOutline,
    rocketOutline
}                               from 'ionicons/icons';
import Utils                    from '@/scripts/Utils'
import jQuery                   from 'jquery'
import DateRangePicker          from '@/components/DateRangePicker.vue'
import OrderPaymentCardModal    from '@/components/OrderPaymentCardModal.vue'

export default {
    components:{
    // yandexMap,
    // ymapMarker,
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
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonCheckbox,
    IonItemDivider,
    IonRadioGroup,
    IonRadio,
    IonAccordion,
    IonAccordionGroup,
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
            alertCircleOutline,
            mapOutline,
            rocketOutline,
        };
    },
    data(){
        return {
            order_id:this.$route.params.id,
            order:null,
            arrivalRange:null,
            bankCard:null,
            routePlan:{},
            tariffRule:{},
            tariffRuleList:[],
            errorCode:null,
            paymentType:'use_card',

            shipAutoloadClock:null,
            termsAccepted:1,
            iplocation:null,
            recurrentPaymentAllow:0,

            deliveryStartScheduled:null,
            deliveryStartMode:'atonce'
        }
    },
    computed:{
        deliveryStartLocal(){
            if(!this.deliveryStartScheduled){
                return null
            }
            const options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric' };
            const d = new Date(Date.parse(this.deliveryStartScheduled));
            return d.toLocaleDateString(undefined, options);
        },
        isAtonceDisabled(){
            return ['downtime','inqueue'].includes(this.routePlan.deliveryDelay)
        },
        deliveryFeeTotal(){
            return Math.round(this.tariffRule.deliveryFee*this.deliveryDistanceKm) || 0
        },
        deliveryDistanceKm(){
            return Math.round(this.routePlan.deliveryDistance/100)/10 || 0
        },
        checkoutError(){
            if( this.errorCode=='no_input' ){
                return "Выберите адрес забора и доставки посылки"
            }
            if( this.errorCode=='start_center_toofar' ){
                return "Адрес получения посылки слишком удален"
            }
            if( this.errorCode=='finish_center_toofar' ){
                return "Адрес доставки посылки слишком удален"
            }
            if( this.errorCode=='start_finish_toofar' ){
                return "Дальность доставки слишком большая"
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
    },
    methods:{
        async itemLoad(){
            this.itemCheckoutDataGet()
        },
        async itemCheckoutDataGet( with_arrival_range=0 ){
            try{
                const request={
                    order_id:this.order_id,
                    with_arrival_range
                }
                const bulkResponse=await Utils.post(`${this.$heap.state.hostname}Shipment/itemCheckoutDataGet`,request)
                if( !bulkResponse ){
                    return
                }
                this.order=bulkResponse.order
                this.routePlan=bulkResponse.routePlan
                this.arrivalRange=bulkResponse.arrivalRange??null
                this.bankCard=bulkResponse?.bankCard;
                this.tariffRuleList=bulkResponse.deliveryOptions
                this.tariffRuleSet(this.tariffRuleList?.[0]||{})
                //this.customerIpLocationGet()

                if( ['downtime','inqueue'].includes(this.routePlan.deliveryDelay) ){
                    this.deliveryStartMode='schedule'
                    this.deliveryStartScheduled=this.arrivalRange.nearest
                }
            }
            catch(err){
                this.errorCode=err?.responseJSON?.messages?.error
                if( this.errorCode =='notfound' || this.errorCode =='forbidden' ){
                    this.$flash('Заказ не найден')
                    this.$router.go(-1)
                }
                return false
            }
        },
        tariffRuleSet( tariffRule ){
            this.tariffRule=tariffRule
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
        async datetimePick(){
            this.deliveryStartMode='schedule'
            if( !this.arrivalRange ){
                await this.itemCheckoutDataGet(1)
            }
            const modal = await modalController.create({
                component: DateRangePicker,
                presentingElement:this.$refs.page.$el,
                initialBreakpoint:'0.5',
                showBackdrop:true,
                componentProps:{dateRange:this.arrivalRange.range,defaultDatetime:this.arrivalRange.nearest},
            });
            modal.present()
            const data=await modal.onDidDismiss()
            if(data.role=="confirm"){
                this.deliveryStartScheduled=data.data
            } else {
                this.deliveryStartMode='atonce'
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
                order_id:this.order.order_id,
                tariff_id:this.tariffRule.tariff_id,
                deliveryStartScheduled:this.deliveryStartScheduled,
                paymentByCard:this.paymentType=='use_card'?1:0,
                paymentByCardRecurrent:this.paymentType=='use_card_recurrent'?1:0,
                paymentByCash:this.paymentType=='use_cash'?1:0,
                paymentByCreditStore:this.paymentType=='use_credit_store'?1:0
            }
            try{
                await jQuery.post(`${this.$heap.state.hostname}Shipment/itemCheckoutDataSet`,JSON.stringify(shipData))
            } catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                if(!exception_code){
                  return false;
                }
                switch(exception_code){
                    case 'payment_already_done':
                        this.$flash("Уже оплачен")
                        this.$go(`/order/shipment-${this.order.order_id}`)
                        return
                }
                this.$flash("Не удается оформить заказ, обратитесь на горячую линию")
                //this.$router.go(-1);
                return false
            }
            if(shipData.paymentByCard==1){
                this.paymentFormOpen({
                    order_id:`${this.order_id}-s`,
                    order_sum_total:this.tariffRule.deliverySum,
                    user_id:this.order.owner_id
                });
                return;
            }
            if(shipData.paymentByCardRecurrent==1){
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
                const request={
                    order_id:this.order.order_id,
                    new_stage:'customer_start'
                }
                await jQuery.post(`${this.$heap.state.hostname}Shipment/itemStageCreate`,request)
                //this.$router.replace('/order/shipment-'+this.order.order_id);
            } catch(err){
                    const exception_code=err?.responseJSON?.messages?.error;
                    switch(exception_code){
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
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                initialBreakpoint: 0.85,
                breakpoints: [0, 0.85, 0.95]
            });
            this.$topic.on('dismissModal',()=>{
                modal.dismiss();
            });
            modal.present()
            await modal.onDidDismiss()
            this.paymentStatusCheck()
        },
        async paymentStatusCheck(){
            const request={
                order_id:`${this.order.order_id}-s`
            };
            try{
                const result= await jQuery.post( this.$heap.state.hostname + "CardAcquirer/statusGet", request );
                if(result=='OK'){
                    this.$router.replace('/order/shipment-'+this.order.order_id)
                }
            } catch(err){
                const message=err.responseJSON?.messages?.error;
                if(message=='wrong_status'){
                    this.$flash("Данный заказ не может быть оплачен");
                    this.$router.replace('/order/shipment-'+this.order.order_id);
                }
                if(message=='not_authorized'){
                    this.$flash("Оплата не удалась, возможно не достаточно средств");
                    this.$router.replace('/order/shipment-'+this.order.order_id);
                }
                if(message=='waiting'){
                    this.$flash("Ваш платеж на ожидании");
                    this.$router.replace('/order/shipment-'+this.order.order_id);
                }
            }
        },
    },
    mounted(){
        this.itemLoad()
    },
    ionViewDidEnter(){
        this.itemLoad()
    }
}
</script>