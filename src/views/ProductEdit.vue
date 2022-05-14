<style scoped>
  .schedule ion-item ion-label{
    width:130px
  }
  .disabled{
    background-color: var(--ion-color-medium-shade);
  }
  .deleted{
    background-color: var(--ion-color-danger-tint);
  }
  .notworking{
    background-color: var(--ion-color-light-shade);
  }
  .primary{
    background-color: var(--ion-color-primary-shade);
  }
  .active{
    background-color: var(--ion-color-success-shade);
  }
</style>

<template>
  <base-layout :page-title="productItem?.product_name??'Товар'" :page-default-back-link="'/product-'+this.productId">
    <ion-card v-if="message">
      <ion-card-content :class="messageClass">
        {{message}}
      </ion-card-content>
    </ion-card>

    <ion-list v-if="productItem">
      <ion-item>
        <ion-icon :src="trashOutline" color="primary" slot="start"/>
        Удалено
        <ion-toggle slot="end" v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="searchOutline" color="primary" slot="start"/>
        На модерации
        <ion-toggle slot="end" v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)"></ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="pizzaOutline" color="primary" slot="start"/>
        Не ограниченный остаток
        <ion-toggle slot="end" v-model="is_produced" @ionChange="save('is_produced',$event.target.checked?1:0)"/>
      </ion-item>
    </ion-list>

    <form @change="saveForm" v-if="productItem">
      <ion-list lines="full">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Основные настройки</ion-label>
          </ion-item-divider>
          <ion-item>
            <ion-label position="stacked" color="primary">Название</ion-label>
            <ion-textarea v-model="productItem.product_name" name="product_name"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" color="primary">Описание</ion-label>
            <ion-textarea v-model="productItem.product_description" name="product_description" rows="6"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Артикул</ion-label>
            <ion-input v-model="productItem.product_code" name="product_code" slot="end"/>
          </ion-item>
          <ion-item v-if="!is_produced">
            <ion-label color="primary">Остаток {{productItem.product_unit}}</ion-label>
            <ion-input v-model="productItem.product_quantity" name="product_quantity" slot="end"/>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Единица</ion-label>
            <ion-input v-model="productItem.product_unit" name="product_unit" slot="end"/>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Мин. заказ</ion-label>
            <ion-input v-model="productItem.product_quantity_min" name="product_quantity_min" slot="end"/>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Вес единицы (кг)</ion-label>
            <ion-input v-model="productItem.product_weight" name="product_weight" slot="end"/>
          </ion-item>
        </ion-item-group>
      </ion-list>


      <ion-list lines="full">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Цена</ion-label>
          </ion-item-divider>
        </ion-item-group>
        <ion-item>
          <ion-label color="primary">Цена</ion-label>
          <ion-input v-model="productItem.product_price" name="product_price" slot="end"/>
        </ion-item>
        <ion-item>
          <ion-label color="primary">Цена акционная</ion-label>
          <ion-input v-model="productItem.product_promo_price" name="product_promo_price" slot="end" color="success"/>
        </ion-item>
        <ion-item>
          <ion-label color="primary">Начало акции</ion-label>
          <ion-input type="date" v-model="productItem.product_promo_start" name="product_promo_start" slot="end"/>
        </ion-item>
        <ion-item>
          <ion-label color="primary">Конец акции</ion-label>
          <ion-input type="date" v-model="productItem.product_promo_finish" name="product_promo_finish" slot="end"/>
        </ion-item>
      </ion-list>
    </form>
    <ion-list v-if="productItem">
      <ion-item-divider>
        <ion-label>Слайдер</ion-label>
      </ion-item-divider>
      <image-tile-comp :images="productItem.images" :image_holder_id="productItem.product_id" controller="Product" ref="productImgs"></image-tile-comp>
      <ion-button @click="$refs.productImgs.take_photo()" size="small" expand="full" color="medium">
        <ion-icon :src="cameraOutline"/> Добавить
      </ion-button>
    </ion-list>

    <ion-list v-if="categoryList">
      <ion-item-divider>
          <ion-label>Категории товара</ion-label>
      </ion-item-divider>
      <ion-item v-for="cat in categoryList" :key="cat.group_id">
        <ion-icon :src="compassOutline" slot="start" color="primary"/>
        <ion-label>{{cat.group_name}}</ion-label>
        <ion-icon :src="trashOutline" slot="end" @click="categoryDelete(cat.group_id,cat.group_name)"/>
      </ion-item>
      <ion-item button @click="categoryAdd()">
        <ion-icon :src="addOutline" slot="start" color="primary"/>
        <ion-label>Добавить в категорию</ion-label>
      </ion-item>
    </ion-list>

  </base-layout>
</template>

<script>
import {
  IonInput,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonToggle,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonItemDivider,
  IonItemGroup,
  IonButton,
  modalController
  }                   from '@ionic/vue'
import {
  cameraOutline,
  trashOutline,
  searchOutline,
  personOutline,
  addOutline,
  pizzaOutline,
  compassOutline
}                     from 'ionicons/icons'
import imageTileComp  from '@/components/ImageTileComp.vue'
import GroupPicker    from '@/components/GroupPicker.vue'
import heap           from '@/heap';
import Topic          from '@/scripts/Topic.js'
import jQuery         from "jquery";

