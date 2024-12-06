<style scoped>
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
<base-layout :pageTitle="`Оформление заказа из ${order?.store?.store_name||''}`" :pageDefaultBackLink="`/order/order-${order_id}`" ref="page">
    <div v-if="is_checkout_data_loaded">


        <ion-list lines="none" v-if="isNoFatalError">




            <ion-item-divider style="margin-top:0px;box-shadow:none;">Доставка</ion-item-divider>
            <ion-radio-group v-model="deliveryType">
                <ion-item button detail="false" @click="tariffRuleSet(deliveryByCourierRule)" v-if="deliveryByCourierRule">
                    <!-- <ion-icon :icon="rocketOutline" slot="start" color="medium"></ion-icon> -->
                    <ion-radio value="delivery_by_courier">Доставит <b>{{$heap.state.settings?.app_title}}</b></ion-radio>
                </ion-item>
                <ion-item button detail="false" @click="tariffRuleSet(deliveryByStoreRule)" v-if="deliveryByStoreRule">
                    <!-- <ion-icon :icon="rocketOutline" slot="start" color="medium"></ion-icon> -->
                    <ion-radio value="delivery_by_store">
                        Доставит <b>{{order?.store?.store_name}}</b> <a @click.stop="$go(`/modal/store-dmethods-${order?.store?.store_id}`)">(условия)</a>
                    </ion-radio>
                </ion-item>
                <ion-item button detail="false" @click="tariffRuleSet(pickupByCustomerRule)" v-if="pickupByCustomerRule">
                    <!-- <ion-icon :icon="storefrontOutline" slot="start" color="medium"></ion-icon> -->
                    <ion-radio value="pickup_by_customer">Самовывоз</ion-radio>
                </ion-item>
            </ion-radio-group>
            <div v-if="tariffRule?.routePlan" class="ion-padding-top ion-padding-bottom">
                <ion-card v-if="tariffRule.routePlan?.start_plan_mode=='scheduled'" color="light">
                    <ion-card-content>
                        <p>Продавец или курьерская служба уже не работают.</p> <p>Вы можете выбрать время доставки.</p>
                    </ion-card-content>
                </ion-card>
                <div></div>
                <ion-item>
                    <ion-segment mode="ios" v-model="routePlanMode">
                        <ion-segment-button v-if="tariffRule.routePlan?.start_plan_mode=='inited'" value="inited" @click="deliveryFinishScheduled=null">
                            <ion-label>Привезти сразу</ion-label>
                            <span>как можно скорее</span>
                        </ion-segment-button>
                        <ion-segment-button v-else-if="tariffRule.routePlan?.start_plan_mode=='awaited'" value="awaited" @click="deliveryFinishScheduled=null">
                            <ion-label>Подождать</ion-label>
                            <span>заказ в очереди</span>
                        </ion-segment-button>
                        <ion-segment-button value="scheduled" @click="datetimePick()">
                            <ion-label><b>Запланировать</b></ion-label>
                            <span v-if="routePlanLocal">{{routePlanLocal}}</span>
                            <span v-else>выберите день и время</span>
                        </ion-segment-button>
                    </ion-segment>
                </ion-item>
            </div>
            <order-checkout-address v-if="deliveryType=='delivery_by_store' || deliveryType=='delivery_by_courier'" :deliveryTime="deliveryTime" deliveryAddressOnly="1" :nextRoute="`/modal/order-checkout-${order_id}`"></order-checkout-address>

            <!-- <ion-item  v-if="deliveryType=='delivery_by_store'" button detail="" @click="$go(`/modal/store-dmethods-${order?.store?.store_id}`)">
                <ion-icon :icon="documentTextOutline" slot="start" color="medium"></ion-icon>
                <ion-text style="font-size:0.9em" color="medium">
                    Условия доставки {{order?.store?.store_name}}
                </ion-text>
            </ion-item> -->



            <ion-item-divider v-if="storeIsReady">Оплата</ion-item-divider>
            <ion-radio-group v-model="paymentType">
                <ion-item button detail="false" v-if="tariffRule.paymentByCash==1">
                    <ion-icon :icon="cashOutline" slot="start" color="medium"></ion-icon>
                    <ion-radio value="use_cash">Наличными курьеру</ion-radio>
                </ion-item>
                <ion-item button detail="false" v-if="tariffRule.paymentByCashStore==1">
                    <ion-icon :icon="cashOutline" slot="start" color="medium"></ion-icon>
                    <ion-radio value="use_cash_store">Наличными продавцу</ion-radio>
                </ion-item>
                <div v-if="tariffRule.paymentByCard==1">
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
            <div v-if="deliveryByCourierRuleChecked && (paymentType=='use_card' || paymentType=='use_card_recurrent')">
                <ion-item v-if="promo" button @click="promoPick()" color="success">
                    <div slot="start">
                        <ion-icon :icon="giftOutline" color="medium" style="font-size:1.5em"></ion-icon>
                        <sup class="righttop_badge"><ion-badge v-if="promoCount>0" color="secondary">{{promoCount}}</ion-badge></sup>
                    </div>
                    {{promo.promo_name}}
                    <ion-text slot="end">-{{order.order_sum_promo}}{{$heap.state.currencySign}}</ion-text>
                </ion-item>
                <ion-item v-else button detail @click="promoPick()">
                    <div slot="start">
                        <ion-icon :icon="giftOutline" color="medium" style="font-size:1.5em"></ion-icon>
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
                    Скидка доступна при доставке <b>{{$heap.state.settings?.app_title}}</b> и оплате картой
                    </ion-text>
                </ion-item>
            </div>
           <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header">
                        <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                        <ion-text>Итого к оплате</ion-text>
                        <ion-label slot="end" color="primary"><b>{{ order_sum_total }}{{$heap.state.currencySign}}</b></ion-label>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item>
                            <ion-icon :icon="cubeOutline" slot="start" color="medium"></ion-icon>
                            Сумма заказа 
                            <ion-text slot="end">{{order.order_sum_product}}{{$heap.state.currencySign}}</ion-text>
                        </ion-item>
                        <ion-item v-if="order_sum_delivery>0">
                            <ion-icon :icon="rocketOutline" slot="start" color="medium"></ion-icon>
                            <div>
                                Доставка
                                <div v-if="tariffRule.deliveryHeavyCost" style="font-size:0.75em;color:#666">{{order_sum_delivery-tariffRule.deliveryHeavyCost}}+{{tariffRule.deliveryHeavyCost}} (непогода или высокая загруженность)</div>
                            </div>
                            <ion-text slot="end">{{order_sum_delivery??0}}{{$heap.state.currencySign}}</ion-text>
                        </ion-item>
                        <ion-item v-if="promo" button>
                            <div slot="start">
                                <ion-icon :icon="giftOutline" color="medium" style="font-size:1.5em"></ion-icon>
                            </div>
                            {{promo.promo_name}}
                            <ion-text slot="end">-{{order.order_sum_promo}}{{$heap.state.currencySign}}</ion-text>
                        </ion-item>
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>

            <ion-item v-if="deliveryType=='delivery_by_courier'">
                <ion-text style="font-size:0.9em">
                    Я согласен(на) с <router-link to="/page/rules-customer">офертой об оказании услуг доставки</router-link>
                </ion-text>
                <ion-checkbox slot="end" v-model="termsAccepted" aria-label=""></ion-checkbox>
            </ion-item>
            <ion-item v-else>
                <ion-text style="font-size:0.9em">
                    Я согласен(на) с <router-link :to='`/modal/store-dmethods-${order?.store?.store_id}`'>с условиями доставки {{order?.store?.store_name}}</router-link>
                </ion-text>
                <ion-checkbox slot="end" v-model="termsAccepted" aria-label=""></ion-checkbox>
            </ion-item>
        </ion-list>

        <ion-card v-if="checkoutError" color="warning">
            <ion-card-content>{{checkoutError}}</ion-card-content>
        </ion-card>

        <ion-button v-if="!isNoFatalError" expand="block" @click="$router.replace('/order/order-'+order_id)">Назад</ion-button>
        <ion-button v-else-if="routePlanMode=='scheduled' && !deliveryFinishScheduled" expand="block" @click="datetimePick()" color="medium">Выбрать время</ion-button>
        <ion-button v-else-if="paymentType=='use_card' || paymentType=='use_card_recurrent'" expand="block" @click="proceed()" :disabled="checkoutError">Оплатить заказ</ion-button>
        <ion-button v-else expand="block" @click="proceed()" :disabled="checkoutError">Заказать</ion-button>
    </div>
    <div v-else>
        <ion-item lines="none">
            <ion-skeleton-text animated style="width: 200px"></ion-skeleton-text>
        </ion-item>
        <ion-list>
            <ion-item v-for="i in [1,2,3,4,5]" :key="i">
                <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
            </ion-item>
        </ion-list>
        <ion-button color="light" expand="block"></ion-button>
    </div>
