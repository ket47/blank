import { createRouter, createWebHistory, } from '@ionic/vue-router';

import BaseTabs from '@/components/BaseTabs.vue'

const already_visited_app=localStorage?.already_visited_app?true:false;
const homePath=already_visited_app?"/catalog":'/page/about-us';
localStorage.already_visited_app=1;

const routes = [
  {
    path: '/home/',
    redirect: '/'
  },
  {
    path: '/',
    redirect: homePath
  },
  {
    path: '/',
    component: BaseTabs,
    children: [
      {
        path: '',
        redirect: "/catalog"
      },
      {
        path: "/catalog",
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: '/catalog/store-edit-:id',
        component: () => import('@/views/StoreEdit.vue')
      },
      {
        path: '/catalog/store-:id',
        component: () => import('@/views/StoreView.vue')
      },
      {
        path: '/catalog/product-edit-:id',
        component: () => import('@/views/ProductEdit.vue')
      },
      {
        path: '/catalog/product-:id',
        component: () => import('@/views/ProductView.vue')
      },





      {
        path: '/search/',
        component: () => import('@/views/SearchView.vue')
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
        path: '/user/',
        redirect: '/user/user-dashboard'
      },
      {
        path: '/user/user-dashboard',
        component: () => import('@/views/UserDashboard.vue'),
        props: true
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
        path: '/user/user-addresses',
        component: () => import('@/views/UserAddresses.vue')
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
        path: '/user/text-list',
        component: () => import('@/views/TextListView.vue')
      },
      {
        path: '/user/admin-tariff-list',
        component: () => import('@/views/AdminTariffList.vue')
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
        path: '/user/supplier-statistics',
        component: () => import('@/views/user/SupplierStatistics.vue')
      },
      {
        path: '/user/user-cards',
        component: () => import('@/views/user/UserCards.vue')
      },
      

      {
        path: '/order/',
        redirect: '/order/order-list'
      },
      {
        path: '/order/order-list',
        component: () => import('@/views/OrderList.vue')
      },
      {
        path: '/order/order-checkout-:id',
        component: () => import('@/views/OrderCheckout.vue')
      },
      {
        path: '/order/order-:id',
        component: () => import('@/views/OrderView.vue')
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
  ]
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
export default router
