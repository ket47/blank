    <div class="t-container t-pa-sm">
        <div class="t-card t-pa-sm" data-block="card">
            <figure class="t-figure-md  t-rounded-border">
                <img src="<?=$image_host?>/<?=$store->image_hash?>.750.750.webp"/>
                <figcaption><?=$store->store_name?></figcaption>
            </figure>
            <h1><?=$store->store_name?></h1>
            <p><i><?=$store->store_description?></i></p>
            <hr>
            <p><small>Адрес: <?=$store->location_address?></small></p>
            <p><small>Телефон: <?=$store->store_phone?></small></p>
            <p><small>Предприятие: <?=$store->store_company_name?></small></p>
            <p><small>ИНН: <?=$store->store_tax_num?></small></p>
        </div>

        <?php if(!empty($store->categories)): ?>
        <h2>Подразделы: </h2>
        <div  class="t-grid t-grid-six-cols ">
            <?php foreach($store->categories as $category): ?>
            <div class="t-card t-pa-sm t-text-center t-card-rounded"  data-block="card">
                <a href="/catalog/category-<?=$category->group_id ?>&store_id=<?=$store->store_id ?>">
                    <figure class="t-rounded-border  t-figure-sm">
                        <img src="<?=$image_host?>/<?=$category->image_hash?>.750.750.webp"/>
                        <figcaption><?=$category->group_name?></figcaption>
                    </figure>
                </a>
                <h5 class="t-my-sm">
                    <a href="/catalog/category-<?=$category->group_id ?>&store_id=<?=$store->store_id ?>">
                        <b><?=$category->group_name?></b>
                    </a>
                </h5>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <h2>Каталог товаров</h2>
        <div  class="t-grid t-grid-five-cols ">
            <?php foreach($productList as $product): ?>
            <div class="t-card t-pa-sm"  data-block="card">
                <figure class="t-rounded-border">
                    <img src="<?=$image_host?>/<?=$product->image_hash?>.500.500.webp"/>
                    <figcaption><?=$product->product_name?></figcaption>
                </figure>
                <h5 class="t-my-sm">
                    <a href="/catalog/product-<?=$product->product_id ?>">
                        <b><?=$product->product_name?></b>
                    </a>
                </h5>
                <h4 class="t-my-sm">
                    <b><?=$product->product_final_price?> ₽</b>
                </h4>
                <code><?=$product->product_barcode?></code>
                <sub><i class="t-text-cut"><?=$product->product_description?></i></sub>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <style>
        

    .store-item{
        min-height: 60%;
        width: 60%;
        margin: 20% auto;
        background-color: white;
        border-radius: 10px;
        overflow: hidden;
        font-size: 14px;
        display: grid;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .store-item .store-left{
        
    }
    .store-item .store-left .image{
        overflow: hidden;
    }
    .store-item .store-left .image img{
        min-height: 150px;
        width: auto;
        border-radius: 10px;
    }
    .store-item .store-right{
        padding: 0.5em;
    }
    .store-item .store-right .store-name{
        display: inline-block;
        padding: 7px 10px;
        background-color: #eefcf4;
        border-radius: 22px;
        color: rgb(40, 186, 98);
        min-height: 1em;
    }
    .store-item .store-right .name a{
        margin: 5px 0;
        min-height: 2.4em;
        height: 2.4em;
        font-size: 1em;
        overflow: hidden;
        line-height: 1.2em;
        margin: 5px 0;
        text-overflow: ellipsis;
        font-weight: 900;
        text-decoration: none;
        color: #009dcd;
    }
    .store-item .store-right .description{
        color: gray;
        min-height: 2.4em;
        height: 2.4em;
        font-size: 1em;
        overflow: hidden;
        line-height: 1.2em;
        margin: 5px 0;
        text-overflow: ellipsis;
    }
    .store-item .store-right .address{
        font-size: 12px;
    }
    </style>