<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\AuthItem */
/* @var $permissions array */

?>


<div class="check_tree_container">

    <?= Html::label(Yii::t('app_admin', 'Permissions')) ?>

    <ul class="tree">
        <?php foreach ($permissions as $m_name => $module) { ?>

            <li class="module">
                <input id="<?= $m_name ?>" name="module[]" type="checkbox">
                <label for="<?= $m_name ?>"><?= $module->title ?></label>
                <?php if (!empty($module->items)) { ?>
                    <ul class="controllers expanded">
                        <?php foreach ($module->items as $c_name => $controller) { ?>
                            <li class="controller">
                                <input id="<?= $c_name ?>" name="controller[]" type="checkbox">
                                <label for="<?= $c_name ?>"><?= $controller->title ?></label>
                                <?php if (!empty($controller->items)) { ?>
                                    <ul class="actions">
                                        <?php foreach ($controller->items as $a_name => $a_title) { ?>
                                            <li class="action">
                                                <input
                                                        id="<?= $a_name ?>"
                                                        type="checkbox"
                                                        name="AuthItem[permissions][]"
                                                        value="<?= $a_name ?>"
                                                    <?= !$model->isNewRecord && in_array($a_name, $model->attached) ? 'checked' : '' ?>
                                                >
                                                <label for="<?= $a_name ?>"><?= $a_title ?></label>
                                            </li>
                                        <?php } ?>
                                    </ul>
                                <?php } ?>
                            </li>
                        <?php } ?>
                    </ul>
                <?php } ?>
            </li>

        <?php } ?>
    </ul>

</div>
