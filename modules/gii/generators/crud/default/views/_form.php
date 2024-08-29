<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\crud\Generator */

/* @var $model \yii\db\ActiveRecord */
$model = new $generator->modelClass();
$safeAttributes = $model->safeAttributes();
if (empty($safeAttributes)) {
    $safeAttributes = $model->attributes();
}

echo "<?php\n";
?>

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use app\models\Lang;

/* @var $this yii\web\View */
/* @var $model <?= ltrim($generator->modelClass, '\\') ?> */
/* @var $form yii\widgets\ActiveForm */
?>


<?= "<?php " ?>$form = ActiveForm::begin(['class' => 'form-horizontal no-mlr', 'id' => 'ns_form']); ?>

<ul class="nav nav-tabs">
    <li class="active" style="margin-left: 15px;">
        <a data-toggle="tab" href="#top"> <?= "<?= " ?> \Yii::t('app_admin', 'Data') ?></a>
    </li>
    <?php if ($generator->multiLang): ?>
        <?= "<?php" ?> foreach (Lang::getBehaviorsList('lang.default = 0') as $k => $v) { ?>
        <li>
            <a data-toggle="tab" href="#top-<?= '<?= $k ?>' ?>"><?= '<?= $v ?>' ?></a>
        </li>
        <?= "<?php } ?>" ?>
    <?php endif; ?>
</ul>

<?= "<?=" ?> $form->errorSummary($model, ['class' => 'alert-danger alert fade in form_error_summary']); ?>

<div id="top" class="tab-pane fade in active form_tab">
    <div class="row ns-mb-15">
        <?php foreach ($generator->getColumnNames() as $attribute) {
            if (in_array($attribute, $safeAttributes)) {
                echo "  <div class=\"col-md-4 col-sm-6 col-xs-12\"> \n  <?= " . $generator->generateActiveField($attribute) . " ?>\n</div>\n";
            }
        } ?>
    </div>
</div>

<?php if ($generator->multiLang): ?>
<?= "<?php foreach (Lang::getBehaviorsList() as \$k => \$v) { ?>
        <div class=\"tab-pane fade form_tab\" id=\"top-<?= \$k ?>\">
            <div class=\"row ns-mb-15\">"; ?>
                <?php foreach ($generator->getMlColumnNames() as $attribute) {
                    if (in_array($attribute, $safeAttributes) && $attribute != 'id') {
                        echo "  <div class=\"col-md-4 col-sm-6 col-xs-12\"> \n  <?= " . $generator->generateMlActiveField($attribute . '_\'.$k') . " ?>\n</div>\n";
                    }
                } ?>
    <?= "</div>\n
    </div>\n
<?php } ?>" ?>
<?php endif; ?>

<?= "<?php " ?>ActiveForm::end(); ?>
