<style scoped>

</style>
<template>
<div class="ion-page">
  <ion-header>
      <ion-toolbar color="secondary">
          <ion-title>Выбрать {{itemTypeName}}</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-searchbar v-model="query" :debounce="100" @ionChange="listGet()" />
    <ion-list v-if="!itemList">
        <ion-item v-for="i in [0,1,2,3,4,5,6,7,8,9]" :key="i" button detail>
            <ion-skeleton-text style="height:35px;width:40px" animated/>
             <ion-skeleton-text style="width:100%" animated/>
        </ion-item>
    </ion-list>
    <ion-list v-else-if="itemList?.length">
        <ion-item v-for="item in itemList" :key="item.id" button detail @click="itemPick(item)">
            <ion-img v-if="item.image_hash" slot="start" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.50.50.webp`"/>
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
    IonChip,
    IonSearchbar,
    IonSkeletonText,
}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['itemType'],
    components:{
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonIcon,
        IonImg,
        IonList,
        IonItem,
        IonChip,
        IonSearchbar,
        IonSkeletonText,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        return {
            query:null,
            itemList:null,
            itemTypeName:''
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            if( this.itemType=='order' ){
                this.itemTypeName='Заказ'
                this.ordersGet()
            } else
            if( this.itemType=='store' ){
                this.itemTypeName='Продавец'
                this.storesGet()
            }else
            if( this.itemType=='courier' ){
                this.itemTypeName='Курьер'
                this.couriersGet()
            } else {
                this.$flash('unknown item type '+this.itemType)
            }
        },
        async storesGet(){
            const request={
                name_query:this.query,
                name_query_fields:'store_name',
                limit:10
            }
            try{
                let result=await jQuery.post(`${this.$heap.state.hostname}Store/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`продавец ${item.store_name}`;
                    item.id=item.store_id
                    return item
                    })
            }catch{/** */}
        },
        async couriersGet(){
            const request={
                name_query:this.query,
                name_query_fields:'user_name,user_phone',
                limit:10
            }
            try{
                let result=await jQuery.post(`${this.$heap.state.hostname}Courier/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`курьер ${item.user_name} ${item.user_phone}`;
                    item.id=item.courier_id
                    item.image_hash=item.courier_photo_image_hash
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
                let result=await jQuery.post(`${this.$heap.state.hostname}Order/listGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`заказ#${item.order_id} ${item.store_name} > ${item.user_name}`;
                    item.id=item.order_id
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