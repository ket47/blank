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

            <!-- <div style="border-radius:10px;margin:10px;overflow: hidden;" v-if="0">
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
            </div> -->
            <div v-if="orderLocal.locationStart">
                <ion-item>
                    <ion-icon color="medium" :src="locationOutline" slot="start"/>
                    Откуда
                </ion-item>
                <ion-item button detail @click="locationStartSelect()">
                    <ion-thumbnail v-if="orderLocal.locationStart?.image_hash" slot="start" style="--size:20px">
                        <ion-img :src="`${$heap.state.hostname}image/get.php/${orderLocal.locationStart?.image_hash}.150.150.webp`"/>
                    </ion-thumbnail>
                    <ion-icon v-else color="primary" :src="locationOutline" slot="start"/>
                    <ion-text> {{orderLocal.locationStart.location_address}}</ion-text>
                </ion-item>
                <ion-item>
                    <div>
                        <div v-if="orderLocal.locationStart.location_comment" @click="locationCommentEdit('locationStart')" style="padding:10px;background-color:var(--ion-color-light);color:#666;border-radius:10px;display:inline-block">
                            {{orderLocal.locationStart.location_comment}}
                        </div>
                        <ion-chip color="medium" v-else @click="locationCommentEdit('locationStart')">
                            <ion-icon :src="addOutline"/><ion-label>комментарий</ion-label>
                        </ion-chip>

                        <ion-chip v-if="orderLocal.locationStart.location_phone" color="medium" @click="locationPhoneEdit('locationStart')">
                            <ion-icon :src="callOutline"/><ion-label>{{orderLocal.locationStart.location_phone}}</ion-label>
                        </ion-chip>
                        <ion-chip v-else color="medium" @click="locationPhoneEdit('locationStart')"><ion-icon :src="addOutline"/><ion-label>телефон</ion-label></ion-chip>
                    </div>
                </ion-item>
            </div>
            <ion-item v-else button :detail-icon="addOutline" @click="locationStartSelect()">
                <ion-icon color="medium" :src="locationOutline" slot="start"/>
                <ion-text color="medium">Откуда забрать?</ion-text>
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>


            <div v-if="orderLocal.locationFinish">
                <ion-item>
                    <ion-icon color="medium" :src="flagOutline" slot="start"/>
                    Куда
                </ion-item>
                <ion-item button detail @click="locationFinishSelect()">
                    <ion-thumbnail v-if="orderData.locationFinish?.image_hash" slot="start" style="--size:20px">
                        <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData.locationFinish?.image_hash}.150.150.webp`"/>
                    </ion-thumbnail>
                    <ion-icon v-else color="primary" :src="flagOutline" slot="start"/>
                    <ion-text>{{orderData.locationFinish.location_address}}</ion-text>
                </ion-item>
                <ion-item>
                    <div>
                        <div v-if="orderLocal.locationFinish.location_comment" @click="locationCommentEdit('locationFinish')" style="padding:10px;background-color:var(--ion-color-light);color:#666;border-radius:10px;display:inline-block">
                            {{orderLocal.locationFinish.location_comment}}
                        </div>
                        <ion-chip color="medium" v-else @click="locationCommentEdit('locationFinish')">
                            <ion-icon :src="addOutline"/><ion-label>комментарий</ion-label>
                        </ion-chip>

                        <ion-chip v-if="orderLocal.locationFinish.location_phone" color="medium" @click="locationPhoneEdit('locationFinish')">
                            <ion-icon :src="callOutline"/><ion-label>{{orderLocal.locationFinish.location_phone}}</ion-label>
                        </ion-chip>
                        <ion-chip v-else color="medium" @click="locationPhoneEdit('locationFinish')"><ion-icon :src="addOutline"/><ion-label>телефон</ion-label></ion-chip>
                    </div>
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
                    <ion-item slot="header" lines="none">
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


            <ion-accordion-group>
                <ion-accordion toggle-icon-slot="start">
                    <ion-item slot="header" lines="none">
                        <ion-checkbox :checked="isValidAll" @ionChange="toggleValid($event.target.checked)">Посылка отвечает условиям</ion-checkbox>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item>
                            <ion-icon :src="helpCircleOutline" slot="start" @click="$router.push('/page/rules-customer#dimentions')"/>
                            <ion-checkbox v-model="isValidDimention">Меньше 40 × 40 × 25 см</ion-checkbox>
                        </ion-item>
                        <ion-item>
                            <ion-icon :src="helpCircleOutline" slot="start" @click="$router.push('/page/rules-customer#dimentions')"/>
                            <ion-checkbox v-model="isValidDimention">Легче 8кг</ion-checkbox>
                        </ion-item>
                        <ion-item>
                            <ion-icon :src="helpCircleOutline" slot="start" @click="$router.push('/page/rules-customer#contents')"/>
                            <ion-checkbox v-model="isValidContent">Без запрещенных вещей</ion-checkbox>
                        </ion-item>
                        <ion-item>
                            <ion-icon :src="helpCircleOutline" slot="start" @click="$router.push('/page/rules-customer#contents')"/>
                            <ion-checkbox v-model="isValidReadyness">Уже готова к перевозке</ion-checkbox>
                        </ion-item>
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>
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
                    <ion-button v-else-if="!isValidAll" @click="toggleValid( 1 )" expand="block" color="light"> 
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
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonSkeletonText,
    IonCard,
    IonCardContent,
    IonItemDivider,
    IonTextarea,
    IonAccordion,
    IonAccordionGroup,
    IonChip,
    IonCheckbox,
    alertController,
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
    callOutline,
}                        from 'ionicons/icons';
import UserAddressesModal       from '@/components/UserAddressesModal.vue';

export default({
    props:['orderData'],
    components: {
        IonIcon,
        IonText,
        IonLabel,
        IonItem,
        IonList,
        IonImg,
        IonThumbnail,
        IonButton,
        IonCol,
        IonRow,
        IonGrid,
        IonSkeletonText,
        IonCard,
        IonCardContent,
        IonItemDivider,
        IonTextarea,
        IonAccordion,
        IonAccordionGroup,
        IonChip,
    IonCheckbox,
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
            callOutline,
        };
    },
    data(){
        return {
            isValidReadyness:1,
            isValidDimention:1,
            isValidWeight:1,
            isValidContent:1,

            orderLocal:{},
        };
    },
    computed:{
        checkoutError(){
            const errorCode=this.orderLocal.deliveryCalculation?.error??null
            if( errorCode=='no_input' || !this.orderData.locationStart || !this.orderData.locationFinish){
                return "Выберите адрес отправителя и получателя"
            }
            if( errorCode=='start_center_toofar' ){
                return "Адрес отправителя посылки слишком удален"
            }
            if( errorCode=='finish_center_toofar' ){
                return "Адрес получателя посылки слишком удален"
            }
            if( errorCode=='start_finish_toofar' ){
                const max_distance_km=Math.round(this.orderLocal.deliveryCalculation?.max_distance/100)/10
                return `Расстояние по карте между адресами ${this.deliveryDistanceKm}км, больше максимального в ${max_distance_km}км`
            }
            if( !(this.orderLocal.deliveryCalculation?.fee??0) ){
                return "Тариф доставки не установлен"
            }
            if( !(this.orderLocal.deliveryCalculation?.deliveryDistance??0) ){
                return "Отправитель и получатель в одной точке"
            }
            return null
        },
        deliveryDistanceKm(){
            return Math.round(this.orderLocal.deliveryCalculation?.deliveryDistance/100)/10 || 0
        },
        deliveryFeeTotal(){
            const fee=this.orderLocal.deliveryCalculation?.fee??0
            return Math.round(fee*this.deliveryDistanceKm)
        },
        isReadyToCheckout(){
            return this.orderData.order_description && this.orderData.locationStart && this.orderData.locationFinish && !this.checkoutError && this.isValidAll
        },
        isValidAll(){
            return this.isValidContent&&this.isValidDimention&&this.isValidReadyness&&this.isValidWeight
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
            try{
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
            } catch{/** */}
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
        async locationPhoneEdit( type ){
            let phone=this.orderLocal[type].location_phone??''
            const alert = await alertController.create({
                header: 'Напишите номер телефона',
                buttons: [
                    {
                        text: 'Удалить',
                        role: 'cancel'
                    },
                    {
                        text: 'OK',
                        role: 'confirm'
                    },
                ],
                inputs: [
                    {
                        name:'phone',
                        placeholder: '+7 xxxxxxxxxx',
                        value:phone
                    },
                ],
            });
            try{
                await alert.present();
                const {data,role}=await alert.onDidDismiss()
                if(role=='confirm'){
                    phone=data.values.phone.replace(/\D/g,'').replace(/^7/,'')
                    if(phone){
                        if(phone.length!=10){
                            this.$flash("Проверьте правильность телефона")
                        }
                        phone='+7'+phone
                    }
                }
                if(role=='cancel'){
                    phone=''
                }
                this.orderLocal[type].location_phone=phone
                const loc=this.orderLocal[type]
                const locationUpdate={
                    location_id:loc.location_id,
                    location_phone:phone
                }
                this.$emit('locationUpdate',locationUpdate)
                this.itemUpdate()
            } catch(err){
                console.log(err)
            }
        },
        async locationCommentEdit( type ){
            let comment=this.orderLocal[type].location_comment??''
            const alert = await alertController.create({
                header: 'Комментарий к адресу',
                buttons: [
                    {
                        text: 'Удалить',
                        role: 'cancel'
                    },
                    {
                        text: 'OK',
                        role: 'confirm'
                    },
                ],
                inputs: [
                    {
                        type:'textarea',
                        name:'comment',
                        placeholder: 'напишите комментарий',
                        value:comment
                    },
                ],
            });
            try{
                await alert.present();
                const {data,role}=await alert.onDidDismiss()
                comment=data.values.comment
                if(role=='cancel'){
                    comment=''
                }
                this.orderLocal[type].location_comment=comment
                const loc=this.orderLocal[type]
                const locationUpdate={
                    location_id:loc.location_id,
                    location_comment:comment
                }
                this.$emit('locationUpdate',locationUpdate)
                this.itemUpdate()
            } catch(err){
                console.log(err)
            }
        },
        toggleValid( checked ){
            this.isValidContent=this.isValidDimention=this.isValidWeight=this.isValidReadyness=checked
        }
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
