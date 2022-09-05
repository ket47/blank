
    <footer class="desktop-footer md footer-md footer-collapse-fade" role="contentinfo">
        <!---->
        <div class="desktop-footer-container">
            <div class="desktop-footer-top">
                <a href="" class="">
                    <div>
                        <img src="/img/logo_full_transparent.png" class="md" style="width: 150px; height: auto;"></img>
                         <div><label class="md title-default">Быстро и удобно</label></div>
                    </div>
                </a>
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
    @font-face {   
        font-family: 'Comfortaa';
        src: url('/seo/Views/fonts/Comfortaa-VariableFont_wght.ttf');
        font-display: swap;
    }
    body{
        margin: 0;
        font-family: 'Comfortaa';
        text-rendering: optimizeLegibility;
        word-wrap: break-word;
        -webkit-text-size-adjust: none;
        -moz-text-size-adjust: none;
    }
    .toolbar{
        position: absolute;
        width: 100%;
    }
    .toolbar .main-logo{
        width: 180px;
        fill: white;
        margin: 1em auto;
    }
    h1, h2, h3, h4, h5, h6 {
        margin-top: 16px;
        font-weight: 500;
        line-height: 1.2;
    }
    h2 {
        margin-top: 18px;
        font-size: 24px;
    }
    h4 {
        font-size: 20px;
    }
    a.button{
        background-color: #009dcd;
        color: white;
        text-decoration: none;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
        
    }
    a.button:hover,
    a.button:focus,
    a.button:active{
        background-color: #14a5d1;
    }
    hr{
        border: 1px solid lightgray;
        border-bottom: none;
    }
    .about-us-page h2,
    .about-us-page h3,
    .about-us-page h4 {
        font-weight: bold;
        color: #009dcd;
    }

    .about-us-page p {
        font-size: 14px;
        line-height: 25px;
    }


    .about-us-page .main-block {
        padding: 2em 0;
    }

    .about-us-page .main-block .main-block-content {
        max-width: 1200px;
        margin: 0 auto;
    }

    .about-us-page toolbar {
        position: absolute;
        --toolbar-background: transparent;
    }

    .about-us-page back-button {
        display: initial;
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

    .intro-container {
        /*background-image: url("/public/img/about_us/tezkel_anasayfa1.jpg");
  background-posity: bottom;
  background-positx: right;
  min-height: 600px;*/
        display: grid;
        background-color: #f2f2f2;
    }

    .intro-container .main-block-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        padding: 1em;
    }

    .intro-container .main-block-content .image-col {}

    .intro-container .main-block-content img {
        margin-bottom: -5em;
    }

    .order-stages-container {
        padding-top: 4em !important;
        text-align: center;
    }

    .order-stages-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: baseline;
        padding: 1em;
        text-align: center;
        justify-content: center;
    }

    .order-stages-grid .order-stage-item {
        padding: 2em;
    }

    .order-stages-grid .order-stage-item p {
        color: gray;
    }

    .order-stages-grid .order-stage-item img {
        width: 120px;
    }

    .sign-up-suggest {
        background-color: #f2f2f2;
        text-align: center;
        min-height: 250px;
        display: grid;
        align-items: center;
    }

    .sign-up-suggest .main-block-content {}

    .benefits-container {
        text-align: center;
    }

    .benefits-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: baseline;
        padding: 1em;
    }

    .benefits-list .benefit-item {
        padding: 2em;
    }

    .benefits-list .benefit-item p {
        color: gray;
        line-height: 20px;
        text-align: left;
    }

    .benefits-list .benefit-item img {
        width: 120px;
    }
    
    

    .partner-image-container {
        padding: 2em 4em; 
        display: grid;
        grid-template-columns: 50% 50%;
        min-height: 350px;
        align-items: center;
        background-image: url("/img/tezkel_partner.jpg");
        background-size: cover;
        background-position: center center;
    }
    
    
    .partner-image-container .left-block{
        text-align: left;
    }
    
    .partner-image-container .right-block{
        
        text-align: right;
    }

    .partner-image-container h2,
    .partner-image-container h4 {
        color: white;
    }
    
    /*=========================*/
    /*======TOP SELLERS========*/
    /*=========================*/
    .store-top-tile{
        
    }
    .store-top-tile > h2{
        text-align: center;
    }
    .store-top-tile .store-list{
        display:grid;
        gap:  0.5em;
        grid-template-columns: repeat(auto-fit,250px);
        justify-content: center;
        
    }
    .store-top-tile .store-list .store-item{
        background-color: white;
        border-radius: 10px;
        overflow: hidden;
        font-size: 14px;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, 
                    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, 
                    rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        
    }
    .store-top-tile .store-list .store-item .store-left{
        
    }
    .store-top-tile .store-list .store-item .store-left .image{
        max-height: 150px;
        overflow: hidden;
    }
    .store-top-tile .store-list .store-item .store-left .image img{
        min-height: 150px;
        width: auto;
    }
    .store-top-tile .store-list .store-item .store-right{
        padding: 0.5em;
    }
    .store-top-tile .store-list .store-item .store-right .barcode{
        display: inline-block;
        padding: 7px 10px;
        background-color: #eefcf4;
        border-radius: 22px;
        color: rgb(40, 186, 98);
        min-height: 1em;
    }
    .store-top-tile .store-list .store-item .store-right .title{
        margin: 5px 0;
    }
    .store-top-tile .store-list .store-item .store-right .description{
        color: gray;
        min-height: 2.4em;
        height: 2.4em;
        font-size: 1em;
        overflow: hidden;
        line-height: 1.2em;
        margin: 5px 0;
        text-overflow: ellipsis;
    }
    .store-top-tile .store-list .store-item .store-right .address{
        font-size: 12px;
    }
    
    /*=========================*/
    /*=====/TOP SELLERS========*/
    /*=========================*/
    
    /*=========================*/
    /*======TOP PRODUCTS=======*/
    /*=========================*/
    .product-top-tile{
        background-color: #f2f2f2;
    }
    .product-top-tile > h2{
        text-align: center;
    }
    .product-top-tile .product-list{
        display:grid;
        gap: 0.5em;
        grid-template-columns: repeat(auto-fit,150px);
        justify-content: center;
    }
    .product-top-tile .product-list .product-item{
        background-color: white;
        border-radius: 10px;
        overflow: hidden;
        font-size: 14px;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, 
                    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, 
                    rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        
    }
    .product-top-tile .product-list .product-item .product-left{
        
    }
    .product-top-tile .product-list .product-item .product-left .image{
        max-height: 150px;
        overflow: hidden;
    }
    .product-top-tile .product-list .product-item .product-left .image img{
        min-height: 150px;
        width: auto;
    }
    .product-top-tile .product-list .product-item .product-right{
        padding: 0.5em;
    }
    .product-top-tile .product-list .product-item .product-right .phone{
        display: inline-block;
        padding: 7px 10px;
        background-color: #eefcf4;
        border-radius: 22px;
        color: rgb(40, 186, 98);
        min-height: 1em;
    }
    .product-top-tile .product-list .product-item .product-right .name{
        margin: 5px 0;
        min-height: 2.4em;
        height: 2.4em;
        font-size: 1em;
        overflow: hidden;
        line-height: 1.2em;
        margin: 5px 0;
        text-overflow: ellipsis;
    }
    .product-top-tile .product-list .product-item .product-right .description{
        color: gray;
        min-height: 2.4em;
        height: 2.4em;
        font-size: 1em;
        overflow: hidden;
        line-height: 1.2em;
        margin: 5px 0;
        text-overflow: ellipsis;
    }
    .product-top-tile .product-list .product-item .product-right .address{
        font-size: 12px;
    }
    
    /*=========================*/
    /*=====/TOP PRODUCTS=======*/
    /*=========================*/


    .pagination{
        display: flex;
        text-align: center;
        margin: 0 auto;
        width: fit-content;
        justify-content: center;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        background-color: white;
        margin: 1em auto;
        border-radius: 5px;
    }
    .pagination a{
        padding: 5px 10px;
        border-right: 1px solid lightgray;
        text-decoration: none;
        color: inherit;
    }
    .pagination a.active{
        background-color: #e8e8e8;
        font-weight: bold;
    }
    .pagination a:last-child{
        border-right: none;
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
        margin-left: 20px;
    }

    footer title {
        padding: 0px;
        font-size: 15px;
    }

    footer.desktop-footer .social-media-block {
        justify-content: center;
        display: flex;
    }

    footer.desktop-footer .social-media-block img {
        width: 200px;
    }

    footer.desktop-footer .desktop-footer-top {
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 1em 0;
    }

    footer.desktop-footer .desktop-footer-top img {
        width: inherit;
        display: inline-block;
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

        footer.desktop-footer {
            display: none;
        }
    }


    
    .store-item{
        min-height: 60%;
        width: 90%;
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