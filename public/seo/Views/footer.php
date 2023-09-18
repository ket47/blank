<footer class="desktop-footer md footer-md footer-collapse-fade" role="contentinfo">
        <!---->
        <div class="desktop-footer-container">
            <div class="t-list-horizontal t-list-collapse t-align-center t-justify-between">
                <a href="/" class="t-align-self-center">
                    <div>
                        <figure>
                            <img class="t-rounded-border" src="/img/logo_full_transparent.png" width="150"/>
                            <figcaption>Быстро и удобно</figcaption>
                        </figure>
                    </div>
                </a>
                <ul class="t-list-horizontal t-list-collapse t-pa-sm t-ma-none">
                    <li>
                        <a href="/page/contacts" class="">Контакты</a>
                    </li>
                    <li>
                        <a href="/page/rules-customer" class="">Правила пользования</a>
                    </li>
                    <li>
                        <a href="/page/privacy_policy" class="">Политика конфиденциальности</a>
                    </li>
                </ul>
            </div>
            <div class="desktop-footer-bottom">
                <div style="padding-top: 15px;">
                    <label class="sc-label-md-h sc-label-md-s md">Все права защищены. 2021-<?=date('Y')?> iSellSoft © </label>
                </div>
                <div>
                    <a href="https://uniteller.ru" target="_new">
                        <img src="/img/uniteller.png" class="md" style="width: 200px; height: auto;"></img>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</body>

</html>
<style>
    .toolbar{
        position: absolute;
        width: 100%;
    }
    .toolbar .main-logo{
        width: 180px;
        fill: white;
        margin: 1em auto;
    }



    .header-image-container {
        padding: 2em 4em;
        display: grid;
        min-height: 350px;
        align-items: center;
        text-align: center;
        background-image: url("/img/about_us/tezkel_header.jpg");
        background-size: cover;
        background-position: center center;
    }

    .header-image-container h2,
    .header-image-container h4 {
        color: white;
    }

    

    /*=========================*/
    /*==========FOOTER=========*/
    /*=========================*/
    footer.desktop-footer {
        color: white;
        background: #292929;
        padding: 1em 2em;
        min-height: 15vh;
    }

    footer.desktop-footer .desktop-footer-container {
        max-width: calc(var(--breakpoints-width)/1);
        margin: 0 auto;
    }

    footer a {
        color: white;
        text-decoration: none;
    }

    footer.desktop-footer .desktop-footer-bottom {
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 1em 0;
        border-top: 1px solid gray;
        font-size: 12px;
    }


    /*=========================*/
    /*==========FOOTER=========*/
    /*=========================*/


    @media screen and (max-width: 740px) {
        .about-us-page .main-block {
            padding: 1em;
        }

        .about-us-page .main-block .toolbar_svg_logo {
            left: 0;
            width: 100%;
        }

        .intro-container .main-block-content,
        .order-stages-grid,
        .benefits-list {
            grid-template-columns: 1fr;
        }
    }
</style>