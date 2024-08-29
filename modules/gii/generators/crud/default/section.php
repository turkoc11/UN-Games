<?php

/* @var $this yii\web\View */
/* @var $generator app\modules\gii\generators\crud\Generator */

/**
 * @var $module string
 * @var $controller string
 */

echo "<?php\n";
?>

use yii\helpers\Html;

/**
* @var $content string
*/

$cont = Yii::$app->controller->id;
$mod = Yii::$app->controller->module->id;
$act = Yii::$app->controller->action->id;

?>

<li class="<?= "<?= " ?> $cont == '<?= $controller ?>' ? 'active' : ''?>">
    <a href="javascript:void(0)" class="waves-effect"> <i class="fa fa-circle fa-fw" data-icon="v"></i>
        <span class="hide-menu"><?= "<?= " ?> Yii::t('app_admin', '<?= ucfirst($controller) ?>') ?><span class="fa arrow"></span></span>
    </a>
    <ul class="nav nav-second-level">
        <?= "<?php " ?> if(\app\models\Access::checkAccess('<?= $controller ?>/index')){ ?>
        <li class="<?= "<?= " ?> $cont == '<?= $controller ?>' && in_array($act, ['index', 'update', 'view']) ? 'active' : ''?>">
            <?= "<?= " ?> Html::a('<i class=" fa-fw">1</i><span class="hide-menu">' . Yii::t('app_admin', 'List') . '</span>',
                ['<?= $controller ?>/index']
            ) ?>
        </li>
        <?= "<?php }" ?>?>
        <?= "<?php " ?> if(\app\models\Access::checkAccess('<?= $controller ?>/create')){ ?>
        <li class="<?= "<?= " ?> $cont == '<?= $controller ?>' && in_array($act, ['create']) ? 'active' : ''?>">
            <?= "<?= " ?> Html::a('<i class=" fa-fw">2</i><span class="hide-menu">' . Yii::t('app_admin', 'Create') . '</span>',
            ['<?= $controller ?>/create']
            ) ?>
        </li>
        <?= "<?php }" ?>?>
    </ul>
</li>
