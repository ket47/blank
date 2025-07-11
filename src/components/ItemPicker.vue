<style scoped>

</style>
<template>
<div class="ion-page">
  <ion-header>
      <ion-toolbar>
          <ion-title>Выбрать {{itemTypeName}}</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-searchbar v-if="itemTypeLabel!='acc'" v-model="query" placeholder="поиск" :debounce="100" @ionInput="listGet()" />
    <ion-list v-if="!itemList">
        <ion-item v-for="i in [0,1,2,3,4,5,6,7,8,9]" :key="i" button detail>
            <ion-skeleton-text style="height:35px;width:40px" animated/>
             <ion-skeleton-text style="width:100%" animated/>
        </ion-item>
    </ion-list>
    <ion-list v-else-if="itemList?.length">
        <ion-item v-for="item in itemList" :key="item.id" button detail @click="itemPick(item)">
            <ion-avatar slot="start">
                <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.100.100.webp`"/>
            </ion-avatar>
            {{item.name}}
        </ion-item>
    </ion-list>
    <ion-list v-else>
        <ion-item>
            Ничего не найдено
        </ion-item>
    </ion-list>
  </ion-content>
</div>
</template>
<script>
import 
{
  closeOutline
}                         from 'ionicons/icons';
import {
    modalController,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonImg,
    IonList,
    IonItem,
    IonSearchbar,
    IonSkeletonText,
    IonAvatar,
}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['itemType','filter'],
    components:{
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonIcon,
        IonImg,
        IonList,
        IonItem,
        IonSearchbar,
        IonSkeletonText,
        IonAvatar,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        const itemTypeLabel=this.itemType?this.itemType:'order'
        return {
            query:'',
            itemList:null,
            itemTypeLabel,
            itemTypeName:''
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            if( this.itemTypeLabel=='order' ){
                this.itemTypeName='Заказ'
                this.ordersGet()
            } else
            if( this.itemTypeLabel=='store' ){
                this.itemTypeName='Продавец'
                this.storesGet()
            } else
            if( this.itemTypeLabel=='product' ){
                this.itemTypeName='Товар'
                this.productsGet()
            } else
            if( this.itemTypeLabel=='courier' ){
                this.itemTypeName='Курьер'
                this.couriersGet()
            } else 
            if( this.itemTypeLabel=='user' ){
                this.itemTypeName='Пользователь'
                this.usersGet()
            } else 
            if( this.itemTypeLabel=='acc' ){
                this.itemTypeName='Счет'
                this.accountsGet()
            } else {
                this.$flash('unknown item type '+this.itemTypeLabel)
            }
        },
        async storesGet(){
            let request={
                name_query:this.query,
                name_query_fields:'store_name',
                limit:10
            }
            if( this.filter ){
                request=Object.assign(request,this.filter)
            }
            try{
                let result=await this.$post(`Store/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`продавец ${item.store_name??item.store_name_new}`;
                    item.id=item.store_id
                    return item
                    })
            }catch{/** */}
        },
        async couriersGet(){
            let request={
                name_query:this.query,
                name_query_fields:'user_name,user_phone',
                limit:10
            }
            if( this.filter ){
                request=Object.assign(request,this.filter)
            }
            try{
                let result=await this.$post(`Courier/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`курьер ${item.user_name} ${item.user_phone}`;
                    item.id=item.courier_id
                    item.image_hash=item.courier_photo_image_hash
                    return item
                    })
            }catch{/** */}
        },
        async usersGet(){
            let request={
                name_query:this.query,
                name_query_fields:'user_name,user_phone',
                limit:10
            }
            if( this.filter ){
                request=Object.assign(request,this.filter)
            }
            try{
                let result=await this.$post(`User/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`Пользователь ${item.user_name} ${item.user_phone}`;
                    item.id=item.user_id
                    return item
                    })
            }catch{/** */}
        },
        async ordersGet(){
            const request={
                name_query:this.query,
                name_query_fields:'store_name,order_id,user_name',
                limit:10
            }
            try{
                let result=await this.$post(`Order/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`заказ#${item.order_id} ${item.store_name} > ${item.user_name}`;
                    item.id=item.order_id
                    return item
                    })
            }catch{/** */}
        },
        async accountsGet(){
            const request={
                group_table:'transaction_account_list'
            }
            try{
                let result=await this.$post(`Admin/GroupManager/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`${item.group_name}`;
                    item.type=item.group_type
                    return item
                    })
            }catch{/** */}
        },
        async productsGet(){
            let request={
                name_query:this.query,
                name_query_fields:'product_name,product_code',
                //store_id:this.store_id,
                limit:10
            }
            if( this.filter ){
                request=Object.assign(request,this.filter)
            }
            try{
                let result=await this.$post(`Product/listGet`,request)
                this.itemList=result.product_list.map(item=>{
                    item.name=`${item.product_name}`;
                    item.id=item.product_id
                    return item
                    })
            }catch{/** */}
        },
        itemPick(item){
            modalController.dismiss(item);
        },
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>