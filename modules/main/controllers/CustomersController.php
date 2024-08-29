<?php

namespace app\modules\main\controllers;


use app\modules\main\models\Indicators;
use Yii;
use app\modules\main\models\UsersSearch;
use app\components\Controller;
use yii\helpers\ArrayHelper;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\ForbiddenHttpException;
use yii\filters\AccessControl;
use app\models\Access;
use app\models\Users;


/**
 * UsersController implements the CRUD actions for Users model.
 */
class CustomersController extends Controller
{

    public $layout = '@app/views/layouts/empty';

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
                        'actions' => parent::getActions($this->module->id, $this->id),
                        'allow' => true,
                        'matchCallback' => function ($rule, $action) {
                            if (!Access::checkPublicAccess($action->id)) {
                                throw new ForbiddenHttpException(
                                    \Yii::t('app', 'You are not allowed to access this page.')
                                );
                            }
                            return true;
                        },
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }

    /**
     * Lists all Users models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new UsersSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        $doctors = Users::listUsers(true);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
            'doctors' => $doctors,
        ]);
    }

    /**
     * Displays a single Users model.
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
     * Creates a new Users model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Users();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        $doctors = Users::listUsers(true);

        return $this->render('create', [
            'model' => $model,
            'doctors' => $doctors
        ]);
    }

    /**
     * Updates an existing Users model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     *
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }
        $doctors = Users::listUsers(true);

        return $this->render('update', [
            'model' => $model,
            'doctors' => $doctors
        ]);
    }

    /**
     * Deletes an existing Users model.
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

        return $this->redirect(['index']);
    }

    /**
     * Finds the Users model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @param bool $ml
     *
     * @return Users|array|null|\yii\db\ActiveRecord the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        $model = Users::find()->where('id = :id', [':id' => $id])->one();

        if (!empty($model)) return $model;
        else throw new NotFoundHttpException(\Yii::t('app', 'The requested page does not exist.'));
    }
}
