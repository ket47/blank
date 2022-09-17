<?php
namespace Models;
require_once 'Db.php';
class CatalogModel{

    function __construct(){
        $this->db=new Db();
    }


    public function storeListGet($filter){
        $limit=$filter['limit']?$this->db->esc($filter['limit']):12;
        $offset=($filter['page']??0)*$limit;

        $sql="
            SELECT
                store_id,
                store_name,
                store_description,
                store_phone,
                store_company_name,
                location_address,
                image_hash,
                store_list.updated_at
            FROM
                store_list
                    LEFT JOIN
                location_list ON location_holder='store' AND location_holder_id=store_id
                    LEFT JOIN
                image_list ON image_holder='store' AND image_holder_id=store_id AND image_list.is_main=1
            WHERE
                store_list.is_disabled=0
                AND store_list.deleted_at IS NULL
            ORDER BY store_list.updated_at DESC
            LIMIT $limit OFFSET $offset
        ";
        return $this->db->query($sql)->rows();
    }

    public function storeListPageCountGet(){
        $sql="
            SELECT
                COUNT(*) cnt
            FROM
                store_list
                    LEFT JOIN
                location_list ON location_holder='store' AND location_holder_id=store_id
                    LEFT JOIN
                image_list ON image_holder='store' AND image_holder_id=store_id AND image_list.is_main=1
            WHERE
                store_list.is_disabled=0
                AND store_list.deleted_at IS NULL
        ";
        $count=$this->db->query($sql)->row();

        return ceil($count->cnt/12);
    }
    public function storeItemGet( int $store_id ){
        $sql="
        SELECT
            store_list.*,
            location_address,
            image_hash
        FROM
            store_list
                LEFT JOIN
            location_list ON location_holder='store' AND location_holder_id=store_id
                LEFT JOIN
            image_list ON image_holder='store' AND image_holder_id=store_id AND image_list.is_main=1
        WHERE
            store_list.is_disabled=0
            AND store_list.deleted_at IS NULL
            AND store_id='$store_id'
        ";
        return $this->db->query($sql)->row();        
    }
















    public function productListGet($filter){
        $limit=$filter['limit']?$this->db->esc($filter['limit']):12;
        $offset=($filter['page']??0)*$limit;

        $store_case=isset($filter['store_id'])?"AND store_id='{$filter['store_id']}'":'';

        $sql="
            SELECT
                product_id,
                product_name,
                product_description,
                product_barcode,
                product_weight,
                store_id,
                store_name,
                product_price,
                ROUND(IF(IFNULL(`product_promo_price`,0)>0 AND `product_price`>`product_promo_price` AND `product_promo_start` < NOW() AND `product_promo_finish` > NOW(),`product_promo_price`,`product_price`)) product_final_price,
                image_hash,
                product_list.updated_at
            FROM
                product_list
                    LEFT JOIN
                store_list USING(store_id)
                    LEFT JOIN
                image_list ON image_holder='product' AND image_holder_id=product_id AND image_list.is_main=1
            WHERE
                product_list.is_disabled=0
                AND product_list.deleted_at IS NULL
                $store_case
            ORDER BY product_list.updated_at DESC
            LIMIT $limit OFFSET $offset
        ";
        return $this->db->query($sql)->rows();
    }

    public function productListPageCountGet(){
        $sql="
            SELECT
                COUNT(*) cnt
            FROM
                product_list
                    LEFT JOIN
                store_list USING(store_id)
                    LEFT JOIN
                image_list ON image_holder='product' AND image_holder_id=product_id AND image_list.is_main=1
            WHERE
                product_list.is_disabled=0
                AND product_list.deleted_at IS NULL
        ";
        $count=$this->db->query($sql)->row();

        return ceil($count->cnt/24);
    }

    public function productItemGet( $product_id ){
        $sql="
            SELECT
                product_id,
                product_name,
                product_description,
                product_barcode,
                store_id,
                store_name,
                product_price,
                ROUND(IF(IFNULL(`product_promo_price`,0)>0 AND `product_price`>`product_promo_price` AND `product_promo_start` < NOW() AND `product_promo_finish` > NOW(),`product_promo_price`,`product_price`)) product_final_price,
                image_hash
            FROM
                product_list
                    LEFT JOIN
                store_list USING(store_id)
                    LEFT JOIN
                image_list ON image_holder='product' AND image_holder_id=product_id AND image_list.is_main=1
            WHERE
                product_list.is_disabled=0
                AND product_list.deleted_at IS NULL
                AND product_id=$product_id
        ";
        return $this->db->query($sql)->row();        
    }

}