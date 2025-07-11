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

            <ion-list>
                <ion-item button detail @click="itemEdit({promo_code_id:0})">
                    <ion-icon :src="addOutline" slot="start"></ion-icon>
                    <ion-text>Добавить промокод</ion-text>
                </ion-item>
                <div v-for="item in listComputed" :key="item.promo_code_id">
                    <ion-item button detail @click="itemEdit(item)" lines="none">
                        <ion-label>{{item.promo_code}}</ion-label>
                        <ion-label slot="end">{{item.start_at_dmy}}-{{item.finish_at_dmy}}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-chip color="primary">
                            <ion-icon :src="callOutline"></ion-icon>
                            <ion-label><a :href="`tel:${item.user_phone}`">{{item.user_phone}}</a></ion-label>
                        </ion-chip>
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
  modalController,
  IonThumbnail,
  IonText,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonChip,
  IonIcon,
}                           from '@ionic/vue';
import jquery               from 'jquery'
import ImagePreviewModal    from '@/components/ImagePreviewModal'

import {
  callOutline,
  addOutline,
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
            addOutline,
            callOutline
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
                let items=await jquery.post(`${this.$heap.state.hostname}PromoCode/listGet`,request)

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