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
  @keyframes hideshow {
    0% { transform:scale(3);fill:var(--ion-color-primary);opacity:0.5; }
    50% { transform:scale(1);fill:red; }
    100% { transform:scale(3);fill:var(--ion-color-primary);opacity:0.5; }
  } 
  .like_animate:active{
    animation: hideshow 0.3s ease;
  }
</style>


<template>
    <ion-searchbar v-model="query" placeholder="поиск" :debounce="600" @ionInput="listReload()" />
    <ion-list v-if="!items">
        <div v-for="i in [0,1,2,3]" :key="i">
            <ion-item lines="none">
                <ion-skeleton-text style="height:35px;width:40px;border-radius:20px" animated/>
                <ion-skeleton-text style="width:100%;margin:5px" animated/>
            </ion-item>
            <ion-item>
                <ion-skeleton-text style="width:100%" animated/>
            </ion-item>
        </div>
    </ion-list>
    <ion-list v-else-if="items?.length">
        <div v-for="item in items" :key="item.id">
            <div v-if="item.is_sealed==0">
                <ion-item lines="none">
                    <ion-thumbnail slot="start">
                        <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.150.150.webp`" style="border-radius:10px"/>
                    </ion-thumbnail>
                    <ion-text color="medium">{{item.name}}</ion-text>
                    <ion-chip color="medium" slot="end" style="overflow:visible">
                        <ion-icon :src="thumbsUpSharp" :color="item.reaction_is_like==1?`dark`:`medium`" @click="itemReactionLike(item,$event.target)" class="like_animate"/>
                        <ion-label color="medium">&nbsp;|&nbsp;</ion-label> 
                        <ion-icon :src="thumbsDownSharp" :color="item.reaction_is_dislike==1?`dark`:`medium`" @click="itemReactionDislike(item)"/>
                    </ion-chip>
                </ion-item>
                <ion-item v-if="item.is_comment_editing_mode==1">
                    <ion-textarea
                        :ref="`comment_ta${item.id}`"
                        :id="`comment_ta${item.id}`"
                        rows="1"
                        auto-grow="true"
                        v-model="item.reaction_comment"
                        placeholder="напишите отзыв"
                        label=""
                        style="background:var(--ion-color-primary-tint);border-radius:10px;margin-bottom:3px;"
                    ></ion-textarea>
                    <ion-buttons>
                        <ion-button @click="itemReactionComment(item);">
                            <ion-icon :icon="send" slot="end" color="primary"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-item>
                <ion-item v-if="!item.is_comment_editing_mode" lines="full" @click="itemCommentEdit(item)">
                    <ion-text v-if="item.reaction_comment">
                        {{item.reaction_comment}} 
                        <ion-chip color="medium">
                            <ion-icon :src="pencil"/>
                            <ion-label>изменить</ion-label>
                        </ion-chip>
                    </ion-text>
                    <ion-chip v-else color="medium">
                        <ion-icon :src="chatboxOutline"/>
                        <ion-label> добавить отзыв</ion-label>
                    </ion-chip>
                </ion-item>
            </div>
            <div v-if="item.is_sealed==1">
                <ion-item :lines="item.reaction_comment?'none':'full'">
                    <ion-thumbnail slot="start">
                        <ion-img v-if="item.image_hash" :src="`${$heap.state.hostname}image/get.php/${item.image_hash}.50.50.webp`"/>
                    </ion-thumbnail>
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
    <ion-list v-else-if="query || !targetId">
        <ion-item>
            Ничего не найдено
        </ion-item>
    </ion-list>
    <ion-list v-else>
        <ion-item>
            Купите у этого продавца, чтобы оставлять отзывы
        </ion-item>
    </ion-list>
    <ion-infinite-scroll @ionInfinite="listLoadMore($event)" id="moderation-infinite-scroll">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data..."></ion-infinite-scroll-content>
    </ion-infinite-scroll>
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
  pencil,
}                         from 'ionicons/icons';
import {
    modalController,
    IonIcon,
    IonImg,
    IonList,
    IonItem,
    IonSearchbar,
    IonSkeletonText,
    IonThumbnail,
    IonChip,
    IonLabel,
    IonNote,
    IonTextarea,
    IonText,
    IonButtons,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,

}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['targetType','targetId'],
    components:{
        IonIcon,
        IonImg,
        IonList,
        IonItem,
        IonSearchbar,
        IonSkeletonText,
        IonThumbnail,
        IonChip,
        IonLabel,
        IonNote,
        IonTextarea,
        IonText,
        IonButtons,
        IonButton,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
    },
    setup(){
        return {
            closeOutline,
            chatboxOutline,
            thumbsUpSharp,
            thumbsDownSharp,
            trashOutline,
            send,
            pencil,
        }
    },
    data(){
        const targetTypeLabel=this.targetType??'product'
        return {
            query:null,
            items:null,
            targetTypeLabel,
            targetTypeName:'',
            commentCurrentItem:null,
        }
    },
    mounted(){
        this.listLoad()
        console.log('this.targetType');
    },
    methods:{
        async listLoadMore(ev){
            await this.listLoad()
            ev.target.complete();
        },
        async listReload(){
            this.items=null
            this.listLoad()
        },
        async listLoad(){
            let request={
                target_type:this.targetTypeLabel,
                target_id:this.targetId,
                name_query:this.query,
                offset:this.items?.length,
                limit:15,
            }
            try{
                this.is_loading=1
                let items
                if(this.targetTypeLabel=='product' || this.targetTypeLabel=='store'){
                    const result=await jQuery.post(`${this.$heap.state.hostname}Reaction/itemListGet`,request)
                    items=result.map(item=>{
                        item.name=`${item.entry_text}`;
                        item.id=item.entry_id
                        return item
                    })
                }
                this.is_loading=0
                if(!this.items){
                    this.items=[]
                }
                this.items=this.items.concat(items)
            } catch(err){
                console.log(err)
            }
        },
        async itemReact( request ){
             try{
                await jQuery.post(`${this.$heap.state.hostname}Reaction/itemSave`,request)
            }catch(err){
                const exception_code=err?.responseJSON?.messages?.error;
                switch(exception_code){
                    case 'notfound':
                        //
                        break;
                }
                this.listReload()
                return false
            }
        },
        async itemReactionLike(item){
            item.reaction_is_like=item.reaction_is_like*1?0:1
            item.reaction_is_dislike=0
            let request={
                is_like:item.reaction_is_like
            }
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            if(item.reaction_is_like){
                this.$flash("Благодарим за оценку")
            }
            await this.itemReact(request)
        },
        async itemReactionDislike(item){
            item.reaction_is_dislike=item.reaction_is_dislike*1?0:1
            item.reaction_is_like=0
            let request={
                is_dislike:item.reaction_is_dislike
            }
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            if(item.reaction_is_dislike){
                this.$flash("Ваша оценка будет учтена продавцом")
            }
            await this.itemReact(request)
        },
        async itemReactionComment(item,comment){
            item.is_comment_editing_mode=0
            let request={
                comment:item.reaction_comment
            }
            if(item.entry_id??0){
                request.tagQuery=`entry:${item.entry_id}`;
            }
            await this.itemReact(request)
            this.$flash("Коментарий сохранен")
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
                this.listReload()
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
            if(this.commentCurrentItem){//trying to close previous comment
                this.commentCurrentItem.is_comment_editing_mode=0
            }
            this.commentCurrentItem=item

            item.is_comment_editing_mode=1
            try{
                setTimeout(()=>document.querySelector(`#comment_ta${item.id}`).setFocus(),100)
            } catch{/** */}
        },
        closeModal(){
            modalController.dismiss();
        }
    }
}
</script>