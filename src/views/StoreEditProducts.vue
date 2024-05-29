<style scoped>
.deleted{
    border: 3px red solid;
}
.disabled{
    border: 3px gray solid;
}
.absent img{
    filter: grayscale(1);
}
.hidden{
    border: 3px orange solid;
}
</style>
<template>
    <base-layout :pageDefaultBackLink="`/catalog/store-edit-${storeId}`" page-title="Управление товарами">
        <!-- <ion-segment :scrollable="true" v-model="moderationType" @ionChange="listTypeChanged($event)">
            <ion-segment-button value="products">
                Товары
            </ion-segment-button>
        </ion-segment> -->
        <div>
            <!-- <ion-item>
                <ion-select v-model="item_type" value="active" label="Тип элементов" label-placement="stacked" @ionChange="listReload()">
                    <ion-select-option value="active">активные</ion-select-option>
                    <ion-select-option value="disabled">выключенные</ion-select-option>
                    <ion-select-option value="deleted">удаленные</ion-select-option>
                </ion-select>
            </ion-item> -->
            <ion-searchbar placeholder="Фильтр" v-model="filter"/>



            <ion-popover :is-open="editor_opened" @didDismiss="editor_opened = 0">
                <ion-content style="--ion-padding">
                <ion-item>
                    <ion-input :placeholder="editor_placeholder" v-model="editor_value" style="--border-width:1px;--border-radius:10px" />
                    <ion-button slot="end">OK</ion-button>
                </ion-item>
                </ion-content>
            </ion-popover>

            <ion-list v-if="listComputed.length>0">
                <div v-for="item in listComputed" :key="item.item_id">
                <ion-item lines="none"  @click="itemEdit(item)" button detail="">
                    <ion-thumbnail slot="start" :class="item.class" style="border-radius:10px">
                        <ion-img :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.150.150.webp`"/>
                    </ion-thumbnail>
                    <ion-text>
                        {{item.item_name}}
                        <span v-if="item.is_counted==1 && item.product_quantity*1==0"> (нет в наличии)</span>
                        <span v-if="item.is_hidden==1"> (скрыт)</span>
                    </ion-text>
                </ion-item>
                <ion-item lines="full">
                    <ion-chip v-if="item.is_hidden==1" @click="itemUpdate(item.product_id,'is_hidden',0)" color="warning">
                        <ion-icon :src="eyeOffOutline"/>&nbsp;&nbsp;
                    </ion-chip>
                    <ion-chip v-else @click="itemUpdate(item.product_id,'is_hidden',1)" color="medium">
                        <ion-icon :src="eyeOffOutline"/>&nbsp;&nbsp;
                    </ion-chip>


                    <ion-chip v-if="item.is_counted==1" :color="item.product_quantity>0?'success':'danger'" @click="itemPrompt(item,'product_quantity','введите остаток')">
                        <ion-icon :src="calculatorOutline"/>
                        <ion-label>{{item.product_quantity||0}}{{item.product_unit}}</ion-label>
                    </ion-chip>
                    <ion-chip v-else @click="itemUpdate(item.product_id,'is_counted',1)" color="medium">
                        <ion-icon :src="calculatorOutline"/><ion-icon :src="infiniteOutline"/>&nbsp;&nbsp;
                    </ion-chip>

                    <ion-chip color="primary" @click="itemPrompt(item,'product_price','введите цену')">{{item.product_price}}{{$heap.state.currencySign}}</ion-chip>                    
                </ion-item>
                </div>
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
  IonList,
  IonImg,
  modalController,
  alertController,
  IonThumbnail,
  IonText,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonChip,
  IonCheckbox,
  IonIcon,

  IonPopover,
  IonContent,
  IonInput,
  IonButton,
 }                          from '@ionic/vue';
import jquery               from 'jquery'
import ImagePreviewModal    from '@/components/ImagePreviewModal'
import { 
  infiniteOutline,
  calculatorOutline,
  eyeOffOutline
}                         from "ionicons/icons";
export default {
    components: {
        IonInfiniteScroll, 
        IonInfiniteScrollContent,
        IonItem,
        IonList,
        IonImg,
        IonThumbnail,
        IonText,
        IonSkeletonText,
        IonCard,
        IonCardContent,
        IonSearchbar,
        IonChip,
        IonCheckbox,
        IonIcon,
        IonPopover,
        IonContent,
  IonInput,
  IonButton,
    },
    setup(){
        return {infiniteOutline,calculatorOutline,
  eyeOffOutline}
    },
    data(){
        return{
            storeId: this.$route.params.id,
            items:[],
            item_type:'active',
            filter:'',
            is_loading:0,
            moderationType:'products',
            holders:{
                'store':'Поставщик',
                'courier':'Курьер',
                'product':'Товар',
                'order':'Заказ',
                'product_group_list':'Категория товара',
                'location_group_list':'Категория местоп.',
                'store_group_list':'Категория поставщ.',
                'user_group_list':'Категория пользователя',
            },

            editor_opened:0,
            editor_value:null,
            editor_placeholder:''
        }
    },
    computed:{
        listComputed(){
            let list=[]
            for(let i of this.items){
                let item=Object.assign({},i)
                item.item_id=item.product_id
                item.item_name=item.product_name
                item.date_time=this.toLocDateTime(item.updated_at)
                item.class=''
                item.class+=(item.deleted_at)?'deleted ':''
                item.class+=(item.is_disabled==1)?'disabled ':''
                item.class+=(item.is_hidden==1)?'hidden ':''
                item.class+=(item.is_counted==1 && item.product_quantity==0)?'absent ':''
                list.push(item)
            }
            return list
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
                is_disabled: this.item_type=='disabled'?1:0,
                is_active: this.item_type=='active'?1:0,
                is_deleted: this.item_type=='deleted'?1:0,
                name_query:this.filter,
                offset:this.items.length,
                limit:15,
                //order:'group_id'
            }
            try{
                this.is_loading=1
                let items
                if(this.moderationType=='products'){
                    request.name_query_fields='product_name'
                    request.reverse='updated_at'
                    request.store_id=this.storeId
                    const products=await jquery.post(`${this.$heap.state.hostname}Product/listGet`,request)
                    items=products.product_list
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
        async itemPrompt( item, property, label ){
            const val=item[property]
            const conf={
                header: label,
                buttons: [
                    {
                        text: 'Ок',
                        role: 'confirm'
                    },
                    {
                        text: 'Отмена',
                        role: 'cancel'
                    },
                ],
                inputs: [
                    {
                        type:'input',
                        name:'comment',
                        placeholder: label,
                        value:val
                    },
                ],
            }
            if(property=='product_quantity'){
                conf.buttons.push({
                        text: 'Бесконечное кол-во',
                        role: 'notcount'
                    },)
            }
            const alert = await alertController.create(conf);
            await alert.present();
            const {data,role}=await alert.onDidDismiss()
            if(role=='cancel'){
                return
            }
            if(role=='notcount'){
                this.itemUpdate( item.product_id, 'is_counted', 0 )
                return
            }
            this.itemUpdate( item.product_id, property, data.values.comment )
        },
        async itemUpdate( product_id, property, value ){
            try{
                const update={
                    product_id:product_id,
                    [property]:value
                }
                await jquery.post(`${this.$heap.state.hostname}Product/itemUpdate`,JSON.stringify(update))
                this.itemAlter( product_id, property, value )
                this.$flash("💾 Сохранено")
            }catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                if(exception_code=='idle'){
                    return
                }
                this.$flash("Не сохранено")
            }
        },
        itemAlter( product_id, property, value ){
            for( let i in this.items ){
                if(this.items[i].product_id==product_id){
                    this.items[i][property]=value
                }
            }
        },
        itemEdit(item){
            if( this.moderationType=='images' ){
                this.imageEdit(item)
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