<template>
    <ion-grid class="group-list">
        <ion-row>
        <ion-col size="6" v-show="group_item"  v-for="group_item in groupList" :key="group_item.group_id" @click="() => {return onClick(group_item.group_id)}">
                <ion-card style="display: flex">
                    <img  :src="$store.state.hostname + '/image/get.php/' + group_item.image_hash + '.100.100.webp'"  width="50" height="50"/>
                    <ion-card-header> 
                        <ion-card-title>{{ group_item.group_name }}</ion-card-title>
                    </ion-card-header>
                </ion-card>
        </ion-col>
        </ion-row>
    </ion-grid>
</template>

<script>
import { 
    IonCol, 
    IonGrid, 
    IonRow, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle 
} from '@ionic/vue';

export default {
    props: ['groupList', 'onClick'],
    components: { 
        IonCol, 
        IonGrid, 
        IonRow, 
        IonCard, 
        IonCardHeader, 
        IonCardTitle 
    }
  
};
</script>


<style>
.group-list a{
    text-decoration: none;
    color: inherit;
}
.group-list ion-col{
    cursor: pointer;
}
</style>