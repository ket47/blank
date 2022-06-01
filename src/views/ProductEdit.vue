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
    <ion-card :color="validity_perc<validity_min?'danger':''">
      <ion-card-header>
        <ion-label>Анкета заполнена на {{validity_perc}}%</ion-label>
        <ion-progress-bar :value="validity"></ion-progress-bar>
      </ion-card-header>
      <ion-card-content v-if="validity_perc<validity_min">
        <ion-text>
          Вам необходимо заполнить анкету не меньше чем на {{validity_min}}% для рассмотрения модератором
        </ion-text>
      </ion-card-content>
    </ion-card>
    <ion-card v-if="message&&validity_perc>validity_min">
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
        Вести учет остатков
        <ion-toggle slot="end" v-model="is_counted" @ionChange="save('is_counted',$event.target.checked?1:0)"/>
      </ion-item>
      <ion-item-divider></ion-item-divider>
      <ion-item button @click="$router.push('product-'+productItem.product_id)">
        <ion-icon :src="chevronBack" slot="start"/>
        Показать товар
      </ion-item>
      <ion-item button @click="showProductInStore()">
        <ion-icon :src="chevronBack" slot="start"/>
        Показать в магазине
      </ion-item>
      <ion-item button @click="$router.push('store-edit-'+productItem.store_id)">
        <ion-icon :src="chevronBack" slot="start"/>
        Управление магазином
      </ion-item>
    </ion-list>

    <form @change="saveForm" v-if="productItem">
      <ion-list lines="full">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Основные настройки</ion-label>
          </ion-item-divider>
          <ion-item>
            <ion-label position="stacked" color="primary">Название*</ion-label>
            <ion-input v-model="productItem.product_name" name="product_name" placeholder="полное название товара" clearInput="true"/>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" color="primary">Описание*</ion-label>
            <ion-textarea v-model="productItem.product_description" name="product_description" rows="6" placeholder="характеристики, свойства, состав товара"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Артикул</ion-label>
            <ion-input v-model="productItem.product_code" name="product_code" slot="end" placeholder="код товара"/>
          </ion-item>
          <ion-item v-if="is_counted">
            <ion-label color="primary">Остаток <span v-if="productItem.product_unit">({{productItem.product_unit}})</span></ion-label>
            <ion-input v-model="productItem.product_quantity" name="product_quantity" slot="end" placeholder="в наличии"/>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Мин. заказ*<span v-if="productItem.product_unit">({{productItem.product_unit}})</span></ion-label>
            <ion-input v-model="productItem.product_quantity_min" name="product_quantity_min" type="number" inputmode="numeric" pattern="\d\." slot="end"/>
          </ion-item>
          <ion-item>
            <ion-label color="primary">Единица*</ion-label>
            <ion-select v-model="productItem.product_unit" name="product_unit" slot="end">
              <ion-select-option value="шт">штука</ion-select-option>
              <ion-select-option value="кг">килограмм</ion-select-option>
              <ion-select-option value="м">метр</ion-select-option>
              <ion-select-option value="л">литр</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item v-if="productItem.product_unit!='кг'">
            <ion-label color="primary">Вес 1{{productItem.product_unit}} (кг)*</ion-label>
            <ion-input v-model="productItem.product_weight" name="product_weight" type="number" step="0.1" inputmode="numeric" pattern="\d\." slot="end"/>
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
          <ion-label color="primary">Цена*</ion-label>
          <ion-input v-model="productItem.product_price" name="product_price" type="number" inputmode="numeric" slot="end"/>
        </ion-item>
        <ion-item>
          <ion-label color="success">Цена акционная</ion-label>
          <ion-input v-model="productItem.product_promo_price" name="product_promo_price" type="number" inputmode="numeric" slot="end" color="success"/>
        </ion-item>
        <ion-item>
          <ion-label color="success">Начало акции</ion-label>
          <ion-input type="date" v-model="productItem.product_promo_start" name="product_promo_start" slot="end"/>
        </ion-item>
        <ion-item>
          <ion-label color="success">Конец акции</ion-label>
          <ion-input type="date" v-model="productItem.product_promo_finish" name="product_promo_finish" slot="end"/>
        </ion-item>
      </ion-list>
    </form>
    <ion-list v-if="productItem">
      <ion-item-divider>
        <ion-label>Изображения товара*</ion-label>
      </ion-item-divider>
      <image-tile-comp :images="productItem.images" :image_holder_id="productItem.product_id" controller="Product" ref="productImgs"></image-tile-comp>
      <ion-button @click="$refs.productImgs.take_photo()" size="small" expand="full" color="medium">
        <ion-icon :src="cameraOutline"/> Добавить
      </ion-button>
    </ion-list>

    <ion-list v-if="categoryList">
      <ion-item-divider>
          <ion-label>Категории товара*</ion-label>
      </ion-item-divider>
      <ion-item v-if="categoryList.length==0" color="light">
        <ion-icon :src="compassOutline" slot="start" color="danger"/>
        <ion-label color="danger">Без категории (в разделе 'Другое')</ion-label>
      </ion-item>
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
  IonCardHeader,
  IonToggle,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonItemDivider,
  IonItemGroup,
  IonButton,
  IonProgressBar,
  IonText,
  IonSelect,
  IonSelectOption,
  modalController
  }                   from '@ionic/vue'
