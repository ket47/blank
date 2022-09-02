<?php
$uri=$_SERVER['REQUEST_URI'];
$uri_parts=explode('/',$uri);
list($uri_id,$uri_page)=array_reverse($uri_parts);

$expire_after=time()-3*60*60;//3 hours
if( file_exists('home.html') && !$uri_page ){
    $delta=filectime('home.html')-$expire_after;
    if( $delta>0 ){
        //require 'home.html';die;
    }
}
function parseDotEnv(){
    $dotenv=file_get_contents('../../.env');
    $lines = preg_split("/[\n\r]+/", $dotenv);
    foreach($lines as $line){
        $var=explode('=',$line);
        if( strpos(trim($var[0]),'#')===0 ){
            continue;
        }
        putenv(trim($var[0])."=".trim($var[1]));
    }
}
function View($template_file,$context){
    extract($context);
    include $template_file;
}


function pageHome(){
    global $HomeModel,$context,$uri_page,$uri_id;
    $context['topStoreListPageCount']=$HomeModel->storeListPageCountGet();
    $context['topStoreList']=$HomeModel->storeListGet([
        'limit'=>12,
        'page'=> ($uri_page=='storeList')?(int)$uri_id:0
    ]);

    $context['topProductListPageCount']=$HomeModel->productListPageCountGet();
    $context['topProductList']=$HomeModel->productListGet([
        'limit'=>24,
        'page'=>($uri_page=='productList')?(int)$uri_id:0
    ]);
    $context['template']='Views/page.php';
}

function pageProduct(){
    global $HomeModel,$context,$uri_page,$uri_id;
    $context['product']=$HomeModel->productItemGet($uri_id);
    $context['template']='Views/productItem.php';
}

function pageStore(){
    global $HomeModel,$context,$uri_page,$uri_id;
    $context['store']=$HomeModel->storeItemGet($uri_id);
    $context['template']='Views/storeItem.php';
}



function response(){
    global $context,$uri_page;
    ob_start();
        View($context['template'],$context);
        $page_html=ob_get_contents();
        if( !$uri_page ){
            file_put_contents('home.html',$page_html);
        }
    ob_flush();
}




parseDotEnv();
include 'Models/HomeModel.php';
$HomeModel=new \Models\HomeModel();
$context=[
    'image_host'=>'https://api.tezkel.com/image/get.php'
];

switch($uri_page){
    case 'productItem':
        pageProduct();
        break;
    case 'storeItem':
        pageStore();
        break;
    case 'storeList':
    case 'productList':
    default:
        pageHome();
        break;
}
response();