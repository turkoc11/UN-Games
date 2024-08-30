<?php

namespace app\modules\main\controllers;

use app\models\Subscribe;
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
class SubscribeController extends Controller
{

    // public $layout = '@app/modules/admin/layouts/sidebar';

/**
* {@inheritdoc}
*/
public function behaviors()
{
return [
    // 'access' => [
    // 'class' => AccessControl::class,
    // //'except' => [''],
    // //'only' => [''],
    //     // 'rules' => [
    //     //     [
    //     //         'actions' => parent::getActions($this->module->id, $this->id),
    //     //         'allow' => true,
    //     //         'matchCallback' => function ($rule, $action) {
    //     //         if (!Access::checkAccess($action->id)) {
    //     //         throw new ForbiddenHttpException(
    //     //         \Yii::t('app', 'You are not allowed to access this page.')
    //     //         );
    //     //         }
    //     //         return true;
    //     //         },
    //     //     ],
    //     // ],
    // ],
    'verbs' => [
            'class' => VerbFilter::className(),
            'actions' => [
            'delete' => ['POST'],
            'create' => ['POST'],
            ],
        ],
    ];
}



/**
* Creates a new Subscribe model.
* If creation is successful, the browser will be redirected to the 'view' page.
* @return mixed
*/


public function actionCreate()
{
    \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
    
    $model = new Subscribe();
    
    $model->attributes = \Yii::$app->request->post('Subscribe');
    $model->created_at = time();
    $model->updated_at = time();
    $data = \Yii::$app->request->post('Subscribe');
    if ($model->validate() && $model->save()) {
        $message = \Yii::$app->mailer->compose('subscribe', ['data' => $data]);
        $message->setFrom( 'ungames.eu@gmail.com' );
        $message->setSubject( 'New messages from site' );
        $message->setTo( ['ungames.eu@gmail.com'] );
        $message->send();

        $message = \Yii::$app->mailer->compose('subscribeuser', ['data' => $data]);
        $message->setFrom( 'ungames.eu@gmail.com' );
        $message->setSubject( 'Thank you for your request' );
        $message->setTo( [$data['email']] );
        $message->send();
        return ['success' => true];
       
    } else {
        return $model->errors;
    }    
}


/**
* Deletes an existing Feedback model.
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
    * Finds the Feedback model based on its primary key value.
    * If the model is not found, a 404 HTTP exception will be thrown.
    * @param integer $id
    *
    * @return Subscribe|array|null|\yii\db\ActiveRecord the loaded model
    * @throws NotFoundHttpException if the model cannot be found
    */
    protected function findModel($id)
    {
        if (!empty($model = Subscribe::findOne($id))) return $model;
        else throw new NotFoundHttpException(\Yii::t('app', 'The requested page does not exist.'));
    }
}
