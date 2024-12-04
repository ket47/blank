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
</style>

<template>
  <base-layout :page-title="postItem?.post_title??'Пост'">
  <div v-if="postItem">
    <ion-card>
      <ion-card-content :class="messageClass">
        <ion-text color="dark">{{message}}</ion-text>
      </ion-card-content>
    </ion-card>


    <ion-list>
      <ion-item>
        <ion-icon :src="trashOutline" color="primary" slot="start"/>
        <ion-toggle v-model="is_deleted" color="danger" @ionChange="itemDelete($event.target.checked?1:0)">Удален</ion-toggle>
      </ion-item>
      <ion-item>
        <ion-icon :src="ribbonOutline" color="primary" slot="start"/>
        <ion-toggle v-model="is_disabled" @ionChange="itemDisable($event.target.checked?1:0)">На модерации</ion-toggle>
      </ion-item>
    </ion-list>

    <form @change="saveForm">
      <ion-list lines="full">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Основные настройки</ion-label>
          </ion-item-divider>
          <ion-item>
            <ion-input v-model="postItem.post_title" label="Заголовок*" labelPlacement="stacked" name="post_title" placeholder="заголовок" clearInput="true"/>
          </ion-item>
          <ion-item>
            <ion-textarea v-model="postItem.post_content" label="Содержание*" labelPlacement="stacked" name="post_content" rows="6" placeholder="текст"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-input v-model="postItem.post_route" label="Ссылка*" labelPlacement="stacked" name="post_route" placeholder="ссылка" clearInput="true"/>
          </ion-item>
        </ion-item-group>
      </ion-list>

      <ion-list lines="full">
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

      <ion-item-divider>
        <ion-label>Тип поста</ion-label>
      </ion-item-divider>
      <ion-list>
        <ion-radio-group v-model="postItem.post_type" @ionChange="saveForm" name="post_type">
          <ion-item v-for="type in postTypes" :key="type.post_type" @click="itemImageParamsSet()">
            {{type.post_type_name}}
            <ion-radio color="primary" slot="end" :value="type.post_type"></ion-radio>
          </ion-item>
        </ion-radio-group>
      </ion-list>
    </form>

    <ion-list v-if="imageParams">
      <ion-item-divider>
        <ion-label>Изображения*</ion-label>
      </ion-item-divider>
      <image-tile-comp :images="postItem.images" :image_holder_id="postItem.post_id" :params="imageParams" title="Фото поста" controller="Post" ref="postImgs"></image-tile-comp>
      <ion-button @click="$refs.postImgs.take_photo()" color="light" expand="block">
        <ion-icon :src="cameraOutline" slot="start"/> Добавить фото в пост
      </ion-button>
    </ion-list>


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
  <div v-else>
    loading
  </div>
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
  IonText,
  IonRadio,
  IonRadioGroup,
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
}                     from 'ionicons/icons'
import imageTileComp  from '@/components/ImageTileComp.vue'
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
    IonText,
    imageTileComp,
    IonRadio,
    IonRadioGroup,
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
      }
  },
  data(){
    return {
      postId: this.$route.params.id,
      postItem: null,
      imageParams:null,
      postTypes:[
        {
          post_type:'homeslide',
          post_type_name:'Главная-слайд 1920x700',
          image_height:700,
          image_width:1920,
        },
        {
          post_type:'wellcomeslide',
          post_type_name:'Приветствие-слайд 1500x3200',
          image_height:3200,
          image_width:1500,
        },
      ],
      is_deleted:0,
      is_disabled:0,
    }
  },
  computed: {
    messageCardSeverity(){
      if(this.postItem?.validity<50){
        return 'danger';
      }
      if(this.postItem?.validity<this.validity_min){
        return 'warning';
      }
      return 'primary';
    },
    message(){
      if( !this.postItem ){
        return ''
      }
      if(this.postItem.deleted_at){
        return "Пост не активен и будет удален. Вы еще можете отменить удаление"
      }
      if(this.postItem.is_disabled==1){
        return "Пост не активен и находится на рассмотрении у администратора"
      }
      if(this.postItem.is_hidden==1){
        return "Пост скрыт со стены."
      }
      return "Пост активен"
    },
    messageClass(){
      if( !this.postItem ){
        return ''
      }
      if(this.postItem?.deleted_at){
        return "pdeleted";
      }
      if(this.postItem?.is_disabled==1){
        return "pdisabled";
      }
      return 'pactive';
    },
    categoryList(){
      let categories=[];
      try{
        let member_of_ids=this.postItem.member_of_groups.group_ids.split(',');
        let member_of_names=this.postItem.member_of_groups.group_names.split(',');
        for( let i in member_of_ids){
          categories.push({group_id:member_of_ids[i],group_name:member_of_names[i]})
        }
      }catch{/** */}
      return categories;
    }
  },
  created(){
    this.itemGet()
  },
  methods:{
    async itemGet(){
      try{
        if( this.postId==0 ){
          await this.itemCreate()
          return
        }
        let postItem=await jQuery.post(`${this.$heap.state.hostname}Post/itemGet`, { post_id: this.postId })
        this.postItem=this.itemPrepare(postItem)
        this.itemParseFlags()
        this.itemImageParamsSet()
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
    itemParseFlags(){
      this.is_deleted   = this.postItem.deleted_at==null?0:1
      this.is_disabled  = this.postItem.is_disabled==0?0:1
    },
    async itemCreate(){
      const draft={
        post_title:'Черновик'
      }
      try{
        const post_id=await jQuery.post(`${this.$heap.state.hostname}Post/itemCreate`, draft)
        if( post_id ){
          this.$router.replace(`/wall/post-edit-${post_id}`)
        }
      } catch{/** */}
    },
    async itemDelete( is_deleted ){
      const remoteFunction=is_deleted?'itemDelete':'itemUnDelete'
      try{
        await jQuery.post( `${this.$heap.state.hostname}Post/${remoteFunction}`, { post_id: this.postId })
        this.postItem.deleted_at=is_deleted?1:null;
      }catch{
        this.itemGet()
      }
    },
    async itemDisable( is_disabled ){
      if(this.postItem.is_disabled==is_disabled){
        return
      }
      try{
        await jQuery.post( `${this.$heap.state.hostname}Post/itemDisable`, { post_id: this.postId, is_disabled })
        this.postItem.is_disabled=is_disabled;
      }catch{
        this.$flash("Изменение не сохранено")
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
    
  },
}
</script>