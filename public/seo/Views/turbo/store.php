<header>
    <h1><?=$title?></h1>
</header>
<div class="t-container t-pa-sm">
    <div class="t-card t-pa-sm" data-block="card">
        <figure class="t-figure-md  t-rounded-border">
            <img src="<?=$image_host?><?=$store->image_hash?>.750.750.webp"/>
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
                    <img src="<?=$image_host?><?=$category->image_hash?>.750.750.webp"/>
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