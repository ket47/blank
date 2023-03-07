<style scoped>

</style>
<template>
    <ion-header>
      <ion-toolbar color="secondary">
          <ion-title>Категории</ion-title>
          <ion-icon slot="end" @click="closeModal();" :icon="closeOutline" size="large" color="medium"></ion-icon>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-searchbar placeholder="Фильтр по категориям" v-model="searchQuery"/>
        <ion-accordion-group v-if="groupListFiltered.length>0">
            <ion-accordion v-for="parentGroup in groupListTree" :key="parentGroup.group_id">
                <ion-item slot="header">
                    <ion-avatar slot="start" v-if="parentGroup.image_hash">
                        <ion-img :src="$heap.state.hostname + 'image/get.php/'+parentGroup.image_hash+'.50.50.webp'"/>
                    </ion-avatar>
                    <ion-label>{{parentGroup.group_name}}</ion-label>
                </ion-item>
                <div class="ion-padding" slot="content">
                    <ion-list>
                        <div v-for="childGroup in parentGroup.children" :key="childGroup.group_id">
                            <ion-item>
                                <ion-avatar slot="start" v-if="childGroup.image_hash">
                                    <ion-img :src="$heap.state.hostname + 'image/get.php/'+childGroup.image_hash+'.50.50.webp'"/>
                                </ion-avatar>
                                <ion-label>{{childGroup.group_name}}</ion-label>
                                <ion-checkbox slot="end" :checked="childGroup.is_marked" @click="mimickChage($event.target,childGroup.group_id)"></ion-checkbox>
                            </ion-item>
                        </div>
                    </ion-list>
                </div>
            </ion-accordion>
        </ion-accordion-group>
        <ion-list v-else>
            <ion-item v-for="i in [1,2,3,4]" :key="i">
                <ion-skeleton-text style="width:100%"/>
            </ion-item>
        </ion-list>
    </ion-content>
</template>
<script>
import 
{
  closeOutline
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
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonSearchbar,
    IonSkeletonText,
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
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonSearchbar,
    IonSkeletonText,
    },
    setup(){
        return {closeOutline}
    },
    data(){
        return {
            searchQuery:'',
            groupList:null,
            checkedGroupList:[]
        }
    },
    created(){
        this.listGroupGet()
        this.checkedGroupList=this.memberOfIds||[]
    },
    computed:{
        groupListFiltered(){
            if(!this.searchQuery){
                return this.groupList??[]
            }
            const regexp=new RegExp(this.searchQuery.replace(/^[\w\d\s]/,'').replace(/\s/g,'.*'),'im')
            return this.groupList.filter(group=>group.group_name?.match( regexp ))??[]
        },
        groupListTree(){
            let groupTree=[]
            for( let group of this.groupListFiltered ){
                if(group.group_parent_id==0){
                    group.children=this.groupList.filter(child_group=>child_group.group_parent_id==group.group_id)
                    groupTree.push(group)
                } else {
                    let branchIndex=groupTree.findIndex(parentGroup=>group.group_parent_id==parentGroup.group_id)
                    if(branchIndex<0){
                        let parentGroup=this.groupList.find(parent_group=>parent_group.group_id==group.group_parent_id)
                        parentGroup.children=[]
                        branchIndex=groupTree.push(parentGroup)-1
                    }
                    groupTree[branchIndex].children.push(group)
                }
            }
            return groupTree
        },


        parentGroupList(){
            return this.groupListFiltered?.filter(group=>group.group_parent_id==0)
        },
        childGroupList(){
            let childGroups={}
            for(let group of this.parentGroupList){
                childGroups[group.group_id]=this.groupListFiltered.filter(child_group=>child_group.group_parent_id==group.group_id)
            }
            return childGroups
        }
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