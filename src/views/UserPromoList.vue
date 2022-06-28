<template>
    <base-layout pageTitle="Ваши скидки"  pageDefaultBackLink="user-promo">
        <ion-card>
            <ion-card-header>
                <ion-card-title>
                    Получите скидку
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <p>Новый пользователь, зарегистриванный по вашему приглашению, получит 5 скидок по 200руб.</p>
                <p>В качестве благодарности, мы начислим вам 5 скидок по 100руб.</p>
                <ion-accordion-group>
                    <ion-accordion>
                        <ion-item slot="header">
                            <ion-text slot="end" color="medium">подробнее</ion-text>
                        </ion-item>
                        <ion-text slot="content">
                            После регистрации нового клиента по вашему приглашению, мы начислим вам 5 скидок по 100руб. Эти скидки будут активироваться по мере того, как приглашённый вами друг, будет использовать свои скидки.
                        </ion-text>
                    </ion-accordion>
                </ion-accordion-group>
                <p>
                    <ion-button @click="shareInvitation()" expand="full">Пригласить друга</ion-button>
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
                Не активные
            </ion-segment-button>
        </ion-segment>

        <ion-list v-if="promoType=='active'">
            <div v-for="promo in compPromoList" :key="promo.promo_id">
                <ion-item lines="none">
                    <ion-icon slot="start" :icon="giftOutline" color="primary"/>
                    <ion-text>{{promo.promo_name}}</ion-text>
                    <ion-text slot="end" color="success"><b>{{promo.promo_value}}{{$heap.state.currencySign}}</b></ion-text>
                </ion-item>
                <ion-item>
                    <ion-text>действительна до: {{promo.exp_date_time}}</ion-text>
                </ion-item>
            </div>
        </ion-list>

        <ion-list v-if="promoType=='inactive'">
            <div v-for="promo in compPromoList" :key="promo.promo_id">
                <ion-item lines="none">
                    <ion-icon slot="start" :icon="giftOutline" color="medium"/>
                    <ion-text>{{promo.promo_name}}</ion-text>
                    <ion-text slot="end"><b>{{promo.promo_value}}{{$heap.state.currencySign}}</b></ion-text>
                </ion-item>
                <ion-item>
                    <ion-text v-if="promo.is_disabled" color="warning" style="cursor:pointer" @click="helpNotActive()">не активирована</ion-text>
                    <ion-icon v-if="promo.is_disabled" color="warning" :icon="helpCircle" @click="helpNotActive()" style="cursor:pointer"/>
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
}                       from 'ionicons/icons'
import jQuery           from 'jquery'
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
            if(!this.$heap.state.user?.user_id){
                this.$flash('Вы не авторизированы');
                return
            }
            try{
                const link=`${this.$heap.state.settings.app.frontendUrl}invitation.html?inviter_user_id=${this.$heap.state.user.user_id}`;
                if(navigator.share){
                    const shareData = {
                        title: this.$heap.state.settings.app_title,
                        text: 'Присоединяйтесь и получите 5 сертификатов по 200руб',
                        url:link
                    }
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(link);
                    this.$alert("Ссылка с приглашением скопирована. Теперь вы можете поделиться ей с друзьями в социальных сетях или мессенджерах.","Готово");
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