<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="orderData">
        <ion-list lines="none">
            <ion-item>
                <ion-chip color="primary" slot="end" v-if="orderData.stage_current_name">
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    <ion-label color="dark">{{orderData.stage_current_name}}</ion-label>
                </ion-chip>
            </ion-item>
            <ion-item>
                Доставка посылки
            </ion-item>
            <ion-item>
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="dark"><b>{{orderData.order_description}}</b></ion-text>
            </ion-item>

            <ion-item-divider>Детали перевозки</ion-item-divider>
            <ion-item>
                <ion-icon color="medium" :src="locationOutline" slot="start"/>
                Откуда
                <ion-chip slot="end" color="medium" v-if="orderData?.deliveryJob?.start_plan_date" @click="timePlanInfo()">
                    <ion-label><b>{{orderData.deliveryJob.start_plan_date}}</b></ion-label>
                    <ion-icon :src="alertCircleOutline"/>
                </ion-chip>
            </ion-item>
            <ion-item>
                <ion-thumbnail v-if="orderData.locationStart?.image_hash" slot="start" style="--size:20px">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData.locationStart?.image_hash}.150.150.webp`"/>
                </ion-thumbnail>
                <ion-icon v-else color="primary" :src="locationOutline" slot="start"/>
                <ion-text>
                    <a :href="`https://yandex.ru/maps/?pt=${orderData.locationStart.location_longitude},${orderData.locationStart.location_latitude}&z=19&l=map,trf`" target="_new">
                        {{orderData.locationStart.location_address}} 
                    </a>
                </ion-text>
            </ion-item>
            <ion-item v-if="orderData.locationStart.location_comment || orderData.locationStart.location_phone>0">
                <div>
                    <div v-if="orderData.locationStart.location_comment" style="padding:10px;background-color:#fafafa;color:#333;border-radius:10px;display:inline-block">
                        {{orderData.locationStart.location_comment}}
                    </div>
                    <ion-chip v-if="orderData.locationStart.location_phone>0" color="light">
                        <ion-icon :src="callOutline"/><a :href="`tel:+`+orderData.locationStart.location_phone">+{{orderData.locationStart.location_phone}}</a>
                    </ion-chip>
                </div>
            </ion-item>

            <ion-item>
                <ion-icon color="medium" :src="flagOutline" slot="start"/>
                Куда
                <ion-chip slot="end" color="medium" v-if="orderData.finish_plan_scheduled" @click="timePlanInfo()">
                    <ion-label><b>{{orderData.finish_plan_scheduled}}</b></ion-label>
                    <ion-icon :src="alertCircleOutline"/>
                </ion-chip>
            </ion-item>
            <ion-item>
                <ion-thumbnail v-if="orderData.locationFinish?.image_hash" slot="start" style="--size:20px">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData.locationFinish?.image_hash}.150.150.webp`"/>
                </ion-thumbnail>
                <ion-icon v-else color="primary" :src="flagOutline" slot="start"/>
                <ion-text>
                    <a :href="`https://yandex.ru/maps/?pt=${orderData.locationFinish.location_longitude},${orderData.locationFinish.location_latitude}&z=19&l=map,trf`" target="_new">
                        {{orderData.locationFinish.location_address}} 
                    </a>
                </ion-text>
            </ion-item>
            <ion-item v-if="orderData.locationFinish.location_comment || orderData.locationFinish.location_phone>0">
                <div>
                    <div v-if="orderData.locationFinish.location_comment" style="padding:10px;background-color:var(--ion-color-light);color:#333;border-radius:10px;display:inline-block">
                        {{orderData.locationFinish.location_comment}}
                    </div>
                    <ion-chip v-if="orderData.locationFinish.location_phone>0" color="primary">
                        <ion-icon :src="callOutline"/><a :href="`tel:+`+orderData.locationFinish.location_phone">+{{orderData.locationFinish.location_phone}}</a>
                    </ion-chip>
                </div>
            </ion-item>      

            <ion-item-divider>Итог</ion-item-divider>
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header">
                        <ion-icon :icon="walletOutline" slot="start" color="medium"></ion-icon>
                        <ion-text color="medium">Итого: </ion-text>
                        <ion-label slot="end" color="primary">{{ orderData.order_sum_total }}{{$heap.state.currencySign}}</ion-label>
                    </ion-item>
                    <ion-list slot="content">
                        <ion-item lines="none">
                            <ion-text color="medium">Доставка</ion-text>
                            <ion-label slot="end" color="primary">{{ orderData.order_sum_delivery }}{{$heap.state.currencySign}}</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-accordion>
            </ion-accordion-group>
        </ion-list>


        <ion-card color="primary"  v-if="0 && orderData.order_description">
            <ion-card-header>
                <ion-card-title>Посылка</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{orderData.order_description}}</ion-card-content>
        </ion-card>

        <ion-card color="warning"  v-if="orderData.order_objection">
            <ion-card-header>
                <ion-card-title>Проблема с заказом</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{orderData.order_objection}}</ion-card-content>
        </ion-card>





        <ion-grid>
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
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonItemDivider,
    IonAccordion,
    IonAccordionGroup,
    IonChip,
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
        IonCardHeader,
        IonCardContent,
        IonCardTitle,
        IonItemDivider,
        IonAccordion,
        IonAccordionGroup,
        IonChip,
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
    computed:{
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
        async timePlanInfo(){
            const alert = await alertController.create({
                header: 'Время доставки',
                message:'Указано приблизительное время. На него влияют длительность приготовления заказа, пробки и другие факторы.',
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

    },
})
</script>
