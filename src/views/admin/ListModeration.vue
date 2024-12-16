<style scoped>
.deleted{
    border: 3px red solid;
}
</style>
<template>
    <base-layout pageDefaultBackLink="/user" page-title="Элементы">
        <ion-segment :scrollable="true" v-model="moderationType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="images">
                Картинки
            </ion-segment-button>
            <ion-segment-button value="posts">
                Посты
            </ion-segment-button>
            <ion-segment-button value="products">
                Товары
            </ion-segment-button>
            <ion-segment-button value="stores">
                Магазины
            </ion-segment-button>
            <ion-segment-button value="users" @click="item_type='active'">
                Пользователи
            </ion-segment-button>
            <ion-segment-button value="couriers">
                Курьеры
            </ion-segment-button>
        </ion-segment>
        <div>
            <ion-item>
                <ion-select v-model="item_type" value="disabled" label="Тип элементов" label-placement="stacked" @ionChange="listReload()">
                    <ion-select-option value="active">активные</ion-select-option>
                    <ion-select-option value="disabled">выключенные</ion-select-option>
                    <ion-select-option value="deleted">удаленные</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-searchbar v-if="moderationType=='posts' || moderationType=='stores' || moderationType=='products' || moderationType=='couriers' || moderationType=='users'" placeholder="Фильтр" v-model="filter"/>




                <ion-list v-if="moderationType=='users'">
                    <!--USERS component-->
                    <ion-item button detail @click="itemEdit({user_id:0})">
                        <ion-icon :src="addOutline" slot="start"></ion-icon>
                        <ion-text>Добавить нового пользователя</ion-text>
                    </ion-item>
                    <div v-for="item in listComputed" :key="item.item_id">
                        <ion-item button detail @click="itemEdit(item)" lines="none">
                            <ion-avatar slot="start">
                                <ion-img v-if="item.user_avatar_name" :src="`${$heap.state.settings.app.backendUrl}img/avatar/${item.user_avatar_name}.png`"/>
                            </ion-avatar>
                            <ion-text>{{item.item_name}}</ion-text>
                            <ion-label slot="end">{{item.date_dmy}}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-chip color="primary">
                                <ion-icon :src="callOutline"></ion-icon>
                                <ion-label><a :href="`tel:${item.user_phone}`">{{item.user_phone}}</a></ion-label>
                            </ion-chip>
                        </ion-item>
                    </div>
                </ion-list>
                <ion-list v-else-if="moderationType=='posts'">
                    <!--POSTS component-->
                    <ion-item button detail @click="itemEdit({post_id:0})">
                        <ion-icon :src="addOutline" slot="start"></ion-icon>
                        <ion-text>Добавить ноый пост</ion-text>
                    </ion-item>
                    <div v-for="item in listComputed" :key="item.item_id">
                        <ion-item button detail @click="itemEdit(item)" lines="none">
                            <ion-thumbnail slot="start" :class="item.class" v-if="item.image_hash">
                                <ion-img :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.150.150.webp`"/>
                            </ion-thumbnail>
                            <ion-text>{{item.item_name}}</ion-text>
                            <ion-label slot="end">{{item.date_dmy}}</ion-label>
                        </ion-item>
                    </div>
                </ion-list>
                <ion-list v-else>
                    <ion-item v-for="item in listComputed" :key="item.item_id" button detail @click="itemEdit(item)">
                        <ion-thumbnail slot="start" :class="item.class" v-if="item.image_hash">
                            <ion-img :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.150.150.webp`"/>
                        </ion-thumbnail>
                        <ion-text>{{item.item_name}}</ion-text>
                        <ion-label slot="end">{{item.date_time}}</ion-label>
                    </ion-item>
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
  IonImg,
  modalController,
  IonThumbnail,
  IonText,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonAvatar,
  IonIcon,
}                          from '@ionic/vue';
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
        IonImg,
        IonThumbnail,
        IonText,
        IonSkeletonText,
        IonCard,
        IonCardContent,
        IonSearchbar,
        IonSelect,
        IonSelectOption,
        IonChip,
        IonAvatar,
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
            moderationType:localStorage.listModerationLastType||"images",
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
                item.item_id=item.image_id||item.store_id||item.courier_id||item.product_id||item.post_id
                item.item_name=this.holders[item.image_holder]||(item.store_name??item.store_name_new)||item.user_name||item.product_name||item.post_title+(item.post_type=='story'?' (История)':item.post_type=='slide'?'  (Слайд)':'')
                item.date_time=this.toLocDateTime(item.updated_at)
                item.date_dmy=this.toDmy(item.updated_at)
                item.class=item.deleted_at?'deleted':''
            }
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
            this.listLoad()
        },
        async listLoad(){
            let request={
                is_disabled: this.item_type=='disabled'?1:0,
                is_active: this.item_type=='active'?1:0,
                is_deleted: this.item_type=='deleted'?1:0,
                name_query:this.filter,
                offset:this.items.length,
                limit:15
            }
            try{
                this.is_loading=1
                let items
                if(this.moderationType=='images'){
                    request.order='updated_at'
                    items=await jquery.post(`${this.$heap.state.hostname}Image/listGet`,request)
                } else 
                if(this.moderationType=='posts'){
                    request.name_query_fields='post_title,post_content'
                    request.order='updated_at'
                    const posts=await jquery.post(`${this.$heap.state.hostname}Post/listGet`,request)
                    items=posts.post_list
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
                } else 
                if(this.moderationType=='users'){
                    request.name_query_fields='user_phone,user_name'
                    request.order='signed_in_at'
                    items=await jquery.post(`${this.$heap.state.hostname}User/listGet`,request)
                }
                this.is_loading=0
                this.items=this.items.concat(items)
                if( items.length<request.limit ){
                    this.is_items_left=0
                }
            } catch(err){
                //console.log(err)
            }
        },
        listTypeChanged(e){
            localStorage.listModerationLastType=e.target.value;
            this.items=[]
            this.is_items_left=1
            this.listLoad();
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
            if( this.moderationType=='images' ){
                this.imageEdit(item)
            }
            if( this.moderationType=='posts' ){
                this.$go('/wall/post-edit-'+item.post_id)
            }
            if( this.moderationType=='products' ){
                this.$go('/catalog/product-edit-'+item.product_id)
            }
            if( this.moderationType=='stores' ){
                this.$go('/catalog/store-edit-'+item.store_id)
            }
            if( this.moderationType=='couriers' ){
                this.$go('/user/courier-dashboard?courier_id='+item.courier_id)
            }
            if( this.moderationType=='users' ){
                this.$go('/user/user-management?user_id='+item.user_id)
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
        if(this.moderationType=='users'){
            //this.item_type='active'
        }
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