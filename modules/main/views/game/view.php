<?php
use ruskid\stripe\StripeCheckout;
use ruskid\stripe\StripeForm;
use yii\helpers\Url;
use yii\web\JsExpression;
use yii\helpers\Html;
use ruskid\stripe\StripeCheckoutCustom;
?>
<main class="main">
    <div class="services-head-container">
        <h3 class="services-head-big-text"><?php echo $model->title?></h3>
<!--        <div class="services-head-small-text">Сюда сопроводительный текст (если нужен)</div>-->
    </div>
    <!--Начало контента-->
    <div class="services-content-container">
        <img src="<?php echo $model->image?>" alt="сюда картинку" class="services-content-image">
        <div class="services-content-text">
<!--            <h3 class="services-content-big-text">Сюда какое-нибудь преимущество</h3>-->
            <div class="services-content-small-text"><?php echo $model->description?></div>
        </div>
    </div>
    <div class="services-content-container">
        <div class="services-content-text">
<!--            <h3 class="services-content-big-text">Сюда какое-нибудь преимущество</h3>-->
            <div class="services-content-small-text"><?php echo $model->description2 ?></div>
        </div>
        <img src="<?php echo $model->image2?>" alt="а сюда другую картинку" class="services-content-image">
    </div>
    <?php if (!Yii::$app->user->isGuest) {?>
    <div class="stripe-payment">
        <label for="tentacles" class="stripe-label"><?php echo Yii::t('app', 'Введите сумму доната')?></label>
        <input type="number" id="donate" class="stripe-donation-input" name="tentacles"  />
        <span id="donat-payment"></span>
        <a href="/payment/form" target="_blank" class="stripe-payment stripe-payment-button"> <?php echo Yii::t('app', 'Оплатить')?></a>

    </div>
    <?php }?>

    <?php


    ?>
</main>

<script>
    $(".stripe-payment").click(function(event){
        let donate = $("#donate").val()
        let product = '<?php echo $model->title?>'
        if(!donate) {
            event.preventDefault();
            $("#donat-payment").show();
            document.getElementById("donat-payment").innerHTML='<?= Yii::t("app", "Введите сумму доната")?>'
        }
        $('.stripe-payment').attr('href', '/payment/form?paySum='+ donate + '&product=' + product)

    });
</script>