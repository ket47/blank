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
  <base-layout :page-title="productItem?.product_name??'Товар'" :pageDefaultBackLink="`/catalog/product-${productId}`">

  <div v-if="!is_option_child">
    <ion-card :color="productItem?.validity<validity_min?'danger':''">
      <ion-card-header>
        <ion-card-title>
          Форма заполнена на {{productItem?.validity??0}}%
          <ion-progress-bar :value="productItem?.validity/100"></ion-progress-bar>
        </ion-card-title>
      </ion-card-header>
      <ion-card-content v-if="productItem?.validity<validity_min">
        <ion-text>
          Вам необходимо заполнить анкету не меньше чем на {{validity_min}}% для рассмотрения модератором
          <p v-if="productItem?.validity==0">Обратите внимание на то, что поля 
            <ul>
              <li>Название (больше 5 букв), </li>
              <li>Цена, </li>
              <li>Актуальный остаток (если ведется учет), </li>
              <li>Изображения товара</li>
            </ul>
            обязательные
          </p>
        </ion-text>
      </ion-card-content>
    </ion-card>
    <ion-card v-if="message&&productItem?.validity>validity_min">
      <ion-card-content :class="messageClass">
        <ion-text>{{message}}</ion-text>
      </ion-card-content>
    </ion-card>
  </div>

    <ion-list v-if="productItem">
      <ion-item>
        <ion-icon :src="trashOutline" color="primary" slot="start"/>
        
        <ion-toggle v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)">Удалено</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="calculatorOutline" color="primary" slot="start"/>
        <ion-toggle v-if="productItem" v-model="is_counted" @ionChange="save('is_counted',$event.target.checked?1:0)">Вести учет остатков</ion-toggle>
      </ion-item>
      <ion-item v-if="!is_option_child">
        <ion-icon :src="layersOutline" color="primary" slot="start"/>
        <ion-toggle v-if="productItem" v-model="is_option_parent" @ionChange="itemOptionSet($event.target.checked);">Имеет варианты</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="ribbonOutline" color="primary" slot="start"/>
        <ion-toggle v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)">На модерации</ion-toggle>
      </ion-item>


      <!-- OPTIONS DATA 
      <ion-popover :is-open="is_option_menu_open" @didDissmiss="is_option_menu_open=false">
        <ion-content>
          <ion-list>
            <ion-item>
              Вариант
            </ion-item>
            <ion-item :button="true" :detail="false" @click="itemOptionPhotoAdd()">
              <ion-icon :src="cameraOutline" slot="start"/> Добавить фото
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>
      -->


      <div @change="saveForm" v-if="optionData">
          <ion-card @click="$router.replace(`product-edit-${optionData.parent.product_id}?refreshOptions=1`)" :color="(is_option_parent)?'primary':'light'">
            <ion-card-header>
              <ion-card-subtitle>
                Родительский товар
              </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-item color="light" lines="none">
                <img slot="start" style="height:70px;border-radius:10px;margin:3px" :src="`${$heap.state.hostname}image/get.php/${optionData.parent.image_hash}.70.70.webp`"/>
                <ion-label>{{optionData.parent.product_name}}</ion-label>
              </ion-item>
              <ion-item v-if="productId==optionData.parent.product_id" color="light">
                <ion-input label="Вариант*" label-placement="stacked" placeholder="напишите вариант" name="product_option" v-model="productItem.product_option"/>
              </ion-item>
              <ion-item lines="none" v-else color="light">
                <ion-text>[{{optionData.parent.product_option}}]</ion-text>
              </ion-item>
            </ion-card-content>
          </ion-card>
        <div style="display:grid;grid-template-columns:1fr 1fr">
          <ion-card @click="$router.replace(`product-edit-${option.product_id}?refreshOptions=1`)" v-for="option in optionData.children" :key="option.product_id" :color="productItem.product_id==option.product_id?'primary':''">
            <ion-card-content>
              <div v-if="productItem.product_id==option.product_id">
                <ion-item :color="productItem.deleted_at?'danger':''">
                  <ion-input label="Вариант*" label-placement="stacked" placeholder="напишите вариант" name="product_option" v-model="productItem.product_option"/>
                </ion-item>
                <ion-item v-if="productItem.image_hash">
                  <ion-icon :src="cameraOutline"/>
                </ion-item>
              </div>
              <ion-item lines="none" v-else>
                <ion-text :color="option.deleted_at?'danger':'medium'">[{{option.product_option}}]</ion-text>
              </ion-item>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-content>
              <ion-button color="light" expand="block" @click="itemOptionCreate()"><ion-icon :src="addOutline"/>добавить</ion-button>
            </ion-card-content>
          </ion-card>
        </div>
      </div>



      <div v-if="!is_option_child">
      <ion-item-divider></ion-item-divider>
      <ion-item button @click="$go('/catalog/product-'+productItem.product_id)" detail="false">
        <ion-icon :src="chevronBack" slot="start"/>
        Показать товар
      </ion-item>
      <ion-item button @click="showProductInStore()" detail="false">
        <ion-icon :src="chevronBack" slot="start"/>
        Показать в магазине
      </ion-item>
      <ion-item button @click="$go('/catalog/store-edit-'+productItem.store_id)" detail="false">
        <ion-icon :src="chevronBack" slot="start"/>
        Управление магазином
      </ion-item>
      </div>
    </ion-list>

    <form @change="saveForm" v-if="productItem">
      <ion-list lines="full">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Основные настройки</ion-label>
          </ion-item-divider>
          <ion-item v-if="!is_option_child">
            <ion-input v-model="productItem.product_name" label="Название*" labelPlacement="stacked" name="product_name" placeholder="полное название товара" clearInput="true"/>
          </ion-item>
          <ion-item v-if="!is_option_child">
            <ion-textarea v-model="productItem.product_description" label="Описание*" labelPlacement="stacked" name="product_description" rows="6" placeholder="характеристики, свойства, состав товара"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-input v-model="productItem.product_code" label="Артикул" labelPlacement="stacked" name="product_code" placeholder="код товара"/>
          </ion-item>
          <ion-item>
            <ion-input v-model="productItem.product_barcode" label="Штрихкод" labelPlacement="stacked" name="product_barcode" placeholder="штрихкод"/>
          </ion-item>
          <ion-item v-if="is_counted">
            <ion-input v-model="productItem.product_quantity" :label="`Остаток ${productItem.product_unit}`" labelPlacement="stacked" name="product_quantity" placeholder="в наличии"/>
          </ion-item>
          <ion-item>
            <ion-input v-model="productItem.product_quantity_min" :label="`Мин. заказ* ${productItem.product_unit}`" labelPlacement="stacked" name="product_quantity_min" type="number" inputmode="numeric" pattern="\d\."/>
          </ion-item>
          <ion-item v-if="!is_option_child">
            <ion-select v-model="productItem.product_unit" label="Единица*" labelPlacement="stacked" name="product_unit"  @ionChange="saveForm">
              <ion-select-option value="шт">штука</ion-select-option>
              <ion-select-option value="порция">порция вес</ion-select-option>
              <ion-select-option value="порция мл">порция объем</ion-select-option>
              <ion-select-option value="кг">килограмм</ion-select-option>
              <ion-select-option value="м">метр</ion-select-option>
              <ion-select-option value="л">литр</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item v-if="productItem.product_unit!='кг'">
            <ion-input v-model="productItem.product_weight" :label=" (productItem.product_unit=='порция мл')?'Объем л*':`Вес 1${productItem.product_unit} в кг*`" labelPlacement="stacked" name="product_weight" type="number" step="0.1" inputmode="numeric" pattern="\d\."/>
          </ion-item>
        </ion-item-group>
      </ion-list>


      <ion-list lines="full">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Цена</ion-label>
          </ion-item-divider>
        </ion-item-group>
        <!--
        <ion-item v-if="is_option_child">
          <ion-checkbox v-model="is_option_same_price" @ionChange="is_option_same_price?itemPriceReset():''">Цена как у родительского товара</ion-checkbox>
        </ion-item>
        -->
        <div v-if="!is_option_same_price">
          <ion-item>
            <ion-input v-model="productItem.product_price" label="Цена*" labelPlacement="stacked" name="product_price" type="number" inputmode="numeric"/>
          </ion-item>
          <ion-item>
            <ion-input v-model="productItem.product_net_price" label="Цена в меню/на полке" labelPlacement="stacked" name="product_net_price" type="number" inputmode="numeric"/>
          </ion-item>
          <ion-item>
            <ion-input v-model="productItem.product_promo_price" label="Цена акционная" labelPlacement="stacked" name="product_promo_price" type="number" inputmode="numeric" color="success"/>
          </ion-item>
          <ion-item>
            <ion-input type="date" v-model="productItem.product_promo_start" label="Начало акции" labelPlacement="stacked" name="product_promo_start"/>
          </ion-item>
          <ion-item>
            <ion-input type="date" v-model="productItem.product_promo_finish" label="Конец акции" labelPlacement="stacked" name="product_promo_finish"/>
          </ion-item>
        </div>
      </ion-list>
    </form>



    <ion-list v-if="productItem && !is_option_child">
      <ion-item-divider>
        <ion-label>Изображения товара*</ion-label>
      </ion-item-divider>
      <image-tile-comp :images="productItem.images" :image_holder_id="productItem.product_id" title="Витрина товара 5 фото" controller="Product" ref="productImgs"></image-tile-comp>
      <ion-button @click="$refs.productImgs.take_photo()" color="light" expand="block">
        <ion-icon :src="cameraOutline" slot="start"/> Добавить фото на витрину
      </ion-button>
    </ion-list>
    <!--
    <ion-list v-if="productItem && is_option_child">
      <ion-item-divider>
        <ion-label>Изображение варианта</ion-label>
      </ion-item-divider>
      <image-tile-comp :images="null" :image_holder_id="productItem.product_id" title="Фото варианта" controller="Product" ref="productImgs"></image-tile-comp>

      <ion-button @click="$refs.productImgs.take_photo()" color="light" expand="block">
        <ion-icon :src="cameraOutline" slot="start"/> Добавить фото варианта
      </ion-button>
    </ion-list>
    -->
    <ion-list v-if="productItem && categoryList && !is_option_child">
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
  IonCardTitle,
  IonCardSubtitle,
  modalController,
  }                   from '@ionic/vue'
