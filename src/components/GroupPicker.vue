<style scoped>

</style>
<template>
    <ion-header>
      <ion-toolbar>
          <ion-title>Категории</ion-title>
          <ion-icon slot="end" @click="closeModal();" :icon="closeCircle" size="large" color="medium"></ion-icon>
      </ion-toolbar>
      <ion-button @click="closeModal();" color="medium" expand="full">Готово</ion-button>
    </ion-header>
    <ion-content>
        <ion-list v-if="groupList">
            <div v-for="group in groupList" :key="group.group_id">
                <ion-item v-if="group.group_parent_id>0">
                    <ion-avatar slot="start">
                        <ion-img :src="$heap.state.hostname + 'image/get.php/'+group.image_hash+'.50.50.webp'"/>
                    </ion-avatar>
                    <ion-label>{{group.group_name}}</ion-label>
                    <ion-checkbox 
                    slot="end" 
                    :checked="group.is_marked"
                    @click="mimickChage($event.target,group.group_id)"></ion-checkbox>
                </ion-item>
                <ion-item-divider v-else>
                    <ion-label><b>{{group.group_name}}</b></ion-label>
                </ion-item-divider>
            </div>
        </ion-list>
    </ion-content>
</template>
<script>
import 
{
  closeCircle
}                         from 'ionicons/icons';
import {
    modalController,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
    IonImg,
    IonAvatar,
    IonLabel,
    IonItemDivider,
    IonList,
    IonItem
}                         from "@ionic/vue";
import jQuery             from 'jquery'

export default {
    props:['controller','memberId','memberOfIds','memberLimit'],
    components:{
    IonCheckbox,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
    IonImg,
    IonAvatar,
    IonLabel,
    IonItemDivider,
    IonList,
    IonItem
    },
    setup(){
        return {closeCircle}
    },
    data(){
        return {
            groupList:null,
            checkedGroupList:[]
        }
    },
    created(){
        this.listGroupGet()
        this.checkedGroupList=this.memberOfIds||[]
    },
    methods:{
        async listGroupGet(){
            this.groupList=await jQuery.get(this.$heap.state.hostname + this.controller + '/listGroupGet')
            this.itemMarkGroups()
        },
        itemMarkGroups(){
            if(!this.groupList){
                return
            }
            try{
                for(let group of this.groupList){
                    group.is_marked=this.checkedGroupList.includes(group.group_id)?1:0;
                }
            }catch{/** */}
        },
        async itemUpdateGroup(is_joined,group_id){
            const request={
                [this.controller.toLowerCase()+'_id']:this.memberId,
                is_joined,
                group_id
            }
            try{
                await jQuery.post(this.$heap.state.hostname + this.controller + "/itemUpdateGroup", request)
            } catch(err){
                this.$flash("Не удалось сохранить изменение")
            }
        },
        mimickChage(target,group_id){
            const self=this
            setTimeout(()=>{
                self.groupChanged(target,group_id)
            },0)
        },
        async groupChanged(target,group_id){
            const is_checked=target.checked?1:0
            if( is_checked ){
                if(this.checkedGroupList.length>=this.memberLimit){
                    this.$flash(`Можно выбрать не больше ${this.memberLimit} категорий`)
                    target.checked=0;
                    return
                }
                if(this.memberLimit==1){
                    this.closeModal()
                }
                this.checkedGroupList.push(group_id)
            } else {
                this.checkedGroupList = this.checkedGroupList.filter(function(value, index, arr){ 
                    return value != group_id;
                });
            }
            this.itemUpdateGroup(is_checked,group_id)
        },
        closeModal(){
            modalController.dismiss(this.checkedGroupList);
        }
    }
}
</script>