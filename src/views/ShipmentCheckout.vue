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
    <base-layout pageTitle="Оформление доставки посылки" :pageDefaultBackLink="`/order/shipment-${order_id}`" ref="page">

        <ion-list  lines="none">
            <ion-item-divider style="margin-top:0px;margin-bottom:10px;box-shadow:none;">Доставка</ion-item-divider>
            <!-- <ion-item>
                Курьер отвезет вашу посылку
            </ion-item>
            <ion-item>
                {{order?.order_description}}
            </ion-item> -->
            <ion-card v-if="tariffRule.routePlan?.start_plan_mode=='scheduled'" color="light">
                <ion-card-content>
                    <div style="display:grid;grid-template-columns:30% 70%">
                        <div><img src="../assets/icons/sleeping_wolf.png" style="height:60px"/></div>
                        <div>
                            Курьерская служба сейчас не работает. 
                            Доставим, когда Вам будет удобно.
                        </div>
                    </div>
                </ion-card-content>
            </ion-card>
            <ion-item>
                <ion-segment mode="ios" v-model="deliveryPlanMode">
                    <ion-segment-button v-if="isAtonceEnabled" value="inited" @click="deliveryFinishScheduled=null">
                        <ion-icon :icon="rocketOutline"></ion-icon>
                        <ion-label>Отвезти сразу</ion-label>
                        <span>как можно скорее</span>
                    </ion-segment-button>
                    <ion-segment-button v-else value="awaited" @click="deliveryFinishScheduled=null">
                        <ion-icon :icon="timeOutline"></ion-icon>
                        <ion-label>Подождать</ion-label>
                        <span>заказ в очереди</span>
                    </ion-segment-button>
                    <ion-segment-button value="scheduled" @click="datetimePick()">
                        <ion-icon :icon="alarmOutline"></ion-icon>
                        <ion-label><b>Запланировать</b></ion-label>
                        <span v-if="deliveryFinishLocal">{{deliveryFinishLocal}}</span>
                        <span v-else>выберите день и время</span>
                    </ion-segment-button>
                </ion-segment>
            </ion-item>
            <ion-item-divider>Оплата</ion-item-divider>
            <ion-radio-group v-model="paymentType">
                <div>

                <ion-item v-if="tariffRule.paymentByCreditStore==1" button detail="false" @click="paymentType='use_credit_store'">
                    <ion-icon :icon="businessOutline" slot="start" color="medium"></ion-icon>
                    <ion-radio value="use_credit_store">
                        Со счета предприятия
                        <div style="font-size:0.7em;color:var(--ion-color-medium)">{{tariffRule.storeCreditName}} {{tariffRule.storeCreditBalance}}{{$heap.state.currencySign}}</div>                        
                    </ion-radio>
                </ion-item>                    
                </div>

<!-- 
                NODE INSERT ERROR OCCURS <ion-item v-if="tariffRule.paymentByCash==1" button detail="false" @click="paymentType='use_cash'">
                    <ion-icon :icon="cashOutline" slot="start" color="medium"></ion-icon>
                    <ion-radio value="use_cash">
                        Оплата наличными
                    </ion-radio>
                </ion-item> -->

                <div v-if="tariffRule.paymentByCard==1">
                    <ion-item v-if="sbpPaymentAllow" detail="false" button>
                        <ion-img style="width:22px;height: auto;" :src="`/img/icons/card-sbp.svg`" slot="start"/>
                        <ion-radio value="use_card_sbp">
                            СБП быстрая оплата
                        </ion-radio>
                    </ion-item>
                    <ion-item detail="false" button>
                        <ion-icon :icon="cardOutline" slot="start" color="medium"></ion-icon>
                        <ion-radio value="use_card">
                            Банковская карта
                        </ion-radio>
                    </ion-item>
                    <ion-item v-if="bankCardCalc?.card_type" button detail="false">
                        <ion-img v-if="bankCardCalc.card_type" style="width:22px;height: auto;" :src="`/img/icons/card-${bankCardCalc.card_type.toLowerCase()}.svg`" slot="start"/>
                        <ion-icon v-else :src="cardOutline" slot="start" color="medium"/>
                        <ion-radio value="use_card_recurrent">
                            Сохраненная карта {{bankCardCalc.label}}
                        </ion-radio>
                    </ion-item>
                    <ion-item v-if="bankCardCalc?.card_type" button detail @click="$go('/user/user-cards')">
                        <ion-label color="medium">Выбрать другую карту</ion-label>
                    </ion-item>
                    <ion-item v-else-if="recurrentPaymentAllow" button detail @click="$go('/user/user-cards')">
                        <ion-icon :icon="addOutline" slot="start" color="medium"></ion-icon>
                        <ion-label color="medium">Добавить карту</ion-label>
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
        <!-- <ion-card v-else-if="deliveryPlanMode=='awaited'" color="light" @click="heavyLoadInfo()">
            <ion-card-content>
                <p v-if="deliveryPlanMode=='awaited'">Высокая загруженность</p>
                 Планируемое время доставки {{deliveryFinishRange}} <ion-icon :src="alertCircleOutline" color="warning"/>.
            </ion-card-content>
        </ion-card> -->
        <ion-button v-if="paymentType=='use_card' || paymentType=='use_card_recurrent'" expand="block" @click="proceed()" :disabled="checkoutError">Оплатить картой</ion-button>
        <ion-button v-else expand="block" @click="proceed()" :disabled="checkoutError">Вызвать курьера</ion-button>
    </base-layout>
