        <div>
            <div class="image" style="text-align: center"><img src="<?=$image_host?>/<?=$product->image_hash?>.350.350.webp" alt="<?=$product->product_name?>"/></div>
        </div>
    <div class="product-item">
        <div class="product-right">
            <a href="/catalog/store-<?=$product->store_id ?>">
                <div class="store-name"><?=$product->store_name?></div>
            </a>
            <div class="name">
                <h1>Купить <?=$product->product_name?> из <?=$product->store_name?></h1>
            </div>
            <div class="barcode">Штрихкод: <?=$product->product_barcode?></div>
            <div class="description"><?=$product->product_description?></div>
        </div>
    </div>
    <style>
        
    .product-item{
        min-height: 60%;
        width: 100%;
        margin: 20% auto;
        background-color: white;
        border-radius: 10px;
        overflow: hidden;
        font-size: 14px;
        display: flex;
        align-items: center;
    }
    .product-item .product-left{
        
    }
    .product-item .product-left .image{
        overflow: hidden;
    }
    .product-item .product-left .image img{
        min-height: 150px;
        width: auto;
    }
    .product-item .product-right{
        padding: 0.5em;
    }
    .product-item .product-right .store-name{
        display: inline-block;
        padding: 7px 10px;
        background-color: #eefcf4;
        border-radius: 22px;
        color: rgb(40, 186, 98);
        min-height: 1em;
    }
    .product-item .product-right .name a{
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
    .product-item .product-right .description{
        color: gray;
        min-height: 2.4em;
        height: 2.4em;
        font-size: 1em;
        overflow: hidden;
        line-height: 1.2em;
        margin: 5px 0;
        text-overflow: ellipsis;
    }
    .product-item .product-right .address{
        font-size: 12px;
    }
    
    </style>