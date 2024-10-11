<style scoped>
.image_grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
    width:100%;
    margin-bottom:10px;
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
ion-avatar{
    border:5px solid #fff;
}
.deleted{
    border:5px solid red;
}
.disabled{
    border:5px solid gray;
}
</style>
<template>
    <div>
        <ion-item v-if="showTile" lines="none"  @click="editMode=!editMode;editMode&&load()">
            <ion-label v-if="title" color="imageList?.length?'':medium">{{title}}</ion-label>
            <ion-label v-else color="imageList?.length?'':medium">Фотографии</ion-label>
            <ion-icon v-if="editMode" slot="end" :icon="settingsSharp" color="primary"/>
            <ion-icon v-else slot="end" :icon="settingsOutline"/>
        </ion-item>
        <div class="image_grid" v-if="imageList?.length">
            <div v-for="img in imageList" :key="img.image_id" style="position:relative">
                <div style="position: absolute; top:0px;background-color:#fffc;font-size:0.75em"  @click="imagePreview(img.image_hash)">
                    <div v-if="img.deleted_at">будет удалено</div>
                    <div v-else-if="img.is_disabled==1">на модерации</div>
                </div>
                <ion-avatar @click="imagePreview(img.image_hash)" :class="img.class">
                    <ion-img :src="$heap.state.hostname + 'image/get.php/'+img.image_hash+'.100.100.webp'"/>
                </ion-avatar>
            
                <div v-if="editMode" class="image_controls">
                    <ion-icon :icon="chevronBackCircleOutline" @click="back(img)"/>
                    <ion-icon :icon="checkmarkCircle" color="success" v-if="isAdmin && img.is_disabled==1" @click="enable(img)"/>
                    <ion-icon :icon="addCircle" color="success" @click="restore(img)" v-if="img.deleted_at"/>
                    <ion-icon :icon="trash" color="danger" @click="remove(img)" v-else/>
                    <ion-icon :icon="chevronForwardCircleOutline" @click="forward(img)"/>
                </div>
            </div>
        </div>
        <input type="file" :id="fileUploaderId" accept=".png, .jpg, .jpeg, .webp, .gif" @change="uploadImage($event)" style="display:none">
    </div>
</template>
<script>
import {
    settingsOutline,
    settingsSharp,
    chevronBackCircleOutline,
    chevronForwardCircleOutline,
    trash,
    addCircle,
    checkmarkCircle
}                               from 'ionicons/icons';
import { 
    IonLabel,
    IonIcon,
    IonItem,
    IonImg,
    IonAvatar,
    modalController
    }                           from '@ionic/vue';
import ImagePreviewModal        from '@/components/ImagePreviewModal.vue'
import jQuery                   from 'jquery'
import Topic                    from '@/scripts/Topic.js'
import User                     from '@/scripts/User.js'
import { isPlatform }           from "@ionic/vue";
import { 
    Camera, 
    CameraResultType 
}                               from '@capacitor/camera';

export default {
    props:['images','image_holder','image_holder_id','controller','title','hide_if_empty','source'],
    components:{
    IonLabel,
    IonIcon,
    IonItem,
    IonImg,
    IonAvatar,
    },
    setup(){
        return {settingsOutline,settingsSharp,chevronBackCircleOutline,chevronForwardCircleOutline,trash,addCircle,checkmarkCircle}
    },
    data(){
        return {
            images_loaded:null,
            editMode:false,
            fileUploaderId:((this.image_holder??this.controller)+this.image_holder_id).replace(/[^\d\w]/,'')
        }
    },
    mounted(){//to force server load have to set images to null
        if(this.images===null){
            this.load()
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
        },
        isAdmin(){
            return User.isAdmin()
        },
        showTile(){
            let list = this.images_loaded || this.images;
            if( this.hide_if_empty && !list?.length){
                return  false
            }
            return true
        }
    },
    methods:{
        async back(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemUpdateOrder',{image_id:img.image_id,dir:'up'});
                this.load();
            } catch{/** */}
        },
        async forward(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemUpdateOrder',{image_id:img.image_id,dir:'down'});
                this.load();
            } catch{/** */}
        },
        async remove(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemDelete',{image_id:img.image_id});
                this.load();
                this.$flash("Фото перемещено в корзину и будет удалено")
            } catch{/** */}
        },
        async restore(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemUnDelete',{image_id:img.image_id});
                this.load();
                this.$flash("Фото перемещено извлечено из корзины")
            } catch{/** */}
        },
        async enable(img){
            try{
                await jQuery.post(this.$heap.state.hostname + 'Image/itemDisable',{image_id:img.image_id,is_disabled:0});
                this.load();
            } catch{/** */}
        },
        async load(){
            const request={
                image_holder_id:this.image_holder_id,
                image_holder:this.image_holder??this.controller,
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
                initialBreakpoint: 0.75,
                breakpoints: [0.75, 1]
                });
            const dismissFn=function(){
                modal.dismiss();
            };
            Topic.on('dismissModal',dismissFn);
            return modal.present();
        },
        async uploadImage(event=null, imagedata=null) {
            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;
                let byteCharacters = atob(b64Data);
                let byteArrays = [];
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    let slice = byteCharacters.slice(offset, offset + sliceSize);
                    let byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    let byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                return new Blob(byteArrays, {type: contentType});
            }

            let data = new FormData();
            if( event ){
                data.append("files[]", event.target.files[0]); 
            }
            if( imagedata ){
                let blob = b64toBlob(imagedata, 'image/jpeg');
                data.append("files[]", blob, 'img.jpg'); // Here you can set the filename
            }
            data.set("image_holder_id", this.image_holder_id);
            if(this.image_holder){
                data.set("image_holder", this.image_holder);
            }
            const request={
                url : this.$heap.state.hostname + this.controller + "/fileUpload",
                type: "POST",
                data : data,
                processData: false,
                contentType: false
            };
            try{
                await jQuery.ajax(request)
                await this.load()
                this.$emit('onChange', this.images_loaded)
            } catch(err){
                if(err?.responseJSON?.messages?.error=='limit_exeeded'){
                    this.$flash("Уже загружено максимальное количество фото");
                    return;
                }
                if(err?.responseJSON?.messages?.error=='no_valid_images'){
                    this.$flash("Формат файла не поддерживается");
                    return;
                }
                this.$flash("Не удалось загрузить фото");
            }
        },
        async useCamera(){
            const src=this.source||'PROMPT'
            try{
                const conf={
                    allowEditing: false,
                    promptLabelPhoto:'Галерея',
                    promptLabelPicture:'Камера',
                    promptLabelCancel:'Отмена',
                    promptLabelHeader:'Где получить фото?',
                    resultType: CameraResultType.Base64,
                    source:src
                }
                if( src==='CAMERA' ){
                    conf.quality=90
                    conf.width=1080
                    conf.height=1920
                }
                const imageBase64 = await Camera.getPhoto(conf);
                await this.uploadImage(null,imageBase64.base64String)                
            } catch{
                //
            }
        },
        take_photo(){
            if( isPlatform('capacitor') ){
                 this.useCamera();
            } else {
                jQuery(`#${this.fileUploaderId}`).trigger('click');
           }
            this.editMode=true
        },
    }
}
</script>