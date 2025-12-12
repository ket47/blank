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
    
    background-color: var(--ion-color-primary-shade) !important;
  }
  .post-preview{
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    overflow: hidden;
     
  }
  .slide-container{
    position: relative;
    overflow: hidden;
    height: 100%;
    max-width:500px;
    margin:auto;
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
  .slide-content{
    position: absolute;
    left: 0;
    bottom: 30px;
    padding: 16px;
    z-index: 100;
    width: 100%;
  }
  .slide-content ion-chip{
    --background:#00000066;
  }
  .slide-content>div>div{
    text-align:right
  }
  .slide-container:before{
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    opacity: 0.7;
    background: linear-gradient(to top, #000000aa, transparent);
  }
  @media screen and (max-width: 740px) {
    .crop-to-fit{

    }
  }
  @media screen and (min-width: 740px) {
    ion-modal {
      --height: 90vh;
      --width: calc(90vh / 1.77);
    }
  }
</style>

<template>
  <base-layout :hideTitle="1">
      <div v-if="postItem==null" style="position:relative;">
        <div class="post-preview">
          <div class="slide-container">
            <div class="slide-content">
              <div style="display:grid;grid-template-columns:1fr 150px ;">
                <div></div>
                <div>
                  <ion-chip v-for="i in [0,1,2,3,4]" :key="i">
                    <ion-label><ion-skeleton-text style="width:50px" animated/></ion-label>
                    <ion-skeleton-text style="width:20px;height:20px;" animated/>
                  </ion-chip>
                </div>
              </div>
              <ion-skeleton-text v-for="i in [0,1,2,3]" :key="i" style="width:100%;height:70px" animated/>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="postItem" style="position:relative;">
        <div class="post-preview">
          <div class="slide-container">
            <div class="story-toolbar">
              <div>
                <ion-avatar v-if="pickedStore?.avatar_hash">
                  <img :src="`${$heap.state.hostname}image/get.php/${pickedStore.avatar_hash}.150.150.webp`" />
                </ion-avatar>
                <ion-label><b>{{pickedStore?.store_name}}</b></ion-label>
              </div>
            </div>
            <div class="slide-content">
              <div style="display:grid;grid-template-columns:1fr 150px ;">
                <div></div>
                <div>

                  <ion-chip @click="popovers.image=1">
                    <ion-label v-if="postItem?.images?.length" color="light">Фото</ion-label>
                    <ion-label v-else color="danger">Нет фото</ion-label>
                    <ion-icon :icon="imageOutline" color="light"></ion-icon>
                  </ion-chip>
                  <ion-chip @click="popovers.holder=1">
                    <ion-label v-if="postItem?.holder?.store_name" color="light">{{ postItem.holder.store_name }}</ion-label>
                    <ion-label v-else color="danger">Автор</ion-label>
                    <ion-icon :icon="personOutline" color="light"></ion-icon>
                  </ion-chip>
                  <ion-chip @click="popovers.link=1">
                    <ion-label v-if="postItem?.post_route" color="primary">Ссылка</ion-label>
                    <ion-label v-else color="light">Нет ссылки</ion-label>
                    <ion-icon :icon="linkOutline" color="light"></ion-icon>
                  </ion-chip>
                  <ion-chip @click="popovers.date=1">
                    <ion-label color="light">{{ dateRange }}</ion-label>
                    <ion-icon :icon="calendarOutline" color="light"></ion-icon>
                  </ion-chip>
                  <ion-chip @click="popovers.reaction_tags=1">
                    <ion-label color="light">Реакции</ion-label>
                    <ion-icon :icon="chatboxOutline" color="light"></ion-icon>
                  </ion-chip>
                  <ion-chip>
                    <ion-label @click="itemDelete()" color="light">Удалить</ion-label>
                    <ion-icon :icon="trashOutline" color="light"></ion-icon>
                  </ion-chip>


                  <ion-chip v-if="postItem?.is_disabled==1" @click="save('is_disabled',0)">
                    <ion-label color="danger">На модерации</ion-label>
                    <ion-icon :icon="ban" color="danger"></ion-icon>
                  </ion-chip>
                  <ion-chip v-else @click="save('is_disabled',1)">
                    <ion-label color="light">Проверен</ion-label>
                    <ion-icon :icon="checkmarkOutline" color="light"></ion-icon>
                  </ion-chip>

                  <ion-chip v-if="postItem?.is_promoted==1" @click="save('is_promoted',0)">
                    <ion-label color="primary">Приоритет</ion-label>
                    <ion-icon :icon="star" color="primary"></ion-icon>
                  </ion-chip>
                  <ion-chip v-else @click="save('is_promoted',1)">
                    <ion-label color="light">Обычный пост</ion-label>
                    <ion-icon :icon="starOutline" color="light"></ion-icon>
                  </ion-chip>
                </div>
              </div>

              <form @change="saveForm" v-if="postItem.post_type=='story'">
                <h3 style="padding-left:10px;background: #0000004d;border-radius:16px;">
                  <ion-input v-model="postItem.post_title" labelPlacement="stacked" name="post_title" placeholder="Заголовок" clearInput="true" style="--placeholder-color: #fff;--color:#fff"></ion-input>
                </h3>
                <p style="padding-left:10px;background: #0000004d;border-radius:16px;">
                  <ion-textarea v-model="postItem.post_content" labelPlacement="stacked" name="post_content" rows="3" placeholder="Описание" style="--placeholder-color: #fff;--color:#fff"></ion-textarea>
                </p>
              </form>
              <ion-segment mode="ios" v-model="postItem.is_published" @ionChange="itemPublish()" style="--background:#ffffff66">
                  <ion-segment-button value="0" style="height: 50px;--indicator-color:var(--ion-color-light)">
                      <ion-icon :icon="eyeOffOutline"></ion-icon>
                      <ion-label>Скрыт</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="1" style="height: 50px;--indicator-color:var(--ion-color-success)">
                    <ion-icon :icon="eyeOutline"></ion-icon>
                    <ion-label>Опубликован</ion-label>
                  </ion-segment-button>
              </ion-segment>
              <ion-button color="light" expand="block" @click="$router.go(-1)"><ion-icon :icon="closeOutline" slot="start"></ion-icon>Закрыть</ion-button>
            </div>
            <div class="crop-to-fit">
              <img :src="`${$heap.state.hostname}image/get.php/${postItem.images[0]?.image_hash}.1500.1000.webp`"/>
            </div>
          </div>
        </div>
      </div>



      <ion-modal :is-open="popovers.link" :initial-breakpoint="0.5"  @didDismiss="itemGet();popovers.link = false">
        <form @change="saveForm">
          <h6 class="ion-padding-horizontal">Ссылка</h6>
          <ion-list>
              <ion-item>
                <ion-input type="text" v-model="postItem.post_route" label="Ссылка" labelPlacement="stacked" name="post_route" :readonly="!isAdmin"/>
                <ion-icon v-if="postItem.post_route" slot="end" :src="trashOutline" @click="save('post_route',null);popovers.link = false"/>
              </ion-item>
              <ion-item button @click="productPick()">
                  <ion-icon slot="start" :src="addOutline"/>
                  <ion-label>Выбрать товар</ion-label>
              </ion-item>
          </ion-list>
          <ion-button color="light" expand="block" @click="popovers.link = false">Закрыть</ion-button>
        </form>
      </ion-modal>

      <ion-modal :is-open="popovers.holder" :initial-breakpoint="0.5"  @didDismiss="itemGet();popovers.holder = false">
        <div>
          <h6 class="ion-padding-horizontal">Автор поста</h6>
          <ion-list>
                <ion-item v-if="postItem?.holder" button>
                    <ion-icon @click="storePick()" slot="start" :src="storefrontOutline"/>
                    <ion-label @click="storePick()">{{postItem.holder.store_name}}</ion-label>
                    <ion-icon slot="end" :src="trashOutline" @click="storeReset()"/>
                </ion-item>
                <ion-item v-else button @click="storePick()">
                    <ion-icon slot="start" :src="addOutline"/>
                    <ion-label>Добавить автора</ion-label>
                </ion-item>
          </ion-list>
          <ion-button color="light" expand="block" @click="popovers.holder = false">Закрыть</ion-button>
        </div>
      </ion-modal>


      <ion-modal :is-open="popovers.date" :initial-breakpoint="0.5"  @didDismiss="itemGet();popovers.date = false">
        <form @change="saveForm">
          <h6 class="ion-padding-horizontal">Время действия</h6>
          <ion-list addOutlinelines="full">
            <ion-item>
              <ion-input type="date" v-model="postItem.started_at" label="Начало показа" labelPlacement="stacked" name="started_at"/>
            </ion-item>
            <ion-item>
              <ion-input type="date" v-model="postItem.finished_at" label="Конец показа" labelPlacement="stacked" name="finished_at"/>
            </ion-item>
          </ion-list>
          <ion-button color="light" expand="block" @click="popovers.date = false">Закрыть</ion-button>
        </form>
      </ion-modal>

      <ion-modal :is-open="popovers.reaction_tags" :initial-breakpoint="0.5"  @didDismiss="itemGet();popovers.reaction_tags = null">
        <form @change="saveForm">
          <h6 class="ion-padding-horizontal">Поддерживаемые реакции</h6>
          <ion-list addOutlinelines="full">
            <ion-item>
              <ion-select v-model="postItem.reaction_tags" @ionChange="itemUpdate({post_id:postItem.post_id, reaction_tags:postItem.reaction_tags})" label="Тип реакций" labelPlacement="stacked" name="reaction_tags">
                  <ion-select-option value="">
                      Не выбрано
                  </ion-select-option>
                  <ion-select-option value="challenge">
                      Розыгрыш
                  </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
          <ion-button color="light" expand="block" @click="popovers.reaction_tags = false">Закрыть</ion-button>
        </form>
      </ion-modal>

      <ion-modal :is-open="popovers.image" :initial-breakpoint="0.5"  @didDismiss="itemGet();popovers.image = false">
        <div class="ion-padding">
          <ion-segment mode="ios" v-model="postItem.post_type" style="height: 70px;" @ionChange="itemImageDelete()">
              <ion-segment-button value="story">
                  <ion-icon :icon="phonePortraitOutline"></ion-icon>
                  <ion-label>История 1080х1920</ion-label>
              </ion-segment-button>
              <ion-segment-button value="slide">
                  <ion-icon :icon="phoneLandscapeOutline"></ion-icon>
                  <ion-label>Слайд 1920х700</ion-label>
              </ion-segment-button>
          </ion-segment>
          <image-tile-comp ref="postImgs" title="Фото поста" controller="Post" :params="imageParams" :images="postItem?.images??[]" :image_holder_id="postId" @change="itemGet();popovers.image = false;"></image-tile-comp>
          <ion-button @click="itemImageUpload()" expand="block">
            <ion-icon :src="imageOutline" slot="start"/> Загрузить изображение
          </ion-button>
        </div>
      </ion-modal>

  </base-layout>
</template>

<script>
import {
  modalController,
  actionSheetController,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonButton,
  IonAvatar,
  IonSegmentButton,
  IonSegment,
  IonChip,
  IonSkeletonText,
  }                   from '@ionic/vue'
import {
  trashOutline,
  checkmarkOutline,
  banOutline,
  ban,
  personOutline,
  addOutline,
  eyeOutline,
  eyeOffOutline,
  storefrontOutline,
  imageOutline,
  calendarOutline,
  starOutline,
  star,
  closeOutline,
  phonePortraitOutline,
  phoneLandscapeOutline,
  linkOutline,
  chatboxOutline
}                     from 'ionicons/icons'
import ImageTileComp  from '@/components/ImageTileComp.vue'
import jQuery         from "jquery";

import ItemPicker     from '@/components/ItemPicker.vue'
import ProductPicker  from '@/components/ProductPicker.vue'

import User           from "@/scripts/User.js";

export default  {
  components: { 
    ImageTileComp,
    IonModal,
    IonInput,
    IonTextarea,
    IonIcon,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonList,
    IonLabel,
    IonButton,
    IonAvatar,
    IonSegmentButton,
    IonSegment,
    IonChip,
    IonSkeletonText,
    },
  setup(){
    return {
      trashOutline,
      checkmarkOutline,
      banOutline,
      ban,
      personOutline,
      addOutline,
      eyeOutline,
      eyeOffOutline,
      storefrontOutline,
      imageOutline,
      calendarOutline,
      starOutline,
      star,
      closeOutline,
      phonePortraitOutline,
      phoneLandscapeOutline,
      linkOutline,
      chatboxOutline
    }
  },
  data(){
    return {
      postId: this.$route.params.id,
      postItem: null,

      imageParams:null,
      pickedStore:null,
      pickedProduct: null,
      storeList:[],
      popovers: {
        image: 0,
        holder: false,
        date: false,
        link: false,
        reaction_tags: false
      },
      is_deleted:0,
      is_disabled:0,
      is_promoted:0,
    }
  },

  created(){
    this.itemGet()
  },
  computed:{
    dateRange(){
      const start = this.postItem.started_at.split(' ').shift().split('-').reverse().splice(0,2).join('.')
      const finish=this.postItem.finished_at.split(' ').shift().split('-').reverse().splice(0,2).join('.')
      return `${start}-${finish}`
    },
    isAdmin(){
      return User.isAdmin()
    }
  },
  methods:{
    async itemGet(){
      try{
        if( this.postId==0 ){
          await this.itemCreatedGet()
          return
        }
        let postItem=await jQuery.post(`${this.$heap.state.hostname}Post/itemGet`, { post_id: this.postId })
        this.postItem=this.itemPrepare(postItem)
        this.itemImageParamsSet()
        if(postItem.post_holder=='store'){
          this.pickedStore = postItem.holder;
          this.pickedProduct = postItem.post_route
        } else {
          this.pickedStore = null;
          this.pickedProduct = null
        }
      }catch(err){
        if(err.responseJSON.status==404){
          this.$flash("Пост не найден")
        }
        this.$router.go(-1)
      }
    },
    itemImageParamsSet(){
      this.imageParams={post_type:this.postItem.post_type}
    },
    async itemImageDelete(){
      try{
        const post_image=this.postItem.images.pop()
        const request={
          image_id:post_image.image_id
        }
        this.$flash("Удаляем предыдущее фото")
        await jQuery.post(`${this.$heap.state.hostname}Image/itemDelete`,request)
      } catch{/** */}
    },
    async itemImageUpload(){
      if( this.postItem.is_published==1 ){
        this.postItem.is_published=0
        await this.itemPublish()
      }
      await this.itemImageDelete()
      this.itemImageParamsSet();
      //this.save('post_type',this.postItem.post_type)
      await this.$refs.postImgs.take_photo();
    },
    async itemPublish(){
      try{
        let fn='itemUnpublish'
        if(this.postItem.is_published==1){
          fn='itemPublish'
        }
        await jQuery.post(`${this.$heap.state.hostname}Post/${fn}`, { post_id: this.postId })
        if(this.postItem.is_published==1){
          this.$flash("Пост опубликован!")
        } else {
          this.$flash("Пост снят с публикации")
        }
      }catch(err){
        const error=err.responseJSON.messages.error
        if( error=='noimage' ){
          this.$flash("У поста нет фото")
        }
        if( error=='noholder' ){
          this.$flash("Укажите автора")
        }
        if( error=='disabled' ){
          this.$flash("Пост на модерации")
        }
        this.itemGet()
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
    /**
     * If there is any unpublished post use it instead
     */
    async itemCreatedGet(){
      const draft={
        post_title:'',
        post_type:	"story"
      }
      try{
        const post_id=await jQuery.post(`${this.$heap.state.hostname}Post/itemCreatedGet`, draft)
        if( post_id ){
          this.$router.replace(`/wall/post-user-edit-${post_id}`)
        }
      } catch (err){
        const error=err?.responseJSON?.messages?.error
        if(error=='forbidden'){
          this.$flash("Вы не можете создавать посты")
          this.$router.go(-1)
        }
      }
    },
    async itemDelete(){
      if( !confirm("Вы уверены?") ){
        return
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}Post/itemDelete`, { post_id: this.postId })
        this.$flash("🗑️ Пост удален")
        this.$router.go(-1)
      }catch{
        this.$flash("Ошибка удаления")
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
    async save(field_name, field_value) {
      if( !this.postItem.post_id ){//product not loaded yet
        return
      }
      if( ['is_disabled','is_promoted'].includes(field_name) && !this.isAdmin ){
        return;
      }
      let request = {
        post_id:this.postItem.post_id,
        [field_name]:field_value
      }
      if( this.itemUpdate(request) ){
        this.postItem[field_name] = field_value;
      }
    },
    saveForm(ev){
      const field_name=ev.target.name;
      const field_value=this.postItem[field_name]=ev.target.value
      this.save(field_name,field_value)
    },




    async storePick(){
      let filter={}
      if( !User.isAdmin() ){
        filter.owner_id=this.$heap.state.user.user_id??0
      }
      const modal = await modalController.create({
          component: ItemPicker,
          componentProps:{itemType:'store',filter},
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
      this.popovers.holder = false
      const request={
          post_id:this.postItem.post_id,
          post_holder:'store',
          post_holder_id:item.data.store_id
        }
      await this.itemUpdate(request)
      await this.itemGet()
    },
    async storeReset(){
      this.popovers.holder = false
      const request={
        post_id:this.postItem.post_id,
        post_holder:'store',
        post_holder_id:null
      }
      await this.itemUpdate(request)
      await this.itemGet()
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
      this.popovers.link = false
      const request={
        post_id:this.postItem.post_id,
        post_route: `/catalog/product-${item.data}`
      }
      await this.itemUpdate(request)
      await this.itemGet()
    },    
  },
}
</script>