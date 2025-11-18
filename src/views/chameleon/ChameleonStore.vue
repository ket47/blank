<style scoped>

.avatar-container{
  width: 100px;
}
.avatar{
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 0px;
  border-radius: 100%;
  overflow: hidden;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.avatar img{
  pointer-events: none;
}

@media only screen and (max-width: 740px) {
  .avatar-container{
    width: 80px;
  }
  .avatar{
    width: 80px;
    height: 80px;
  }
}
@media only screen and (max-width: 370px) {
  .avatar-container{
    width: 50px;
  }
  .avatar{
    width: 50px;
    height: 50px;
  }
}
@media only screen and (max-width: 1000px) {
  .desktop-main-container .group-fixed-block{
    top:0px;
  }
}

@media only screen and (min-width: 1000px) {
  .desktop-main-container .group-fixed-block{
    left: 0px;
    top: 320px;
    width: 250px;
  }
  .desktop-main-container .group-fixed-block .sub-groups-container {
    display: none;
  }
}
  ion-skeleton-text {
    --border-radius: 10px;
    --background: #ddd
  }
</style>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goback()"><ion-icon :src="chevronBackOutline"/>Назад</ion-button>
        </ion-buttons>
        <ion-title><b>{{ storeItem.store_name }}</b></ion-title>
      </ion-toolbar>  
    </ion-header>
    <ion-content class="main-container">
      <div class="store-info-container">
        <image-slider-comp :imageList="storeItem.images" :imgHeight="300" :mode="'crop-to-fit'"></image-slider-comp>
        <ion-list  class="store-info">
          <ion-item lines="none" >
            <div v-if="storeItem.avatarImage" slot="start" class="avatar-container">
              <div class="avatar">
                <img :src="$heap.state.hostname+'image/get.php/'+storeItem.avatarImage+'.200.200.webp'" />
              </div>
            </div>
            <ion-text style="font-size:1.2em;"><b>{{ storeItem.store_name }}</b></ion-text>
          </ion-item>
          <ion-item  lines="none">
            <ion-text v-if="storeItem.store_description" class="store-description" color="medium">{{storeItem.store_description}}</ion-text>
          </ion-item>
          <ion-item v-if="storeItem.store_group_names" lines="none">
            <ion-text v-for="cat in storeItem.store_group_names.split(',')" :key="cat" color="medium" style="font-size:0.9em">#{{cat}}&nbsp;</ion-text>
          </ion-item>
        </ion-list>
        <ion-list v-if="reactionList?.length" >
          <div v-for="item in reactionList" :key="item.id" >
            <ion-item style="margin: 8px 0px;">
                <div>
                    <div style="color:#999">{{item.user_name}}
                        <i v-if="item.reaction_is_like==1"> • <ion-icon :src="thumbsUpSharp" color="primary"/></i>
                        <i v-if="item.reaction_is_dislike==1"> • <ion-icon :src="thumbsDownSharp" color="medium"/></i>
                    </div>
                    <div style="color:#333;font-size:0.9em">{{item.reaction_comment}}</div>
                </div>
            </ion-item>
          </div>
        </ion-list>
        <div v-else style="padding: 6px 16px;">
          <h4>Здесь пусто</h4>
          <p>У этого заведения пока нет отзывов</p>
        </div>
        <ion-card style="padding: 10px; border-radius: 12px;">
          <ion-label style="font-size: 15px;"><b>Бывали здесь? Оставьте отзыв</b></ion-label>
          <ion-textarea placeholder="Напишите свои мысли..." v-model="reactionComment" style="margin: 5px 0; background-color: #eee; border-radius: 10px; padding: 5px 10px;"></ion-textarea>
          <div>
              <ion-button :disabled="reactionComment.length == 0" @click="createReaction(appearence_islike, reactionComment, `store:${storeId}:user:${Date.now()}`)" color="primary" expand="block">Подтвердить</ion-button>
          </div>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonText,
  IonIcon,
  IonGrid,
  IonTextarea,
  IonButtons,
  IonButton,
  IonCard,
  IonLabel,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonImg,
  IonThumbnail,
  IonList,
  IonItem,
}                         from "@ionic/vue";
import { 
  thumbsUpSharp,
  thumbsDownSharp,
  chevronBackOutline,
}                         from "ionicons/icons";
import ImageSliderComp    from "@/components/ImageSliderComp";
import jQuery             from "jquery";
import Utils              from "@/scripts/Utils.js";

export default{
  components: {
    IonText,
    IonIcon,
    IonButtons,
    IonGrid,
    IonLabel,
    IonToolbar,
    IonTextarea,
    IonButton,
    IonCard,
    IonList,
    IonTitle,
    IonHeader,
    IonContent,
    IonPage,
    IonItem,
    IonImg,
    IonThumbnail,
    ImageSliderComp,
  },
  setup() {
    return {
      thumbsUpSharp,
      thumbsDownSharp,
      chevronBackOutline,
    };
  },
  data() {
    return {
      storeId: this.$route.params.id,
      query:this.$route.query,
      searchQuery: null,
      storeItem: [],
      reactionList: [],
      reactionComment: ''
    };
  },
  methods: {
    async itemGet() {
      try{
        const request={
          store_id: this.storeId,
          distance_include:1,
          products_include:1,
        }
        this.storeItem=await Utils.post(`${this.$heap.state.hostname}Store/itemGet`,request )
        if(this.storeItem.store_id){
          this.reactionList = await jQuery.post(`${this.$heap.state.hostname}Reaction/listGet`, {tagQuery:`store:${this.storeItem.store_id}`, commentsOnly:1})
        }
        this.$heap.commit('setCurrentStore',this.storeItem);
      } catch(err){
        const exception_code=err?.responseJSON?.messages?.error;
        switch(exception_code){
            case 'notfound':
                this.$flash("Продавец не найден")
                this.$router.replace("/catalog")
                break;
        }
        return false
      }
   },
    getAnchorOffset() {
      var sticky = document.querySelector(`#productCategories${this.storeItem.store_id}`);
      if(!sticky) return 0
      var stickyAnchor = sticky.parentNode;
      return stickyAnchor.getBoundingClientRect().top;
    },
    selectProductCategory(index) {
      document.querySelector(`#group-${index}-${this.storeItem.store_id}`).scrollIntoView()
    },
    async createReaction(is_like, comment, target){
        const request={
            tagQuery: target,
            is_like: true,
            is_dislike: false,
            comment: comment
        }
        try{
            await this.$post("Reaction/itemSave", request)
            this.itemGet()
        }catch(err){
            //
        }
    },
    goback(){
      history.back()
    },
  },
  async mounted(){
    this.query = this.$route.query
    this.itemGet()
  },
  async ionViewDidEnter() {
    this.query = this.$route.query;
    this.itemGet()
  },
  // watch: {
  //   $route(currentRoute) {
  //     this.storeId = currentRoute.params.id;
  //   },
  // },
}
</script>