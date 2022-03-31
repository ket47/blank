<template>
  <base-layout :page-default-back-link="'/order-list'">

  </base-layout>
</template>



<script>

import { search } from 'ionicons/icons';
import heap from '@/heap';
import Order from '@/scripts/Order.js';


export default  {
  components: {},
  setup() {
    return {
      search
    }
  },
  data() {
    return {
      job:{}
    };
  },
  methods: {

  },
  async mounted(){
    this.job = await Order.api.itemJobGet();
  }
}
</script>
