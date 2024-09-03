<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\models\Lang;
use mihaildev\elfinder\InputFile;
use mihaildev\ckeditor\CKEditor;
use mihaildev\elfinder\ElFinder;
use yii\web\JsExpression;

?>
<?php 
//$contacts = $this->params['headerContent']['contacts'];
//$this->params['breadcrumbs'][] = ['label' => 'Home', 'url' => '/'];
//$this->params['breadcrumbs'][] = $model->url;
//echo'<pre>'; var_dump($this->params['headerContent']['feedback']); die;

?>
<main class="main main-contact">
    <h1 class="contact-us-head-text"><?php echo Yii::t('app', 'Свяжитесь с нами!')?></h1>
    <div class="contact-us-small-text">
        <?php echo Yii::t('app', 'Мы будем рады любому отклику, а так-же всегда открыты для набора новых сотрудников!')?>
    </div>
    <img src="/image-gallery/map.png" alt="" class="map-image">

    <div class="contact-contacts-container">
        <div class="contacts-social-media-container">
            <div class="social-media-text">
                Наши соцсети
            </div>
            <div class="social-media-images-container">
                <a href="" class="social-media-contact-link">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.9985 1.9925H6.094V0.0845C5.905 0.0585 5.255 0 4.498 0C2.91851 0 1.83651 0.9935 1.83651 2.8195V4.5H0.0935059V6.633H1.83651V12H3.97351V6.6335H5.646L5.9115 4.5005H3.97301V3.031C3.97351 2.4145 4.1395 1.9925 4.9985 1.9925Z" fill="white"/>
                    </svg>

                </a>
                <a href="" class="social-media-contact-link">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_948)">
                            <path d="M9.481 0H3.51898C1.57858 0 0 1.57858 0 3.51898V9.4811C0 11.4214 1.57858 13 3.51898 13H9.4811C11.4214 13 13 11.4214 13 9.4811V3.51898C13 1.57858 11.4214 0 9.481 0V0ZM12.2379 9.4811C12.2379 11.0012 11.0012 12.2379 9.481 12.2379H3.51898C1.99881 12.2379 0.762114 11.0012 0.762114 9.4811V3.51898C0.762114 1.99881 1.99881 0.762114 3.51898 0.762114H9.4811C11.0012 0.762114 12.2379 1.99881 12.2379 3.51898V9.4811Z" fill="white"/>
                            <path d="M6.49989 2.94543C4.53986 2.94543 2.94531 4.53998 2.94531 6.50002C2.94531 8.46005 4.53986 10.0546 6.49989 10.0546C8.45993 10.0546 10.0545 8.46005 10.0545 6.50002C10.0545 4.53998 8.45993 2.94543 6.49989 2.94543ZM6.49989 9.29248C4.96019 9.29248 3.70743 8.03982 3.70743 6.50002C3.70743 4.96032 4.96019 3.70755 6.49989 3.70755C8.03969 3.70755 9.29236 4.96032 9.29236 6.50002C9.29236 8.03982 8.03969 9.29248 6.49989 9.29248Z" fill="white"/>
                            <path d="M10.1394 1.68298C9.56023 1.68298 9.08911 2.1542 9.08911 2.73332C9.08911 3.31254 9.56023 3.78376 10.1394 3.78376C10.7187 3.78376 11.1899 3.31254 11.1899 2.73332C11.1899 2.1541 10.7187 1.68298 10.1394 1.68298ZM10.1394 3.02154C9.98056 3.02154 9.85122 2.89221 9.85122 2.73332C9.85122 2.57433 9.98056 2.4451 10.1394 2.4451C10.2984 2.4451 10.4278 2.57433 10.4278 2.73332C10.4278 2.89221 10.2984 3.02154 10.1394 3.02154Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_948">
                                <rect width="13" height="13" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                </a>
                <a href="" class="social-media-contact-link">
                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 1.46919C12.5166 1.68125 12.0014 1.82181 11.4644 1.89006C12.0169 1.56019 12.4386 1.04181 12.6368 0.417C12.1217 0.724125 11.5529 0.941063 10.9468 1.06213C10.4577 0.541313 9.76056 0.21875 9.00006 0.21875C7.52456 0.21875 6.33669 1.41638 6.33669 2.88456C6.33669 3.09581 6.35456 3.29894 6.39844 3.49231C4.18275 3.38425 2.22219 2.32231 0.905125 0.704625C0.675187 1.10356 0.540313 1.56019 0.540313 2.05175C0.540313 2.97475 1.01562 3.79294 1.72413 4.26662C1.29594 4.2585 0.875875 4.13419 0.52 3.93837C0.52 3.9465 0.52 3.95706 0.52 3.96762C0.52 5.26275 1.44381 6.3385 2.65525 6.58631C2.43831 6.64563 2.20187 6.67406 1.9565 6.67406C1.78587 6.67406 1.61362 6.66431 1.45194 6.62856C1.79725 7.684 2.77713 8.45994 3.94225 8.48512C3.0355 9.19444 1.88419 9.62181 0.637812 9.62181C0.41925 9.62181 0.209625 9.61206 0 9.58525C1.18056 10.3466 2.57969 10.7812 4.0885 10.7812C8.99275 10.7812 11.674 6.71875 11.674 3.19737C11.674 3.07956 11.6699 2.96581 11.6643 2.85287C12.1932 2.4775 12.6376 2.00869 13 1.46919Z" fill="white"/>
                    </svg>

                </a>
                <a href="" class="social-media-contact-link">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_962)">
                            <path d="M10.9973 11V10.9996H11.0001V6.96531C11.0001 4.99173 10.5752 3.47144 8.26795 3.47144C7.15879 3.47144 6.41445 4.0801 6.11058 4.65714H6.07849V3.65569H3.89087V10.9996H6.16879V7.36314C6.16879 6.40569 6.35029 5.47985 7.536 5.47985C8.70429 5.47985 8.7217 6.57252 8.7217 7.42456V11H10.9973Z" fill="white"/>
                            <path d="M0.181396 3.65613H2.46206V11H0.181396V3.65613Z" fill="white"/>
                            <path d="M1.32092 0C0.591708 0 0 0.591708 0 1.32092C0 2.05013 0.591708 2.65421 1.32092 2.65421C2.05013 2.65421 2.64183 2.05013 2.64183 1.32092C2.64138 0.591708 2.04967 0 1.32092 0V0Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1_962">
                                <rect width="11" height="11" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>

                </a>
            </div>
        </div>

        <div class="contact-email">
            <a href="mailto: testmail@gmail.com" class="contacts-email-text">
                testmail@gmail.com
            </a>
        </div>

        <div class="contact-location">
            <svg width="20" height="29" viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.254 0.89209C5.04313 0.89209 0.803711 5.13151 0.803711 10.3423C0.803711 16.8918 10.2632 28.0796 10.2632 28.0796C10.2632 28.0796 19.7042 16.5697 19.7042 10.3423C19.7042 5.13151 15.4649 0.89209 10.254 0.89209ZM13.1053 13.1094C12.3191 13.8954 11.2866 14.2885 10.254 14.2885C9.22148 14.2885 8.18867 13.8954 7.40279 13.1094C5.83051 11.5373 5.83051 8.97914 7.40279 7.40687C8.16412 6.64521 9.17684 6.22571 10.254 6.22571C11.3311 6.22571 12.3436 6.64537 13.1053 7.40687C14.6776 8.97914 14.6776 11.5373 13.1053 13.1094Z" fill="white"/>
            </svg>
            <div class="location-adress"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, doloribus.</div>
        </div>
    </div>

