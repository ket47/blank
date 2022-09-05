<?php

namespace Controllers;
class Catalog{
    public function store(){
        $store_id=func_get_arg(0);
        $HomeModel=new \Models\HomeModel();
        $store=$HomeModel->storeItemGet((int)$store_id);
        $context=['image_host'=>'https://api.tezkel.com/image/get.php'];
        $context['store']=$store;
        $context['topProductList']=$HomeModel->productListGet([
            'limit'=>150,
            'page'=>0,
            'store_id'=>$store->store_id
        ]);
        $context['page_title']="{$store->store_name} на Тезкель";
        $context['page_description']="{$store->store_description} Сделайте заказ через службу доставки Тезкель";
        view('storeItem',$context);
    }

    public function product(){
        $product_id=func_get_arg(0);
        $HomeModel=new \Models\HomeModel();
        $product=$HomeModel->productItemGet((int)$product_id);
        $context=['image_host'=>'https://api.tezkel.com/image/get.php'];
        $context['product']=$product;
        $context['page_title']="{$product->product_name} купить на Тезкель";
        $context['page_description']="{$product->product_description} Сделайте заказ через службу доставки Тезкель";
        view('productItem',$context);
    }
}