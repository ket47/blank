<?php

namespace Controllers;
class Home{
    public function index( $store_page=null, $product_page=null ){
        $HomeModel=new \Models\HomeModel();
        $context=['image_host'=>'https://api.tezkel.com/image/get.php'];
        $context['topStoreListPageCount']=$HomeModel->storeListPageCountGet();
        $context['topStoreList']=$HomeModel->storeListGet([
            'limit'=>12,
            'page'=> (int) $store_page
        ]);
    
        $context['topProductListPageCount']=$HomeModel->productListPageCountGet();
        $context['topProductList']=$HomeModel->productListGet([
            'limit'=>24,
            'page'=> (int) $product_page
        ]);
        $context['page_title']='Тезкель экспресс доставка';
        $context['page_description']='Служба экспресс доставки из ресторанов, магазинов и маркетов. Бонусы при регистрации.';
        view('home',$context);
    }
}