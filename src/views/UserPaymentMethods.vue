<template>
  <base-layout page-title="Мои методы оплаты" page-default-back-link="/user-dashboard" :errorMessage="error">
      <ion-page ref="UserPaymentMethods">
      <ion-content :fullscreen="true">
        <ion-list v-if="pmetList.length" lines="full">
          <ion-item v-for="pmet in pmetList" :key="pmet.id">
              <ion-img slot="start"  />
              <ion-label style="white-space:normal;cursor:pointer;"></ion-label>
              <ion-icon slot="end" :icon="trash" @click="pmetDelete()"></ion-icon>
          </ion-item>
        </ion-list>
        <ion-list v-else lines="full">
          <ion-item>
            <ion-note>Пока банковские карты не добавлены</ion-note>
          </ion-item>
        </ion-list>

        <ion-list>
          <ion-item style="cursor:pointer">
            <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
            <ion-label>Добавить новую банковскую карту</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </base-layout>
</template>


<script>
import { IonIcon } from '@ionic/vue';
import { addCircleOutline } from 'ionicons/icons';
export default  {
  name: 'UserPaymentMethods',
  components: {
    IonIcon
  },
  setup(){
    return {addCircleOutline};
  },
  data(){
    return {
      pmetList:[]
    }
  },
  methods:{
    pmetDelete(){
      //
    }
  }
}
</script>

