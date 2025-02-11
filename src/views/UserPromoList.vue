<template>
    <base-layout pageTitle="Ваши скидки" pageDefaultBackLink="/user">
        <ion-card color="light">
            <ion-card-header>
                <ion-card-title>
                    Получите скидку
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>Новый пользователь, зарегистриванный <u>на сайте</u> по вашему приглашению, получит 3 скидки по 333руб.</p>
                <p>В качестве благодарности, мы начислим вам 3 скидки по 222руб.</p>
                <ion-accordion-group>
                    <ion-accordion>
                        <ion-item slot="header" color="light">
                            <ion-text slot="end" color="medium">подробнее</ion-text>
                        </ion-item>
                        <div slot="content" style="padding:10px">
                            <p>
                            После регистрации, на сайте, нового клиента по вашему приглашению, мы начислим вам 3 скидки по 222руб.
                            </p>
                            <p>
                                Эти скидки будут активироваться по мере того, как приглашённый вами друг, будет использовать свои скидки.
                            </p>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
                <p>
                    <ion-button @click="shareInvitation()" expand="block"><ion-icon :src="arrowRedoOutline"/>Пригласить друга</ion-button>
                </p>
            </ion-card-content>
        </ion-card>
        <ion-title></ion-title>
        <ion-text></ion-text>





        <ion-segment swipe-gesture="true" v-model="promoType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="active">
                Доступные
            </ion-segment-button>
            <ion-segment-button value="inactive">
                Неактивные
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

        <ion-list v-if="promoList?.length===0">
            <ion-item lines="none">
                Скидок нет, но вы можете получить их пригласив друга
            </ion-item>
        </ion-list>

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
            promoType:'active',
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