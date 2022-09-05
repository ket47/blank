<?php
namespace Models;
include 'Db.php';
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



}