<template>
  <base-layout pageTitle="Страницы">
    <ion-list>
      <ion-item v-for="page in pageList" :key="page.page_id" detail button @click="$go('/user/text-edit-' + page.page_id)">
        <ion-icon slot="start" :icon="documentTextOutline"/>
        <ion-label>{{ page.page_title }}</ion-label>
        <ion-note slot="end" style="width: 80px">{{
          page.updated_at
        }}</ion-note>
      </ion-item>
      <ion-item detail button @click="$go('/user/text-edit-0')">
        <ion-icon slot="start" :icon="addOutline"/>
        <ion-label>Добавить страницу</ion-label>
      </ion-item>
    </ion-list>
  </base-layout>
</template>
<script>
import { 
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonNote,
}                       from '@ionic/vue';
import {
  documentTextOutline,
  addOutline
}                       from "ionicons/icons";
import User             from "@/scripts/User.js";
import jQuery           from "jquery";

export default {
  components:{
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonNote,
  },
  setup() {
    return { documentTextOutline,addOutline };
  },
  data() {
    return {
      pageList: null,
    };
  },
  created() {
    if(User.isAdmin()){
        this.listGet();
    } else {
        this.$flash('Страница для администраторов')
        this.$go('/home')
    }
  },
  ionViewDidEnter() {
    this.listGet()
  },
  methods: {
    async listGet() {
      try {
        this.pageList = await jQuery.post(
          this.$heap.state.hostname + "Page/listGet"
        );
      } catch {
        /** */
      }
    }
  },
};
</script>