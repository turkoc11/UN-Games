<?php

namespace app\modules\admin\controllers;

use Yii;
use app\modules\admin\models\Dynamic;
use app\modules\admin\models\DynamicSearch;
use app\components\Controller;
use yii\filters\AccessControl;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\ForbiddenHttpException;
use app\models\Access;
use yii\web\UploadedFile;

/**
 * DynamicController implements the CRUD actions for Dynamic model.
 */
class DynamicController extends Controller
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
     * Lists all Dynamic models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new DynamicSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Dynamic model.
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Dynamic model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Dynamic();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect([ 'view', 'id' => $model->id ]);
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Updates an existing Dynamic model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->validate()) {

//            $model->tempImage = UploadedFile::getInstance($model, 'tempImage');
//            $upload = $model->upload();
//            $model->tempImage = null;
//            $model->image = $upload ? $upload : '';

            $model->save();

            return $this->redirect([ 'view', 'id' => $model->id ]);
        }

        return $this->render('update', [
            'model' => $model,
        ]);
    }

    /**
     * Deletes an existing Dynamic model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     *
     * @return \yii\web\Response
     * @throws NotFoundHttpException
     * @throws \Throwable
     * @throws \yii\db\StaleObjectException
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect([ 'index' ]);
    }

    /**
     * Finds the Dynamic model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @param bool $ml
     *
     * @return Dynamic|array|null|\yii\db\ActiveRecord the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id, $ml = true)
    {
        if ($ml) $model = Dynamic::find()->where('id = :id', [ ':id' => $id ])->multilingual()->one();
        else $model = Dynamic::findOne($id);

        if (!empty($model)) return $model;
        else throw new NotFoundHttpException(\Yii::t('app', 'The requested page does not exist.'));
    }
}
