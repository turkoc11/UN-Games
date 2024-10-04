<?php

namespace app\modules\admin\controllers;

use app\models\Lang;
use app\models\Log;
use app\models\Subscribe;
use app\modules\admin\models\Prize;
use app\modules\admin\models\PrizeSearch;
use Yii;
use app\components\Controller;
use yii\web\NotFoundHttpException;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use app\models\Access;
use yii\helpers\ArrayHelper;

/**
 * NewsController implements the CRUD actions for News model.
 */
class PrizeController extends Controller
{
	public $layout = '@app/modules/admin/layouts/sidebar';

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
            'verbs' => [
                    'class' => VerbFilter::className(),
                    'actions' => [
                    'delete' => ['POST'],
                    ],
                ],
            ];
    }

    /**
     * Lists all News models.
     * @return mixed
     */
    public function actionIndex()
    {
		if (Yii::$app->request->isAjax) {
			$keys = (isset($_POST['keys']))?$_POST['keys']:[];
			if (count($keys)) {
				foreach ($keys as $k => $v) {
					if (($model = Prize::findOne($v)) !== null) {
						$model->delete();
					}
				}
				return $this->redirect(['index']);
			}
		}
		
        $searchModel = new PrizeSearch();
        
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);
        

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Prize model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Prize model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Prize();
        if ($model->load(Yii::$app->request->post())) {
//            echo'<pre>'; var_dump(Lang::getCurrent()->local); die;
//            $model->created_by = Yii::$app->user->identity->id;
            $model->save();
            $log = new Log();
            $log::createRow('Prize', $model->name, 'Create', $model->id);
            /////////////////////////////////// Send email
//            $subscribes = Subscribe::find()->select('email')->asArray()->column();
//            $message = \Yii::$app->mailer->compose('message', ['data' => $model, 'url' => 'news']);
//            $message->setFrom( 'ungames.eu@gmail.com' );
//            $message->setSubject( 'UN games new news' );
//            $message->setTo( $subscribes );
//            $message->send();
//            if ( ) {
//
//            }

            ///
            return $this->redirect(['index']);

        } else {

            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Updates an existing Prize model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            $log = new Log();
            $log::createRow('Prize', $model->name, 'Update', $model->id);
			Yii::$app->getSession()->setFlash('success', 'Изменения сохранены');
            return $this->redirect(['update', 'id' => $model->id]);

        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Deletes an existing News model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $model = $this->findModel($id);
        $log = new Log();
        $log::createRow('Prize', $model->name, 'Delete', $model->id);
        $model->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the News model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Prize the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id, $ml = true)
    {
        if ($ml) {
            $model = Prize::find()->where('id = :id', [':id' => $id])->multilingual()->one();
        } else {
            $model = Prize::findOne($id);
        }

        if ($model !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
