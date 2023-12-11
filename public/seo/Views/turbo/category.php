<header>
    <h1><?=$title?></h1>
</header>
<div class="t-container t-pa-sm">
    <div  class="t-grid t-grid-two-cols">
        <?php if(!empty($category->image_hash)): ?>
        <div class="t-card t-pa-sm" data-block="card">
            <figure class="t-figure-full  t-rounded-border">
                <img src="<?=$image_host?><?=$category->image_hash?>.750.750.webp"/>
                <figcaption><?=$title?></figcaption>
            </figure>
        </div>
        <?php endif; ?>
        <div>
            <h1>Товары из раздела <?=$title?></h1>
            <?php if(!empty($category->subcategories)): ?>
            <h3>Подразделы: </h3>
            <div  class="t-grid t-grid-five-cols ">
                <?php foreach($category->subcategories as $subcategory): ?>
                <div class="t-card t-pa-sm"  data-block="card">
                    <h5 class="t-my-sm">
                        <a href="/catalog/category-<?=$subcategory->group_id ?>">
                            <b><?=$subcategory->group_name?></b>
                        </a>
                    </h5>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <?php if(!empty($productList)): ?>
    <h2>Каталог товаров</h2>
    <div  class="t-grid t-grid-five-cols ">
        <?php foreach($productList as $product): ?>
        <div class="t-card t-pa-sm"  data-block="card">
            <figure class="t-rounded-border">
                <img src="<?=$image_host?><?=$product->image_hash?>.500.500.webp"/>
                <figcaption><?=$product->product_name?></figcaption>
            </figure>
            <h6  class="t-my-sm">
                <a href="/catalog/store-<?=$product->store_id ?>">
                    <dt><?=$product->store_name?></dt>
                </a>
            </h6>
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
    <?php else: ?>
    <h3>В данном разделе нет товаров</h3>
    <?php endif; ?>
</div>
        
