<?php

namespace app\modules\admin\controllers;

use app\modules\admin\models\Category;
use app\modules\admin\models\Hashtags;
use Yii;
use app\modules\admin\models\Partners;
use app\modules\admin\models\PartnersSearch;
use app\components\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use app\models\Access;
use yii\helpers\ArrayHelper;

/**
 * NewsController implements the CRUD actions for News model.
 */
class PartnersController extends Controller
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
					if (($model = Partners::findOne($v)) !== null) {
						$model->delete();
					}
				}
				return $this->redirect(['index']);
			}
		}
		
        $searchModel = new PartnersSearch();
        
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);       
            
        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single News model.
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
     * Creates a new News model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Partners();
        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['index']);
        } else {

            // - get category list
//            $model->categories_all = $model->categories_all = Category::getSortableArrayTree();

            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Updates an existing News model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {

			Yii::$app->getSession()->setFlash('success', 'Изменения сохранены');
            return $this->redirect(['update', 'id' => $model->id]);

        } else {

            // - get category list
//            $model->categories_all = Category::getSortableArrayTree();

//            $model->categories = ArrayHelper::getColumn(Category::find()
//                ->leftJoin('news_category','news_category.category_id = category.id')
//                ->where('news_id = :id', [':id' => $id])
//                ->all(),'id');

//            $model->hashtags = implode(',',ArrayHelper::getColumn(Hashtags::find()
//                ->leftJoin('news_hashtags', 'news_hashtags.hashtag_id = hashtags.id')
//                ->where('news_id = :id', [':id' => $id])
//                ->all(), 'name'));

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
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the News model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Partners the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id, $ml = true)
    {
        if ($ml) {
            $model = Partners::find()->where('id = :id', [':id' => $id])->multilingual()->one();
        } else {
            $model = Partners::findOne($id);
        }

        if ($model !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
