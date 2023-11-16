<?php
namespace Controllers;
use \Library\SiteMapService;


class Sitemap{
    private $siteMapService;
    function index(){
        $this->siteMapService=new SiteMapService(getenv('app.frontendURL'));
        $this->siteMapService->setPath('../');
        $this->addPages();
        $this->addStores();
        $this->addProducts();
        echo $this->flush();
    }


    private function addPages(){
        $PageModel=new \Models\PageModel();
        $pages=$PageModel->pageListGet();
        foreach($pages as $page){
            $this->siteMapService->addItem("page/{$page->page_name}/", 0.3, "yearly","{$page->updated_at}");
        }
    }
    private function addStores(){
        $CatalogModel=new \Models\CatalogModel();
        $stores=$CatalogModel->storeListGet([
            'limit'=>500
        ]);
        foreach($stores as $store){
            $this->siteMapService->addItem("catalog/store-{$store->store_id}/", "1", "monthly","{$store->updated_at}");
        }
    }
    private function addProducts(){
        $CatalogModel=new \Models\CatalogModel();
        $products=$CatalogModel->productListGet([
            'limit'=>5000
        ]);
        foreach($products as $product){
            $this->siteMapService->addItem("catalog/product-{$product->product_id}/", "0.7", "weekly","{$product->updated_at}");
        }
    }

    private function flush(){
        $siteMapResult = $this->siteMapService->createSitemapIndex(getenv('app.baseURL'), 'Now');
        if (empty($siteMapResult)) {
            $result = "1";
        } else {
            $result = "0";
        }
        return $result;
    }

    public function ymlFeed(){
        header("Content-Type:text/xml");
        // $CatalogModel=new \Models\CatalogModel();
        // $stores=$CatalogModel->storeListGet([
        //     'limit'=>500
        // ]);
        $xml=new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startDocument('1.0', 'UTF-8');
        $xml->startElement('yml_catalog');
        $xml->writeAttribute('date',date("Y-m-d\TH:i:s"));

        //foreach($stores as $store){
            $xml->startElement('shop');
            $xml->writeElement('name',getenv('app.title'));
            $xml->writeElement('company',getenv('app.company'));
            $xml->writeElement('url',getenv('app.frontendURL'));
            
            $CatalogModel=new \Models\CatalogModel();
            $categories=$CatalogModel->categoryListAllGet();
            
            
            if($categories){
                $categories[]=(object)[
                    'group_id'=>1,
                    'group_name'=>'другое'
                    ];
                $xml->startElement('categories');
                foreach($categories as $cat){
                    $xml->startElement('category');
                    $xml->writeAttribute('id',$cat->group_id);
                    $xml->text($cat->group_name);
                    $xml->endElement();
                }
                $xml->endElement();
            }
            $xml->startElement('offers');
            $this->ymlProductsWrite($xml);
            $xml->endElement();
            $xml->endElement();
        //}

        $xml->endElement();
        $xml->endDocument();
        echo $xml->flush();
    }

    private function ymlProductsWrite($xml){
        $CatalogModel=new \Models\CatalogModel();
        $products=$CatalogModel->productListGet([
            'limit'=>5000
        ]);
        foreach($products as $product){
            if( !$product->product_final_price ){
                continue;
            }
            $xml->startElement('offer');
            $xml->writeAttribute('id',$product->product_id);
            $xml->writeElement('name',$product->product_name);
            $xml->writeElement('url',getenv('app.frontendURL').'catalog/product-'.$product->product_id);
            $xml->writeElement('price',$product->product_final_price);
            if($product->product_final_price!=$product->product_price){
                $xml->writeElement('oldprice',$product->product_price);
            }
            $xml->writeElement('delivery','true');
            $xml->writeElement('weight',$product->product_weight);
            if(!$product->group_id){
                $product->group_id=1;
            }
            $xml->writeElement('categoryId',$product->group_id);
            $xml->writeElement('currencyId','RUR');
            
            $xml->writeElement('picture',getenv('app.backendURL')."image/get.php/{$product->image_hash}.500.500.jpg");
            if(!empty($product->product_description)){
                $xml->startElement('description');
                $xml->writeCdata($product->product_description);
                $xml->endElement();
            }
            $xml->endElement();
        }
    }

