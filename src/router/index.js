import { createRouter, createWebHistory } from '@ionic/vue-router';

import Tabs from '@/views/Tabs.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'search',
        component: () => import('@/views/Search.vue')
      },
      {
        path: 'user-dashboard',
        name: 'UserDashboard',
        component: () => import('@/views/UserDashboard.vue'),
        props: true
      },
      {
        path:'courier-dashboard',
        component:()=>import('@/views/CourierDashboard.vue')
      },
      {
        path: '/product-:id',
        component: () => import('@/views/ProductView.vue')
      },
      {
        path: '/product_edit-:id',
        component: () => import('@/views/ProductEdit.vue')
      },
      {
        path: '/store-:id',
        component: () => import('@/views/StoreView.vue')
      },
      {
        path: '/store_edit-:id',
        component: () => import('@/views/StoreEdit.vue')
      },
      {
        path: '/category-:id',
        component: () => import('@/views/CategoryView.vue')
      },
      {
        path: '/sign-in',
        name: 'UserSignIn',
        component: () => import('@/views/UserSignIn.vue')
      },
      {
        path: '/sign-up',
        component: () => import('@/views/UserSignUp.vue')
      },
      {
        path: '/user-edit',
        component: () => import('@/views/UserEdit.vue')
      },
      {
        path: '/verify-phone',
        name: 'UserVerifyPhone',
        component: () => import('@/views/UserVerifyPhone.vue'),
        props: true
      },
      {
        path: '/reset-password',
        component: () => import('@/views/UserResetPassword.vue')
      },
      {
        path: '/user-addresses',
        name:'UserAddresses',
        component: () => import('@/views/UserAddresses.vue')
      },
      {
        path: '/user-addresses-add',
        component: () => import('@/views/UserAddressesAdd.vue')
      },
      {
        path: '/user-favourites',
        component: () => import('@/views/UserFavourites.vue')
      },
      {
        path: '/order-list',
        component: () => import('@/views/OrderList.vue')
      },
      // {
      //   path: '/cart-list',
      //   component: () => import('@/views/CartList.vue')
      // },
      {
        path: '/order-:id',
        component: () => import('@/views/OrderView.vue')
      },
      {
        path: '/user-payment-methods',
        component: () => import('@/views/UserPaymentMethods.vue')
      },
      {
        path: '/user-notifications',
        component: () => import('@/views/UserNotifications.vue')
      },
      {
        path: '/help',
        component: () => import('@/views/Help.vue')
      },
      {
        path: '/confirm-password',
        component: () => import('@/views/UserResetPasswordConfirm.vue')
      },

  ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
