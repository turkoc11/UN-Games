<?php

namespace app\modules\admin\controllers;


use app\models\Access;
use app\models\Users;
use Yii;

use app\components\Controller;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\web\ForbiddenHttpException;

/**
 * DefaultController implements the CRUD actions for User model.
 */
class DefaultController extends Controller
{
    public $layout = '@app/modules/admin/layouts/sidebar';


    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                //'except' => [''],
                //'only' => [''],
                'rules' => [
                    [
                        'actions'       => parent::getActions($this->module->id, $this->id),
                        'allow'         => true,
                        'matchCallback' => function ($rule, $action) {
                            if (!Access::checkAccess($action->id)) {
                                throw new ForbiddenHttpException(
                                    \Yii::t('app', 'You are not allowed to access this page.')
                                );
                            }
                            return true;
                        },
                    ],
                ],
            ],
            'verbs'  => [
                'class'   => VerbFilter::className(),
                'actions' => [
                    'delete' => [ 'POST' ],
                ],
            ],
        ];
    }

    /**
     * Lists all User models.
     * @return mixed
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

}
