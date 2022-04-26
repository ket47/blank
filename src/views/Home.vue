<template>
  <base-layout  pageLogo="./assets/icon/tezkel_logo.png">
      <home-slider></home-slider>
      <user-address-widget></user-address-widget>
      <home-primary-category-widget></home-primary-category-widget>
      <store-list></store-list>
  </base-layout>
</template>

<script>
import HomeSlider from "../components/HomeSlider";
import StoreList from "../components/StoreList";
import UserAddressWidget from "../components/UserAddressWidget";
import HomePrimaryCategoryWidget from "../components/HomePrimaryCategoryWidget";

export default {
  name: "HomePage",
  components: {
    HomeSlider,
    StoreList,
    UserAddressWidget,
    HomePrimaryCategoryWidget
  },
};
</script>