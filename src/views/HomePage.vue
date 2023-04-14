<template>
  <base-layout :pageLogo="mainLogo" hideBackLink="true">
      <home-slider/>
      <user-address-widget :deliveryTime="primaryDeliveryTime"/>
      <!-- <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/> -->
      <store-list ref="homeStoreList"/>
  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import StoreList                  from "@/components/StoreList";
import UserAddressWidget          from "@/components/UserAddressWidget";
import mainLogo                   from "@/assets/icons/tezkel_logo.svg";

import User                       from "@/scripts/User.js"

export default {
  setup() {
    return {
      mainLogo
    }
  },
  components: {
    HomeSlider,
    StoreList,
    UserAddressWidget,
//    HomePrimaryCategoryWidget
  },
  data(){
    return {
      primaryDeliveryTime:null
    }
  },
  ionViewDidEnter(){
    //User.geo.switch();
    this.$refs.homeStoreList.listNearGet();
  }
};
</script>