import {
  cameraOutline,
  trashOutline,
  banOutline,
  personOutline,
  addOutline,
  calculatorOutline,
  compassOutline,
  chevronBack,
  layersOutline,
  ribbonOutline,
}                     from 'ionicons/icons'
import imageTileComp  from '@/components/ImageTileComp.vue'
import GroupPicker    from '@/components/GroupPicker.vue'
import heap           from '@/heap'
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
    IonCardTitle,
    IonCardSubtitle,
    imageTileComp
    },
  setup(){
    return {
      cameraOutline,
      trashOutline,
      banOutline,
      personOutline,
      addOutline,
      calculatorOutline,
      compassOutline,
      chevronBack,
      layersOutline,
      ribbonOutline,
      }
  },
  data(){
    return {
      productId: this.$route.params.id,
      productItem: null,
      productGroupList:null,
      validity:0,
      validity_min:80,
      optionData:null,
      refreshOptions:this.$route.query.refreshOptions,
      is_option_parent:false,
      is_option_child:false,
      is_option_menu_open:false,
//      is_option_same_price:false,
      is_groups_marked:0,
      is_deleted:0,
      is_disabled:0,
      is_counted:0,
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
        return "Товар активен и готов к продаже. Учет остатков товара не ведется";
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
  ionViewDidEnter() {
    if(this.refreshOptions && this.productItem?.product_parent_id){
        this.itemOptionGet();
    }
  },
  methods:{
    async itemGet(){
      try{
        let productItem=await jQuery.post( heap.state.hostname + "Product/itemGet", { product_id: this.productId })
        this.productItem=this.itemPrepare(productItem)
        this.itemParseFlags()
        //this.itemMarkGroups()

        this.is_option_child=(this.productItem.product_parent_id && this.productItem.product_parent_id!=this.productItem.product_id)
        this.is_option_parent=(this.productItem.product_parent_id && this.productItem.product_parent_id==this.productItem.product_id)
        //this.is_option_same_price=!parseFloat(this.productItem.product_price)
        await this.itemOptionGet();
      }catch(err){
        //console.log(err);
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
        if(this.is_option_child || this.is_option_parent){
          this.itemOptionGet()
        }
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
        this.$flash("Изменение не сохранено")
        this.itemGet()
      }
    },
    async itemUpdate(request){
      try{
        await jQuery.post( heap.state.hostname + "Product/itemUpdate", JSON.stringify(request))
        this.$flash("💾 сохранено")
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




    async itemOptionGet(){
      if(!this.productItem.product_parent_id){
        this.optionData=null
      }
      const request={
        product_parent_id:this.productItem.product_parent_id
      }
      let optionData=await jQuery.post(`${this.$heap.state.hostname}Product/itemOptionGet`,request)
      this.optionData={
        parent:optionData[0],
        children:optionData.slice(1)
      }
    },
    async itemOptionCreate(){
      const existingOptionCount=this.optionData?.children?.length??0
      const productOption={
        is_disabled:1,
        store_id:this.productItem.store_id,
        product_parent_id:this.productItem.product_parent_id,
        product_name:'OPTION',
        product_price:0,
        product_option: `Вариант#${existingOptionCount}`
      };
      try{
        await jQuery.post(`${this.$heap.state.hostname}Product/itemCreate`,productOption)
        this.itemOptionGet()
      } catch(err){/** */}
    },
    async itemOptionSet( set_option ){
      if( set_option ){
        await this.itemOptionSave( this.productId, this.productId )
      } else {
        await this.itemOptionDelete( this.productId )
      }
      this.itemGet()
    },
    async itemOptionUpdate( option_value ){
      //console.log(this.productId,option_value)
    },
    async itemOptionSave( product_id, product_parent_id ){
      try{
        await jQuery.post( `${this.$heap.state.hostname}Product/itemOptionSave`, { product_id, product_parent_id })
      }catch{/** */}
    },
    async itemOptionDelete( product_id ){
      if(!confirm("Удалить разновидности товара?")){
        return
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}Product/itemOptionDelete`, { product_id })
        this.itemOptionGet()
      }catch{/** */}
    },
    // itemPriceReset(){//needed for options
    //     const request = {
    //       product_id:this.productId,
    //       product_promo_price:0,
    //       product_price:0
    //     };
    //     this.itemUpdate(request)
    //     this.productItem.product_price=0
    //     this.productItem.product_promo_price=0
    // },


    checkPromoPrice(field_name){
      const promo=parseFloat(this.productItem.product_promo_price)
      const price=parseFloat(this.productItem.product_price)
      if( price>0 && promo>0 && price<=promo ){
        if(field_name=='product_promo_price'){
          this.productItem.product_price=promo+1;
        }
        if(field_name=='product_price'){
          this.productItem.product_promo_price=price-1;
        }
        const request = {
          product_id:this.productId,
          product_promo_price:this.productItem.product_promo_price,
          product_price:this.productItem.product_price
        };
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
      if( !this.productItem.product_id ){//product not loaded yet
        return
      }
      let request = {
        product_id:this.productItem.product_id,
        [field_name]:field_value
      }
      if( this.itemUpdate(request) ){
        this.productItem[field_name] = field_value;
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
      let sub_group_id=0;
      try{
        sub_group_id=this.productItem.member_of_groups.group_ids.split(',')[0];
      } catch{/** */}
      this.$go({path:('store-'+this.productItem.store_id),query:{sub_group_id}})
    }
  },
}
</script>