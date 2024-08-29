<?php

namespace app\modules\user\controllers;

use app\models\Access;
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
use app\modules\user\models\ConfirmEmailForm;
use app\modules\user\models\LoginForm;
use app\modules\user\models\PasswordResetRequestForm;
use app\modules\user\models\ResetPasswordForm;
use Yii;
use app\components\Controller;
use yii\base\InvalidParamException;
use yii\filters\AccessControl;
use yii\web\Response;
use yii\widgets\ActiveForm;

/**
 * Default controller for the `user` module
 */
class DefaultController extends Controller
{
    public $layout = '@app/views/layouts/empty';
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only'  => [
                    'logout',
                ],
                'rules' => [
                    [
                        'actions' => [
                            'login',
                            'reset-password',
                        ],
                        'allow'   => true,
                        'roles'   => [ '?' ],
                    ],
                    [
                        'actions' => [
                            'logout',
                        ],
                        'allow'   => true,
                        'roles'   => [ '@' ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Renders the index view for the module
     * @return string
     */
    public function actionIndex()
    {        
        return $this->render('index');
    }


    /**
     * @param $token
     *
     * @return \yii\web\Response
     */
    public function actionConfirmEmail($token)
    {
        $session = Yii::$app->getSession();

        $model = new ConfirmEmailForm($token);
        if (!$model) {
            $session->set('error_message', Yii::t('app', 'Email Confirmation Error.'));
        }

        if ($model) {
            if ($model->confirmEmail()) {
                $session->set('message',
                    Yii::t('app', 'Your Email has been successfully confirmed. Complete registration.'));
            } else {
                $session->set('error_message', Yii::t('app', 'Email Confirmation Error.'));
            }
        }

        return $this->redirect([ '/user/default/index' ]);
    }

    /**
     * @return array|string|Response
     * @throws \yii\base\Exception
     */
    public function actionLogin()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (!Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }

        $login = new LoginForm();
        $recover = new PasswordResetRequestForm();


        if ($login->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {
//                echo '<pre>'; var_dump(ActiveForm::validate($login)); die;
                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($login);
            } else {
//                var_dump(1111111); die;
                $login->login();

                if (Access::can('super_admin')) return $this->redirect([ '/admin/default/index' ]);
            }

            return $this->goBack();
        }

        $this->view->title = Yii::t('app', 'Sign in');
        $this->view->registerMetaTag(
            [
                'name'    => 'description',
                'content' => Yii::t('app', 'We are glad to see you again on our website. Complete a form to sign in.')
            ]
        );
        $this->view->registerMetaTag(
            [
                'name'    => 'robots',
                'content' => 'noindex, nofollow'
            ]
        );


        return $this->render('login-form', [ 'loginForm' => $login, 'recoverForm' => $recover ]);
    }

    /**
     * @return \yii\web\Response
     */
    public function actionLogout()
    {

        Yii::$app->user->logout();

        return $this->redirect([ '/login' ]);
    }

    /**
     * @return array|string|Response
     * @throws \yii\base\Exception
     */
    public function actionPasswordReset()
    {
        $model = new PasswordResetRequestForm();
        if ($model->load(Yii::$app->request->post())) {
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($model);
            } else {
                $session = Yii::$app->session;
                if ($model->sendEmail()) {
                    $session->set('message',
                        Yii::t('app', 'Check your email for further instructions.'));

                    return $this->redirect([ '/' ]);
                } else {
                    $session->set('error_message',
                        Yii::t('app', 'Sorry, we are unable to reset password for the provided email address.'));
                }
            }
        }

        $this->view->title = Yii::t('app', 'FORGOT YOUR PASSWORD?');
        $this->view->registerMetaTag(
            [
                'name'    => 'description',
                'content' => Yii::t('app', 'Do not worry. Just send us your authorization email and we will help you to recover the password.')
            ]
        );


        return $this->render('resetPassword', [ 'resetForm' => $model ]);
    }

    /**
     * @param bool $token
     * @return array|string|Response
     * @throws \yii\base\Exception
     */
    public function actionResetPassword($token = false)
    {
        $session = Yii::$app->session;

        if (!$token) {
            $token = $session->get('reset_token');
        }

        try {
            $model = new ResetPasswordForm($token);
            $session->set('reset_token', $token);

            if ($model->load(Yii::$app->request->post())) {
                if (Yii::$app->request->isAjax) {
                    Yii::$app->response->format = Response::FORMAT_JSON;

                    return ActiveForm::validate($model);
                } elseif ($model->resetPassword()) {
                    $session->remove('reset_token');
                    $session->set('message', Yii::t('app', 'Password changed successfully.'));
                    return $this->redirect([ '/' ]);
                }
            }

            return $this->render('setPassword', [ 'resetForm' => $model ]);

        } catch (InvalidParamException $e) {
            $session->set('error_message', $e->getMessage());
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
//        echo'<pre>'; var_dump($productsLong[0]->user); die;
        $contacts = Contacts::find()
            ->where('id = :id', [':id' => 1])
            ->multilingual()
            ->one();

        $settings = Settings::find()
            ->multilingual()
            ->one();

        return [

            'contacts' => $contacts,
            'sections' => $sections,
            'feedback' => $feedback,
            'settings' => $settings,
            'subscribe' => $subscribe,
            'newsLong' => $productsLong,
            'newsShort' => $productsShort,
            'games' => $games

//            'textPageFaqs' =>  $textPageFaqs

        ];
    }
}

