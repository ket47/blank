<template>
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
            <ion-title>Промокоды и скидки</ion-title>
            <ion-icon :icon="closeOutline" @click="$topic.publish('dismissModal')" slot="end" size="large" color="dark"></ion-icon>
        </ion-item>
        <ion-item lines="none" style="--background:var(--ion-color-primary-tint);" v-if="0">
            <ion-input placeholder="Впишите Промокод" style111="--background:var(--ion-color-primary-tint);--placeholder-color: #000;--placeholder-opacity: 0.8;">
                <ion-button slot="end" color="success">
                    Применить
                </ion-button>
            </ion-input>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>

    <div v-if="promoList==null">
        <ion-card  v-for="skeleton in [1,2,3]" :key="skeleton">
            <ion-card-header>
                <div style="display:grid;grid-template-columns:2fr 1fr">
                    <div>
                        <ion-card-title><ion-skeleton-text style="width:60px;height:20px" animated></ion-skeleton-text></ion-card-title>
                        <ion-card-subtitle><ion-skeleton-text style="width:70%" animated></ion-skeleton-text></ion-card-subtitle>
                    </div>
                    <div><ion-button size="small" expand="block" color="light"><ion-skeleton-text style="width:70%"></ion-skeleton-text></ion-button></div>
                </div>
            </ion-card-header>
        </ion-card>
    </div>
    <div v-else-if="!promoList.length">
        <ion-card>
            <ion-card-header>
                <ion-card-subtitle>Нет доступных скидок</ion-card-subtitle>
            </ion-card-header>
        </ion-card>
    </div>
    <div v-else>
        <ion-card v-if="promoList?.length" button @click="promoPick({})">
            <ion-card-header>
                <div style="display:grid;grid-template-columns:2fr 1fr">
                    <div>
                        <ion-card-title>0{{ $heap.state.currencySign }}</ion-card-title>
                        <ion-card-subtitle>Без скидки</ion-card-subtitle>
                    </div>
                    <div><ion-button size="small" expand="block">Выбрать</ion-button></div>
                </div>
            </ion-card-header>
        </ion-card>
        <ion-item lines="none">
            <b>Подходящие скидки</b>
        </ion-item>
        <ion-card  v-for="promo in promoList" :key="promo.promo_id" button @click="promoPick(promo)">
            <ion-card-header>
                <div style="display:grid;grid-template-columns:2fr 1fr">
                    <div>
                        <ion-card-title style="color:var(--ion-color-success)">-{{promo.promo_value}}{{ $heap.state.currencySign }}</ion-card-title>
                        <ion-card-subtitle>Заказ {{promo.min_order_sum_product}}{{$heap.state.currencySign}}+</ion-card-subtitle>
                    </div>
                    <div><ion-button size="small" expand="block">Выбрать</ion-button></div>
                </div>
            </ion-card-header>
            <ion-card-content>
                <ion-label>{{promo.promo_name}}</ion-label>
                <p>до {{promo.expiration}}</p>
            </ion-card-content>
        </ion-card>
    </div>
  </ion-content>
</template>
<script>
import {
  modalController,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
  IonText,
  IonSkeletonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonLabel,
}                       from '@ionic/vue'
import {
    giftOutline,
    closeOutline,
    banOutline,
    textOutline,
}                       from 'ionicons/icons'
//import Order            from '@/scripts/Order.js';
export default {
    components:{
        modalController,
        IonIcon,
        IonToolbar,
        IonHeader,
        IonContent,
        IonTitle,
        IonList,
        IonItem,
        IonText,
        IonSkeletonText,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        IonButton,
        IonInput,
        IonLabel,
    },
    props:['order'],
    setup(){
        return {
            giftOutline,
            closeOutline,
            banOutline,
            textOutline,
        }
    },
    data(){
        return {
            promoList:null,
            promo:null,
            isPropositionOpen:0,
            promoType:'active',
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listTypeChanged(type){
            this.promoType=type
            this.listGet()
        },
        async listGet(){
            try{
                const request={
                    type:'all',
                    user_id:this.order.owner_id,
                    order_id:this.order.order_id,
                }
                this.promoList=await this.$post(`${this.$heap.state.hostname}Promo/listFilteredGet`,request)
            }catch(err){
                if(err.status==404){
                    this.promoList=[]
                }
            }
        },
        promoPick(promo){
            this.promo=promo
            if( !this.promoValidate(promo) ){
                return false
            }
            modalController.dismiss(promo);
        },
        promoValidate( promo ){
            if( !promo ){
                return true
            }
            //promo.min_order_sum_product=(promo?.min_order_sum_product??0)*1+1;
            if( this.order.order_sum_product*1<promo.min_order_sum_product ){
                this.$flash("Сумма заказа должна быть больше "+promo.min_order_sum_product)
                this.isPropositionOpen=1
                return false
            }
            this.isPropositionOpen=0
            return true
        },
        // async orderChange(){
        //     this.promoPick({});
        //     this.$flash(`Переходим в ${this.order.store.store_name}...`)
        //     await this.$router.replace('/catalog/store-'+this.order.order_store_id);            
        //     await Order.api.itemStageCreate(this.order.order_id, 'customer_cart')
        //     await Order.api.itemGet(this.order.order_id)
        // }
    }
}
</script>