import {
  cameraOutline,
  trashOutline,
  searchOutline,
  personOutline,
  addOutline,
  pizzaOutline,
  compassOutline,
  chevronBack
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
    IonCardHeader,
    IonToggle,
    IonIcon,
    IonItem,
    IonList,
    IonLabel,
    IonItemDivider,
    IonItemGroup,
    IonButton,
    IonProgressBar,
    IonText,
    IonSelect,
    IonSelectOption,
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
      compassOutline,
      chevronBack
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
      is_counted:0,
      validity:0,
      validity_perc:100,
      validity_min:80
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
      if(this.productItem?.is_counted!=1){
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
      if(this.productItem?.is_counted!=1){
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
  },
  methods:{
    async itemGet(){
      try{
        let productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        this.productItem=this.itemPrepare(productItem)
        this.itemValidityCalc()
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
      this.is_counted  = this.productItem.is_counted==0?0:1
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
    itemValidityCalc(){
      const requiredFields=[
        "product_name",
        "product_description",
        "product_code",
        "product_unit",
        "product_quantity_min",
        "product_weight",
        "product_price",
        "images",
        "member_of_groups.group_ids"
        ]
      const filedsTotal=requiredFields.length
      let validTotal=0
      for(const fields of requiredFields){
        let is_valid=0
        for(const field of fields.split('|')){
          let value=null
          const path=field.split('.')
          if(path[1]){//notation with dot
            value=this.productItem[path[0]][path[1]]
          } else {
            value=this.productItem[path[0]]
          }
          if(value?.length>0){
            is_valid=1
            break
          }
        }
        validTotal+=is_valid
      }
      this.validity=validTotal/filedsTotal
      this.validity_perc=Math.round(this.validity*100)
    },
    async itemUpdate(request){
      try{
        request['validity']=this.validity_perc
        await jQuery.post( heap.state.hostname + "Product/itemUpdate", JSON.stringify(request))
        return true
      } catch(err){
        const validationErrors=err.responseJSON.messages.error
        if(validationErrors?.includes('product_description')){
          this.$flash("Описание слишком короткое")
        } else
        if(validationErrors?.includes('product_name')){
          this.$flash("Название слишком короткое")
        } else 
        this.$flash("Изменение не сохранено")
        this.itemGet()
        return false
      }
    },
    checkPromoPrice(field_name){
      if( this.productItem.product_price<=this.productItem.product_promo_price ){
        if(field_name=='product_promo_price'){
          this.productItem.product_price=Number(this.productItem.product_promo_price)+1;
        }
        if(field_name=='product_price'){
          this.productItem.product_promo_price=Number(this.productItem.product_price)-1;
        }
        const request = {
          product_id:this.productId,
          product_promo_price:this.productItem.product_promo_price,
          product_price:this.productItem.product_price
        };
        this.itemValidityCalc()
        this.itemUpdate(request)
        this.$flash("Акционная цена должна быть ниже основной. Внимание цена изменена!")
        return false
      }
      return true
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.productItem[field_name]=ev.target.value
      if( !this.checkPromoPrice(field_name) ){
        return
      }
      this.save(field_name,field_value)
    },
    async save(field_name, field_value) {
      let request = {
        product_id:this.productId,
        [field_name]:field_value
      }
      if( this.itemUpdate(request) ){
        this.productItem[field_name] = field_value;
        this.itemValidityCalc()
        this.itemParseFlags()
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
    showProductInStore(){
      console.log(this.productItem)
      let sub_group_id=0;
      try{
        sub_group_id=this.productItem.member_of_groups.group_ids.split(',')[0];
      } catch{/** */}
      this.$router.push({path:('store-'+this.productItem.store_id),query:{sub_group_id}})
    }
  },
}
</script>