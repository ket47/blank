<style scoped>
.image_grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
    width:100%
}
.image_grid>div{
    display: flex;
    align-items: center;
    flex-flow: column;
}
.image_controls{
    display: flex;
    width: 100%;
    justify-content: space-evenly;
}
.deleted{
    border:3px solid red;
}
.disabled{
    border:3px solid gray;
}
</style>
<template>
    <div v-if="imageList?.length">
        <ion-item lines="none">
            <ion-label>Фотографии</ion-label>
            <ion-icon v-if="editMode" slot="end" :icon="settingsSharp" color="primary" @click="editMode=0"/>
            <ion-icon v-else slot="end" :icon="settingsOutline" @click="editMode=1"/>
        </ion-item>
        <div class="image_grid">
            <div v-for="img in imageList" :key="img.image_id">
                <ion-avatar @click="imagePreview(img.image_hash)" :class="img.class">
                    <ion-img :src="$heap.state.hostname + 'image/get.php/'+img.image_hash+'.100.100.webp'"/>
                </ion-avatar>
            
                <div v-if="editMode" class="image_controls">
                    <ion-icon :icon="chevronBackCircleOutline" @click="back(img)"/>
                    <ion-icon :icon="trashBin" color="danger" @click="remove(img)"/>
                    <ion-icon :icon="chevronForwardCircleOutline" @click="forward(img)"/>
                </div>
            </div>
        </div>
    </div>
    <input type="file" id="foto_upload" accept="image/*" @change="uploadImage($event)" style="display:none">
</template>
<script>
import ImagePreviewModal from '@/components/ImagePreviewModal.vue'
import { modalController }  from '@ionic/vue';
import jQuery from 'jquery'
import Topic from '@/scripts/Topic.js'
import {
    settingsOutline,
    settingsSharp,
    chevronBackCircleOutline,
    chevronForwardCircleOutline,
    trashBin
}      from 'ionicons/icons';

export default {
    props:['images','image_holder_id','controller'],
    setup(){
        return {settingsOutline,settingsSharp,chevronBackCircleOutline,chevronForwardCircleOutline,trashBin}
    },
    created(){
        this.imageList=this.images;
    },
    data(){
        return {
            images_loaded:null,
            editMode:false
        }
    },
    computed:{
        imageList(){
            let list = this.images_loaded || this.images;
            let filtered=[];
            for(let i in list){
                if(list[i].deleted_at){
                    list[i].class=' deleted';
                    if(this.editMode){
                        filtered.push(list[i]);
                    }
                } else if(list[i].is_disabled==1){
                    list[i].class=' disabled';
                    if(this.editMode){
                        filtered.push(list[i]);
                    }
                } else{
                    filtered.push(list[i]);
                }
            }
            return filtered;
        }
    },
    methods:{
        async back(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemUpdateOrder',{image_id:img.image_id,dir:'up'});
                this.load();
            } catch(err){
                console.log(err);
            }
        },
        async forward(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemUpdateOrder',{image_id:img.image_id,dir:'down'});
                this.load();
            } catch(err){
                console.log(err);
            }
        },
        async remove(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemDelete',{image_id:img.image_id});
                this.load();
            } catch(err){
                console.log(err);
            }
        },
        async load(){
            const request={
                image_holder_id:this.image_holder_id,
                image_holder:'order',
                is_disabled:1,
                is_deleted:1,
                is_active:1
            };
            this.images_loaded=await jQuery.post(this.$heap.state.hostname + 'Image/listGet',request);
        },
        async imagePreview( image_hash ){
            const modal = await modalController.create({
                component: ImagePreviewModal,
                componentProps:{image_hash},
                initialBreakpoint: 0.5,
                breakpoints: [0, 0.5, 1]
                });
            const dismissFn=function(){
                modal.dismiss();
            };
            Topic.on('dismissModal',dismissFn);
            return modal.present();
        },
        async uploadImage(event) {
            let data = new FormData();
            data.append("files[]", event.target.files[0]); 
            data.set("image_holder_id", this.image_holder_id);
            const request={
                url : this.$heap.state.hostname + this.controller + "/fileUpload",
                type: "POST",
                data : data,
                processData: false,
                contentType: false
            };
            try{
                await jQuery.ajax(request)
                this.load()
            } catch(err){
                if(err?.responseJSON?.messages?.error=='limit_exeeded'){
                    this.$flash("Уже загружено максимальное количество фото");
                    return;
                }
                this.$flash("Не удалось загрузить фото");
            }
        },
        take_photo(){
            jQuery('#foto_upload').trigger('click');
        },
    }
}
</script>