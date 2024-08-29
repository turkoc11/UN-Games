<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model app\modules\admin\models\SourceMessage */

$this->title = $this->title ?: Yii::t('app_admin', 'Translation');
$this->params[ 'breadcrumbs' ][] = [ 'label' => Yii::t('app_admin', 'Translations'), 'url' => [ 'index' ] ];
$this->params[ 'breadcrumbs' ][] = $this->title;
?>


<div class="container-fluid ps-ptb-30">
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">

                <div class="tb-hd-wp">
                    <div class="ttl-wp">
                        <h3 class="box-title"> "<?= $model->message ?>" </h3>
                    </div>
                    <div class="navs-wp">

                        <?php if (\app\models\Access::checkAccess('index')) { ?>
                            <?= Html::a('<i class="ti-back-left"></i>' . Yii::t('app_admin', 'Назад к списку'), [ 'index' ], [ 'class' => 'btn btn-success btn-rounded' ]) ?>
                        <?php } ?>

                        <?php if (\app\models\Access::checkAccess('update')) { ?>
                            <?= Html::a('<i class="ti-pencil"></i>' . Yii::t('app_admin', 'Edit info'), [ 'update', 'id' => $model->id ], [ 'class' => 'ns-button ns-button-white' ]) ?>
                        <?php } ?>

                        <?php if (\app\models\Access::checkAccess('delete')) { ?>
                            <?= Html::a('<i class="ti-trash"></i>' . Yii::t('app_admin', 'Delete') . ' ' . Yii::t('app_admin', rtrim(strtolower($this->title), 's')), [ 'delete', 'id' => $model->id ], [
                                'class' => 'btn btn-danger btn-rounded confirm-alert',
                                'type'  => 'button',
                                'data'  => [
                                    'question_text' => Yii::t('app_admin', 'Are you sure?'),
                                    'cancel_text'   => Yii::t('app_admin', 'No, stop it!'),
                                    'confirm_text'  => Yii::t('app_admin', 'Yes, delete it!'),
                                    'success_text'  => Yii::t('app_admin', "Successful!"),
                                ],
                            ]) ?>
                        <?php } ?>

                    </div>
                </div>


                <div class="scrollable">
                    <div class="table-responsive w-100 ps-mb-30 brd-1-g">
                        <table class="table m-b-0 t-col-50">
                            <thead>
                            <tr>
                                <th class="bg-ob"><?= Yii::t('app_admin', rtrim($this->title, 's')) ?> <?= Yii::t('app_admin', 'info') ?></th>
                            </tr>
                            </thead>
                        </table>

                        <?= DetailView::widget([
                            'model'      => $model,
                            'options'    => [
                                'class' => 'table m-b-0 t-col-50',
                            ],
                            'attributes' => [
                                [
                                    'attribute' => 'id',
                                ],
                                [
                                    'attribute' => 'category',
                                    'value'     => function ($model) {
                                        return $model->category;
                                    },
                                ],
                                [
                                    'attribute' => 'message',
                                    'format'    => 'raw',
                                    'value'     => function ($model) {
                                        return Html::a($model->message, [ 'update', 'id' => $model->id ]);
                                    },
                                ],
                                [
                                    'attribute' => 'translations',
                                    'format'    => 'raw',
                                    'value'     => function ($model) {
                                        $result = '';
                                        foreach ($model->messages as $message) {
                                            $result .= '<b><span style="color: #1e6abc">' . $message->language . '</span>: ' .
                                                (!empty($message->translation) ?
                                                    $message->translation :
                                                    Yii::t('app_admin', 'Not translated')) . ';</b><br>';
                                        }

                                        return $result;
                                    },
                                ],
                                [
                                    'attribute' => 'status',
                                    'value'     => function ($model) {
                                        /** @var \app\modules\admin\models\SourceMessage $model */
                                        return $model->isTranslated() ?
                                            Yii::t('app_admin', 'Translated') :
                                            Yii::t('app_admin', 'Not translated');
                                    },
                                ],
                            ],
                        ]) ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
