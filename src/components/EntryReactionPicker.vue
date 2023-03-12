<style scoped>

</style>
<template>
  <ion-header>
      <ion-toolbar color="secondary">
          <ion-title>Выбрать товар</ion-title>
          <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-searchbar v-model="query" :debounce="100" @ionChange="listGet()" />
    <ion-list v-if="productList">
        <ion-item v-for="product in productList" :key="product.product_id" button detail @click="itemPick(product.product_id)">
            <ion-img slot="start" :src="`${$heap.state.hostname}image/get.php/${product.image_hash}.50.50.webp`"/>
            {{product.product_name}} {{product.product_code}}
            <ion-chip v-if="product.product_option">{{product.product_option}}</ion-chip>
        </ion-item>
    </ion-list>
    <ion-list v-else>
        <ion-item>
            Ничего не найдено
        </ion-item>
    </ion-list>
  </ion-content>
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
}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['store_id','exclude_product_id'],
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
    },
    setup(){
        return {closeOutline}
    },
    data(){
        return {
            productList:null,
            query:null
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            const request={
                name_query:this.query,
                name_query_fields:'product_name,product_article',
                store_id:this.store_id,
                limit:10
            }
            try{
                let result=await jQuery.post(`${this.$heap.state.hostname}Product/listGet`,request)
                this.productList=result.product_list.filter(product=>product.product_id!=this.exclude_product_id)
            }catch{/** */}
        },
        itemPick(product_id){
            modalController.dismiss(product_id);
        },
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>