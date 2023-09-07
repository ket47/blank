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
</style>

<template>
    <base-layout pageTitle="Оформление" pageDefaultBackLink="/order/order-list" ref="page">
        <ion-list  lines="none">
            <ion-item>
                <ion-label>
                    <h1>Ваш заказ</h1>
                    <p><b>Курьер</b></p>
                </ion-label>
            </ion-item>
            <ion-item detail="" lines="none">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="medium">Скажите нам, что нужно перевезти?</ion-text>
            </ion-item>
            <ion-item >
                <ion-label><h1>Детали перевозки</h1></ion-label>
            </ion-item>

            <div style="border-radius:10px;margin:10px;overflow: hidden;">
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
                        отвезти сразу
                    </ion-segment-button>
                    <ion-segment-button value="schedule" @click="datetimePick()">
                        <ion-label><b>Ко времени</b></ion-label>
                        выберите день и время
                    </ion-segment-button>
                </ion-segment>
            </ion-item>




            
            <ion-item >
                <ion-label><h1>Способы оплаты</h1></ion-label>
            </ion-item>
        
        </ion-list>


        <ion-item button detail="false" @click="paymentType='use_cash'" v-if="tariffRule.paymentByCash==1">
            <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
            <label for="payment_cash">Оплата наличными</label>
            <div slot="end">
                <input type="radio" name="paymentType" id="payment_cash" value="cash" :checked="paymentType == 'use_cash'">
            </div>
        </ion-item>
        <ion-item button detail="false" @click="paymentType='use_cash_store'" v-if="tariffRule.paymentByCashStore==1">
            <ion-icon :icon="cashOutline" slot="start" color="primary"></ion-icon>
            <label for="payment_cash_store">Оплата наличными продавцу</label>
            <div slot="end">
                <input type="radio" name="paymentType" id="payment_cash_store" value="cash" :checked="paymentType == 'use_cash_store'">
            </div>
        </ion-item>



        <div v-if="tariffRule.paymentByCard==1">
            <ion-item detail="false" button @click="paymentType='use_card'">
                <ion-icon :icon="cardOutline" slot="start" color="primary"></ion-icon>
                <label for="payment_card">Оплата картой без привязки</label>
                <div slot="end">
                    <input type="radio" name="paymentType" id="payment_card" value="card"  :checked="paymentType == 'use_card'">
                </div>
            </ion-item>
            <ion-item v-if="bankCard?.card_type" button detail="false" @click="paymentType='use_card_recurrent'">
                <ion-img v-if="bankCard.card_type=='mir'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                <ion-img v-else-if="bankCard.card_type=='visa'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                <ion-img v-else-if="bankCard.card_type=='mastercard'" class="card_type" :src="`/img/icons/card-${bankCard.card_type}.svg`" slot="start"/>
                <ion-icon v-else :src="cardOutline" slot="start" color="primary"/>
                
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


        {{locationStart}}


        <ion-card v-if="checkoutError" color="warning">
            <ion-card-content>{{checkoutError}}</ion-card-content>
        </ion-card>

















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
}                   from '@ionic/vue'
import {
    cubeOutline,
    locationOutline,
    flagOutline,
    chevronDown,
    addOutline,
    checkmark,
}                   from 'ionicons/icons';
import {
    yandexMap,
    ymapMarker,
    loadYmap 
}                   from "vue-yandex-maps";
import Utils        from '@/scripts/Utils'
import jQuery       from 'jquery'
import UserAddressesModal from '@/components/UserAddressesModal.vue';
import DateRangePicker from '@/components/DateRangePicker.vue'

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
    },
    setup(){
        return {
            cubeOutline,
            locationOutline,
            flagOutline,
            chevronDown,
            addOutline,
            checkmark,
        };
    },
    computed:{
        checkoutError(){
            if( this.errorCode=='no_input' ){
                return "Выберите адрес забора и доставки посылки"
            }
            if( this.errorCode=='no_courier' ){
                return "Нет доступных курьеров"
            }
            return null
        }
    },
    data(){
        return {
            presentingElement: null,
            isDatePickerOpen:false,
            deliveryStartRange:{},
            deliveryStartRangeHours:[],

            ship_id:this.$route.params.id,
            ship:null,
            shipAutoloadClock:null,

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
                this.itemCheckoutDataUse(bulkResponse)







                this.isDatePickerOpen=true
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
            this.deliveryStartRange=bulkResponse.DeliveryStartRange

            this.locationStart=bulkResponse.Ship_locationStart
            this.locationFinish=bulkResponse.Ship_locationFinish
            this.bankCard=bulkResponse?.bankCard;
            this.tariffRuleList=bulkResponse.Store_deliveryOptions
            this.tariffRuleSet(this.tariffRuleList?.[0]||{})
            this.is_checkout_data_loaded=1

            //this.customerIpLocationGet()
        },
        async itemCheckoutDataSet(){
            const shipData={
                ship_id:this.ship_id,
                ship_start_location_id:this.locationStart?.location_id,
                ship_finish_location_id:this.locationFinish?.location_id,
            }
            try{
                const response=await jQuery.post(`${this.$heap.state.hostname}Shipment/itemCheckoutDataSet`,JSON.stringify(shipData))
            } catch(err){
                console.log(err)
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
            const modal = await modalController.create({
                component: DateRangePicker,
                initialBreakpoint:'0.4',
                showBackdrop:true,
                componentProps:{dateRange:this.deliveryStartRange},
            });
            modal.present()
            const datetime=await modal.onDidDismiss()
            
            console.log(datetime)
        },

        // async modalLocationCreate( location_group_id, location_group_name ) {

        //     const modal = await modalController.create({
        //         component: UserAddressPicker,
        //         showBackdrop:true,
        //         componentProps:{},
        //     });
        //     modal.onDidDismiss().then(location => {
        //         console.log(location);
        //         //this.locationCreate(location_group_id,location.data);
        //     });
        //     return modal.present();
        // },

        async customerIpLocationGet(){
            try{
                const response = await fetch("https://geolocation-db.com/json/");
                this.iplocation = await response.json();
            }catch{/** */}
        },
        async ymapInit(locSettings){
            this.mapsettings={
                apiKey: locSettings.ymapApiKey,
                lang: "ru_RU",
                coordorder: "latlong",
                version: "2.1",
            }
            this.placemarkCoords=JSON.parse(locSettings.mapCenter)
            await loadYmap();
        },
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