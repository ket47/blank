<?php
namespace Controllers;

class Catalog{
    public function index(){
        $CatalogModel=new \Models\CatalogModel();


        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['title']="Тезкель экспресс доставка";
        $context['description']="Служба экспресс доставки из ресторанов, магазинов и маркетов. Бонусы при регистрации.";
        $context['topStoreList']=$CatalogModel->storeListGet([
            'limit'=>48
        ]);
        $context['topStoreListPageCount']=$CatalogModel->storeListPageCountGet();
        $context['topProductList']=$CatalogModel->productListGet([
            'limit'=>48
        ]);
        $context['topProductListPageCount']=$CatalogModel->productListPageCountGet();
        view('aboutUs',$context);
    }

    public function store(){
        $store_id=(int)func_get_arg(0);
        
        $CatalogModel=new \Models\CatalogModel();
        $store=$CatalogModel->storeItemGet($store_id);

        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['title']="{$store->store_name} на Тезкель";
        $context['description']="{$store->store_description} Вы можете заказать через Тезкель.";
        $context['store']=$store;
        $context['productList']=$CatalogModel->productListGet([
            'limit'=>150,
            'store_id'=>$store_id
        ]);
        view('store',$context);
    }

    public function product(){
        $product_id=(int)func_get_arg(0);
        
        $CatalogModel=new \Models\CatalogModel();
        $product=$CatalogModel->productItemGet($product_id);

        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['title']="{$product->product_name} из {$product->store_name} на Тезкель";
        $context['description']="{$product->product_description} из {$product->store_name} Вы можете заказать через Тезкель.";
        $context['product']=$product;
        view('product',$context);
    }
}