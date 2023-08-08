<?php
namespace Models;
require_once 'Db.php';
class CatalogModel{

    private $db;
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
                location_address,
                image_hash,
                store_list.updated_at
            FROM
                store_list
                    LEFT JOIN
                location_list ON location_holder='store' AND location_holder_id=store_id AND location_list.deleted_at IS NULL
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
                AND location_list.deleted_at IS NULL
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
    
    public function categoryListGet( int $store_id ){
        $sql="
        SELECT
            group_id,
            group_parent_id,
            group_name
        FROM
            product_group_list
                JOIN
            product_group_member_list USING(group_id)
                JOIN
            product_list ON member_id=product_id
        WHERE
            store_id='$store_id'
        GROUP BY group_id
        ";
        return $this->db->query($sql)->rows();        
    }
    public function categoryListAllGet(){
        $sql="
        SELECT
            group_id,
            group_parent_id,
            group_name
        FROM
            product_group_list
        ";
        return $this->db->query($sql)->rows();        
    }


    














    public function productListGet($filter){
        $limit=$filter['limit']?$this->db->esc($filter['limit']):12;
        $offset=($filter['page']??0)*$limit;

        $store_case=isset($filter['store_id'])?"AND pl.store_id='{$filter['store_id']}'":'';

        $sql="
            SELECT
                pl.product_id,
                CONCAT(COALESCE(pl_parent.product_name,pl.product_name),' ',COALESCE(pl.product_option,'')) product_name,
                COALESCE(pl_parent.product_description,pl.product_description) product_description,
                pl.product_barcode,
                pl.store_id,
                store_name,
                pl.product_price,
                ROUND(IF(IFNULL(`pl`.`product_promo_price`,0)>0 AND `pl`.`product_price`>`pl`.`product_promo_price` AND `pl`.`product_promo_start` < NOW() AND `pl`.`product_promo_finish` > NOW(),`pl`.`product_promo_price`,`pl`.`product_price`)) product_final_price,
                pl.product_promo_start,
                pl.product_promo_finish,
                image_hash,
                pl.updated_at,
                group_id,
                group_name
            FROM
                product_list pl
                    LEFT JOIN
                product_list pl_parent ON pl.product_parent_id=pl_parent.product_id
                    LEFT JOIN
                store_list ON store_list.store_id=pl.store_id
                    LEFT JOIN
                image_list ON image_holder='product' AND image_holder_id=COALESCE(pl_parent.product_id,pl.product_id) AND image_list.is_main=1
                    LEFT JOIN
                product_group_member_list ON pl.product_id=member_id
                    LEFT JOIN
                product_group_list USING(group_id)
            WHERE
                pl.is_disabled=0
                AND pl.deleted_at IS NULL
                AND store_list.is_disabled=0
                AND store_list.deleted_at IS NULL
                $store_case
            ORDER BY pl.updated_at DESC
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
        $sql="
            SELECT
                pl.product_id,
                CONCAT(COALESCE(pl_parent.product_name,pl.product_name),' ',COALESCE(pl.product_option,'')) product_name,
                COALESCE(pl_parent.product_description,pl.product_description) product_description,
                pl.product_barcode,
                pl.store_id,
                store_name,
                pl.product_price,
                ROUND(IF(IFNULL(`pl`.`product_promo_price`,0)>0 AND `pl`.`product_price`>`pl`.`product_promo_price` AND `pl`.`product_promo_start` < NOW() AND `pl`.`product_promo_finish` > NOW(),`pl`.`product_promo_price`,`pl`.`product_price`)) product_final_price,
                image_hash,
                pl.updated_at
            FROM
                product_list pl
                    LEFT JOIN
                product_list pl_parent ON pl.product_parent_id=pl_parent.product_id
                    LEFT JOIN
                store_list ON store_list.store_id=pl.store_id
                    LEFT JOIN
                image_list ON image_holder='product' AND image_holder_id=COALESCE(pl_parent.product_id,pl.product_id) AND image_list.is_main=1
            WHERE
                pl.is_disabled=0
                AND pl.deleted_at IS NULL
                AND pl.product_id=$product_id
        ";
        return $this->db->query($sql)->row();        
    }

}