<!--    <form method="post" action="#" id="contactForm" class="contact-us-form">-->
<!--        <h3 class="contact-form-big-text">Поздоровайтесь :) </h3>-->
<!--        <div class="contact-form-small-text">Заполните небольшую форму обратной связи снизу, и мы обязательно вам ответим!</div>-->
<!--        <div class="contact-form-container">-->
<!--            <div class="input-container">-->
<!--                <label for="firstName">Имя</label>-->
<!--                <input type="text" class="form-name" name="firstName">-->
<!--            </div>-->
<!--            <div class="input-container">-->
<!--                <label for="lastName">Фамилия</label>-->
<!--                <input type="text" class="form-name" name="lastName">-->
<!--            </div>-->
<!--            <div class="input-container-big">-->
<!--                <label for="contactEmail">Email</label>-->
<!--                <input type="text" class="form-name-big" name="contactEmail">-->
<!--            </div>-->
<!--            <div class="input-container-big">-->
<!--                <label for="message">Сообщение</label>-->
<!--                <textarea rows="10" cols="100" name="message" id="formMessage" class="form-textarea"></textarea>-->
<!--            </div>-->
<!--        </div>-->
<!--        <input type="submit" class="form-submit-button" value="Отправить">-->
<!--    </form>-->
</main>
    <?php
    echo Yii::$app->controller->renderPartial("block/get_in_touch",
        ['content' => $this->params['headerContent']['feedback']]);
    ?>
</main>
