<?php

namespace app\modules\main\controllers;

use app\models\Benefits;
use app\models\Contacts;
use app\models\Sections;
use app\models\Settings;
use app\models\Subscribe;
use app\models\TextPageFaqs;
use app\modules\admin\models\Feedback;
use Yii;
use app\modules\main\models\NewsSearch;
use app\models\Values;
use app\components\Controller;
use yii\helpers\ArrayHelper;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\ForbiddenHttpException;
use yii\filters\AccessControl;
use app\models\Access;
use app\models\News;


/**
 * UsersController implements the CRUD actions for Users model.
 */
class GameController extends Controller
{

    public $layout = '@app/views/layouts/empty';

    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
//        var_dump(234234234); die;
        return [

//            'access' => [
//                'class' => AccessControl::class,
////'except' => [''],
////'only' => [''],
//                'rules' => [
//                    [
//                        'actions' => parent::getActions($this->module->id, $this->id),
//                        'allow' => true,
//                        'matchCallback' => function ($rule, $action) {
//                            if (!Access::checkPublicAccess($action->id)) {
//                                throw new ForbiddenHttpException(
//                                    \Yii::t('app', 'You are not allowed to access this page.')
//                                );
//                            }
//                            return true;
//                        },
//                    ],
//                ],
//            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
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
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }


    /**
     * Finds the Users model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @param bool $ml
     *
     * @return Values|array|null|\yii\db\ActiveRecord the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        $model = Values::find()->where('id = :id', [':id' => $id])->one();

        if (!empty($model)) return $model;
        else throw new NotFoundHttpException(\Yii::t('app', 'The requested page does not exist.'));
    }

    public function getContent($id = false)
    {
        $feedback = new Feedback();
        $subscribe = new Subscribe();

        $games = Values::find()
            ->where('status = :status', [':status' => 1])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();

        $sections = Sections::find()
            ->where('status = :status', [':status' => 1])
            ->orderBy('id ASC')
            ->multilingual()
            ->all();

        $textPageFaqs = TextPageFaqs::find()
            ->where('status = :status', [':status' => 1])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();

        $productsLong = News::find()->with('user')
            ->where('status = :status', [':status' => 1])
            ->andWhere('type = :type', [':type' => 1])
            ->orderBy('id DESC')
            ->multilingual()
            ->limit(3)->all();
        $productsShort = News::find()
            ->where('status = :status', [':status' => 1])
            ->andWhere('type = :type', [':type' => 2])
            ->orderBy('id DESC')
            ->multilingual()
            ->limit(10)->all();
        $contacts = Contacts::find()
            ->where('id = :id', [':id' => 1])
            ->multilingual()
            ->one();

        $settings = Settings::find()
            ->multilingual()
            ->one();

        return [

            'contacts'      =>  $contacts,
            'sections'      =>  $sections,
            'feedback'      =>  $feedback,
            'settings'      =>  $settings,
            'subscribe'     => $subscribe,
            'newsLong'      => $productsLong,
            'newsShort'     => $productsShort,
            'games'         => $games

//            'textPageFaqs' =>  $textPageFaqs

        ];
    }
}
