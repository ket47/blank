<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Промо коды">
        <div>
            <ion-card>
                <ion-card-content>
                    <ion-segment mode="ios" :scrollable="true"  v-model="item_type" value="disabled" label="Тип элементов" label-placement="stacked" @ionChange="listReload()" color="primary">
                        <ion-segment-button value="active">
                            активные
                        </ion-segment-button>
                        <ion-segment-button value="disabled">
                            выключенные
                        </ion-segment-button>
                        <ion-segment-button value="deleted">
                            удаленные
                        </ion-segment-button>
                    </ion-segment>                    
                </ion-card-content>
            </ion-card>

            <ion-searchbar placeholder="Фильтр" v-model="filter"/>

            <ion-list lines="full">
                <ion-item button detail @click="itemCreate()">
                    <ion-icon :src="addOutline" slot="start"></ion-icon>
                    <ion-text>Добавить промокод</ion-text>
                </ion-item>
                <div v-for="item in listComputed" :key="item.promo_code_id">
                    <ion-item button @click="itemEdit(item)" lines="none">
                        <ion-chip color="primary">
                            <ion-label>{{item.promo_code}}</ion-label>
                        </ion-chip>
                        <ion-label slot="end" color="primary">
                            {{ item.promo_sum }}{{ $heap.state.currencySign }}
                            <span  v-if="item.charge_sum" style="color:var(--ion-color-danger)">/{{ item.charge_sum }}{{ $heap.state.currencySign }}</span>
                        </ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label slot="start" color="medium">{{item.promo_description}}</ion-label>
                        <div slot="end">
                            <ion-icon v-if="item.promo_subject=='delivery'" :icon="rocketOutline" color="secondary"/>
                            <ion-icon v-if="item.promo_subject=='product'" :icon="cubeOutline" color="secondary"/>

                            <ion-icon v-if="item.case_user_id" color="medium" :icon="personOutline"/>

                            <ion-icon v-if="item.case_started_at" color="medium" :icon="calendarClearOutline"/>
                            <ion-icon v-else-if="item.case_finished_at" color="medium" :icon="calendarNumberOutline"/>

                            <ion-icon v-if="item.case_product_id" color="medium" :icon="fastFoodOutline"/>
                            <ion-icon v-else-if="item.case_store_id" color="medium" :icon="storefrontOutline"/>
                            <ion-icon v-if="item.charge_sum&&0" color="danger" :icon="removeCircleOutline"/>
                        </div>
                    </ion-item>
                </div>
            </ion-list>

            <ion-list v-if="is_loading==1">
                <ion-item v-for="item in [1,2,3]" :key="item" button detail>
                    <ion-thumbnail slot="start" style="background-color:lightgray"></ion-thumbnail>
                    <ion-skeleton-text animated></ion-skeleton-text>
                </ion-item>
            </ion-list>
            <ion-card v-else-if="listComputed.length==0" color="light">
                <ion-card-content>
                Ничего не найдено
                </ion-card-content>
            </ion-card>
            <ion-infinite-scroll @ionInfinite="listLoadMore($event)" id="moderation-infinite-scroll">
                <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Загрузка"></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </div>
    </base-layout>
</template>
<script>
import {
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonSegmentButton,
  IonSegment,
  IonThumbnail,
  IonText,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonChip,
  IonIcon,
}                           from '@ionic/vue';

import {
  walletOutline,
  addOutline,
  storefrontOutline,
  personOutline,
  removeCircleOutline,
  fastFoodOutline,
  rocketOutline,
  calendarNumberOutline,
  calendarClearOutline,
  cubeOutline,
}                     from 'ionicons/icons'

export default {
    components: {
        IonInfiniteScroll, 
        IonInfiniteScrollContent,
        IonItem,
        IonLabel,
        IonList,
        IonSegmentButton,
        IonSegment,
        IonThumbnail,
        IonText,
        IonSkeletonText,
        IonCard,
        IonCardContent,
        IonSearchbar,
        IonChip,
        IonIcon,
    },
    setup(){
        return {
  walletOutline,
  addOutline,
  storefrontOutline,
  personOutline,
  removeCircleOutline,
  fastFoodOutline,
  rocketOutline,
  calendarNumberOutline,
  calendarClearOutline,
  cubeOutline,
        }
    },
    data(){
        return{
            items:[],
            item_type:'disabled',
            filter:'',
            is_loading:0,
            is_items_left:1,
        }
    },
    computed:{
        listComputed(){
            return this.items
        }
    },
    methods:{
        async listLoadMore(ev){
            if( this.is_items_left ){
                await this.listLoad()
            }
            ev.target.complete();
        },
        async listReload(){
            this.is_items_left=1
            this.items=[]
            await this.listLoad()
        },
        async listLoad(){
            if( this.is_loading==1 ){
                return 
            }
            this.is_loading=1
            let request={
                is_disabled: this.item_type=='disabled'?1:0,
                is_active: this.item_type=='active'?1:0,
                is_deleted: this.item_type=='deleted'?1:0,
                name_query:this.filter,
                offset:this.items.length,
                limit:15
            }
            try{
                request.order='updated_at'
                let items=await this.$post(`PromoCode/listGet`,request)

                this.is_loading=0
                this.items=this.items.concat(items)
                if( items.length<request.limit ){
                    this.is_items_left=0
                }
            } catch(err){
                //console.log(err)
            }
        },
        listFilter(){
            clearTimeout(this.clock)
            this.clock=setTimeout(()=>{
                this.listReload()
            },300)
        },
        toLocDate( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        toLocDateTime( iso ){
            const event = new Date(Date.parse(iso));
            const options = { month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' };

            return event.toLocaleDateString(undefined, options);
        },
        toDmy( iso ){
            try{
                return iso.split(' ')[0].split('-').reverse().join('.')
            } catch{
                return ''
            }
        },
        itemEdit(item){
            this.$go('/admin/promo-code-edit-'+item.promo_code_id)
        },
        itemCreate(){
            this.$go('/admin/promo-code-create')
        },
    },
    mounted(){
        this.listLoad();
    },
    watch:{
        'filter':function(){
            this.listFilter()
        }
    },
    ionViewDidEnter(){
        this.listReload();
    }
}
</script>