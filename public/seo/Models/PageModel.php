<?php
namespace Models;
require_once 'Db.php';
class PageModel{

    function __construct(){
        $this->db=new Db();
    }


    public function itemGet($page_name){
        $sql="
            SELECT
                *
            FROM
                page_list
            WHERE
                page_name='".addslashes($page_name)."'
        ";
        return $this->db->query($sql)->row();
    }

    public function pageListGet(){
        $pages=[
            'about',
            'privacy_policy',
            'contacts',
            'rules-supplier',
            'rules-courier',
            'rules-customer'
        ];
        $where = "page_name='".implode("' OR page_name='",$pages)."'";
        $sql="
            SELECT
                *
            FROM
                page_list
            WHERE
                $where
        ";
        return $this->db->query($sql)->rows();
    }


}