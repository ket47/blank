<template>
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-title>Ваши доступные скидки</ion-title>
          <ion-icon :icon="closeOutline" @click="$topic.publish('dismissModal')" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list v-if="promoList==null">
        <ion-item lines="none" v-for="skeleton in [1,2,3]" :key="skeleton">
            <ion-icon slot="start" :icon="giftOutline" color="primary"/>
            <ion-skeleton-text style="width:70%"></ion-skeleton-text>
            <ion-skeleton-text slot="end" style="width:50px"></ion-skeleton-text>
        </ion-item>
    </ion-list>

    <div v-if="isPropositionOpen">
        <ion-card>
            <ion-card-content>
                <ion-title>
                Увеличьте заказ до <ion-text color="success">{{promo?.min_order_sum_product}}{{this.$heap.state.currencySign}}</ion-text>
                </ion-title>
                Эту скидку можно использовать для заказов от {{promo?.min_order_sum_product}}{{this.$heap.state.currencySign}}
            </ion-card-content>
        </ion-card>
        
        <ion-button color="primary" expand="block" @click="orderChange()">Увеличить заказ</ion-button>
        <ion-button color="light" expand="block" @click="promoPick({})">Без скидки</ion-button>
    </div>
    <ion-list v-else>
        <ion-item v-if="promoList?.length" button @click="promoPick({})">
            <ion-icon slot="start" :icon="banOutline" color="danger"/>
            <ion-text>Без скидки</ion-text>
            <ion-text slot="end">0{{$heap.state.currencySign}}</ion-text>
        </ion-item>
        <ion-item v-else>
            <ion-icon slot="start" :icon="giftOutline" color="medium"/>
            <ion-text color="medium">К сожалению, доступных скидок нет.</ion-text>
        </ion-item>

        <ion-item v-for="promo in promoList" :key="promo.promo_id" button @click="promoPick(promo)">
            <ion-icon slot="start" :icon="giftOutline" color="primary"/>
            <ion-text>
                {{promo.promo_name}} 
                <p style="color:#999">мин. заказ {{promo.min_order_sum_product}}{{$heap.state.currencySign}}; до {{promo.expiration}}</p>
            </ion-text>
            <ion-text slot="end" color="success">{{promo.promo_value}}{{$heap.state.currencySign}}</ion-text>
        </ion-item>
        
        <ion-item button detail @click="$go('/user/user-promo');$topic.publish('dismissModal')">
            <ion-text>Показать все ваши скидки <span v-if="!promoList?.length">или получить ещё</span></ion-text>
        </ion-item>
    </ion-list>
  </ion-content>
</template>
<script>
import {
  IonIcon,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
  IonText,
  modalController,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonButton,
}                       from '@ionic/vue'
import {
    giftOutline,
    closeOutline,
    banOutline,
}                       from 'ionicons/icons'
import jQuery           from 'jquery'
import Order            from '@/scripts/Order.js';
export default {
    components:{
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
        IonCardContent,
        IonButton,
    },
    props:['order'],
    setup(){
        return {
            giftOutline,
            closeOutline,
            banOutline,
        }
    },
    data(){
        return {
            promoList:null,
            promo:null,
            isPropositionOpen:0
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            try{
                const request={
                    type:'active',
                    user_id:this.$heap.state.user.user_id
                }
                this.promoList=await jQuery.post(`${this.$heap.state.hostname}Promo/listGet`,request)
            }catch{/** */}
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
            promo.min_order_sum_product=(promo?.min_order_sum_product??0)*1+1;
            if( this.order.order_sum_product*1<promo.min_order_sum_product ){
                this.isPropositionOpen=1
                return false
            }
            this.isPropositionOpen=0
            return true
        },
        async orderChange(){
            this.promoPick({});
            this.$flash(`Переходим в ${this.order.store.store_name}...`)
            await this.$router.replace('/catalog/store-'+this.order.order_store_id);            
            await Order.api.itemStageCreate(this.order.order_id, 'customer_cart')
            await Order.api.itemGet(this.order.order_id)
        }
    }
}
</script>