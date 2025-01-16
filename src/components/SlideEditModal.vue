<style scoped>
  .pdisabled{
    background-color: var(--ion-color-light-shade);
  }
  .pdeleted{
    background-color: var(--ion-color-danger-tint);
  }
  .phidden{
    background-color: var(--ion-color-warning-shade);
  }
  .pactive{
    background-color: var(--ion-color-success-shade);
  }
  .post-preview{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .slide-container{
    position: relative;
    overflow: hidden;
    height: 100%;
  }
  .crop-to-fit{
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .story-toolbar{
    position: absolute;
    width: 100%;
    padding: 16px;
    pointer-events: all;
    display: flex;
    justify-content: space-between;
    z-index: 100;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.486), transparent);
  }
  .story-toolbar > div{
    display: flex;
    color: white;
    align-items: center;
  }
  .story-toolbar > div ion-avatar{
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .crop-to-fit img{
    min-width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    pointer-events: none;
  }
  .slide-content{
    position: absolute;
    left: 0;
    bottom: 50px;
    padding: 16px;
    color: white;
    z-index: 100;
    -webkit-transform:translate3d(0,0,200px);
    transform: translate3d(0, 0, 200px);
  }
  .slide-container:before{
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    opacity: 0.7;
    background: linear-gradient(to top, black, transparent);
  }
  @media screen and (max-width: 740px) {
    .crop-to-fit{
      width: 100vw;
      height: 100vh;
    }
  }
  @media screen and (min-width: 740px) {
    ion-modal {
      --height: 90vh;
      --width: calc(90vh / 2.13);
    }
  }
</style>

<template>
  <div>
    <ion-modal :is-open="isOpen"  :initial-breakpoint="1" @willPresent="willPresent"  @willDismiss="willClose">
      <ion-header>
          <ion-toolbar>
            <ion-title>Изменить слайд</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal"><ion-icon :icon="closeOutline" slot="start"></ion-icon></ion-button>
              <ion-button :disabled="postItem?.images.length == 0" @click="popovers.holder = true" color="success"><ion-icon :icon="checkmarkOutline" slot="start"></ion-icon></ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
      <div v-if="postItem">
        <form @change="saveForm">
          <ion-list v-if="imageParams">
            <ion-item-divider>
              <ion-label>Изображения</ion-label>
            </ion-item-divider>
            <image-tile-comp :images="postItem.images" :image_holder_id="postItem.post_id" :params="imageParams" title="Фото поста" controller="Post" ref="postImgs"></image-tile-comp>
            <ion-button @click="$refs.postImgs.take_photo()" color="light" expand="block">
              <ion-icon :src="cameraOutline" slot="start"/> Добавить фото в пост
            </ion-button>
          </ion-list>
          <ion-list v-if="imageParams" lines="full">
            <ion-item-group>
              <ion-item-divider>
                <ion-label>Основные настройки</ion-label>
              </ion-item-divider>
              <div v-if="isAdmin">
                <ion-item>
                  <ion-input v-model="postItem.post_route" label="Ссылка*" labelPlacement="stacked" name="post_route" placeholder="ссылка" clearInput="true"/>
                </ion-item>
              </div>
              <div v-else-if="storeList && storeList.length > 0">
                <ion-item v-if="pickedProduct" button>
                    <ion-icon @click="productPick()" slot="start" :src="storefrontOutline"/>
                    <ion-label @click="productPick()">{{pickedProduct}}</ion-label>
                    <ion-icon slot="end" :src="trashOutline" @click="linkReset()"/>
                </ion-item>
                <ion-item v-else button @click="productPick()">
                    <ion-icon slot="start" :src="addOutline"/>
                    <ion-label>Добавить ссылку на продукт</ion-label>
                </ion-item>
              </div>
            </ion-item-group>
          </ion-list>

          <ion-list v-if="imageParams" lines="full">
            <ion-item-group>
              <ion-item-divider>
                <ion-label>Время действия</ion-label>
              </ion-item-divider>
            </ion-item-group>
            <ion-item>
              <ion-input type="date" v-model="postItem.started_at" label="Начало показа" labelPlacement="stacked" name="started_at"/>
            </ion-item>
            <ion-item>
              <ion-input type="date" v-model="postItem.finished_at" label="Конец показа" labelPlacement="stacked" name="finished_at"/>
            </ion-item>
          </ion-list>

        </form>
        <ion-list v-if="postItem && postItem.updated_user">
          <ion-item-divider>
              <ion-label></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            Изменен {{postItem.updated_at}}
            <a slot="end" :href="`tel:+${postItem.updated_user.user_phone}`">{{postItem.updated_user.user_name}}</a>
          </ion-item>
        </ion-list>
      </div>
      <ion-popover :is-open="popovers.holder"  @didDismiss="popovers.holder = false" size="auto">
        <form @change="saveForm">
          <h6 class="ion-padding-horizontal">Опубликовать как:</h6>
          <ion-list >
              <div v-if="isAdmin">
                <ion-item v-if="pickedStore" button>
                    <ion-icon @click="storePick()" slot="start" :src="storefrontOutline"/>
                    <ion-label @click="storePick()">{{pickedStore.store_name}}</ion-label>
                    <ion-icon slot="end" :src="trashOutline" @click="storeReset()"/>
                </ion-item>
                <ion-item v-else button @click="storePick()">
                    <ion-icon slot="start" :src="addOutline"/>
                    <ion-label>Добавить автора</ion-label>
                </ion-item>
              </div>
              <div v-else-if="storeList && storeList.length > 0">
                <ion-item v-for="store in storeList" :key="store.store_id" button @click="pickedStore=store; updateHolder(postItem.post_id, store.store_id)">
                  <ion-icon v-if="pickedStore && pickedStore.store_id == store.store_id" :icon="checkmarkOutline" slot="start"></ion-icon>
                  <ion-icon v-else :icon="storefrontOutline" slot="start"></ion-icon>
                  {{store.store_name||store.store_name_new||'- - -'}}
                </ion-item>
              </div>
          </ion-list>
        </form>
        <div  class="ion-margin">
          <ion-button :disabled="!isAdmin && !pickedStore" expand="block" @click="publishSlide(0)">
            <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
            Опубликовать
          </ion-button>
          <ion-button @click="publishSlide(1)" expand="block" fill="clear" color="danger">
            <ion-icon slot="start" :icon="banOutline"></ion-icon>
            Удалить
          </ion-button>
        </div>
      </ion-popover>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script>
import {
  IonModal,
  IonInput,
  IonTextarea,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonButton,
  modalController,
  IonItemDivider,
  IonItemGroup,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonContent,
  IonPopover,
  IonTitle,
  actionSheetController,
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
  eyeOffOutline,
  storefrontOutline,
  chevronUpCircle,
  imageOutline,
  chevronForwardOutline,
  calendarOutline,
  checkmarkOutline,
  closeOutline
}                     from 'ionicons/icons'
import imageTileComp  from '@/components/ImageTileComp.vue'
import jQuery         from "jquery";
import User     from "@/scripts/User.js";

import ItemPicker             from '@/components/ItemPicker.vue'
import ProductPicker     from '@/components/ProductPicker.vue'

export default  {
  components: { 
    IonModal,
    IonInput,
    IonTextarea,
    IonIcon,
    IonItem,
    IonList,
    IonLabel,
    IonButton,
    imageTileComp,
    IonItemDivider,
    IonItemGroup,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonContent,
    IonPopover,
    IonTitle
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
      eyeOffOutline,
      storefrontOutline,
      chevronUpCircle,
      imageOutline,
      chevronForwardOutline,
      calendarOutline,
      checkmarkOutline,
      closeOutline
    }
  },
  emits: ['onClose'],
  props: ['isOpen', 'postId'],
  data(){
    return {
      currentPostId: 0,
      postItem: null,
      imageParams:null,
      pickedStore:null,
      isAdmin: 0,
      storeList:[],
      popovers: {
        holder: false
      },
      postTypes:[
        {
          post_type:'slide',
          post_type_name:'Слайд 1920x700',
          image_height:700,
          image_width:1920,
        },
      ],
    }
  },
  methods:{
    async itemGet(){
      try{
        if( this.currentPostId==0 ){
          this.currentPostId = await this.itemCreate()
        }
        let postItem=await jQuery.post(`${this.$heap.state.hostname}Post/itemGet`, { post_id: this.currentPostId })
        this.postItem=this.itemPrepare(postItem)
        this.itemImageParamsSet()
        if(postItem.post_holder=='store'){
          this.pickedStore=postItem.holder;
          this.pickedProduct = postItem.post_route
        } else {
          this.pickedStore=null;
          this.pickedProduct = null
        }
      }catch(err){
        //console.log(err);
      }
    },
    itemImageParamsSet(){
        if(this.postItem.post_type){
          for(let type of this.postTypes){
            if(type.post_type==this.postItem.post_type){
              this.imageParams={image_width:type.image_width,image_height:type.image_height}
            }
          }
        }
    },
    itemPrepare(postItem){
      if(postItem.started_at){
        postItem.started_at=postItem.started_at.split(' ')[0]
      }
      if(postItem.finished_at){
        postItem.finished_at=postItem.finished_at.split(' ')[0]
      }
      return postItem
    },
    async itemCreate(){
      const draft={
        post_title:'',
        post_type:	"slide"
      }
      try{
        return await jQuery.post(`${this.$heap.state.hostname}Post/itemCreate`, draft)
      } catch{/** */}
    },
    async itemDelete( is_deleted, postId ){
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( `${this.$heap.state.hostname}Post/${remoteFunction}`, { post_id: postId })
        this.postItem.deleted_at=is_deleted?1:null;
      }catch{
        this.itemGet()
      }
    },
    async itemUpdate(request){
      try{
        await jQuery.post( `${this.$heap.state.hostname}Post/itemUpdate`, JSON.stringify(request))
        this.$flash("💾 сохранено")
        return true
      } catch(err){
        const validationErrors=err.responseJSON.messages.error
        if(validationErrors?.includes('post_content')){
          this.$flash("Описание слишком короткое")
        } else
        if(validationErrors?.includes('post_title')){
          this.$flash("Заголовок слишком короткий")
        } else 
        this.$flash("Изменение не сохранено")
        this.itemGet()
        return false
      }
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.postItem[field_name]=ev.target.value
      this.save(field_name,field_value)
    },
    async save(field_name, field_value) {
      if( !this.postItem.post_id ){//product not loaded yet
        return
      }
      let request = {
        post_id:this.postItem.post_id,
        [field_name]:field_value
      }
      if( this.itemUpdate(request) ){
        this.postItem[field_name] = field_value;
      }
    },
    async storePick(){
        const modal = await modalController.create({
            component: ItemPicker,
            componentProps:{itemType:'store'},
            initialBreakpoint: 0.75,
            breakpoints: [0.75, 1],
            canDissmiss:true,
        });
        modal.present()
        this.$topic.on('dismissModal',()=>{
            modal.dismiss()
        });
        const item=await modal.onDidDismiss();
        if(!item.data){
            return
        }
        this.updateHolder(this.postItem.post_id, item.data.store_id)
    },
    async productPick(){
        const modal = await modalController.create({
            component: ProductPicker,
            componentProps:{store_id:this.postItem.post_holder_id},
            initialBreakpoint: 0.75,
            breakpoints: [0.75, 1],
            canDissmiss:true,
        });
        modal.present()
        this.$topic.on('dismissModal',()=>{
            modal.dismiss()
        });
        const item=await modal.onDidDismiss();
        if(!item.data){
            return
        }
        const request={
          post_id:this.postItem.post_id,
          post_route: `/catalog/product-${item.data}`
        }
        await this.itemUpdate(request)
        await this.itemGet()
    },
    async canDismiss() {
      if(!this.postItem) return true;
      if(this.postItem.is_disabled == 0) return true;
      const actionSheet = await actionSheetController.create({
        header: 'Слайд будет удалён. Вы уверены?',
        buttons: [
          {
            text: 'Да',
            role: 'confirm',
          },
          {
            text: 'Нет',
            role: 'cancel',
          },
        ],
      });
      actionSheet.present();
      const { role } = await actionSheet.onWillDismiss();
      if(role === 'confirm' && this.postItem.is_disabled == 1){
        await this.itemDelete(1, this.postItem.post_id)
      }
      return role === 'confirm';
    },
    async updateHolder(post_id, post_holder_id){
        const request={
          post_id:post_id,
          post_holder:'store',
          post_holder_id:post_holder_id
        }
        await this.itemUpdate(request)
        await this.itemGet()
    },
    async storeReset(){
        const request={
          post_id:this.postItem.post_id,
          post_holder:'',
          post_holder_id:0
        }
        await this.itemUpdate(request)
        await this.itemGet()
    },
    async linkReset(){
        const request={
          post_id:this.postItem.post_id,
          post_route:'',
        }
        await this.itemUpdate(request)
        await this.itemGet()
    },
    async publishSlide( is_disabled = 1 ){
      const request={
        post_id: this.postItem.post_id,
        is_disabled: is_disabled
      }
      await this.itemUpdate(request)
      await this.itemGet()
      this.popovers.holder = false; 
      this.closeModal()
    },
    async closeModal(){
      if(await this.canDismiss()){
        modalController.dismiss();
      }
    },
    async willPresent(){
      this.isAdmin = User.isAdmin()
      this.storeList = await User.supplier.listGet()
      this.currentPostId = this.postId
      this.itemGet()
    },
    willClose(){
      this.$emit('onClose', true)
    },
    
  },
}
</script>