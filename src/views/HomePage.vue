<template>
  <base-layout  pageLogo="./assets/icon/tezkel_logo.png">
      <home-slider/>
      <user-address-widget :deliveryTime="primaryDeliveryTime"/>
      <home-primary-category-widget @deliveryTimeGet="deliveryTime=>{primaryDeliveryTime=deliveryTime}"/>
      <store-list/>
  </base-layout>
</template>

<script>
import HomeSlider                 from "@/components/HomeSlider";
import StoreList                  from "@/components/StoreList";
import UserAddressWidget          from "@/components/UserAddressWidget";
import HomePrimaryCategoryWidget  from "@/components/HomePrimaryCategoryWidget";

export default {
  components: {
    HomeSlider,
    StoreList,
    UserAddressWidget,
    HomePrimaryCategoryWidget
  },
  data(){
    return {
      primaryDeliveryTime:null
    }
  }
};
</script>