<style scoped>
    ion-textarea{
        border-radius:5px;
        --background: #eee;
        padding: 0px;
        padding-left: 5px;;
    }
</style>


<template>
<div class="ion-page">
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
            <ion-icon :icon="chatboxOutline" slot="start"></ion-icon>
            <ion-title>Отзывы</ion-title>
            <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
      <ion-item button detail="false" @click="commentAdd()">
        <ion-chip color="medium">
            <ion-icon :src="addOutline" color="medium" size="small"/>
            <ion-label>добавить отзыв</ion-label>
        </ion-chip>
      </ion-item>
  </ion-header>
  <ion-content>
    <ion-list v-if="!itemList">
        <div v-for="i in [0,1,2,3,4,5]" :key="i">
            <ion-item lines="none">
                <ion-skeleton-text style="height:35px;width:40px;border-radius:40px" animated/>
                <ion-skeleton-text style="width:40%" animated/>
            </ion-item>
            <ion-item lines="none">
                <ion-skeleton-text style="width:100%" animated/>
            </ion-item>
        </div>
    </ion-list>
    <ion-list v-else-if="itemList?.length">
        <div v-for="item in itemList" :key="item.id">
            <div class="ion-padding">
                <ion-item lines="none">
                    <ion-thumbnail slot="start">
                        <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.150.150.webp`" style="border-radius:10px;"/>
                    </ion-thumbnail>
                    <div>
                        <div style="color:#999">{{item.user_name}}
                            <i v-if="item.reaction_is_like==1"> • <ion-icon :src="thumbsUpSharp" color="primary"/></i>
                            <i v-if="item.reaction_is_dislike==1"> • <ion-icon :src="thumbsDownSharp" color="medium"/></i>
                        </div>
                        <div style="color:#333;font-size:0.9em">{{item.reaction_comment}}</div>
                    </div>
                </ion-item>
            </div>
        </div>
    </ion-list>
    <ion-list v-else>
        <ion-item>
            Ничего не найдено
        </ion-item>
    </ion-list>
  </ion-content>
</div>
</template>
<script>
import 
{
  closeOutline,
  chatboxOutline,
  thumbsUpSharp,
  thumbsDownSharp,
  trashOutline,
  ellipsisVertical,
  send,
  addOutline,
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
    IonSkeletonText,
    IonThumbnail,
    IonChip,
    IonLabel,
}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['targetType','targetId','targetTitle'],
    components:{
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonIcon,
        IonImg,
        IonList,
        IonItem,
        IonSkeletonText,
        IonThumbnail,
        IonChip,
        IonLabel,
    },
    setup(){
        return {
  closeOutline,
  chatboxOutline,
  thumbsUpSharp,
  thumbsDownSharp,
  trashOutline,
  ellipsisVertical,
  addOutline,
        }
    },
    data(){
        const targetTypeLabel=this.targetType??'product'
        return {
            query:null,
            itemList:null,
            targetTypeLabel,
            targetTypeName:''
        }
    },
    mounted(){
        this.listGet()
    },
    methods:{
        async listGet(){
            const request={
                tagQuery:`${this.targetTypeLabel}:${this.targetId}`,
                commentsOnly:1
            }
            try{
                this.itemList=await jQuery.post(`${this.$heap.state.hostname}Reaction/listGet`,request)
            }catch{/** */}
        },
        closeModal(){
            modalController.dismiss();
        },
        commentAdd(){
            modalController.dismiss('commentAdd');
        }
    }
}
</script>