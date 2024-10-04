<?php

namespace app\modules\user\controllers;

use app\models\Benefits;
use app\models\Contacts;
use app\models\Differences;
use app\models\DubaiSections;
use app\models\DubaiValues;
use app\models\News;
use app\models\Sections;
use app\models\Settings;
use app\models\Subscribe;
use app\models\TextPageFaqs;
use app\models\Values;
use app\modules\admin\models\Feedback;
use app\modules\user\models\RegistrationForm;
use Yii;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use app\components\Controller;
use yii\web\HttpException;
use yii\web\Response;
use yii\widgets\ActiveForm;

/**
 * Class UsersController
 * @package app\modules\users\controllers
 */
class RegistrationController extends Controller
{
    public $layout = '@app/views/layouts/empty';
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['index'],
                'rules' => [
                    [
                        'actions' => ['index'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                ],
            ]
        ];
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function actionIndex()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (!Yii::$app->user->isGuest) return $this->redirect(['/']);
        $model = new RegistrationForm();
        return $this->render('index', [
            'model' => $model
        ]);
    }

    /**
     * @return array
     */
    public function actionValidate()
    {
        $model = new RegistrationForm();
        $request = \Yii::$app->getRequest();

        if ($request->isPost && $model->load($request->post())) {
            \Yii::$app->response->format = Response::FORMAT_JSON;
            return ActiveForm::validate($model);
        }
    }

    /**
     * @return bool|int
     * @throws \Exception
     */
    public function actionSave()
    {
        $model = new RegistrationForm();
        // $model->useCaptcha = true;
        if (Yii::$app->request->isPost && $model->load(Yii::$app->request->post())) {
//            echo '<pre>';var_dump($model->validate()); die;
            return $model->save() ? $this->redirect([ '/' ]) : 'error';
        }
        
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
        ];
    }
}
