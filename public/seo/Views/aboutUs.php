
<div class="header-image-container main-block">
    <div class="t-container t-grid t-grid-one-column t-align-center">
        <h2>Супер быстрая доставка</h2>
        <h4>Роскошь, ставшая реальностью</h4>
        <a class="button" href="/catalog">Хочу сделать заказ!</a>
    </div>
</div>

<div class="t-container">
    <div data-block="card" class="t-grid t-grid-two-cols t-align-center">
        <div class="t-pa-md t-text-right">
            <h2>Сервис курьерской доставки</h2>
            <p>Супер быстрая доставка товаров на дом теперь не роскошь, а вполне доступная для каждого услуга.
                Экономия времени, разнообразный ассортимент и возможность получить любой товар не выходя за пределы любимого домашнего очага, - все это возможно с Tezkel.
                <br><br>
                Tezkel – это служба экспресс-доставки товаров. Мы сотрудничаем со многими заведениями общественного питания и магазинами,
                поэтому всего через полчаса после оформления заказа вы получите его в руки.
            </p>
        </div>
        <div class="t-pa-md">
            <img src="/img/about_us/tezkel_anasayfa1.png" />
        </div>
    </div>
</div>

<div class="t-container t-text-center">
    <h2>Как всё работает?</h2>
    <div class="t-grid t-grid-two-cols">
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon1.png" width="200"/>
            <h4>1. Создайте заказ</h4>
            <p>Выберите нужные товары и создайте заказ</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon2.png" width="200" />
            <h4>2. Подтвердите заказ</h4>
            <p>Выберите карту и выполните оплату</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon3.png" width="200" />
            <h4>3. Получите уведомление</h4>
            <p>Вам придут уведомления о доставке</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon4.png" width="200" />
            <h4>4. Получите заказ</h4>
            <p>Получите заказанные товары</p>
        </div>
    </div>
</div>

<?php if(!empty($topCategoryList)): ?>
<div id="categories" class="t-container ">
    <h2>Категории: </h2>
    <div  class="t-grid t-grid-compact t-grid-six-cols ">
        <?php foreach($topCategoryList as $category): ?>
        <div class="t-card t-pa-sm t-text-center t-card-rounded"  data-block="card">
            <a href="/catalog/category-<?=$category->group_id ?>">
                <figure class="t-rounded-border t-figure-sm">
                    <img src="<?=$image_host?>/<?=$category->image_hash?>.350.350.webp"/>
                    <figcaption><?=$category->group_name?></figcaption>
                </figure>
            </a>
            <h5 class="t-my-sm">
                <a href="/catalog/category-<?=$category->group_id ?>">
                    <b><?=$category->group_name?></b>
                </a>
            </h5>
        </div>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<!--TOP STORE TILE 12PCS-->
<div id="stores" class="t-container ">
    <h2>Лучшие продавцы</h2>
    <div class=" t-grid t-grid-four-cols">
    <?php foreach($topStoreList as $store): ?>
        <div class="t-card t-pa-sm">
            <figure class="t-rounded-border">
                <img src="<?=$image_host?>/<?=$store->image_hash?>.700.700.jpg"/>
                <figcaption><?=$store->store_name?></figcaption>
            </figure>
            <h4>
                <a href="/catalog/store-<?=$store->store_id ?>">
                    <?=$store->store_name?>
                </a>
            </h4>
            <p><i class="t-text-cut"><?=$store->store_description?></i></p>
        </div>
    <?php endforeach; ?>
    </div>
</div>
<!--TOP PRODUCT TILE 24PCS-->
<div id="products" class="t-container ">
    <h2>Лучшие товары</h2>
    <div  class="t-grid t-grid-five-cols">
    <?php foreach($topProductList as $product): ?>
        <div class="t-card t-pa-sm">
            <figure class="t-rounded-border">
                <img src="<?=$image_host?>/<?=$product->image_hash?>.500.500.jpg"/>
                <figcaption><?=$product->product_name?></figcaption>
            </figure>
            <h6  class="t-my-sm">
                <a href="/catalog/store-<?=$product->store_id ?>">
                    <dt><?=$product->store_name?></dt>
                </a>
            </h6>
            <h5 class="t-my-sm">
                <a href="/catalog/product-<?=$product->product_id ?>">
                <b>Купить <?=$product->product_name?></b>
                </a>
            </h5>
            <h4 class="t-my-sm">
                <b><?=$product->product_final_price?> ₽</b>
            </h4>
            <sub><?=$product->product_barcode?></sub>
            <p><i class="t-text-cut"><?=$product->product_description?></i></p>
        </div>
    <?php endforeach; ?>
    </div>
</div>


<div class="t-container t-text-center">
    <h2>Tezkel – ультрасовременный сервис экпресс-доставки</h2>
    <div class="t-grid t-grid-two-cols">
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon_speed.png" width="200" />
            <h4>Оперативность</h4>
            <p>После подтверждения Ваш заказ отправляется в централизованную сеть зарегистрированных курьеров, и ближайший свободный курьер берет его в работу.</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon_trust.png" width="200"/>
            <h4>Ответственность</h4>
            <p>В процессе обработки заказа каждый актёр несёт полную ответственность за добросовестное и своевременное собственных функций по выполнению заказа.</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon_accuracy.png" width="200" />
            <h4>Точность</h4>
            <p>Курьер приезжает в обусловленный интервал времени. Вы можете убедиться в этом, отследив перемещение курьера вплоть до указанного Вами адреса.</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon_prestige.png" width="200" />
            <h4>Квалифицированность</h4>
            <p>У нас работают только профессиональные курьеры. Перед тем как получить допуск к системе, каждый из них проходит проверку в несколько ступеней.</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon_tarif.png" width="200" />
            <h4>Разумные тарифы</h4>
            <p>Мы предлагаем крайне выгодные цены на экпресс-доставку всего 90 руб. К тому же, мы регулярно предлагаем различные купоны и акции, которые делают стоимость услуг еще приятнее.</p>
        </div>
        <div>
            <img src="/img/about_us/tezkel_anasayfa_icon_flex.png" width="200" />
            <h4>Гибкость</h4>
            <p>Мы осуществляем доставку высокой сложности, а также предоставляем услугу размещения и реализации товаров на нашей площадке.</p>
        </div>
    </div>
</div>
