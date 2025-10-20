<template>
    <base-layout pageTitle="Мои бонусы" pageDefaultBackLink="/user">
        <ion-segment swipe-gesture="true" v-model="promoType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="bonuses">
                Бонусы
            </ion-segment-button>
            <ion-segment-button value="active">
                Скидки
            </ion-segment-button>
            <ion-segment-button value="inactive">
                Архив
            </ion-segment-button>
        </ion-segment>

        <ion-list v-if="promoType=='active'">
            <div v-for="promo in compPromoList" :key="promo.promo_id">
                <ion-item lines="none">
                    <ion-icon slot="start" :icon="giftOutline" color="primary"/>
                    <ion-text>
                        {{promo.promo_name}} 
                        <p style="color:#999">мин. заказ {{promo.min_order_sum_product}}{{$heap.state.currencySign}}; до {{promo.expiration}}</p>
                    </ion-text>
                    <ion-text slot="end" color="success"><b>{{promo.promo_value}}{{$heap.state.currencySign}}</b></ion-text>
                </ion-item>
            </div>
        </ion-list>

        <ion-list v-if="promoType=='inactive'">
            <div v-for="promo in compPromoList" :key="promo.promo_id">
                <ion-item lines="none">
                    <ion-icon slot="start" :icon="giftOutline" color="medium"/>
                    <ion-text>{{promo.promo_name}} до {{promo.exp_date_time}}</ion-text>
                    <ion-text slot="end"><b>{{promo.promo_value}}{{$heap.state.currencySign}}</b></ion-text>
                </ion-item>
                <ion-item>
                    <div v-if="promo.is_expired==1">
                        <ion-text color="danger">просрочена</ion-text>
                    </div>
                    <div v-else-if="promo.is_disabled==1">
                        <ion-text color="warning" style="cursor:pointer" @click="helpNotActive()">не активирована</ion-text>
                        <ion-icon color="warning" :icon="helpCircle" @click="helpNotActive()" style="cursor:pointer"/>
                    </div>
                    <ion-text v-if="promo.promo_order_id">использована в заказе #{{promo.promo_order_id}}</ion-text>
                </ion-item>
            </div>
        </ion-list>

        <ion-list v-if="promoList==null">
            <div v-for="skeleton in [1,2,3]" :key="skeleton">
            <ion-item lines="none">
                <ion-icon slot="start" :icon="giftOutline" color="medium"/>
                <ion-skeleton-text style="width:70%"></ion-skeleton-text>
                <ion-skeleton-text slot="end" style="width:50px"></ion-skeleton-text>
            </ion-item>
            <ion-item>
                <ion-skeleton-text style="width:70%"></ion-skeleton-text>
            </ion-item>
            </div>
        </ion-list>

        <div v-if="promoType=='bonuses'">
            <promo-statistics/>
        </div>
    </base-layout>
</template>
<script>
import {
  IonIcon,
  IonTitle,
  IonList,
  IonItem,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSkeletonText,
  IonAccordion,
  IonAccordionGroup,
}                       from '@ionic/vue'
import {
    giftOutline,
    closeOutline,
    banOutline,
    helpCircle,
    arrowRedoOutline,
}                       from 'ionicons/icons'
import jQuery           from 'jquery'
import { Share }        from '@capacitor/share';
import PromoStatistics  from '@/components/PromoStatistics.vue'

export default {
    components:{
  IonIcon,
  IonTitle,
  IonList,
  IonItem,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSkeletonText,
  IonAccordion,
  IonAccordionGroup,
  PromoStatistics
    },
    setup(){
        return {
    giftOutline,
    closeOutline,
    banOutline,
    helpCircle,
    arrowRedoOutline,
        }
    },
    data(){
        return {
            promoType:'bonuses',
            promoList:null
        }
    },
    mounted(){
        this.listGet()
    },
    computed:{
        compPromoList(){
            let promos=[]
            if( this.promoList ){
                for(let promo of this.promoList){
                    promo.exp_date_time=this.toLocDate(promo.expired_at)
                    promo.date_time=this.toLocDate(promo.created_at)
                    promos.push(promo)
                }
            }
            return promos;
        },
    },
    methods:{
        async listGet(){
            try{
                this.promoList=[]
                const request={
                    user_id:this.$heap.state.user.user_id,
                    type:this.promoType
                }
                this.promoList=await jQuery.post(`${this.$heap.state.hostname}Promo/listGet`,request)
            }catch{/** */}
        },
        listTypeChanged(e){
            const listType=e.target.value;
            this.listGet(listType);
        },
        toLocDate( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return event.toLocaleDateString(undefined, options);
        },
        async shareInvitation(){
            try{
                const targetTitle=this.$heap.state.settings.app_title
                const targetText='Присоединяйтесь и получите 5 сертификатов по 200руб'
                const canshare=await Share.canShare()
                const fullUrl=`${this.$heap.getters.settings.app.frontendUrl}invitation.html?inviter_user_id=${this.$heap.state.user.user_id}`
                if(canshare){
                    await Share.share({
                        title: targetTitle,
                        text: targetText,
                        url: fullUrl,
                        dialogTitle: targetTitle,
                    });
                } else if(navigator.clipboard){
                    await navigator.clipboard.writeText(fullUrl);
                    this.$alert("Теперь вы можете поделиться ей с друзьями в социальных сетях или мессенджерах.","Ссылка на страницу скопирована");
                } else {
                    this.$alert("Устройство не поддерживает функцию поделиться",""); 
                }
            }catch(err){
                //console.log(err)
            }
        },
        helpNotActive(){
            this.$alert("Эта скидка будет активирована, когда приглашённый вами друг воспользуется начисленной ему скидкой. Не забудьте напомнить😉")
        }
    }
}
</script>