<?php

namespace app\modules\main\controllers;

use app\models\Transactions;
use app\models\Users;
use app\modules\user\services\RbacService;
use Yii;
use app\modules\admin\models\Feedback;
    use app\modules\admin\models\FeedbackSearch;
use app\components\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\ForbiddenHttpException;
use yii\filters\AccessControl;
use app\models\Access;

/**
* FeedbackController implements the CRUD actions for Feedback model.
*/
class PaymentController extends Controller
{

    // public $layout = '@app/modules/admin/layouts/sidebar';

/**
* {@inheritdoc}
*/
public function behaviors()
{
return [

    'verbs' => [
            'class' => VerbFilter::className(),
            'actions' => [
            'delete' => ['POST'],
//            'create' => ['POST'],
            ],
        ],
    ];
}


public function actionCreate()
{
    $stripe = new \Stripe\StripeClient([
        'api_key' => Yii::$app->params['stripe']['privateKey']
    ]);
    $paymentIntent = $stripe->paymentIntents->retrieve(Yii::$app->request->get('payment_intent'));
    if($paymentIntent->status == 'succeeded') {
        $user = Users::find()->where(['id' => Yii::$app->user->identity->id])->one();
        $user->balance = number_format($user->balance + $paymentIntent->amount/100, 2);
        $user->save(false);
        (new RbacService())->delete($user->id, 'user');
        $auth = Yii::$app->authManager;
        $role = $auth->getRole('donator');
        if(!$role){
            (new RbacService())->assign($user->id, 'donator');
        }
    }
    Transactions::transactionSave($paymentIntent);
    $this->redirect('http://gamesite.local');
}

    public function actionForm()
    {
        $stripe = new \Stripe\StripeClient([
           'api_key' => Yii::$app->params['stripe']['privateKey']
        ]);
        return $this->render('form', [
            'model' => $stripe,
            'sum'   => Yii::$app->request->get('paySum') * 100,
            'product'   => Yii::$app->request->get('product')
        ]);
    }

}
