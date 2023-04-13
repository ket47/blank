<style scoped>
ion-tab-bar.bottom-bar  {
  contain: inherit;
  overflow: visible;
  position: relative;
  padding-inline-end: 0;
  box-shadow: 0px -3px 10px #ccc;
  justify-content: space-around;
  color:#999;
}
ion-tab-bar>div{
  width:calc(100vw / 4);
}
ion-tabs ion-icon{
  font-size:1.5em;
}
ion-tabs ion-label{
  display: block;
  font-size:0.6em;
}
.tab-selected ion-label{
  color: var(--ion-color-primary);
}
.tab-selected .active{
  display:inline-block;
}
.tab-selected .passive{
  display:none;
}
.active{
  display:none;
}
.passive{
  display:inline-block;
}
.badge{
  background:var(--ion-color-warning);
  position:absolute;
  right:calc( 50% - 20px );
  top:0px;
  border-radius:20px;
  min-width: 15px;
  font-size:0.7em;
  font-weight:bold;
  color:#000;
}
.ios ion-tab-bar>div{
  margin-top: -10px;
}
</style>


<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar v-if="isMobile || narrowScreen" class="bottom-bar" slot="bottom">

        <div @click="tabClicked('/catalog')" ref="catalogtab">
          <ion-icon class="active" color="primary" :icon="home"/>
          <ion-icon class="passive" :icon="homeOutline"/>
          <ion-label>Каталог</ion-label>
        </div>

        <div @click="tabClicked('/search')" ref="searchtab">
          <ion-icon class="active" color="primary" :icon="search"/>
          <ion-icon class="passive" :icon="searchOutline"/>
          <ion-label>Поиск</ion-label>
        </div>

        <div @click="tabClicked('/order')" ref="ordertab" style="position: relative;">
          <ion-icon class="active" color="primary" :icon="reader"/>
          <ion-icon class="passive" :icon="readerOutline"/>
          <div color="warning" class="badge" v-if="activeOrderCount>0">{{activeOrderCount}}</div>
          <ion-label>Заказы</ion-label>
        </div>

        <div @click="tabClicked('/user')" ref="usertab">
          <ion-icon class="active" color="primary" :icon="person"/>
          <ion-icon class="passive" :icon="personOutline"/>
          <ion-label><b>Профиль</b></ion-label>
        </div>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonTabBar,
  IonButton,
  IonTabs,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonBadge,
}                   from "@ionic/vue";
import Order        from '@/scripts/Order'

import {
  homeOutline,
  home,
  searchOutline,
  search,
  personOutline,
  person,
  readerOutline,
  reader,
}                   from 'ionicons/icons';

export default{
  components: {
  IonPage,
  IonTabBar,
  IonButton,
  IonTabs,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonBadge,
  },
  setup() {
    return {
  homeOutline,
  home,
  searchOutline,
  search,
  personOutline,
  person,
  readerOutline,
  reader,
    };
  },
  data(){
    const isMobile= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
    const narrowScreen=screen.width<740;
    return {
      isMobile,
      narrowScreen,
      activeOrderCount:0,
      tabRoutes:{},
      tabSelected:''
    }
  },
  async created(){
    const self=this
    this.$topic.on('pushStageChanged',data=>{
      self.activeOrderCount=data?.orderActiveCount
    })
    this.activeOrderCount=await Order.api.listCount()
    addEventListener("resize", (event) => {this.narrowScreen=screen.width<740});

    this.tabSelect(this.$route.href)
  },
  methods:{
    tabClicked(newroute){
      const currroute_tabname=newroute?.split('/')?.[1]//currently opened tabs name
      if( this.tabSelected!==currroute_tabname && this.tabRoutes[currroute_tabname] ){//look if there is prev opened page
        this.$router.push(this.tabRoutes[currroute_tabname])
        return
      }
      this.$router.push(newroute)
    },
    tabSelect(currroute){
      if(!currroute){
        return
      }
      const route_tabname=currroute?.split('/')?.[1]
      const tabbutton=(route_tabname||'catalog')+'tab'
      document.querySelector('.tab-selected')?.classList?.remove('tab-selected')
      if(this.$refs[tabbutton]){
        this.$refs[tabbutton].className="tab-selected"
      }
      this.tabRoutes[route_tabname]=currroute//here we store last opened route in tab
      this.tabSelected=route_tabname
    }
  },
  watch:{
    '$route.href'(to,from){
      setTimeout(()=>this.tabSelect(this.$route.href),0)
    }
  }
}
</script>