    public function googleFeed(){
        header("Content-Type: text/plain");
        $CatalogModel=new \Models\CatalogModel();
        $products=$CatalogModel->productListGet([
            'limit'=>5000,
        ]);
        $out = fopen('php://output', 'w');
        fputcsv($out, [
            'id','title','description','price','condition','link','availability','image_link',
        ], "\t");
        foreach ($products as $prod) {
            $fields=[
                $prod->product_id,
                addslashes($prod->product_name),
                addslashes($prod->product_description),
                "{$prod->product_final_price} RUB",
                'new',
                getenv('app.frontendURL').'catalog/product-'.$prod->product_id,
                'in_stock',
                getenv('app.backendURL')."/image/get.php/{$prod->image_hash}.500.500.webp"
            ];
            fputcsv($out, $fields, "\t");
        }
        fclose($out);
    }
    public function googleFeedXml(){
        header("Content-Type:text/xml");
        $CatalogModel=new \Models\CatalogModel();
        $products=$CatalogModel->productListGet([
            'limit'=>5000,
        ]);
        $xml=new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startDocument('1.0', 'UTF-8');
        $xml->startElement('rss');
        $xml->writeAttribute('xmlns:g','http://base.google.com/ns/1.0');
        $xml->writeAttribute('version','2.0');

        $xml->startElement('channel');
        $xml->writeElement('title',getenv('app.title'));
        $xml->writeElement('description',getenv('app.description'));
        $xml->writeElement('link',getenv('app.frontendURL'));
        
        
        foreach($products as $prod){
            $xml->startElement('item');
            $xml->writeElement('g:id',$prod->product_id);
            $xml->writeElement('g:title',$prod->product_name);
            $xml->writeElement('g:description',$prod->product_description);
            $xml->writeElement('g:link',getenv('app.frontendURL').'catalog/product-'.$prod->product_id);
            $xml->writeElement('g:image_link',getenv('app.backendURL')."/image/get.php/{$prod->image_hash}.500.500.webp");
            
            $xml->writeElement('g:availability','in stock');
            $xml->writeElement('g:price',"{$prod->product_price} RUB");
            if($prod->product_final_price!=$prod->product_price){
                $xml->writeElement('g:sale_price',"{$prod->product_final_price} RUB");
                $start=strtotime($prod->product_promo_start);
                $finish=strtotime($prod->product_promo_finish);
                $xml->writeElement('g:sale_price_effective_date',date("Y-m-d\TH:i O",$start)." / ".date("Y-m-d\TH:i O",$finish));
            }
            $xml->writeElement('g:unit_pricing_measure',$prod->product_unit);
            $xml->writeElement('g:product_type',$prod->group_name??'');
            $xml->writeElement('g:identifier_exists','no');
            $xml->writeElement('g:adult','no');
            $xml->writeElement('g:product_weight',$prod->product_weight);
            $xml->endElement();
        }
        $xml->endElement();
        $xml->endElement();
        $xml->endDocument();
        echo $xml->flush();
    }
    public function turboRSSXml($scope = 'store', $page = 0){
        if(!isset($_GET['scope']) || !isset($_GET['page'])){
            return;
        }
        $scope = $_GET['scope'];
        $page = $_GET['page'];
        header("Content-Type:text/xml");
        $xml=new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startDocument('1.0', 'UTF-8');
            $xml->startElement('rss');
            $xml->writeAttribute('xmlns:yandex','http://news.yandex.ru');
            $xml->writeAttribute('xmlns:media','http://search.yahoo.com/mrss/');
            $xml->writeAttribute('xmlns:turbo','http://turbo.yandex.ru');
            $xml->writeAttribute('version','2.0');
                $xml->startElement('channel');
                    $xml->writeElement('title',getenv('app.title')." ".$scope." (".(($page)*1000)."-".(($page+1)*1000).")");
                    $xml->writeElement('description',getenv('app.description'));
                    $xml->writeElement('link',getenv('app.frontendURL'));
                    $xml->endElement();
                    $xml = $this->addTurboItemsXml($scope, $xml, $page);
                    if(!$xml){
                        return false;
                    }
                $xml->endElement();
            $xml->endElement();
        $xml->endDocument();
        echo $xml->flush();
    }
    public function addTurboItemsXml($scope, $xml, $page){
        $Catalog = new \Controllers\Catalog();
        $CatalogModel  =new \Models\CatalogModel();
        $items = $CatalogModel->{$scope.'ListGet'}(['limit' => 1000, 'page' => $page]);  
        if(empty($items)){
            return false;
        }
        foreach($items as $item){
            $xml->startElement('item');
            $xml->writeAttribute('turbo', 'true');
                $xml->writeElement('link', 'https://'.getenv('app.frontendURL').'/catalog/'.$scope.'-'.$item->{$scope.'_id'});
                $xml->writeElement('author', getenv('app.company'));
                $xml->writeElement('pubDate', $item->updated_at);
                isset($item->group_name) ?? $xml->writeElement('category', $item->group_name);
                $xml->startElement('turbo:content');
                    ob_start();
                    $Catalog->{$scope}($item->{$scope.'_id'});
                    $page_rendered = ob_get_clean();
                    $xml->writeCData($page_rendered);
                $xml->endElement();
            $xml->endElement();
        }
        return $xml;
    }

}