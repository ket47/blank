<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="orderData">
        <ion-list lines="none">
            <ion-item>
                <ion-label>
                    <h1>Ваш заказ</h1>
                    <p><b>Курьер отвезет вашу посылку</b></p>
                </ion-label>
            </ion-item>

            
            <ion-item lines="none">
                <ion-textarea 
                    ref="description"
                    v-model="orderLocal.order_description"
                    rows="5"
                    label=""
                    placeholder="напишите, что будем везти"
                    style="background-color:var(--ion-color-light);border-radius:10px"
                    @ionInput="itemUpdate()"
                    debounce="50"
                ></ion-textarea>
            </ion-item>
            
            <!--
            <ion-item v-if="order?.order_description" detail="" lines="none" @click="descriptionPick()">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="primary">{{orderData.order_description}}</ion-text>
            </ion-item>
            <ion-item v-else detail="" lines="none" @click="descriptionPick()">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="medium">Скажите нам, что нужно перевезти?</ion-text>
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>-->
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
            <div v-if="orderLocal.locationStart">
                <ion-item button @click="locationStartSelect()">
                    <ion-thumbnail v-if="orderLocal.locationStart?.image_hash" slot="start" style="--size:20px">
                        <ion-img :src="`${$heap.state.hostname}image/get.php/${orderLocal.locationStart?.image_hash}.150.150.webp`"/>
                    </ion-thumbnail>
                    <ion-icon v-else color="primary" :src="locationOutline" slot="start"/>
                    <ion-text><b>Откуда:</b> <ion-note>{{orderLocal.locationStart.location_address}}</ion-note></ion-text>
                </ion-item>
                <ion-item>
                    <ion-input v-model="orderLocal.locationStart.location_comment" placeholder="комментарий к адресу отправителя" label="" debounce="700" @ionInput="locationCommentUpdate('locationStart')"/>
                </ion-item>
            </div>
            <ion-item v-else button :detail-icon="addOutline" @click="locationStartSelect()">
                <ion-icon color="medium" :src="locationOutline" slot="start"/>
                <ion-text color="medium">Откуда забрать?</ion-text>
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>


            <div v-if="orderLocal.locationFinish">
                <ion-item v-if="orderData.locationFinish" button @click="locationFinishSelect()">
                    <ion-thumbnail v-if="orderData.locationFinish?.image_hash" slot="start" style="--size:20px">
                        <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData.locationFinish?.image_hash}.150.150.webp`"/>
                    </ion-thumbnail>
                    <ion-icon v-else color="primary" :src="flagOutline" slot="start"/>
                    <ion-text><b>Куда:</b> <ion-note>{{orderData.locationFinish.location_address}}</ion-note></ion-text>
                </ion-item>
                <ion-item>
                    <ion-input v-model="orderLocal.locationFinish.location_comment"  placeholder="комментарий к адресу получателя" label="" debounce="700" @ionInput="locationCommentUpdate('locationFinish')"/>
                </ion-item>
            </div>
            <ion-item v-else button :detail-icon="addOutline" @click="locationFinishSelect()">
                <ion-icon color="medium" :src="flagOutline" slot="start"/>
                <ion-text color="medium">Куда отвезти?</ion-text>
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>


            <ion-item-divider>Итог</ion-item-divider>
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header">
                        <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                        <ion-text color="medium">Итого: </ion-text>
                        <ion-label slot="end" color="primary">{{ orderLocal.deliveryCalculation?.sum??0 }}{{$heap.state.currencySign}}</ion-label>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item lines="none">
                            <ion-text color="medium">Вызов курьера</ion-text>
                            <ion-label slot="end" color="primary">{{ orderLocal.deliveryCalculation?.cost??0 }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                        <ion-item lines="none">
                            <ion-text color="medium">Расстояние по карте {{ deliveryDistanceKm }}км по {{ orderLocal.deliveryCalculation?.fee??0 }}{{$heap.state.currencySign}}</ion-text>
                            <ion-label slot="end" color="primary">{{ deliveryFeeTotal }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>


            <!--
            <ion-item >
                <ion-label><h1>Условия перевозки</h1></ion-label>
            </ion-item>
            <ion-item>
                <ion-icon :src="helpCircleOutline" slot="start" @click="$router.push('/page/rules-customer#dimentions')"/>
                <ion-checkbox v-model="isDimentionValid">Посылка меньше 40см и легче 10кг</ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-icon :src="helpCircleOutline" slot="start" @click="$router.push('/page/rules-customer#contents')"/>
                <ion-checkbox v-model="isContentValid">Посылка без запрещенных вещей</ion-checkbox>
            </ion-item>
            -->
        </ion-list>



        <ion-card v-if="checkoutError" color="warning">
            <ion-card-content>{{checkoutError}}</ion-card-content>
        </ion-card>



        <ion-grid v-if="isReadyToCheckout">
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
        <ion-grid v-else>
            <ion-row>
                <ion-col>
                    <ion-button v-if="!orderData.order_description" @click="$refs.description.$el.setFocus()" expand="block" color="light"> 
                        Заполнить описание
                    </ion-button>
                    <ion-button v-else-if="!orderData.locationStart" @click="locationStartSelect()" expand="block" color="light"> 
                        Откуда забрать
                    </ion-button>
                    <ion-button v-else-if="!orderData.locationFinish" @click="locationFinishSelect()" expand="block" color="light"> 
                        Куда отвезти
                    </ion-button>
                    <ion-button v-else-if="!isContentValid || !isDimentionValid" @click="isContentValid=isDimentionValid=1" expand="block" color="light"> 
                        Согласиться с условиями
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
    modalController,
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
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
    IonItemDivider,
    IonTextarea,
    IonInput,
    IonAccordion,
    IonAccordionGroup,
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
    locationOutline,
    flagOutline,
    chevronDown,
    addOutline,
    checkmark,
    cashOutline,
    businessOutline,
    alertCircleOutline,
    helpCircleOutline,
}                        from 'ionicons/icons';


import {
    yandexMap,
    ymapMarker,
    loadYmap 
}                       from "vue-yandex-maps";


import UserAddressesModal       from '@/components/UserAddressesModal.vue';


import jQuery           from "jquery"
export default({
    props:['orderData'],
    components: {
        yandexMap,
        ymapMarker,
        IonIcon,
        IonText,
        IonLabel,
        IonItem,
        IonList,
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
        IonItemDivider,
        IonTextarea,
        IonInput,
        IonAccordion,
        IonAccordionGroup,
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
            walletOutline,
            banOutline,
            giftOutline,
            cardOutline,
            ribbonOutline,
            chatboxEllipsesOutline,
            locationOutline,
            flagOutline,
            chevronDown,
            addOutline,
            checkmark,
            cashOutline,
            businessOutline,
            alertCircleOutline,
            helpCircleOutline,
        };
    },
    data(){
        return {
            isDimentionValid:1,
            isContentValid:1,

            orderLocal:{},
        };
    },
    computed:{
        checkoutError(){
            const errorCode=this.orderLocal.deliveryCalculation?.error??null
            if( errorCode=='no_input' ){
                return "Выберите адрес забора и доставки посылки"
            }
            if( errorCode=='start_center_toofar' ){
                return "Адрес получения посылки слишком удален"
            }
            if( errorCode=='finish_center_toofar' ){
                return "Адрес доставки посылки слишком удален"
            }
            if( errorCode=='start_finish_toofar' ){
                const max_distance_km=Math.round(this.orderLocal.deliveryCalculation?.max_distance/100)/10
                return `Расстояние по карте между адресами ${this.deliveryDistanceKm}км, больше максимального в ${max_distance_km}км`
            }
            return null
        },
        deliveryDistanceKm(){
            return Math.round(this.orderLocal.deliveryCalculation?.deliveryDistance/100)/10
        },
        deliveryFeeTotal(){
            const fee=this.orderLocal.deliveryCalculation?.fee??0
            return Math.round(fee*this.deliveryDistanceKm)
        },
        isReadyToCheckout(){
            return this.orderData.order_description && this.orderData.locationStart && this.orderData.locationFinish && !this.checkoutError
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
        stageCreate(order_id, order_stage_code, severity){
            if( severity=='danger' ){
                if(!confirm("Вы уверены?")){
                    return
                }
            }
            this.$emit('stageCreate',order_id, order_stage_code);
        },
        async itemUpdate( mode='skipRefresh' ){
            const orderUpdate=this.orderLocal
            orderUpdate.mode=mode
            this.$emit('orderUpdate',orderUpdate)
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
            this.orderLocal.locationStart=await this.locationSelect()
            this.orderLocal.start_location_id=this.orderLocal.locationStart?.location_id
            this.itemUpdate('refreshTotalEstimates')
        },
        async locationFinishSelect(){
            this.orderLocal.locationFinish=await this.locationSelect()
            this.orderLocal.finish_location_id=this.orderLocal.locationFinish?.location_id
            this.itemUpdate('refreshTotalEstimates')
        },
        async locationCommentUpdate(type){
            const loc=this.orderLocal[type]
            const locationUpdate={
                location_id:loc.location_id,
                location_comment:loc.location_comment
            }
            this.$emit('locationCommentUpdate',locationUpdate)
            this.itemUpdate()
        },
    },
    async created(){
        this.orderLocal=this.orderData//for hot reload
    },
    watch:{
        'orderData':async function(newval){
            this.orderLocal=newval
            if(this.orderLocal){
                //this.orderLocal.deliveryCalculation=await this.itemTotalEstimate(this.orderLocal.start_location_id,this.orderLocal.finish_location_id)
            }
        },
    }
})
</script>
