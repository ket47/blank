<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Модерация">
        <ion-segment :scrollable="true" v-model="moderationType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="images">
                Картинки
            </ion-segment-button>
            <ion-segment-button value="products">
                Товары
            </ion-segment-button>
            <ion-segment-button value="stores">
                Магазины
            </ion-segment-button>
            <ion-segment-button value="couriers">
                Курьеры
            </ion-segment-button>
        </ion-segment>
        <div>
            <ion-searchbar v-if="moderationType=='stores' || moderationType=='products' || moderationType=='couriers'" placeholder="Фильтр" v-model="filter"/>
            <ion-list v-if="listComputed.length>0">
                <ion-item v-for="item in listComputed" :key="item.item_id" button detail @click="itemEdit(item)">
                    <ion-thumbnail slot="start" :class="item.class">
                        <ion-img :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.50.50.webp`"/>
                    </ion-thumbnail>
                    <ion-text>{{item.item_name}}</ion-text>
                    <ion-label slot="end">{{item.date_time}}</ion-label>
                </ion-item>
            </ion-list>
            <ion-list v-else-if="is_loading==1">
                <ion-item v-for="item in [1,2,3]" :key="item" button detail>
                    <ion-thumbnail slot="start" style="background-color:lightgray"></ion-thumbnail>
                    <ion-skeleton-text animated></ion-skeleton-text>
                </ion-item>
            </ion-list>
            <ion-card v-else color="light">
                <ion-card-content>
                Ничего не найдено
                </ion-card-content>
            </ion-card>
            <ion-infinite-scroll @ionInfinite="listLoadMore($event)" id="moderation-infinite-scroll">
                <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data..."></ion-infinite-scroll-content>
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
  IonImg,
  modalController,
  IonThumbnail,
  IonText,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonSearchbar,
 }                          from '@ionic/vue';
import jquery               from 'jquery'
import ImagePreviewModal    from '@/components/ImagePreviewModal'

export default {
    components: {
        IonInfiniteScroll, 
        IonInfiniteScrollContent,
        IonItem,
        IonLabel,
        IonList,
        IonSegmentButton,
        IonSegment,
        IonImg,
        IonThumbnail,
        IonText,
        IonSkeletonText,
        IonCard,
        IonCardContent,
        IonSearchbar
    },
    data(){
        return{
            items:[],
            filter:'',
            is_loading:0,
            moderationType:'images',
            holders:{
                'store':'Поставщик',
                'courier':'Курьер',
                'product':'Товар',
                'order':'Заказ',
                'product_group_list':'Категория товара',
                'location_group_list':'Категория местоп.',
                'store_group_list':'Категория поставщ.',
                'user_group_list':'Категория пользователя',
            }
        }
    },
    computed:{
        listComputed(){
            for(let item of this.items){
                item.image_hash=item.image_hash||item.courier_photo_image_hash
                item.item_id=item.image_id||item.store_id||item.courier_id||item.product_id
                item.item_name=this.holders[item.image_holder]||(item.store_name??item.store_name_new)||item.user_name||item.product_name
                item.date_time=this.toLocDateTime(item.updated_at)
                item.class=item.deleted_at?'deleted':''
            }
            return this.items
        }
    },
    methods:{
        async listLoadMore(ev){
            await this.listLoad()
            ev.target.complete();
        },
        async listReload(){
            this.items=[]
            this.listLoad()
        },
        async listLoad(){
            let request={
                is_disabled:1,
                is_active:0,
                name_query:this.filter,
                offset:this.items.length,
                limit:15,
                order:'updated_at'
            }
            try{
                this.is_loading=1
                let items
                if(this.moderationType=='images'){
                    items=await jquery.post(`${this.$heap.state.hostname}Image/listGet`,request)
                } else 
                if(this.moderationType=='products'){
                    request.name_query_fields='product_name,product_description,product_barcode,product_code'
                    request.reverse='validity'
                    const products=await jquery.post(`${this.$heap.state.hostname}Product/listGet`,request)
                    items=products.product_list
                } else
                if(this.moderationType=='stores'){
                    request.name_query_fields='store_name,store_description'
                    request.reverse='validity'
                    items=await jquery.post(`${this.$heap.state.hostname}Store/listGet`,request)
                } else 
                if(this.moderationType=='couriers'){
                    request.name_query_fields='courier_vehicle,user_phone,user_name'
                    request.order='courier_list.updated_at'
                    items=await jquery.post(`${this.$heap.state.hostname}Courier/listGet`,request)
                }
                this.is_loading=0
                this.items=this.items.concat(items)
            } catch(err){
                //console.log(err)
            }
        },
        listTypeChanged(e){
            const listType=e.target.value;
            this.items=[]
            this.listLoad();
        },
        listFilter(){
            clearTimeout(this.clock)
            const self=this
            this.clock=setTimeout(()=>{
                self.listReload()
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
        itemEdit(item){
            if( this.moderationType=='images' ){
                this.imageEdit(item)
            }
            if( this.moderationType=='products' ){
                this.$router.push('/catalog/product-edit-'+item.product_id)
            }
            if( this.moderationType=='stores' ){
                this.$router.push('/catalog/store-edit-'+item.store_id)
            }
            if( this.moderationType=='couriers' ){
                this.$router.push('/user/courier-dashboard?courier_id='+item.courier_id)
            }
        },
        async imageEdit(item){
            const actions={
                'delete':['Удалить','danger'],
                'postpone':['Потом','primary'],
                'enable':['Ок','success'],
            }
            const modal = await modalController.create({
                component: ImagePreviewModal,
                componentProps:{image_hash:item.image_hash,actions},
                initialBreakpoint: 0.75,
                breakpoints: [0.75, 1]
                });
            this.$topic.on('dismissModal',()=>{
                modal.dismiss();
            });
            modal.present();
            const action=await modal.onDidDismiss()
            if( action.role=='delete' ){
                await this.imageDelete(item)
            }
            if( action.role=='enable' ){
                await this.imageEnable(item)
            }
            if( action.role=='postpone' ){
                await this.imagePostpone(item)
            }
            this.listReload()
        },
        async imageEnable(item){
            await jquery.post(`${this.$heap.state.hostname}Image/itemDisable`,{image_id:item.image_id,is_disabled:0})
        },
        async imagePostpone(item){
            //only to change updated_at db field
            await jquery.post(`${this.$heap.state.hostname}Image/itemDisable`,{image_id:item.image_id,is_disabled:0})
            await jquery.post(`${this.$heap.state.hostname}Image/itemDisable`,{image_id:item.image_id,is_disabled:1})
        },
        async imageDelete(item){
            await jquery.post(`${this.$heap.state.hostname}Image/itemDelete`,{image_id:item.image_id})
        },
    },
    mounted(){
        this.listLoad();
    },
    watch:{
        'filter':function(){
            this.listFilter()
        }
    }
}
</script>