<?php
namespace Controllers;


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
}
















use XMLWriter;

/**
 * SiteMap
 *
 * This class used for generating Google Sitemap files
 * Cycle: Schema added for validation, time format changed to ISO
 *
 * @package SiteMap
 * @author Cycle
 * @copyright 2018 Cycle
 * @license Cycle License
 */
class SiteMapService{

    /**
     *
     * @var XMLWriter
     */
    private $writer;

    private $domain;

    private $path;

    private $filename = 'sitemap';

    private $current_item = 0;

    private $current_sitemap = 0;

    const EXT = '.xml';

    const SCHEMA = 'http://www.sitemaps.org/schemas/sitemap/0.9';

    const DEFAULT_PRIORITY = 0.5;

    const ITEM_PER_SITEMAP = 50000;

    const SEPERATOR = '-';

    const INDEX_SUFFIX = 'index';

    /**
     *
     * @param string $domain
     */
    public function __construct($domain)
    {
        $this->setDomain($domain);
    }

    /**
     * Sets root path of the website, starting with http:// or https://
     *
     * @param string $domain
     */
    public function setDomain($domain)
    {
        $this->domain = $domain;
        return $this;
    }

    /**
     * Returns root path of the website
     *
     * @return string
     */
    private function getDomain()
    {
        return $this->domain;
    }

    /**
     * Returns XMLWriter object instance
     *
     * @return XMLWriter
     */
    private function getWriter()
    {
        return $this->writer;
    }

    /**
     * Assigns XMLWriter object instance
     *
     * @param XMLWriter $writer
     */
    private function setWriter(XMLWriter $writer)
    {
        $this->writer = $writer;
    }

    /**
     * Returns the path of sitemaps
     *
     * @return string
     */
    private function getPath()
    {
        return $this->path;
    }

    /**
     * Sets paths of sitemaps
     *
     * @param string $path
     * @return Sitemap
     */
    public function setPath($path)
    {
        $this->path = $path;
        return $this;
    }

    /**
     * Returns the filename of the sitemap file
     *
     * @return string
     */
    private function getFilename()
    {
        return $this->filename;
    }

    /**
     * Sets filename of sitemap file
     *
     * @param string $filename
     * @return Sitemap
     */
    public function setFilename($filename)
    {
        $this->filename = $filename;
        return $this;
    }

    /**
     * Returns current item count
     *
     * @return int
     */
    private function getCurrentItem()
    {
        return $this->current_item;
    }

    /**
     * Increases item counter
     */
    private function incCurrentItem()
    {
        $this->current_item = $this->current_item + 1;
    }

    /**
     * Returns current sitemap file count
     *
     * @return int
     */
    private function getCurrentSitemap()
    {
        return $this->current_sitemap;
    }

    /**
     * Increases sitemap file count
     */
    private function incCurrentSitemap()
    {
        $this->current_sitemap = $this->current_sitemap + 1;
    }

    /**
     * Prepares sitemap XML document
     */
    private function startSitemap()
    {
        $this->setWriter(new XMLWriter());
        if ($this->getCurrentSitemap()) {
            $this->getWriter()->openURI($this->getPath() . $this->getFilename() . self::SEPERATOR . $this->getCurrentSitemap() . self::EXT);
        } else {
            $this->getWriter()->openURI($this->getPath() . $this->getFilename() . self::EXT);
        }
        $this->getWriter()->startDocument('1.0', 'UTF-8');
        $this->getWriter()->setIndent(true);
        $this->getWriter()->startElement('urlset');
        $this->getWriter()->writeAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
        $this->getWriter()->writeAttribute('xsi:schemaLocation', "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd");
        $this->getWriter()->writeAttribute('xmlns', self::SCHEMA);
    }

    /**
     * Adds an item to the sitemap
     *
     * @param string $loc
     *            URL of the page. This value must be less than 2,048 characters.
     * @param string $priority
     *            The priority of this URL relative to other URLs on your SiteMapService. Valid values range from 0.0 to 1.0.
     * @param string $changefreq
     *            How frequently the page is likely to change. Valid values are always, hourly, daily, weekly, monthly, yearly and never.
     * @param string|int $lastmod
     *            The date of last modification of URL. Unix timestamp or any English textual DateTime description.
     * @return Sitemap
     */
    public function addItem($loc, $priority = self::DEFAULT_PRIORITY, $changefreq = NULL, $lastmod = NULL)
    {
        if (($this->getCurrentItem() % self::ITEM_PER_SITEMAP) == 0) {
            if ($this->getWriter() instanceof XMLWriter) {
                $this->endSitemap();
            }
            $this->startSitemap();
            $this->incCurrentSitemap();
        }
        $this->incCurrentItem();
        $this->getWriter()->startElement('url');
        $this->getWriter()->writeElement('loc', $this->getDomain() . $loc);
        if ($lastmod)
            $this->getWriter()->writeElement('lastmod', $this->getLastModifiedDate($lastmod));
        if ($changefreq)
            $this->getWriter()->writeElement('changefreq', $changefreq);
        if ($priority)
            $this->getWriter()->writeElement('priority', $priority);
        $this->getWriter()->endElement();
        return $this;
    }

    /**
     * Prepares given a date for sitemap
     *
     * @param string $date
     *            Unix timestamp or any English textual datetime description
     * @return ISO8601 format.
     */
    private function getLastModifiedDate($date)
    {
        if (ctype_digit($date)) {
            return date('c', $date);
        } else {
            $date = strtotime($date);
            return date('c', $date);
        }
    }

    /**
     * Finalizes tags of sitemap XML document.
     */
    private function endSitemap()
    {
        if (! $this->getWriter()) {
            $this->startSitemap();
        }
        $this->getWriter()->endElement();
        $this->getWriter()->endDocument();
    }

    /**
     * Writes Google sitemap index for generated sitemap files
     *
     * @param string $loc
     *            Accessible URL path of sitemaps
     * @param string|int $lastmod
     *            The date of last modification of sitemap. Unix timestamp or any English textual datetime description.
     */
    public function createSitemapIndex($loc, $lastmod = 'Today')
    {
        $this->endSitemap();
        $indexwriter = new XMLWriter();
        $indexwriter->openURI($this->getPath() . $this->getFilename() . self::SEPERATOR . self::INDEX_SUFFIX . self::EXT);
        $indexwriter->startDocument('1.0', 'UTF-8');
        $indexwriter->setIndent(true);
        $indexwriter->startElement('sitemapindex');
        $indexwriter->writeAttribute('xmlns', self::SCHEMA);
        for ($index = 0; $index < $this->getCurrentSitemap(); $index ++) {
            $indexwriter->startElement('sitemap');
            $indexwriter->writeElement('loc', $loc . $this->getFilename() . ($index ? self::SEPERATOR . $index : '') . self::EXT);
            $indexwriter->writeElement('lastmod', $this->getLastModifiedDate($lastmod));
            $indexwriter->endElement();
        }
        $indexwriter->endElement();
        $indexwriter->endDocument();
    }
}