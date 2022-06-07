<style scoped>

</style>
<template>
  <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Добавить товар</ion-title>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-searchbar @input="listGet({
          name_query: $event.target.value,
          name_query_fields: 'product_name,product_code',
        })" style="border-radius:10px;color: black;" placeholder="Поиск в этом предприятии"/>

    <ion-list>
        <ion-item v-for="product in productList" :key="product.product_id" @click="itemCreate(product.product_id)">
            <ion-img slot="start" :src="$heap.state.hostname + 'image/get.php/'+product.image_hash+'.50.50.webp'"/>
            <ion-label>{{product.product_name}}</ion-label>
            <ion-label slot="end" color="primary">{{product.product_final_price}}{{$heap.state.currencySign}}</ion-label>
        </ion-item>
    </ion-list>
  </ion-content>
</template>
<script>
import {
    modalController,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonImg
}               from '@ionic/vue'
import jQuery   from 'jquery'
export default {
    components:{
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonImg
    },
    props:['store_id','order_id'],
    data(){
        return {
            productList:[]
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(filter = {}){
            filter.store_id = this.store_id;
            filter.is_active = 1;
            filter.limit=5
            let response={};
            try{
                response=await jQuery.post(`${this.$heap.state.hostname}Product/listGet`, filter)
            }catch(err){/** */}
            this.productList=response.product_list
        },
        async itemCreate(product_id){
            let request={
                order_id:this.order_id,
                product_id:product_id,
                product_quantity:prompt(`Введите количество`,1)||1
            };
            try{
                await jQuery.post(`${this.$heap.state.hostname}Entry/itemCreate`, request)
            }catch(err){
                this.$flash("Не удалось добавить товар")
            }
            modalController.dismiss()
        }
    }
}
</script>