export default  {
  components: { 
    IonInput,
    IonTextarea,
    IonCard,
    IonCardContent,
    IonToggle,
    IonIcon,
    IonItem,
    IonList,
    IonLabel,
    IonItemDivider,
    IonItemGroup,
    IonButton,
    imageTileComp
    },
  setup(){
    return {
      cameraOutline,
      trashOutline,
      searchOutline,
      personOutline,
      addOutline,
      pizzaOutline,
      compassOutline
      }
  },
  data(){
    return {
      productId: this.$route.params.id,
      productItem: null,
      productGroupList:null,
      is_groups_marked:0,
      is_deleted:0,
      is_disabled:0,
      is_produced:0
    }
  },
  computed: {
    message(){
      if(this.productItem?.deleted_at){
        return "Товар не активен и будет удален. Вы еще можете отменить удаление";
      }
      if(this.productItem?.is_disabled==1){
        return "Товар не активен и находится на рассмотрении у администратора";
      }
      if(this.productItem?.is_produced==1){
        return "Товар активен и готов к продаже. Товар произодится вами, например еда";
      }
      return "Товар активен и готов к продаже.";
    },
    messageClass(){
      if(this.productItem?.deleted_at){
        return "deleted";
      }
      if(this.productItem?.is_disabled==1){
        return "disabled";
      }
      if(this.productItem?.is_produced==1){
        return "primary";
      }
      return 'active';
    },
    categoryList(){
      let categories=[];
      try{
        let member_of_ids=this.productItem.member_of_groups.group_ids.split(',');
        let member_of_names=this.productItem.member_of_groups.group_names.split(',');
        for( let i in member_of_ids){
          categories.push({group_id:member_of_ids[i],group_name:member_of_names[i]})
        }
      }catch{/** */}
      return categories;
    }
  },
  created(){
    this.listGroupGet()
    this.itemGet()
    // this.groupChanged=(group_id,is_checked)=>{
    //     console.log(group_id)
    //   }
  },
  methods:{
    async itemGet(){
      try{
        let productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })


        this.productItem=this.itemPrepare(productItem)
        this.itemParseFlags()
        this.itemMarkGroups()
      }catch{
        //
      }
    },
    itemPrepare(productItem){
      if(productItem.product_promo_start){
        productItem.product_promo_start=productItem.product_promo_start.split(' ')[0]
      }
      if(productItem.product_promo_finish){
        productItem.product_promo_finish=productItem.product_promo_finish.split(' ')[0]
      }
      return productItem
    },
    itemParseFlags(){
      this.is_deleted   = this.productItem.deleted_at==null?0:1
      this.is_disabled  = this.productItem.is_disabled==0?0:1
      this.is_produced  = this.productItem.is_produced==0?0:1
    },
    async itemDelete( is_deleted ){
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( heap.state.hostname + "Product/"+remoteFunction, { product_id: this.productId })
        this.productItem.deleted_at=is_deleted?1:null;
      }catch{
        this.itemGet()
      }
    },
    async itemDisable( is_disabled ){
      if(this.productItem.is_disabled==is_disabled){
        return
      }
      try{
        await jQuery.post( heap.state.hostname + "Product/itemDisable", { product_id: this.productId, is_disabled })
        this.productItem.is_disabled=is_disabled;
      }catch{
        this.itemGet()
      }
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.productItem[field_name]=ev.target.value
      this.save(field_name,field_value)
    },
    async save(field_name, field_value) {
      let request = {
        product_id:this.productId,
        [field_name]:field_value
      };
      try{
        await jQuery.post( heap.state.hostname + "Product/itemUpdate", JSON.stringify(request))
        this.productItem[field_name] = field_value;
        this.itemParseFlags()
      } catch(err){
        const validationErrors=err.responseJSON.messages.error
        if(validationErrors?.includes('product_description')){
          this.$flash("Описание слишком короткое")
        } else
        if(validationErrors?.includes('product_name')){
          this.$flash("Название слишком короткое")
        } else 
        this.$flash("Не удалось сохранить изменение")
        this.itemGet()
      }
    },
    categoryDelete(group_id,group_name){
      if(!confirm("Исключить товар из категории "+group_name+"?")){
        return
      }
      try{
        this.itemUpdateGroup(0,group_id)
      } catch{/** */}
    },
    async categoryAdd(){
      const memberOfIds=this.productItem?.member_of_groups?.group_ids?.split(',')||[];
      const modal = await modalController.create({
          component: GroupPicker,
          componentProps:{controller:'Product',memberId:this.productId,memberOfIds,memberLimit:1},
          initialBreakpoint: 0.75,
          breakpoints: [0.75, 1],
          canDissmiss:true,
          });
      modal.present()
      Topic.on('dismissModal',()=>{
          modal.dismiss()
      });
      await modal.onDidDismiss();
      this.itemGet()
    },
    async itemUpdateGroup(is_joined,group_id){
      const request={
        product_id:this.productId,
        is_joined,
        group_id
      }
      try{
        await jQuery.post( heap.state.hostname + "Product/itemUpdateGroup", request)
      } catch(err){
        this.$flash("Не удалось сохранить изменение")
      }
      this.itemGet()
    },
    async listGroupGet(){
      try{
        this.productGroupList=await jQuery.get( heap.state.hostname + "Product/listGroupGet")
        this.itemMarkGroups()
      }catch{/** */}
    },
    
  },
}
</script>