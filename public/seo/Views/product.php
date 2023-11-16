<div class="t-container t-pa-sm">
    <div class="t-card t-card-compact t-pa-sm" data-block="card">
        <figure  class="t-figure-md t-rounded-border">
            <img src="<?=$image_host?>/<?=$product->image_hash?>.600.600.webp"/>
            <figcaption><?=$product->product_name?></figcaption>
        </figure>
        <h3>
            <a href="/catalog/store-<?=$product->store_id ?>">
                <?=$product->store_name?>
            </a>
        </h3>
        <h1><?=$product->product_name?> из <?=$product->store_name?></h1>
        <?php if(!empty($product->product_barcode)) :  ?>
        <code>Штрихкод: <?=$product->product_barcode ?></code>
        <?php endif ?>
        <p><i data-color="gray"><?=$product->product_description?></i></p>
        <button
            data-background-color="#0099FF"
            data-color="white"
            data-turbo="false"
            data-primary="true"
            formaction="/"
            onmouseover="document.cookie = 'skipto=site;'; window.location.reload();"
            >
            Купить
        </button>
    </div>
</div>