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

        $context['topCategoryList']=$CatalogModel->categoryListGet([
            'parent_only' => true,
            'limit'=>48
        ]);
        view('aboutUs',$context);
    }

    public function store($store_id = null){
        $store_id ?? (int)func_get_arg(0);
        $context = $this->storeDataGet($store_id);
        if(!$context){
            return redirect('/');
        }
        view('store',$context);
    }
    
    public function storeDataGet($store_id){
        $CatalogModel=new \Models\CatalogModel();
        $store=$CatalogModel->storeItemGet($store_id);
        if(empty($store)){
            return false;
        }
        $store->categories=$CatalogModel->categoryListGet([
            'store_id'=>$store_id,
            'parent_only' => true
        ]);
        $locations = $CatalogModel->locationGetList('store', $store->store_id);
        $store_cities = [];
        if(!empty($locations)){
            foreach($locations as $location){
                $location_city = array_reverse(explode(',', $location->location_address))[0]; 
                if(!in_array($location_city, $store_cities)){
                    $store_cities[] = $location_city;
                }
            }
        }
        $store->cities = count($store_cities)>0?implode(', ', $store_cities):getenv('app.location');

        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['image_hash']=$store->image_hash;
        $context['title']="{$store->store_name} с доставкой Тезкель в {$store->cities}";
        $context['description']="{$store->store_description} Вы можете заказать домой или в офис через Тезкель в {$store->cities}.";
        $context['store']=$store;
        $context['productList']=$CatalogModel->productListGet([
            'limit'=>150,
            'store_id'=>$store_id
        ]);
        return $context;
    }

    public function product($product_id = null){
        $product_id ?? (int)func_get_arg(0);
        $context = $this->productDataGet($product_id);
        if(!$context){
            return redirect('/');
        }
        view('product',$context);
    }
    public function productDataGet($product_id){
        $CatalogModel=new \Models\CatalogModel();
        $product=$CatalogModel->productItemGet($product_id);
        if(empty($product)){
            return false;
        }
        $locations = $CatalogModel->locationGetList('store', $product->store_id);
        $product_cities = [];
        if(!empty($locations)){
            foreach($locations as $location){
                $location_city = array_reverse(explode(',', $location->location_address))[0]; 
                if(!in_array($location_city, $product_cities)){
                    $product_cities[] = $location_city;
                }
            }
        }
        $product->cities = count($product_cities)>0?implode(', ', $product_cities):getenv('app.location');

        $context['image_hash']=$product->image_hash;
        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['title']="{$product->product_name} из {$product->store_name} на Тезкель в {$product->cities}";
        $context['description']="{$product->product_description} из {$product->store_name} Вы можете заказать через Тезкель  в {$product->cities}.";
        $context['product']=$product;
        return $context;
    }
    public function category($category_id = null){
        $category_id ?? (int)func_get_arg(0);
        $context=$this->categoryDataGet($category_id);
        if(empty($context)){
            return redirect('/');
        }
        view('category',$context);
    }
    public function categoryDataGet($category_id = null){
        $CatalogModel=new \Models\CatalogModel();
        $category=$CatalogModel->categoryItemGet((int) $category_id);
        if(empty($category)){
            return false;
        }
        $category_cities = [];
        $store_name = "";
        $store_id=$_REQUEST['store_id']??null;
        if($store_id){
            $store=$CatalogModel->storeItemGet($store_id);
            $store_name = "из {$store->store_name}";
            $locations = $CatalogModel->locationGetList('store', $store_id);
            if(!empty($locations)){
                foreach($locations as $location){
                    $location_city = array_reverse(explode(',', $location->location_address))[0]; 
                    if(!in_array($location_city, $category_cities)){
                        $category_cities[] = $location_city;
                    }
                }
            }
        }
        $category->cities = count($category_cities)>0? implode(', ', $category_cities) : getenv('app.location');

        $category->subcategories=$CatalogModel->categoryListGet([
            'group_parent_id'=>$category_id
        ]);
        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['image_hash']=$category->image_hash;
        $context['title']="{$category->group_name} с доставкой Тезкель {$store_name} в {$category->cities}";
        $context['description']="{$category->group_name} Вы можете заказать домой или в офис через Тезкель {$store_name} в {$category->cities}.";
        $context['category']=$category;
        $context['productList']=$CatalogModel->productListGet([
            'limit'=>150,
            'store_id'=>$store_id,
            'category_id'=>$category_id
        ]);
        return $context;
    }
}