<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="ship">
        <ion-list lines="none">
            <ion-item>
                <ion-label>
                    <h1>Ваш заказ</h1>
                    <p><b>Курьер</b></p>
                </ion-label>
            </ion-item>

            <ion-item lines="none">
                <ion-textarea v-model="ship.ship_description" rows="5" label="" placeholder="напишите, что будем везти" style="background-color:var(--ion-color-light);border-radius:10px"></ion-textarea>
            </ion-item>
            
            <!--
            <ion-item v-if="ship?.ship_description" detail="" lines="none" @click="descriptionPick()">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="primary">{{ship.ship_description}}</ion-text>
            </ion-item>
            <ion-item v-else detail="" lines="none" @click="descriptionPick()">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="medium">Скажите нам, что нужно перевезти?</ion-text>
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>-->
            <!-- <ion-item-divider>Детали перевозки</ion-item-divider> -->
            <ion-item >
                <ion-label><h1>Детали перевозки</h1></ion-label>
            </ion-item>

            <div style="bship-radius:10px;margin:10px;overflow: hidden;" v-if="0">
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
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>

            <ion-item v-if="locationFinish" button @click="locationFinishSelect()">
                <ion-icon color="primary" :src="flagOutline" slot="start"/>
                <ion-text><b>Куда:</b> {{locationFinish.location_address}}</ion-text>
            </ion-item>
            <ion-item v-else button :detail-icon="addOutline" @click="locationFinishSelect()">
                <ion-icon color="medium" :src="flagOutline" slot="start"/>
                <ion-text color="medium">Куда отвезти?</ion-text>
                <ion-icon color="warning" :src="alertCircleOutline" slot="end"/>
            </ion-item>


            



        </ion-list>


        <ion-card color="primary"  v-if="ship.ship_description">
            <ion-card-header>
                <ion-card-title>Комментарий</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{ship.ship_description}}</ion-card-content>
        </ion-card>

        <ion-card color="warning"  v-if="ship.ship_objection">
            <ion-card-header>
                <ion-card-title>Проблема с заказом</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{ship.ship_objection}}</ion-card-content>
        </ion-card>


        <ion-grid>
            <ion-row>
                <ion-col  v-for="(stage_title, ship_stage_code) in nextStageButtons" :key="ship_stage_code" >
                    <ion-button 
                    v-if="stage_title[0]" 
                    @click="stageCreate(ship.ship_id, ship_stage_code, stage_title[1])" 
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
    modalController,
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
    IonItemDivider,
    IonTextarea,
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
}                        from 'ionicons/icons';


import {
    yandexMap,
    ymapMarker,
    loadYmap 
}                       from "vue-yandex-maps";


import ShipDescriptionPicker    from '@/components/ShipDescriptionPicker.vue'
import UserAddressesModal       from '@/components/UserAddressesModal.vue';


import jQuery           from "jquery"
export default({
    props:['shipment'],
    components: {
        yandexMap,
        ymapMarker,
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
        IonItemDivider,
        IonTextarea,
        ShipDescriptionPicker,
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
        };
    },
    data(){
        return {
            ship:null,
            isDimentionValid:0,
            isWeightValid:0,

            locationStart:null,
            locationFinish:null,
        };
    },
    computed:{
        shipTotal(){
            let total=0;
            for(let k in this.ship?.entries){
                let entry=this.ship?.entries[k];
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
                (this.ship.user_role=='supplier' || this.ship.user_role=='admin') 
                && ['supplier_corrected'].includes(this.ship.stage_current) 
                ){
                return true
            }
            return false;
        },
        atCart(){
            if(
                (this.ship.user_role=='customer' || this.ship.user_role=='admin')
                && ['customer_cart'].includes(this.ship.stage_current) 
                ){
                return true
            }
            return false
        },
        nextStageButtons(){
            let buttons={};
            for(let i in this.ship.stage_next){
                if(this.ship.stage_next[i][0]){
                    buttons[i]=this.ship.stage_next[i];
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
        stageCreate(ship_id, ship_stage_code, severity){
            if( severity=='danger' ){
                if(!confirm("Вы уверены?")){
                    return
                }
            }
            this.$emit('stageCreate',ship_id, ship_stage_code);
        },
        async itemSync(){
            
        },
        // async descriptionPick(){
        //     const ship_description=this.ship?.ship_description
        //     const modal = await modalController.create({
        //         component: ShipDescriptionPicker,
        //         initialBreakpoint:'0.7',
        //         showBackdrop:true,
        //         componentProps:{ship_description},
        //     });
        //     modal.present()
        //     const data=await modal.onDidDismiss()
        //     if(data.role=="confirm"){
        //         this.ship_description=data.data
        //         this.itemUpdate()
        //     }
        // },
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
            this.itemUpdate()
        },
        async locationFinishSelect(){
            this.locationFinish=await this.locationSelect()
            this.itemUpdate()
        },
    },
    watch:{
        shipment(newval){
            this.ship=newval
        }
    }
})
</script>