</base-layout>
</template>

<script>
import Order    from '@/scripts/Order.js';
import Topic    from '@/scripts/Topic.js';
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
    documentTextOutline,
    addOutline,
    }                           from 'ionicons/icons';
import { 
    alertController,
    modalController,
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
    IonSkeletonText,
    IonRadioGroup,
    IonRadio,
    IonAccordion,
    IonAccordionGroup,
    IonSegmentButton,
    IonSegment,
}                               from "@ionic/vue";
import OrderCheckoutAddress     from '@/components/OrderCheckoutAddress.vue';
import OrderPaymentCardModal    from '@/components/OrderPaymentCardModal.vue';
import PromoPickerComp          from '@/components/PromoPickerComp.vue'
import DateRangePicker          from '@/components/DateRangePicker.vue'

//import { Browser } from '@capacitor/browser';

export default({
    components: { 
    OrderCheckoutAddress,
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
    IonSkeletonText,
    IonRadioGroup,
    IonRadio,
    IonAccordion,
    IonAccordionGroup,
    IonSegmentButton,
    IonSegment,
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
            documentTextOutline,
            addOutline,
            };
    },
    data(){
        return {
            is_checkout_data_loaded:0,
            can_load_at:0,

            order_id:this.$route.params.id,
            order:{},
            order_sum_delivery:0,

            storeCorrectionAllow:1,//(localStorage.storeCorrectionAllow==0?0:1),

            promo:null,
            promoCount:0,
            deliveryTime:{},
            termsAccepted:1,
            storeIsReady:null,
            errNotfound:0,
            errTooFar:0,
            errNoTariff:0,

            paymentType:'use_card',
            deliveryType:'delivery_by_courier',
            bankCard:null,

            tariffRule:{},
            tariffRuleList:[],
            recurrentPaymentAllow:this.$heap.state.settings?.other?.recurrentPaymentAllow==1?1:0,

            deliveryFinishScheduled:null,
            routePlanMode:'inited',
            scheduleRange:null,
        }
    },
    computed:{
        routePlanLocal(){
            if(!this.deliveryFinishScheduled){
                return null
            }
            const options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric' };
            const d = new Date(Date.parse(this.deliveryFinishScheduled));
            return d.toLocaleDateString(undefined, options);
        },
        // routePlanRange(){
        //     const finish_plan=this.routePlan.start_plan*1+this.routePlan.finish_arrival*1
        //     if( !finish_plan ){
        //         return null
        //     }
        //     const delta=900//round to 15 minutes
        //     const finish_plan_from=Math.floor(finish_plan/delta)*delta
        //     const finish_plan_to=finish_plan_from+delta
        //     const from = new Date(finish_plan_from*1000);
        //     const to   = new Date(finish_plan_to*1000);
        //     try{
        //         return `${from.getHours()}:${String(from.getMinutes()).padStart(2, '0')}-${to.getHours()}:${String(to.getMinutes()).padStart(2, '0')}`
        //     } catch{/***/}
        //     return null
        // },
        isAtonceEnabled(){
            return ['inited'].includes(this.routePlan.start_plan_mode)
        },
        isNoFatalError(){
            return !(this.errTooFar==1 || this.storeIsReady==0 || this.errNoTariff==1 || this.errNotfound==1)
        },
        checkoutError(){
            if( !this.order ){
                return false
            }
            if(this.$heap.state.user?.location_main?.is_default==1){
                return `Нужно указать адрес, куда доставить заказ`;
            }
            if( this.errTooFar==1 ){
                return "Адрес доставки заказа вне зоны обслуживания"
            }
            if( this.errNotfound==1 ){
                return `Заказ удален`
            }
            if( this.storeIsReady==0 ){
                return `К сожалению, ${this.order?.store?.store_name||'продавец'} сейчас не принимает заказы`
            }
            if( this.errNoTariff==1 ){
                return `К сожалению, ${this.order?.store?.store_name||'продавец'} отключен`
            }
            if( this.termsAccepted==0 ){
                return `К сожалению, мы не можем доставить вам заказ, без согласия с условиями`
            }
            if(this.promo){
                const min_order_sum_product=this.promo?.min_order_sum_product??0;
                if( this.order.order_sum_product*1<min_order_sum_product*1 ){
                    return `Сумма заказа со скидкой в ${this.order.order_sum_promo}${this.$heap.state.currencySign} должна быть больше чем ${min_order_sum_product}${this.$heap.state.currencySign}`
                }
            }
            if(this.order.order_sum_product*1<this.tariffRule.order_sum_minimal*1){
                return `Сумма заказа должна быть больше чем ${this.tariffRule.order_sum_minimal}${this.$heap.state.currencySign}`;
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
            return false
        },

        order_sum_total(){
            return Math.round( (this.order.order_sum_product*1-this.order.order_sum_promo*1+this.order_sum_delivery*1)*100 ) / 100
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
        bankCardCalc(){
            let card=this.bankCard;
            if( card && card.card_type ){
                card.label=`${card.card_type.toUpperCase()} (**** ${card.card_mask.split('*').pop()})`
            }
            return card;
        }
    },
    mounted(){
        this.itemCheckoutDataGet();
    },
    created(){
        this.$topic.on('userMainLocationSet',()=>{
            this.can_load_at=0
            this.itemCheckoutDataGet();
        })        
        this.$topic.on('userMainPaymentMethodSet',()=>{
            this.can_load_at=0
            this.itemCheckoutDataGet();
        })        
        this.$topic.on('settingsGet',(settings)=>{
            this.can_load_at=0
            this.recurrentPaymentAllow=settings?.other?.recurrentPaymentAllow
        })        
    },
    ionViewDidEnter(){
        this.itemCheckoutDataGet();
    },
    methods:{
        debounce(){
            const now=Date.now()
            let reject=false
            if(this.can_load_at>now){
                reject=true
            }
            this.can_load_at=now+1000
            return reject
        },
        async itemCheckoutDataGet(){
            if(this.debounce()){
                return
            }
            try{
                const request={
                    order_id:this.order_id,
                    features:"schedule",
                }

                const bulkResponse=await jQuery.post(`${this.$heap.state.hostname}Order/itemCheckoutDataGet`,request)
                this.order=bulkResponse.order||{}
                if( this.order.stage_current!="customer_confirmed" ){
                    this.$router.replace('/order/order-'+this.order.order_id);
                    return;
                }

                this.promo=bulkResponse.Promo_itemLinkGet
                this.promoCount=bulkResponse.Promo_listGet
                this.storeIsReady=Array.isArray(bulkResponse.Store_deliveryOptions)?1:0
                this.errTooFar=0
                this.errNoTariff=0
                this.errNotfound=0
                this.bankCard=bulkResponse?.bankCard;
                this.tariffRuleList=bulkResponse.Store_deliveryOptions
                if( !this.tariffRule.tariff_id ){//if not set already
                    this.tariffRuleSet(this.tariffRuleList[0]||{})
                }
                this.is_checkout_data_loaded=1
                if( this.order_sum_delivery==0 ){//????
                    this.order_sum_delivery=this.order.order_sum_delivery
                }
                // if(this.tariffRule.deliveryIsReady=='ready'){
                //     this.deliveryTime=Utils.deliveryTimeCalculate(bulkResponse.Location_distanceHolderGet,bulkResponse.Store_preparationTime)
                // } else {
                //     this.deliveryTime={}
                // }
            }
            catch(err){
                this.is_checkout_data_loaded=1
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'too_far':
                        this.errTooFar=1
                        break;
                    case 'not_ready':
                        this.storeIsReady=0
                        break;
                    case 'no_tariff':
                        this.errNoTariff=1
                        break;
                    default:
                        this.errNotfound=1
                        this.$flash("Заказ не найден")
                        this.$go('/order/order-list')
                        break;
                }
                return false
            }
        },
        tariffRuleSet( tariffRule ){
            this.deliveryType='delivery_by_courier'
            if(tariffRule.deliveryByCourier==1){
                /**
                 * If selected tariff includes delivery by courier merge in it all payment options
                 */
                this.tariffRule=this.tariffMerge(this.tariffRuleList?.filter(rule=>rule.deliveryByCourier==1))
                this.deliveryType='delivery_by_courier'
            } else
            if(tariffRule.deliveryByStore==1){
                /**
                 * If selected tariff includes delivery by store merge in it all payment options
                 */
                 this.tariffRule=this.tariffMerge(this.tariffRuleList?.filter(rule=>rule.deliveryByStore==1))
                 this.deliveryType='delivery_by_store'
            } else 
            if(tariffRule.pickupByCustomer==1){
                /**
                 * If selected tariff includes pickup by customer merge in it all payment options
                 */
                 this.tariffRule=this.tariffMerge(this.tariffRuleList?.filter(rule=>rule.pickupByCustomer==1))
                 this.deliveryType='pickup_by_customer'
            } else {
                /**
                 * There is no any delivery option
                 */
                return ;
            }

            this.order_sum_delivery=tariffRule.order_sum_delivery
            this.paymentType='use_card'
            if(this.bankCard?.card_type){
                this.paymentType='use_card_recurrent'
            } else
            if(tariffRule.paymentByCard==1){
                this.paymentType='use_card'
            } else
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
            this.routePlanMode=tariffRule.routePlan?.start_plan_mode
        },
        tariffMerge( tariffArray ){//merge payment options for same delivery option
            if( !tariffArray?.length ){
                return null
            }
            let mergedTariff
            for(let tariff of tariffArray ){
                if(!mergedTariff){
                    //should avoid reference copying because original tariff will be updated. Using cloning
                    mergedTariff=Object.assign({}, tariff)
                    continue
                }
                mergedTariff.tariff_id+=`,${tariff.tariff_id}`
                mergedTariff.paymentByCard||=tariff.paymentByCard
                mergedTariff.paymentByCash||=tariff.paymentByCash
                mergedTariff.paymentByCashStore||=tariff.paymentByCashStore
            }
            return mergedTariff
        },
        tariffSplit(){//pick tariff for selected payment option from merged earlier tariff
            if( !this.tariffRule.tariff_id.includes(',') ){
                return this.tariffRule.tariff_id
            }
            const mergedTariffIds=this.tariffRule.tariff_id.split(',')
            for(let tariff_id of mergedTariffIds){
                let tariff=this.tariffRuleList.find(tarifCandidate=>tarifCandidate.tariff_id==tariff_id)
                if( !tariff ){
                    continue
                }
                if( (this.paymentType=='use_card' || this.paymentType=='use_card_recurrent')  && tariff.paymentByCard!=1 ){
                    continue
                }
                if( this.paymentType=='use_cash' && tariff.paymentByCash!=1 ){
                    continue
                }
                if( this.paymentType=='use_cash_store' && tariff.paymentByCashStore!=1 ){
                    continue
                }
                this.tariffRule=tariff
            }
        },
        async scheduleRangeGet(){
            try{
                const finish_plan_timetable=this.tariffRule?.routePlan?.finish_plan_timetable;
                if( !finish_plan_timetable ){
                    return
                }
                const request={
                    timetable:JSON.stringify(finish_plan_timetable)
                }
                this.scheduleRange=await jQuery.post(`${this.$heap.state.hostname}Order/itemScheduleRangeGet`,request)
                this.deliveryFinishScheduled=this.scheduleRange.nearest
            }catch{/** */}
        },
        async datetimePick(){
            if( !this.scheduleRange ){
                await this.scheduleRangeGet();
            }

            const modal = await modalController.create({
                component: DateRangePicker,
                presentingElement:this.$refs.page.$el,
                initialBreakpoint:'0.6',
                showBackdrop:true,
                canDismiss:true,
                componentProps:{dateRange:this.scheduleRange.range,defaultDatetime:this.scheduleRange.nearest},
            });
            modal.present()
            this.routePlanMode='scheduled'
            const data=await modal.onDidDismiss()
            if(data.role=="confirm"){
                this.deliveryFinishScheduled=data.data
            } else {
                this.deliveryFinishScheduled=null
                this.routePlanMode=this.tariffRule?.routePlan?.start_plan_mode
            }
        },
        async proceed(){
            // if( this.tariffRule.deliveryIsReady=='busy' && !await this.heavyLoadConfirm() ){
            //     return false
            // }
            if( this.deliveryByCourierRuleChecked && !await this.deliveryAddressConfirm() ){
                return false
            }
            this.tariffSplit()
            const orderData={
                order_id:this.order.order_id,
                tariff_id:this.tariffRule.tariff_id,
                deliveryByStore:this.deliveryByStoreRuleChecked?1:0 ,
                deliveryByCourier:this.deliveryByCourierRuleChecked?1:0,
                deliveryFinishScheduled:this.deliveryFinishScheduled,
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
                    case 'promo_share_too_high':
                        this.$flash("Сумма заказа с этой скидкой должна быть больше")
                        return
                }
                this.$flash("Не удается оформить заказ, обратитесь на горячую линию")
                //this.$router.go(-1);
                return false
            }
            if(orderData.paymentByCard==1){
                this.paymentFormOpen({
                    order_id:this.order.order_id
                });
                return;
            }
            if(orderData.paymentByCardRecurrent==1){
                const request={
                    order_id:this.order.order_id,
                    card_id:this.bankCard.card_id
                }
                try{
                    this.$flash("Оплачиваем сохраненной картой...")
                    await jQuery.post(`${this.$heap.state.hostname}CardAcquirer/paymentDo`,request)
                } catch(err){
                    const exception_code=err?.responseJSON?.messages?.error;
                    switch(exception_code){
                        case 'error_nocof':
                            this.$flash("Нет привязанного способа оплаты")
                            break;
                        case 'error_fund':
                            this.$alert("На счету недостаточно средств","Оплата не прошла")
                            break;
                        case 'error_card':
                            this.$alert("Возможно карта заблокирована или просрочена","Не действительная карта")
                            break;
                        case 'error_fraud':
                            this.$alert("Отказано в оплате! Обратитесь в ваш банк.","Оплата отклонена")
                            break;
                        default:
                            this.$flash("Оплата сохраненной картой не удалась")
                    }
                    return false
                }
            }
            try{
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
        async cancel(){
            this.$router.replace('/order/order-'+this.order.order_id);
        }, 
        async paymentFormOpen( order_data ) {
            const presEl=document.querySelector('ion-router-outlet');
            const self=this;
            const modal = await modalController.create({
                component: OrderPaymentCardModal,
                componentProps:{order_data},
                presentingElement:presEl,
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
                }
                if(message=='not_authorized'){
                    this.$flash("Оплата не удалась, возможно недостаточно средств");
                }
                if(message=='waiting'){
                    this.$flash("Ваш платеж на ожидании");
                }
                this.$router.replace('/order/order-'+this.order.order_id);
            }
        },
        async deliveryAddressConfirm(){
            const alert = await alertController.create({
                header: 'Адрес доставки',
                message:this.$heap.state.user.location_main.location_address,
                buttons: [
                  {
                    text: 'Изменить',
                    role: 'cancel',
                  },
                  {
                    text: 'Верно',
                    role: 'confirm',
                  },
                ],
            });
            await alert.present();
            const { role } = await alert.onDidDismiss();
            if( role=='confirm' ){
                return true
            }
            this.$go('/modal/user-addresses');
            return false
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
                this.itemCheckoutDataGet()
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