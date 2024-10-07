<?php

namespace app\modules\main\controllers;

use app\components\Controller;
use app\models\Access;
use app\models\Subscribe;
use app\models\Transactions;
use app\models\Users;
use app\modules\user\models\UpdateNickNameForm;
use app\modules\user\models\UpdateProfileForm;
use app\modules\user\models\UploadForm;
use app\modules\user\models\UserDeletedForm;
use Yii;
use yii\data\ActiveDataProvider;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\helpers\Url;
use yii\helpers\StringHelper;
use yii\web\ForbiddenHttpException;
use yii\web\Response;
// use yii\bootstrap\ActiveForm;
use yii\web\NotFoundHttpException;
use app\modules\main\models\Dynamic;
use app\models\Benefits;
use app\models\News;
use app\models\Contacts;
use app\models\TextPage;
use app\models\TextPageFaqs;
use app\models\Partners;
use app\models\Settings;
use app\models\Differences;
use app\models\ServiceAdvantages;
use app\models\ServiceFaqs;
use app\models\Sections;
use app\models\Values;
use app\models\ServiceValues;
use app\models\Advantages;
use app\models\Works;
use app\modules\admin\models\Feedback;
use app\modules\admin\models\FeedbackSearch;
use yii\widgets\ActiveForm;

class DefaultController extends Controller
{
    public $layout = '@app/views/layouts/empty';

    public function actions(): array
    {
        return [
            'error'    => [
                'class' => 'yii\web\ErrorAction',
            ],
            //'timezone' => [
            //    'class' => 'yii2mod\timezone\TimezoneAction',
            //],
        ];
    }

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
            'verbs'  => [
                'class'   => VerbFilter::className(),
                'actions' => [
                    'delete' => [ 'POST' ],
                ],
            ],
        ];
    }

    /**
     * @param string $link
     * @return string
     * @throws \yii\web\NotFoundHttpException
     */

    public function actionIndex($link = null)
    {
        if(isset(\Yii::$app->user->identity->assignments)) {
            $uroles = \Yii::$app->user->identity->assignments;
        } else {
            $uroles = [];
        }
        $content = $this->getContent();

        Yii::$app->view->params['headerContent'] = $content;
        $url = explode('/',Yii::$app->request->getUrl());

        Yii::$app->view->params['menu'] = Dynamic::find()
            ->where('status = :status', [':status' => 1])
            ->andWhere('in_menu = :in_menu', [':in_menu' => 1])
            ->orderBy('position_in_menu ASC')
            ->multilingual()
            ->all();

            $link = $link ?: 'home';

            if($link == 'news') {
                if((!in_array('super_admin', $uroles) && !in_array('donator', $uroles)) || empty($uroles)){
                    self::redirect(Url::to('/'));
                }
            }
            $model = Dynamic::find()
                ->where('status = :status', [':status' => 1])
                ->andWhere('url = :url', [':url' => $link])
                ->orderBy('id ASC')
                ->multilingual()
                ->one();

            if ($model === null) {
                return $this->render('error', [

                ]);
            }
            $user = \app\modules\user\models\Users::find()->where(['id' => Yii::$app->user->id])->one();
            return $this->render($link, [
                'model' => $model,
                'updateProfile' => new UpdateProfileForm(),
                'updateNickName' => new UpdateNickNameForm(),
                'userDeleted'   =>  new UserDeletedForm(),
                'uploadImage' => new UploadForm(),
                'user' => $user,

            ]);

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

	if(\Yii::$app->user->isGuest) {
            $transaction = [];
            $user = [];
        } else {
            $transaction = Transactions::find()->where(['email' => Yii::$app->user->identity->email])->all();
            $user = Users::getUserById(Yii::$app->user->identity->id);
        }

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
//        echo'<pre>'; var_dump($productsLong[0]->user); die;
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
            'games'         => $games,
            'transactions'  => $transaction,
            'user'          => $user

        ];
    }

    public function getServiceContent($serviceId)
    {

        $serviceValues = ServiceValues::find()
            ->where('status = :status', [':status' => 1])
            ->andWhere('service_id = :service_id', [':service_id' => $serviceId])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();

        $serviceAdvantages = ServiceAdvantages::find()
            ->where('status = :status', [':status' => 1])
            ->andWhere('service_id = :service_id', [':service_id' => $serviceId])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();

        $serviceFaqs = ServiceFaqs::find()
            ->where('status = :status', [':status' => 1])
            ->andWhere('service_id = :service_id', [':service_id' => $serviceId])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();



        return [
            'servicesValues'   =>  $serviceValues,
            'serviceAdvantages' => $serviceAdvantages,
            'serviceFaqs'       => $serviceFaqs,

        ];
    }

    public function getPageContent($pageId)
    {

        $textPageFaqs = TextPageFaqs::find()
            ->where('status = :status', [':status' => 1])
            ->andWhere('page_id = :page_id', [':page_id' => $pageId])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();



        return [
            'textPageFaqs' =>  $textPageFaqs
        ];
    }

    public function getNextLink($link)
    {
        $model = \app\models\Benefits::find()
            ->where('status = :status', [':status' => 1])
            ->orderBy('position ASC')
            ->multilingual()
            ->all();

        foreach ($model as $key => $value)
        {
            $result = array();
            if($value->link == $link){
                if(isset($model[$key + 1])){
                    $result['title'] = $model[$key + 1]->title;
                    $result['link'] = $model[$key + 1]->link;
                    return $result;
                }else{

                    $result['title'] = $model[0]->title;
                    $result['link'] = $model[0]->link;
                    return $result;
                }
            }
        }
    }
}
