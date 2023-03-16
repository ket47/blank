<template>
<div class="ion-page">
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
            <ion-icon :icon="chatboxOutline" slot="start"></ion-icon>
            <ion-title>Отзывы и реакции</ion-title>
            <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-searchbar v-model="query" placeholder="поиск" :debounce="100" @ionChange="listGet()" />
    <ion-list v-if="!itemList">
        <div v-for="i in [0,1,2,3,4,5,6,7,8,9]" :key="i">
            <ion-item lines="none">
                <ion-skeleton-text style="height:35px;width:40px" animated/>
                <ion-skeleton-text style="width:100%" animated/>
            </ion-item>
            <ion-item>
                <ion-skeleton-text style="width:100%" animated/>
            </ion-item>
        </div>
    </ion-list>
    <ion-list v-else-if="itemList?.length">
        <div v-for="item in itemList" :key="item.id">
            <ion-item lines="none">
                <ion-avatar slot="start">
                    <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.50.50.webp`"/>
                </ion-avatar>
                {{item.name}}
            </ion-item>
            <ion-item lines="full">
                <ion-chip color="medium" slot="start">
                    <ion-icon :src="thumbsUpSharp" :color="item.reaction_is_like==1?`dark`:`medium`" @click="itemReactionLike(item)"/>
                    <ion-label color="medium">&nbsp;|&nbsp;</ion-label> 
                    <ion-icon :src="thumbsDownSharp" :color="item.reaction_is_dislike==1?`dark`:`medium`" @click="itemReactionDislike(item)"/>
                </ion-chip>
                <ion-chip color="medium" slot="end" @click="itemReactionComment(item)">
                    <ion-icon :icon="chatboxOutline" color="medium"></ion-icon>
                    <ion-label>{{item.reaction_comment??'написать отзыв'}}</ion-label>
                </ion-chip>
            </ion-item>
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
    IonSearchbar,
    IonSkeletonText,
    IonAvatar,
    IonChip,
    IonLabel,
}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['targetType','targetId'],
    components:{
        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonIcon,
        IonImg,
        IonList,
        IonItem,
        IonSearchbar,
        IonSkeletonText,
        IonAvatar,
        IonChip,
        IonLabel,
    },
    setup(){
        return {
  closeOutline,
  chatboxOutline,
  thumbsUpSharp,
  thumbsDownSharp,
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
            if( this.targetTypeLabel=='product' ){
                this.itemTypeName='Товар'
                this.entriesGet()
            }
        },
        async entriesGet(){
            const request={
                target_type:this.targetTypeLabel,
                target_id:this.targetId,
                search_query:this.query
            }
            try{
                const result=await jQuery.post(`${this.$heap.state.hostname}Reaction/itemListGet`,request)
                this.itemList=result.map(item=>{
                    item.name=`${item.entry_text}`;
                    item.id=item.entry_id
                    return item
                })
            }catch{/** */}
        },
        async itemReact( request ){
            try{
                await jQuery.post(`${this.$heap.state.hostname}Reaction/itemCreate`,request)
                this.listGet()
            }catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'notfound':
                        //
                        break;
                }
                return false
            }
        },
        async itemReactionLike(item){
            let request={
                is_like:1
            }
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            await this.itemReact(request)
        },
        async itemReactionDislike(item){
            let request={
                is_dislike:1
            }
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            await this.itemReact(request)
        },
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>