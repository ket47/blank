    <div class="store-item">
        <div class="store-left">
            <div class="image"><img src="<?=$image_host?>/<?=$store->image_hash?>.450.450.jpg" alt="<?=$store->store_name?>"/></div>
        </div>
        <div class="store-right">
            <div class="phone"><?=$store->store_phone?></div>
            <h4 class="name"> <a href="/storeItem/<?=$store->store_id ?>"><?=$store->store_name?></a></h4>
            
            <div class="description"><?=$store->store_description?></div>
            <hr>
            <div class="address"><?=$store->location_address?></div>
        </div>

    </div>
    <div class="product-top-tile main-block">
            <h2>Топ товаров</h2>
            <div class="product-list">
                <?php foreach($topProductList as $product): ?>
                    <div class="product-item">
                        <div class="product-right">
                            <div class="image"><img src="<?=$image_host?>/<?=$product->image_hash?>.150.150.jpg" alt="<?=$product->product_name?>"/></div>
                        </div>
                        <div class="product-right">
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