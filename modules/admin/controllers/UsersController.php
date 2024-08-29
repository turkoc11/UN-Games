<?php

namespace app\modules\admin\controllers;

use Yii;
use app\modules\admin\models\Users;
use app\modules\admin\models\UsersSearch;
use app\components\Controller;
use yii\db\ActiveQuery;
use yii\filters\AccessControl;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\ForbiddenHttpException;
use app\models\Access;
use yii\web\UploadedFile;

/**
 * UsersController implements the CRUD actions for Users model.
 */
class UsersController extends Controller
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
     * Lists all Users models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new UsersSearch();
        $params = [];
        if (!Access::can('developer')) $params += [ '>', 'level', Yii::$app->user->identity->level ];

        $dataProvider = $searchModel->search(Yii::$app->request->queryParams, $params);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
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
     * @return string|\yii\web\Response
     * @throws \yii\base\Exception
     */
    public function actionCreate()
    {
        $params = [];
        $model = new Users($params);
        // var_dump(Yii::$app->request->post()); die;
        if ($model->load(Yii::$app->request->post()) && $model->save()) {

            $model->tempImage = UploadedFile::getInstance($model, 'tempImage');
            $upload = $model->upload();
            $model->tempImage = null;
            $model->image = $upload ? $upload : '';
            $model->generateAuthKey();
            $model->save();

            return $this->redirect([ 'view', 'id' => $model->id ]);
        }

        return $this->render('create', [
            'model' => $model,
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
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {

            $model->tempImage = UploadedFile::getInstance($model, 'tempImage');
            $upload = $model->upload();
            $model->tempImage = null;
            $model->image = $upload ? $upload : '';
            $model->save();

            return $this->redirect([ 'view', 'id' => $model->id ]);
        }

        return $this->render('update', [
            'model' => $model,
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

        return $this->redirect([ 'index' ]);
    }

    /**
     * Finds the Users model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     *
     * @return Users|array|null|\yii\db\ActiveRecord|ActiveQuery the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        $params = [];
        // if (!Access::can('developer')) $params += [ '>', 'level', Yii::$app->user->identity->level ];
        if (!empty($model = Users::find()->where([ 'id' => $id ])->andWhere($params)->one())) return $model;
        else throw new NotFoundHttpException(\Yii::t('app', 'The requested page does not exist.'));
    }
}
