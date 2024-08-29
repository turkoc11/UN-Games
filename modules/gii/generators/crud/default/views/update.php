<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\crud\Generator */

$urlParams = $generator->generateUrlParams();

echo "<?php\n";
?>

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model <?= ltrim($generator->modelClass, '\\') ?> */

$this->title = $this->title ?: <?= $generator->generateString(Inflector::pluralize(Inflector::camel2words(StringHelper::basename($generator->modelClass)))) ?>;

?>

<div class="ns-container-outer">
    <div class="ns-container-inner">

        <div class="row ns-mb-15">
            <div class="col-xs-4 col-xxs-12">
                <div class="ns-title">
                    <?= "<?= " ?>Yii::t('app_admin', $this->title) ?>
                    <?= "<?= " ?>Yii::t('app_admin', 'updating') ?>
                </div>
            </div>
            <div class="col-xs-8 col-xxs-12">
                <div class="ns-actions text-right xxs-left">
                    <?= "<?php " ?> if (\app\models\Access::checkAccess('index')) { ?>
                    <?= "<?= " ?>Html::a(''.Yii::t('app_admin', 'Back to list'), ['index'], ['class' => 'ns-button ns-button-white']) ?>
                    <?= "<?php " ?> } ?>
                    <?= "<?= " ?>Html::submitButton(Yii::t('app_admin', 'Save changes'), ['class' => 'ns-button', 'form' => 'ns_form']) ?>
                </div>
            </div>
        </div>

        <?= '<?= ' ?>$this->render('_form', [ 'model' => $model, ]) ?>

    </div>
</div>
