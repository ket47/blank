import { createRouter, createWebHashHistory, } from '@ionic/vue-router';

import BaseTabs from '@/components/BaseTabs.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: BaseTabs,
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: '/search',
        component: () => import('@/views/SearchView.vue')
      },
      {
        path: '/courier-dashboard',
        component:() => import('@/views/CourierDashboard.vue')
      },
      {
        path: '/supplier-dashboard',
        component:() => import('@/views/SupplierDashboard.vue')
      },
      {
        path: '/product-edit-:id',
        component: () => import('@/views/ProductEdit.vue')
      },
      {
        path: '/product-:id',
        component: () => import('@/views/ProductView.vue')
      },
      {
        path: '/store-edit-:id',
        component: () => import('@/views/StoreEdit.vue')
      },
      {
        path: '/store-:id',
        component: () => import('@/views/StoreView.vue')
      },
      {
        path: '/category-:id',
        component: () => import('@/views/CategoryView.vue')
      },
      {
        path: '/sign-in',
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
        path: '/user-dashboard',
        component: () => import('@/views/UserDashboard.vue'),
        props: true
      },
      {
        path: '/verify-phone',
        name:'UserVerifyPhone',
        component: () => import('@/views/UserVerifyPhone.vue'),
        props: true
      },
      {
        path: '/reset-password',
        component: () => import('@/views/UserResetPassword.vue')
      },
      {
        path: '/user-addresses',
        component: () => import('@/views/UserAddresses.vue')
      },
      {
        path: '/user-favourites',
        component: () => import('@/views/UserFavourites.vue')
      },
      {
        path: '/order-checkout-:id',
        component: () => import('@/views/OrderCheckout.vue')
      },
      {
        path: '/order-list',
        component: () => import('@/views/OrderList.vue')
      },
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
      {
        path: '/text-edit-:id',
        component: () => import('@/views/TextPageEdit.vue')
      },
      {
        path: '/text-list',
        component: () => import('@/views/TextListView.vue')
      },
      {
        path: '/page-:id',
        component: () => import('@/views/TextPageView.vue')
      },
  ]
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
export default router
