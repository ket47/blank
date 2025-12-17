<style>
ion-tab-bar.main-tab-bar  {
  contain: inherit;
  overflow: visible;
  position: relative;
  padding-inline-end: 0;
  box-shadow: 0px -3px 10px #ccc;
  justify-content: space-around;
  color:#999;
  background: white;
}
ion-tab-bar.main-tab-bar>div{
  width:calc(100vw / 4);
}
.tabbar_svg_logo{
  display: none;
}
@media screen and (max-width: 1000px) {
  ion-footer{
    display: none !important;
  }
}
@media only screen and (min-width: 1000px) {
    .main-tab-bar-adaptive .tabbar_svg_logo{
      display: block;
      margin-bottom: 30px;
    }
    .main-grid{
      display:grid;
      grid-template-columns:minmax(250px,15%) 70% 15%;
      width:100%;
      min-height: 100vh;
    }
    ion-tab-bar.main-tab-bar-adaptive  {
      position: fixed;
      width: 15%;
      min-width: 250px;
      height: 300px;

      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;
      box-shadow: none;
    }
    ion-tab-bar.main-tab-bar-adaptive>div{
      width:200px;
      margin:2px;
      padding:10px;
      color:var(--ion-color-dark);
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 10px;
      
      background-color: #ffffff;
      background-color: rgba(255,255,255,.7);
    }
    ion-tab-bar.main-tab-bar-adaptive ion-label{
      display:inline-block;
      font-size:1em;
      margin-left:10px;
      color: var(--ion-color-dark);
    }
    ion-tab-bar.main-tab-bar-adaptive>div ion-icon{
      font-size:1.2em;
      color: var(--ion-color-dark);
    }
    .tabbar_svg_logo ion-icon{
      width: 100%;
      height: 60px;
      display: block;
    }

    ion-tab-bar.main-tab-bar-adaptive .tab-selected{
      border: 1px solid var(--ion-color-primary);
      background-color: var(--ion-color-primary-tint);
      color:var(--ion-color-primary);
    }
}








ion-tabs ion-icon{
  font-size:1.5em;
}
ion-tab-bar ion-label{
  display: block;
  font-size:0.6em;
}
.tab-selected ion-label{
  color: var(--ion-color-primary);
}
.tab-selected .active{
  display:inline-block;

  color:#000;
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
  background:var(--ion-color-primary);
  position:absolute;
  right:calc( 50% - 20px );
  top:0px;
  border-radius:20px;
  min-width: 15px;
  font-size:0.7em;
  font-weight:bold;
  color:#fff;
  text-align: center;
}
</style>


<template>
  <ion-page>
    <ion-tabs style="position:relative">
      <ion-router-outlet ref="routerOutlet"></ion-router-outlet>
      <ion-tab-bar class="main-tab-bar" slot="bottom">
        <div class="tabbar_svg_logo">
          <ion-icon class=" ion-color ion-color-primary" :icon="mainLogo"/>
        </div>

        <div @click="tabClicked('/catalog')" ref="catalogtab">
          <ion-icon class="active" :icon="home"/>
          <ion-icon class="passive" :icon="homeOutline"/>
          <ion-label>Главная</ion-label>
        </div>

        <div @click="tabClicked('/search')" ref="searchtab">
          <ion-icon class="active" :icon="search"/>
          <ion-icon class="passive" :icon="searchOutline"/>
          <ion-label>Поиск</ion-label>
        </div>

        <div @click="tabClicked('/order')" ref="ordertab" style="position: relative;">
          <ion-icon class="active" :icon="cart"/>
          <ion-icon class="passive" :icon="cartOutline"/>
          <ion-label>Заказы</ion-label>
          <div color="warning" class="badge" v-if="activeOrderCount>0">{{activeOrderCount}}</div>
        </div>

        <div @click="tabClicked('/promo')" ref="promotab">
          <ion-icon class="active" :icon="gift"/>
          <ion-icon class="passive" :icon="giftOutline"/>
          <ion-label>Скидки</ion-label>
        </div>

        <div @click="tabClicked('/user')" ref="usertab">
          <ion-icon class="active" :icon="person"/>
          <ion-icon class="passive" :icon="personOutline"/>
          <ion-label>Профиль</ion-label>
        </div>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonTabBar,
  IonTabs,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
}                   from "@ionic/vue";
import Order        from '@/scripts/Order'

import {
  homeOutline,
  home,
  searchOutline,
  search,
  personOutline,
  person,
  cartOutline,
  cart,
  giftOutline,
  gift,
}                   from 'ionicons/icons';

import mainLogo     from "@/assets/icons/tezkel_logo_text.svg";

export default{
  components: {
  IonPage,
  IonTabBar,
  IonTabs,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  },
  setup() {
    return {
      mainLogo,
      homeOutline,
      home,
      searchOutline,
      search,
      personOutline,
      person,
      cartOutline,
      cart,
      giftOutline,
      gift,
    };
  },
  data(){
    return {
      activeOrderCount:0,
      tabRoutes:{},
      tabSelected:'',
      can_click:0,
      isMobile: false
    }
  },
  async mounted(){
    const self=this
    this.$topic.on('pushStageChanged',data=>{
      self.activeOrderCount=data?.orderActiveCount
    })
    //this.activeOrderCount=await Order.api.listCount()
    this.isMobile= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
    if(!this.isMobile){
      document.querySelector('.main-tab-bar').classList.add('main-tab-bar-adaptive');
    }
    this.tabSelect()

    /**
     * Nonessential request delayed bootstrap
     */
    setTimeout(async ()=>{
      try{
        this.activeOrderCount=await Order.api.listCount()
      } catch{/** */}
    },3000)
  },
  methods:{
    tabClicked(newroute){
      const now=Date.now()
      const currroute_tabname=newroute?.split('/')?.[1]//currently opened tabs name
      if( this.tabSelected==currroute_tabname ){
        document.querySelector('.ion-page:not(.ion-page-hidden)>ion-content').scrollToTop(300)
      }
      if(this.can_click>now){
        return
      }
      this.can_click=now+200

      if( this.tabSelected!==currroute_tabname && this.tabRoutes[currroute_tabname] ){//look if there is prev opened page
        this.$router.push(this.tabRoutes[currroute_tabname])
        return
      }
      this.$router.push(newroute)
    },
    tabSelect(){
      const currroute=this.$route.path
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
    '$route'(to,from){
      this.tabSelect()
    }
  }
}
</script>
