<style scoped>
.star-container{
  display: flex;
  gap: 3px;
  opacity: 0.2; 
  font-size: 1.5rem;
  margin-top: 5px;
}
</style>
<template>
  <ion-modal :isOpen="isOpen" :initial-breakpoint="0.35" :breakpoints="[0, 0.35, 0.45]" :backdrop-dismiss="false" :backdrop-breakpoint="0.5">
    <ion-content v-if="productItem.product_id" >
      <ion-item lines="none">
        <div v-if="!reactionCompleted">
          <h5 style="margin-bottom: 0;">Оцените вашу покупку</h5>
          <p style="margin-top: 5px; color: var(--ion-color-medium)">А мы вознаградим вас изумрудами</p>
        </div>
        <ion-buttons slot="end">
          <ion-button @click="isOpen = false">
            <ion-icon :icon="closeOutline"  size="large"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
      <div v-if="!reactionCompleted"> 
          <ion-item lines="none">
            <div style="border-radius: 4px; padding: 5px; margin-right: 10px;">
              <img width="70px" :src="`${$heap.state.hostname}image/get.php/${productItem.images[0]?.image_hash}.350.350.webp`"/>
            </div>
            <ion-label>
              <h3><b>{{ productItem.product_name }}</b></h3>
              <ion-chip color="medium">
                <ion-avatar>
                  <img :src="`${$heap.state.hostname}image/get.php/${productItem.store.avatar[0]?.image_hash}.50.50.webp`"/>
                </ion-avatar>
                <ion-label>{{ productItem.store.store_name }}</ion-label>
              </ion-chip>
            
            </ion-label>
            <ion-chip color="medium" slot="end" style="overflow:visible">
                <ion-icon :src="thumbsUpSharp" :color="reaction.is_like==1?`dark`:`medium`" @click="itemReactionCreate('is_like', true); likeDisabled = true" class="like_animate"/>
                <ion-label color="medium">&nbsp;|&nbsp;</ion-label> 
                <ion-icon :src="thumbsDownSharp" :color="reaction.is_dislike==1?`dark`:`medium`" @click="itemReactionCreate('is_dislike', true); likeDisabled = true"/>
            </ion-chip>
          </ion-item>
          <ion-item v-if="likeDisabled" lines="none">
              <ion-textarea
                  rows="1"
                  auto-grow="true"
                  v-model="reaction.comment"
                  placeholder="отзыв о товаре"
                  label=""
                  style="background:var(--ion-color-primary-tint);border-radius:10px;margin-bottom:3px;"
              ></ion-textarea>
              <ion-button style="margin-left: 5px;" color="primary" size="default" :disabled="reaction.comment == ''" @click="itemReactionCreate('comment', reaction.comment);" >
                <ion-icon :icon="send" ></ion-icon>
              </ion-button>
          </ion-item>
          <ion-button v-if="likeDisabled" expand="block" fill="clear" color="primary" size="default" @click="isOpen = false" >
              ЗАКРЫТЬ
          </ion-button>
        </div>
        <div v-else style="text-align: center;">
          <h5 style="margin-bottom: 0;">Спасибо за отзыв!</h5>
          <p style="margin-top: 5px; color: var(--ion-color-medium); font-size: 13px;">Мы начислили вам изумруды. Они доступны в личном кабинете.</p>
          <ion-button v-if="likeDisabled"  color="primary" size="default" @click="isOpen = false" >
              Хорошо
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
</template>
<script>
import {
  addOutline,
  chevronDownOutline,
  star,
  thumbsUpSharp,
  thumbsDownSharp,
  send,
  closeOutline
}                             from 'ionicons/icons'
import {
  IonModal,
  IonContent,
  IonToolbar,
  IonIcon,
  IonItem,
  IonTitle,
  IonAvatar,
  IonChip,
  IonLabel,
  IonText,
  IonButton,
  IonTextarea,
  IonButtons
}                   from '@ionic/vue'
import Utils        from '@/scripts/Utils.js'
import jQuery       from 'jquery'
import Topic        from '@/scripts/Topic.js';

export default {
  components:{
    IonModal,
    IonContent,
    IonToolbar,
    IonTitle,
    IonChip,
    IonIcon,
    IonAvatar,
    IonLabel,
    IonButtons,
    IonItem,
    IonText,
    IonButton,
    IonTextarea
  },
  props:['disable','isNeedToBeShown'],
  setup(){
      return {
        addOutline,
        chevronDownOutline,
        star,
        thumbsUpSharp,
        thumbsDownSharp,
        send,
        closeOutline
      }
  },
  data(){
    return {
      productItem: {},
      reaction: {
        is_like: false,
        is_dislike: false,
        comment: ''
      },
      editMode: true,
      likeDisabled: false,
      reactionCompleted: false,
      isOpen: false
    }
  },
  methods:{
    async loadSuggest() {
      try{
        let response
        response=await Utils.post(`${this.$heap.state.hostname}Reaction/itemGetSuggest`, {})
        this.productItem = response
      }catch(err){
        this.productItem= {}
      }
    },
    async itemReactionCreate(key, value){
      if(key.includes('like') && this.likeDisabled) return false;
      this.reaction[key] = value
      let request={
        tagQuery: `entry:${this.productItem.entry_id}`
      }
      request[key] = value
      await jQuery.post(`${this.$heap.state.hostname}Reaction/itemSave`,request)
      if(key == 'comment'){
        this.reactionCompleted = true
        this.$flash("Комментарий сохранён")
      } else {
        this.$flash("Реакция сохранена")
      }
    }
  },
  mounted(){
    Topic.on('dismissModal', () => {this.isOpen = false});
  },
  watch:{
    'isNeedToBeShown':async function(val){
      await this.loadSuggest()
      this.isOpen = (val && this.productItem.product_id)
    },
  }
}
</script>