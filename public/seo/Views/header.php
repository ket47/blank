<!DOCTYPE html>
<html>

<head>
    <title><?=$title?></title>
    <meta name="description" content="<?=$description?>">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta property="og:title" content="<?=$title?>" />
    <meta property="og:description" content="<?=$description?>" />
<?php if(isset($image_hash)): ?>
    <meta property="og:image" content="<?=$image_host?><?=$image_hash?>.600.600.jpg" />
<?php else: ?>
    <meta property="og:image" content="'/img/icons/android-chrome-512x512.png'" />
<?php endif;?>
    
    <link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png">
    <link rel="icon" type="image/svg" href="/img/icons/favicon.svg">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png">
    <link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#009dcd">
    <link rel="stylesheet" href="/assets/css/style.css"/>
    <link href="<?=(empty($_SERVER['HTTPS']) ? 'http' : 'https')."://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";  ?>" rel="canonical" />
    <meta name="theme-color" content="#009dcd">
    <meta name="apple-mobile-web-app-capable" content="no">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="tezkel">
    <meta name="msapplicatTileImage" content="/img/icons/msapplicaticon-144x144.png">
    <meta name="msapplicatTileColor" content="#009dcd">
</head>

<body>
    <header>
        <div class="t-list-horizontal t-align-center t-justify-between t-header-content">
            <a class="t-text-large t-hidden t-visible-sm" href="javascript:history.back()">←</a>
            <div class="main-logo">
                <a href="/">
                    <svg version="1.1" id="Слой_1" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 398.6 111" style="enable-background:new 0 0 398.6 111;" xml:space="preserve" class="s-icon">
                        <style type="text/css">
                            .st0{fill-rule:evenodd;clip-rule:evenodd;}
                        </style>
                        <g id="Слой_x0020_1">
                            <path d="M111.9,55.6c0,28.2-22.1,51.3-50.3,53.7c-0.1,0-0.2,0-0.3,0c-9.1-1.5-10.1-9.7-10.1-9.7s1.4,0.7,3,1
                                c-1.7-3.3-2.6-7.1-2.5-10.8l2.9,1.8c-0.8-6.9,6-13.7,12.8-12.2c5.5,1.4,12,5.4,15.2,5.7c3.1,0.3,6.7-3.1,9.8-4.8
                                c3.1-1.7,10.5-4.5,10.5-6.9S79.1,55.8,79.1,55.8c0.2-8.9-4.5-9.7-9.7-13.5L57.3,25c-1.5-1.6-2.2,2.9-2.6,3.5
                                c-16.3-12.6-9.9-10.9-14,8.7c-2.7-0.8-5.6-1-8.4-0.9c0.7,0.8,1.3,1.7,1.4,2.7c-6.3-1.2-12.9-1.5-19.3-0.7c1.6,1.1,2.9,2.6,3.6,4.4
                                l-5.2-0.7c1.7,1.2,3.4,2.8,3.9,4.9c-3.9-0.6-7-0.4-11,0.2c1.7,0.9,1.8,1.8,3.1,3.3c-2.5,1.8-4.9,3.2-7,4.5
                                C2.2,25.4,26.6,1.7,56.8,1.7C87.2,1.7,111.9,25.8,111.9,55.6z"></path>
                            <path d="M70.5,54.5c1.6,0.8,3.7,0.2,3.7,0.2c-1.1-2.6-4.8-4.1-5.9-3.8C68.3,50.9,68.9,53.7,70.5,54.5z"></path>
                            <path class="st0" d="M149.2,36.4V24.8h-4.1l-16.7,19.6v3h7.2V73c0,10.7,6.1,17.3,18.4,17.3c3.7,0,8.1-0.8,10.2-2.5v-11
                                c-1.9,1-4.3,1.5-6.1,1.5c-5.9,0-8.8-2.3-8.8-8.2V47.4h14.5v-11L149.2,36.4L149.2,36.4C149.2,36.4,149.2,36.4,149.2,36.4z
                                    M216.3,87.1v-12c-3.5,2.5-9.5,4.3-15.5,4.3c-11,0-17.1-4.1-18.8-11.7h36.2c0.3-1.7,0.4-4.3,0.4-6.3c0-14.3-8.8-26.6-23.8-26.6
                                c-17.3,0-27,12.9-27,27.9c0,16.3,10.5,28.2,31.5,28.2C205,91.1,212.5,89.7,216.3,87.1L216.3,87.1L216.3,87.1z M205.4,58.3h-23.5
                                c1.2-7.3,5.6-11.9,12.5-11.9C200.5,46.4,204.5,51.1,205.4,58.3L205.4,58.3z M246.7,48l-23.6,40.3v1.4h42.7l3.6-11.7h-25.2
                                l23.7-40.3v-1.4h-41.2L223.1,48H246.7L246.7,48L246.7,48z M275,89.7h13.7V64.2L308,89.7h17.1l-21.9-28.2l21.7-25.1h-16.4
                                l-19.8,23.1V13.6H275V89.7L275,89.7L275,89.7z M373.2,87.1v-12c-3.5,2.5-9.5,4.3-15.5,4.3c-11,0-17.1-4.1-18.8-11.7h36.2
                                c0.3-1.7,0.4-4.3,0.4-6.3c0-14.3-8.8-26.6-23.8-26.6c-17.3,0-27,12.9-27,27.9c0,16.3,10.5,28.2,31.5,28.2
                                C362,91.1,369.4,89.7,373.2,87.1L373.2,87.1L373.2,87.1L373.2,87.1z M362.3,58.3h-23.5c1.2-7.3,5.6-11.9,12.5-11.9
                                C357.4,46.4,361.5,51.1,362.3,58.3L362.3,58.3z M384.7,89.7h13.7V13.6h-13.7V89.7z"></path>
                        </g>
                    </svg>
                </a>
            </div>
            <ul class="t-list-horizontal t-hidden-sm">
                <li>
                    <a href="/">
                        <b>Главная</b>
                    </a>
                </li>
                <li>
                    <a href="/#categories">
                        <b>Категории</b>
                    </a>
                </li>
                <li>
                    <a href="/#stores">
                        <b>Магазины и рестораны</b>
                    </a>
                </li>
                <li>
                    <a href="./#products">
                        <b>Товары</b>
                    </a>
                </li>

                
                <li>
                    <a href="./page/contacts">
                        <b>Контакты</b>
                    </a>
                </li>
            </ul>
        </div>
        <h1><?=$title?></h1>
    </header>