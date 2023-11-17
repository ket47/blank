<style scoped>
    .entry-deleted{
        color:var(--ion-color-danger);
    }
</style>
<template>
    <div v-if="orderData">
        <ion-list lines="none">
            <ion-item lines="full">
                <ion-label v-if="orderData.order_id>0" color="medium">
                Вызов курьера #{{orderData.order_id}}
                </ion-label>
                <ion-label v-else color="medium">
                Корзина
                </ion-label>

                <ion-chip color="primary" slot="end" v-if="orderData.stage_current_name">
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    <ion-label color="dark">{{orderData.stage_current_name}}</ion-label>
                </ion-chip>
            </ion-item>
            <ion-item lines="none">
                Доставка посылки
            </ion-item>
            <ion-item lines="none">
                <ion-icon :src="cubeOutline" slot="start" size="large" color="medium" style="font-size:2em"/>
                <ion-text color="primary">{{orderData.order_description}}</ion-text>
            </ion-item>

            <ion-item-divider>Детали перевозки</ion-item-divider>
            <ion-item>
                <ion-thumbnail v-if="orderData.locationStart?.image_hash" slot="start" style="--size:20px">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData.locationStart?.image_hash}.150.150.webp`"/>
                </ion-thumbnail>
                <ion-icon v-else color="primary" :src="locationOutline" slot="start"/>
                <ion-text><b>Откуда:</b> <ion-note>{{orderData.locationStart.location_address}}</ion-note></ion-text>
            </ion-item>
            <ion-item>
                <p>{{orderData.locationStart.location_comment}}</p>
            </ion-item>
            <ion-item>
                <ion-thumbnail v-if="orderData.locationFinish?.image_hash" slot="start" style="--size:20px">
                    <ion-img :src="`${$heap.state.hostname}image/get.php/${orderData.locationFinish?.image_hash}.150.150.webp`"/>
                </ion-thumbnail>
                <ion-icon v-else color="primary" :src="flagOutline" slot="start"/>
                <ion-text><b>Куда:</b> <ion-note>{{orderData.locationFinish.location_address}}</ion-note></ion-text>
            </ion-item>
            <ion-item>
                <p>{{orderData.locationFinish.location_comment}}</p>
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
    IonAccordion,
    IonAccordionGroup,
    IonChip,
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
    },
})
</script>
