<?php
namespace Controllers;

class Page{
    public function privacy_policy(){
        $this->by_page_name('privacy_policy');
    }

    public function rules(){
        $type=func_get_arg(0);
        $this->by_page_name('rules-'.$type);
    }
    public function contacts(){
        $type=func_get_arg(0);
        $this->by_page_name('contacts');
    }



    private function by_page_name($page_name){
        $PageModel=new \Models\PageModel();

        $page=$PageModel->itemGet($page_name);
        $context['image_host']='https://api.tezkel.com/image/get.php/';
        $context['title']=$page->page_title;
        $context['description']="Служба экспресс доставки из ресторанов, магазинов и маркетов. Бонусы при регистрации.";

        $context['page']=$page;
        view('page',$context);
    }
}