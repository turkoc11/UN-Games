<?php

/* @var $this yii\web\View */
/* @var $name string */
/* @var $message string */

/* @var $exception Exception */


use yii\helpers\Html;

use yii\web\NotFoundHttpException;
use Yii;

?>
 <section id="content" class="main main-404">
        <div class="color-wrapper">
          <div class="container">
            <div class="error">
              <div class="error-num">404</div>
              <div class="error-text"><?php echo Yii::t('app', 'Запрашиваемая страница не найдена')?></div>
              <div class="error-link"><?php echo Yii::t('app', 'Вернуться на')?> <a href="/"><?php echo Yii::t('app', 'Home')?></a></div>
            </div>
          </div>
        </div>
      </section>