import { createRouter, createWebHistory, } from '@ionic/vue-router';

import BaseTabs       from '@/components/BaseTabs.vue'
//import HomePage       from '@/views/HomePage.vue'
import HomeMain       from '@/views/HomeMain.vue'
import SearchView     from '@/views/SearchView.vue'
import UserDashboard  from '@/views/UserDashboard.vue'
import StoreView      from '@/views/StoreView.vue'
import ProductView    from '@/views/ProductView.vue'
import OrderCheckout  from '@/views/OrderCheckout.vue'
import OrderView      from '@/views/OrderView.vue'

import Topic          from '@/scripts/Topic.js';

// const already_visited_app=localStorage?.already_visited_app?true:false;
// const homePath=already_visited_app?"/catalog":'/page/about-us';
// localStorage.already_visited_app=1;

const homePath="/catalog"
const routes = [
  {
    path: '/home',
    redirect: homePath
  },
  {
    path: '/',
    redirect: homePath
  },
  {
    path: '/',
    component: BaseTabs,
    children: [
      // {
      //   path: "",
      //   redirect: '/catalog',
      // },
      {
        path: "/catalog",
        component: HomeMain
      },
      {
        path: "/catalog/home-2",
        component: HomeMain
      },
      {
        path: '/catalog/store-edit-products-:id',
        component: () => import('@/views/StoreEditProducts.vue')
      },
      {
        path: '/catalog/store-edit-dmethods-:id',
        component: () => import('@/views/StoreEditDeliveryMethods.vue')
      },
      {
        path: '/catalog/store-edit-:id',
        component: () => import('@/views/StoreEdit.vue')
      },
      {
        path: '/catalog/store-:id',
        component: StoreView
      },
      {
        path: '/catalog/product-edit-:id',
        component: () => import('@/views/ProductEdit.vue')
      },
      {
        path: '/catalog/product-:id',
        component: ProductView
      },





      {
        path: '/search',
        component: SearchView
      },
      {
        path: '/search/store-edit-:id',
        component: () => import('@/views/StoreEdit.vue')
      },
      {
        path: '/search/store-:id',
        component: () => import('@/views/StoreView.vue')
      },
      {
        path: '/search/product-edit-:id',
        component: () => import('@/views/ProductEdit.vue')
      },
      {
        path: '/search/product-:id',
        component: () => import('@/views/ProductView.vue')
      },




      {
        path: '/user',
        component: UserDashboard,
      },
      {
        path: '/user/courier-dashboard',
        component:() => import('@/views/CourierDashboard.vue')
      },
      {
        path: '/user/supplier-dashboard',
        component:() => import('@/views/SupplierDashboard.vue')
      },
      {
        path: '/user/sign-in',
        component: () => import('@/views/UserSignIn.vue')
      },
      {
        path: '/user/sign-up',
        component: () => import('@/views/UserSignUp.vue')
      },
      {
        path: '/user/user-edit',
        component: () => import('@/views/UserEdit.vue')
      },
      {
        path: '/user/user-promo',
        component: () => import('@/views/UserPromoList.vue'),
        props: true
      },
      {
        path: '/user/user-invoice',
        component: () => import('@/views/UserInvoiceList.vue'),
        props: true
      },
      {
        path: '/user/verify-phone',
        name:'UserVerifyPhone',
        component: () => import('@/views/UserVerifyPhone.vue'),
        props: true
      },
      {
        path: '/user/reset-password',
        component: () => import('@/views/UserResetPassword.vue')
      },
      {
        path: '/user/confirm-password',
        component: () => import('@/views/UserResetPasswordConfirm.vue')
      },
      {
        path: '/user/text-edit-:id',
        component: () => import('@/views/TextPageEdit.vue')
      },
      {
        path: '/user/admin-tariff-edit-:id',
        component: () => import('@/views/AdminTariffEdit.vue')
      },
      {
        path: '/user/courier-statistics',
        component: () => import('@/views/user/CourierStatistics.vue')
      },
      {
        path: '/user/supplier-statistics-:id',
        component: () => import('@/views/user/SupplierStatistics.vue')
      },
      {
        path: '/user/user-cards',
        component: () => import('@/views/user/UserCards.vue')
      },
      {
        path: '/user/reactions',
        component: () => import('@/views/ReactionsView.vue')
      },
      {
        path: '/user/feedback',
        component: () => import('@/views/user/FeedbackView.vue')
      },
      

      {
        path: '/order',
        component: () => import('@/views/OrderList.vue')
      },
      {
        path: '/order/order-list',
        component: () => import('@/views/OrderList.vue')
      },
      {
        path: '/order/order-:id',
        component: OrderView
      },


      {
        path: '/order/shipment-draft',
        component: () => import('@/views/ShipmentDraftView.vue')
      },
      {
        path: '/order/shipment-:id',
        component: () => import('@/views/ShipmentView.vue')
      },




          
      {
        path: '/page/about-us',
        component: () => import('@/views/AboutUs.vue')
      },
      {
        path: '/page/supplier-guide',
        component: () => import('@/views/SupplierGuide.vue')
      },
      {
        path: '/page/:id',
        component: () => import('@/views/TextPageView.vue')
      },
      {
        path: '/error-offline',
        component: () => import('@/views/ErrorOffline.vue')
      },



      
      {
        path: '/admin/transaction-edit-:id',
        component: () => import('@/views/admin/TransactionEdit.vue')
      },
      {
        path: '/admin/accounting',
        component: () => import('@/views/admin/AccountingView.vue')
      },
      {
        path: '/admin/list-moderation',
        component: () => import('@/views/admin/ListModeration.vue')
      },
      {
        path: '/admin/text-list',
        component: () => import('@/views/TextListView.vue')
      },
      {
        path: '/admin/tariff-list',
        component: () => import('@/views/AdminTariffList.vue')
      },
      {
        path: '/admin/mailing-list',
        component: () => import('@/views/admin/MailingView.vue')
      },
      {
        path: '/admin/analytics',
        component: () => import('@/views/admin/AnalyticsView.vue')
      },
  ]
  },
  {
    path: '/modal/store-dmethods-:id',
    component: () => import('@/views/StoreDeliveryMethods.vue')
  },
  {
    path: '/modal/order-checkout-:id',
    component: OrderCheckout
  },
  {
    path: '/modal/shipment-checkout-:id',
    component: () => import('@/views/ShipmentCheckout.vue')
  },
  {
    path: '/modal/user-addresses',
    component: () => import('@/views/UserAddresses.vue')
  },
  {
    path: '/catalog/store-:id/menu',
    component: () => import('@/views/StoreMenu.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: homePath
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  Topic.publish('dismissModal')
  return true
})

export default router