</template>
<script>
import {
    alertController,
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
    rocketOutline,
    alarmOutline,
    timeOutline,
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
            alarmOutline,
            timeOutline,
        };
    },
    data(){
        return {
            order_id:this.$route.params.id,
            order:null,
            finishPlanSchedule:null,
            bankCard:null,
            routePlan:{
                start_plan_mode:'inited'
            },
            tariffRule:{},
            tariffRuleList:[],
            errorCode:null,
            paymentType:'use_card',

            shipAutoloadClock:null,
            termsAccepted:1,
            iplocation:null,
            recurrentPaymentAllow:this.$heap.state.settings?.other?.recurrentPaymentAllow==1?1:0,
            sbpPaymentAllow:this.$heap.state.settings?.other?.sbpPaymentAllow==1?1:0,

            deliveryFinishScheduled:null,
            deliveryPlanMode:'inited',

            is_checkout_data_loaded:0,
        }
    },
    computed:{
        deliveryFinishLocal(){
            if(!this.deliveryFinishScheduled){
                return null
            }
            const options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric' };
            const d = new Date(Date.parse(this.deliveryFinishScheduled));
            return d.toLocaleDateString(undefined, options);
        },
        deliveryFinishRange(){
            const finish_plan=this.routePlan.start_plan*1+this.routePlan.finish_arrival*1
            if( !finish_plan ){
                return null
            }
            const delta=900//round to 15 minutes
            const finish_plan_from=Math.floor(finish_plan/delta)*delta
            const finish_plan_to=finish_plan_from+delta
            const from = new Date(finish_plan_from*1000);
            const to   = new Date(finish_plan_to*1000);
            try{
                return `${from.getHours()}:${String(from.getMinutes()).padStart(2, '0')}-${to.getHours()}:${String(to.getMinutes()).padStart(2, '0')}`
            } catch{/***/}
            return null
        },
        isAtonceEnabled(){
            return ['inited'].includes(this.routePlan.start_plan_mode)
        },
        deliveryFeeTotal(){
            return Math.round(this.tariffRule.deliveryFee*this.deliveryDistanceKm) || 0
        },
        deliveryDistanceKm(){
            return Math.round(this.routePlan.deliveryDistance/100)/10 || 0
        },
        checkoutError(){
            // if( this.routePlan.start_plan_mode=='nocourier' ){
            //     return `К сожалению, нет доступных курьеров`;
            // }
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
            if( this.paymentType=='use_credit_store' && this.tariffRule.storeCreditBalance<this.tariffRule.deliverySum ){
                return `На счету предприятия не достаточно средств`
            }
            return null
        },
        isVPNon(){
            if( !this.iplocation || ['UA','RU','???'].includes(this.iplocation.country_code??'???') ){
                return false
            }
            return true
        },
        bankCardCalc(){
            let card=this.bankCard;
            if( card && card.card_type ){
                card.label=`${card.card_type.toUpperCase()} (**** ${card.card_mask.split('*').pop()})`
            }
            return card;
        }
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
                if( bulkResponse.order.stage_current!=='customer_confirmed' ){
                    this.$go(`/order/shipment-${this.order_id}`)
                }
                this.order=bulkResponse.order
                this.routePlan=bulkResponse.routePlan
                this.bankCard=bulkResponse?.bankCard;


                this.tariffRuleList=bulkResponse.deliveryOptions
                this.tariffRuleSet(this.tariffRuleList?.[0]||{})
                this.deliveryPlanMode=this.routePlan.start_plan_mode
                if( this.routePlan.start_plan_mode=='nocourier' ){
                    this.deliveryPlanMode='awaited'
                }

                if( bulkResponse.finishPlanSchedule ){
                    this.finishPlanSchedule=bulkResponse.finishPlanSchedule
                    this.deliveryFinishScheduled=bulkResponse.finishPlanSchedule.nearest
                } else {
                    this.finishPlanSchedule=null
                    this.deliveryFinishScheduled=null
                }
                //this.customerIpLocationGet()
            }
            catch(err){
                this.errorCode=err?.responseJSON?.messages?.error
                if( this.errorCode =='notfound' || this.errorCode =='forbidden' ){
                    this.$flash('Заказ не найден')
                    this.$router.go(-1)
                }
            }
            this.is_checkout_data_loaded=1
        },
        tariffRuleSet( tariffRule ){
            this.tariffRule=tariffRule
            this.paymentType='use_card'
            if(this.bankCard?.card_type){
                this.paymentType='use_card_recurrent'
            }
            if( tariffRule.paymentByCreditStore==1 && this.tariffRule.storeCreditBalance>=this.tariffRule.deliverySum ){
                this.paymentType='use_credit_store'
            } else
            if(tariffRule.paymentByCash==1){
                this.paymentType='use_cash'
            } else
            if(tariffRule.paymentByCard==1){
                this.paymentType='use_card'
                if(this.sbpPaymentAllow){
                    this.paymentType='use_card_sbp'
                }
            }
        },
        async datetimePick(){
            if( !this.finishPlanSchedule ){
                await this.itemCheckoutDataGet(1)
            }
            const modal = await modalController.create({
                component: DateRangePicker,
                presentingElement:this.$refs.page.$el,
                initialBreakpoint:'0.6',
                showBackdrop:true,
                componentProps:{dateRange:this.finishPlanSchedule.range,defaultDatetime:this.finishPlanSchedule.nearest},
            });
            modal.present()
            this.deliveryPlanMode='scheduled'
            const data=await modal.onDidDismiss()
            if(data.role=="confirm"){
                this.deliveryFinishScheduled=data.data
            } else {
                this.deliveryFinishScheduled=null
                this.deliveryPlanMode=this.routePlan.start_plan_mode
            }
        },
        // async customerIpLocationGet(){
        //     try{
        //         const response = await fetch("https://geolocation-db.com/json/");
        //         this.iplocation = await response.json();
        //     }catch{/** */}
        // },

        async proceed(){
            const shipData={
                order_id:this.order.order_id,
                tariff_id:this.tariffRule.tariff_id,
                deliveryFinishScheduled:this.deliveryFinishScheduled,
                paymentByCard:['use_card','use_card_sbp'].includes(this.paymentType),
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
                    case 'credit_balance_low':
                        this.$flash("Не достаточно средств на счету")
                        return
                }
                this.$flash("Не удается оформить заказ, обратитесь на горячую линию")
                //this.$router.go(-1);
                return false
            }
            if(shipData.paymentByCard==1){
                this.paymentFormOpen({
                    order_id:`${this.order_id}`,
                    payment_type:this.paymentType
                });
                return;
            }
            if(shipData.paymentByCardRecurrent==1){
                const request={
                    order_id:this.order.order_id,
                    card_id:this.bankCard.card_id
                }
                try{
                    this.$flash("Оплачиваем привязанной картой...")
                    await jQuery.post(`${this.$heap.state.hostname}CardAcquirer/paymentDo`,request)
                    this.paymentStatusCheck()
                } catch(err){
                    this.$flash("Оплата привязанной картой не удалась")
                    return false
                }
            }
            if(shipData.paymentByCreditStore==1){
                this.$router.replace('/order/shipment-'+this.order.order_id);
            }
        },
        async heavyLoadInfo(){
            const alert = await alertController.create({
                //header: 'Высокая загруженность',
                message:'Время приблизительное. Готовность заказа, погода, пробки могут задержать доставку.',
                buttons: [
                  {
                    text: 'Ок',
                    role: 'confirm',
                  },
                ],
            });
            await alert.present();
            const { role } = await alert.onDidDismiss();
            if( role=='confirm' ){
                return true
            }
            return false
        },
        async paymentFormOpen( order_data ) {
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                initialBreakpoint: 0.4,
                breakpoints: [0, 0.4]
            });
            this.$topic.on('dismissModal',()=>{
                modal && modal.dismiss();
            });
            modal.present()
            await modal.onDidDismiss()
            this.paymentStatusCheck()
        },
        async paymentStatusCheck(){
            const request={
                order_id:`${this.order.order_id}`
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
                } else
                if(message=='not_authorized'){
                    this.$flash("Оплата не прошла");
                    this.$router.replace('/order/shipment-'+this.order.order_id);
                } else
                if(message=='waiting'){
                    this.$flash("Ваш платеж на ожидании");
                    this.$router.replace('/order/shipment-'+this.order.order_id);
                } else {
                    this.$flash("Оплата картой не удалась");
                }
            }
        },
    },
    mounted(){
        this.itemLoad()
    },
    ionViewDidEnter(){
        this.itemLoad()
    },
    created(){
        this.$topic.on('userMainPaymentMethodSet',()=>{
            this.can_load_at=0
            this.itemLoad()
        })        
        this.$topic.on('settingsGet',(settings)=>{
            this.can_load_at=0
            this.recurrentPaymentAllow=settings?.other?.recurrentPaymentAllow
            this.sbpPaymentAllow=settings?.other?.sbpPaymentAllow
        })        
    },
}
</script>