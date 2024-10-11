<template>
    <ion-accordion-group v-if="orderData?.stages">
        <ion-accordion>
            <ion-item slot="header">
                <ion-label>История заказа</ion-label>
            </ion-item>
            <ion-list slot="content">
                <ion-item v-for="stage in orderData.stages" :key="stage.group_id">
                    <ion-icon slot="start" :icon="checkmarkOutline" size="small" color="success"></ion-icon>
                    <ion-text>
                        {{stage.group_name}}
                        <a v-if="stage?.created_user" href="javascript:void(0)" @click="$go(`/user/user-management?user_id=${stage?.created_user?.user_id}`)">{{stage?.created_user?.user_name}}</a>
                    </ion-text>
                    <ion-note slot="end" style="width:80px">{{stage.created_at}}</ion-note>
                </ion-item>
            </ion-list>
        </ion-accordion>
    </ion-accordion-group>
</template>

<script>
import {
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonNote,
    IonAccordion,
    IonAccordionGroup
}                       from '@ionic/vue';
import { 
    checkmarkOutline 
}                       from 'ionicons/icons';

export default({
    props:['orderData'],
    components: {
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonNote,
    IonAccordion,
    IonAccordionGroup
    },
    setup() {
        return {checkmarkOutline };
    },
})
</script>
