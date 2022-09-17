    <div class="store-item">
        <div class="store-left">
            <div class="image"><img src="<?=$image_host?>/<?=$store->image_hash?>.250.250.webp" alt="<?=$store->store_name?>"/></div>
        </div>
        <div class="store-right">
            <h1 class="title"><?=$store->store_name?></h1>
            <div class="description"><?=$store->store_description?></div>
            <hr>
            <div class="address">Адрес: <?=$store->location_address?></div>
            <div class="phone">Телефон: <?=$store->store_phone?></div>
            <div>Предприятие: <?=$store->store_company_name?></div>
            <div>ИНН: <?=$store->store_tax_num?></div>
        </div>
    </div>

    <div>
    <div class="product-top-tile main-block">
        <h2>Топ товаров</h2>
        <div class="product-list">
            <?php foreach($productList as $product): ?>
                <div class="product-item">
                    <div class="product-right">
                        <div class="image"><img src="<?=$image_host?>/<?=$product->image_hash?>.150.150.webp" alt="<?=$product->product_name?>"/></div>
                    </div>
                    <div class="product-right">
                        <a href="/catalog/store-<?=$product->store_id ?>">
                            <div class="store-name"><?=$product->store_name?></div>
                        </a>
                        <div class="name">
                            <a href="/catalog/product-<?=$product->product_id ?>">
                            Купить <?=$product->product_name?>
                            </a>
                        </div>
                        <div class="barcode"><?=$product->product_barcode?></div>
                        <div class="description"><?=$product->product_description?></div>
                    </div>
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