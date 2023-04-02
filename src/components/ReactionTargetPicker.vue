<style>
  ion-backdrop {
    opacity: 0.3;
    background: #000;
  }

  .commentEdit {
    -position: absolute;
    -z-index: 100;
    background: var(--ion-background-color, #fff);
    width: 100%;
    padding-bottom: 5px;
  }
</style>


<template>
<div class="ion-page">
  <ion-header>
      <ion-toolbar>
        <ion-item lines="none">
            <ion-title>Ваши отзывы и реакции</ion-title>
            <ion-icon :icon="closeOutline" @click="closeModal();" slot="end" size="large"></ion-icon>
        </ion-item>
      </ion-toolbar>
  </ion-header>
  <ion-content>

    <!-- <ion-backdrop :visible="commentCurrent"></ion-backdrop> -->
    <div class="commentEdit" v-if="commentCurrent?true:false">
        <ion-item lines="none">
            <ion-textarea
            rows="1"
            auto-grow="true"
            v-model="commentCurrent"
            placeholder="добавьте отзыв"
            style="border:1px solid #ccc"
            ></ion-textarea>
            <ion-icon :icon="send" slot="end" color="medium"></ion-icon>
        </ion-item>
    </div>

    <ion-searchbar v-model="query" placeholder="поиск" :debounce="200" @ionChange="listGet()" />
    <ion-list v-if="!itemList">
        <div v-for="i in [0,1,2,3,4,5]" :key="i">
            <ion-item lines="none">
                <ion-skeleton-text style="height:35px;width:40px;border-radius:20px" animated/>
                <ion-skeleton-text style="width:100%;margin:5px" animated/>
            </ion-item>
            <ion-item>
                <ion-skeleton-text style="width:100%" animated/>
            </ion-item>
        </div>
    </ion-list>
    <ion-list v-else-if="itemList?.length">
        <div v-for="item in itemList" :key="item.id">
            <div v-if="item.is_sealed==0">
                <ion-item lines="none">
                    <ion-avatar slot="start">
                        <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.50.50.webp`"/>
                    </ion-avatar>
                    <ion-text color="medium">{{item.name}}</ion-text>
                    <ion-chip color="medium" slot="end">
                        <ion-icon :src="thumbsUpSharp" :color="item.reaction_is_like==1?`dark`:`medium`" @click="itemReactionLike(item);item.reaction_is_like=1;item.reaction_is_dislike=0"/>
                        <ion-label color="medium">&nbsp;|&nbsp;</ion-label> 
                        <ion-icon :src="thumbsDownSharp" :color="item.reaction_is_dislike==1?`dark`:`medium`" @click="itemReactionDislike(item);item.reaction_is_dislike=1;item.reaction_is_like=0;"/>
                    </ion-chip>
                </ion-item>
                <ion-item lines="full" @click="itemCommentEdit(item)">
                    <ion-text v-if="item.reaction_comment">
                    {{item.reaction_comment}}
                    </ion-text>
                    <ion-chip v-else color="medium">
                        <ion-icon :src="chatboxOutline"/>
                        <ion-label> добавить отзыв</ion-label>
                    </ion-chip>
                </ion-item>
            </div>
            <div v-if="item.is_sealed==1">
                <ion-item :lines="item.reaction_comment?'none':'full'">
                    <ion-avatar slot="start">
                        <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.50.50.webp`"/>
                    </ion-avatar>
                    <ion-text color="medium">{{item.name}}</ion-text>
                    <ion-chip color="medium" slot="end" @click="itemReactionDelete(item)">
                        <ion-icon v-if="item.reaction_is_like==1" :src="thumbsUpSharp" color="dark"/>
                        <ion-icon v-else-if="item.reaction_is_dislike==1" :src="thumbsDownSharp" color="dark"/>
                        <ion-icon v-if="item.is_sealed==1" :icon="trashOutline" color="danger"></ion-icon>
                    </ion-chip>
                </ion-item>
                <ion-item lines="full" v-if="item.reaction_comment">
                    <ion-note>{{item.reaction_comment}}</ion-note>
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
  send,
}                         from 'ionicons/icons';
import {
    modalController,
    alertController,
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
    IonNote,
    IonTextarea,
    IonText,
    IonBackdrop,
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
        IonNote,
        IonTextarea,
        IonText,
        IonBackdrop,
    },
    setup(){
        return {
            closeOutline,
            chatboxOutline,
            thumbsUpSharp,
            thumbsDownSharp,
            trashOutline,
            send,
        }
    },
    data(){
        const targetTypeLabel=this.targetType??'product'
        return {
            query:null,
            itemList:null,
            targetTypeLabel,
            targetTypeName:'',
            commentCurrent:null,
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
                if(request.reaction_id){
                    await jQuery.post(`${this.$heap.state.hostname}Reaction/itemUpdate`,request)
                } else {
                    await jQuery.post(`${this.$heap.state.hostname}Reaction/itemCreate`,request)
                }
                this.$flash("Сохранено")
                //this.listGet()
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
            if(item.reaction_id??0){
                request.reaction_id=item.reaction_id;
            } else 
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            await this.itemReact(request)
        },
        async itemReactionDislike(item){
            let request={
                is_dislike:1
            }
            if(item.reaction_id??0){
                request.reaction_id=item.reaction_id;
            } else 
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            await this.itemReact(request)
        },
        async itemReactionComment(item,comment){
            let request={
                comment
            }
            if(item.reaction_id??0){
                request.reaction_id=item.reaction_id;
            } else 
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            await this.itemReact(request)
        },
        async itemReactionDelete(item){
            if(!confirm("Удалить отзыв?")){
                return
            }
            try{
                const request={
                    reaction_id:item.reaction_id
                }
                await jQuery.post(`${this.$heap.state.hostname}Reaction/itemDelete`,request)
                this.listGet()
            }catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'idle':
                        //
                        break;
                }
                return false
            }
        },
        async itemCommentEdit( item ){
            this.commentCurrent=item.reaction_comment+'-'
        },
        async itemCommentSave(){
            this.commentCurrent=null
        },
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>