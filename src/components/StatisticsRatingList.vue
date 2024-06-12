<style scoped>
.table_head{
    display:grid;
    grid-template-columns:repeat(3,auto);
    font-size:.8em;
    background-color: #ccc;
    border-radius: 2px;
    margin: 10px;
    width:250px;
    row-gap:1px;
}
.table_head>div{
    padding: 15px;
    background-color: #fcfcfc;
}
.table_head>div:nth-child(even){
    text-align: right;
    color:var(--ion-color-primary);
}
.table{
    display:grid;
    grid-template-columns:repeat(3,auto);
    font-size:.6em;
    margin: 10px;
}
.table_h{
    display:contents;
    font-weight:bold;
    text-align: left;
    white-space: nowrap;
    border-radius:15px;
}
.table_r{
    display:contents;
}
.table_r:nth-child(odd)>div{
    background-color: #fcfcfc;
}
.table_r:hover>div{
    background-color: var(--ion-color-primary-tint);
}
.table_h>div{
    color:var(--ion-color-primary);
    font-weight: bold;
    background-color: var(--ion-color-primary-tint);
    padding: 15px;
    border-bottom: 3px var(--ion-color-primary) solid;
}
.table_r>div{
    padding: 10px;
    border-bottom: 1px #ccc solid;
}
</style>
<template>
    <h6 class="ion-padding-horizontal">{{ label }}</h6>
    <div v-if="list.length > 0" class="table" style="overflow-x:auto">
        <div class="table_h">
            <div>#</div>
            <div>Продавец</div>
            <div>Показы</div>
        </div>
        <div v-for="(row,i) in list" :key="i" class="table_r">
            <div>{{i+1}}</div>
            <div>
                <router-link :to="`/catalog/${row.act_group}-${row.act_target_id}`">
                {{row.act_description}}
                </router-link>
            </div>
            <div>{{row.total}}</div>
        </div>
    </div>
    <div v-else class="ion-padding ion-text-center">
      <h2>Недостаточно данных</h2>
      <p>для показа статистики</p>
    </div>
</template>

<script>

export default {
  components: {},
  props:['label', 'data', 'format', 'color', 'dates'],
  setup(){
    return {}
  },
  data() {
    return {
      value: 0,
      list: this.data 
    }
  },
  methods: {
  },
};
</script>