<?php

namespace app\modules\user\controllers;

use app\models\Access;
use app\models\Benefits;
use app\models\Contacts;
use app\modules\user\models\TwoFactorForm;
use app\modules\user\models\UnSetTwoFactorForm;
use http\Exception;
use GuzzleHttp;
use app\models\Lang;
use app\models\News;
use app\models\Sections;
use app\models\Settings;
use app\models\Subscribe;
use app\models\TextPageFaqs;
use app\models\Values;
use app\modules\admin\models\Feedback;
use app\modules\user\models\ChangePasswordForm;
use app\modules\user\models\ConfirmEmailForm;
use app\modules\user\models\LoginForm;
use app\modules\user\models\PasswordResetRequestForm;
use app\modules\user\models\ResetPasswordForm;
use app\modules\user\models\SendChangePasswordForm;
use app\modules\user\models\SendEmailCodeForm;
use app\modules\user\models\SendPhoneCodeForm;
use app\modules\user\models\SetTwoFactorForm;
use app\modules\user\models\UpdateNickNameForm;
use app\modules\user\models\UpdateProfileForm;
use app\modules\user\models\UploadForm;
use app\modules\user\models\UserDeletedForm;
use app\modules\user\models\Users;
use Yii;
use app\components\Controller;
use yii\base\InvalidParamException;
use yii\filters\AccessControl;
use yii\web\Response;
use yii\widgets\ActiveForm;
use yii\web\UploadedFile;

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
        $twoFactor = new TwoFactorForm();


        if ($login->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {

               Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($login);
            } else {

                $user = \app\models\Users::find()->where(['email' => $login->email])->one();
//                echo '<pre>'; var_dump($user); die;
                if($user && !empty($user->deleted_at)){
                    $date = time() - $user->deleted_at;
                    if($date >= 2592000) {
                        return $this->render('delete');
                    }

                }

                if($user->is_two_factor) {
                    $result = $this->sendCode($user);
                    if($result) {
                        return $this->render('set-code', ['model' => $twoFactor]);
                    }
                }
//                var_dump($login->login()); die;
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


    public function actionSendAuthCode()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (!Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }

//        $login = new LoginForm();
//        $recover = new PasswordResetRequestForm();
        $twoFactor = new TwoFactorForm();


        if ($twoFactor->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($twoFactor);
            } else {
//                var_dump($login->login()); die;
                $twoFactor->login();

                if (Access::can('super_admin')) return $this->redirect([ '/admin/default/index' ]);
            }

            return $this->goBack();
        }

//        $this->view->title = Yii::t('app', 'Sign in');
//        $this->view->registerMetaTag(
//            [
//                'name'    => 'description',
//                'content' => Yii::t('app', 'We are glad to see you again on our website. Complete a form to sign in.')
//            ]
//        );
//        $this->view->registerMetaTag(
//            [
//                'name'    => 'robots',
//                'content' => 'noindex, nofollow'
//            ]
//        );


//        return $this->render('login-form', [ 'loginForm' => $login, 'recoverForm' => $recover ]);
    }

    public function sendCode($user)
    {
       if($user->is_email){
           $code = rand(100000,999999);
           $user->two_factor_code = $code;
           $user->save(false);
           $language = Lang::find()
               ->where(['id' => $user->language_id])
               ->one();
           $newUser = \app\models\Users::find()->where(['two_factor_code' => $code])->one();
           $message = \Yii::$app->mailer->compose('twofactor', ['data' => $newUser, 'lang' => $language->local]);

           $message->setFrom( 'shishkalovd@gmail.com' );
//            $message->setFrom( 'ungames.eu@gmail.com' );
           $message->setSubject( Yii::t('app', 'Код верификации') );
           $message->setTo( 'shishkalovd@gmail.com' );
//            $message->setTo( $user->email );
           $message->send();
       }else{
           // отправка смс пока непонятно через кого
       }
       return true;
    }

    public function actionUpdateProfile()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }

        $updateProfile = new UpdateProfileForm();
        if ($updateProfile->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($updateProfile);
            } else {
                $updateProfile->save();
            }

            return $this->goBack('profile');
        }
    }

    public function actionUpdateNickName()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }

        $updateNickName = new UpdateNickNameForm();
        if ($updateNickName->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($updateNickName);
            } else {
                $updateNickName->save();
            }

            return $this->goBack('profile');
        }
    }

    public function actionDeleteAccount()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        $userDeleted = new UserDeletedForm();
        if ($userDeleted->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($userDeleted);
            } else {
                $userDeleted->save();
            }

            return $this->goBack('profile');
        }
    }

    public function actionChangePassword()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        if(!Yii::$app->request->get('personal_code')) {
            return $this->goBack();
        }
        $code = Yii::$app->request->get('personal_code');

        $user = \app\models\Users::find()->where(['personal_code' => $code])->one();
        if($user) {
            $model = new ChangePasswordForm();
            $user->personal_code = null;
            $user->save(false);
            return $this->render('change-password', [ 'passwordForm' => $model ]);

        }

        return $this->goBack();

    }

    public function actionUpdatePassword()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }

        $updatePassword = new ChangePasswordForm();
        if ($updatePassword->load(Yii::$app->request->post())) {


            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($updatePassword);
            } else {
                $updatePassword->save();
            }

            return $this->goBack('security');
        }
    }

    public function actionSendPasswordLink()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        $sendChangePassword = new SendChangePasswordForm();


            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($sendChangePassword);
            } else {
                $sendChangePassword->save();
                $user = \app\models\Users::find()->where(['id' => Yii::$app->user->identity->id])->one();
                $language = Lang::find()->where(['id' => $user->language_id])->one();
                $message = \Yii::$app->mailer->compose('changepassword', ['data' => $user, 'lang' => $language->local]);

                $message->setFrom( 'shishkalovd@gmail.com' );
                //            $message->setFrom( 'ungames.eu@gmail.com' );
                $message->setSubject( Yii::t('app', 'На сайте UN Games вышла новая игра') );
                $message->setTo( 'shishkalovd@gmail.com' );
                //            $message->setTo( $user->email );
                $message->send();
            }

            return $this->goBack('security');

    }

    public function actionSendEmail()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        $sendEmailCode = new SendEmailCodeForm();

        if (Yii::$app->request->isAjax) {

            Yii::$app->response->format = Response::FORMAT_JSON;

            return ActiveForm::validate($sendEmailCode);
        } else {
            $sendEmailCode->save();
            $user = \app\models\Users::find()->where(['id' => Yii::$app->user->identity->id])->one();
            $language = Lang::find()->where(['id' => $user->language_id])->one();
            $message = \Yii::$app->mailer->compose('twofactor', ['data' => $user, 'lang' => $language->local]);

            $message->setFrom( 'shishkalovd@gmail.com' );
//            $message->setFrom( 'ungames.eu@gmail.com' );
            $message->setSubject( Yii::t('app', 'Код верификации') );
            $message->setTo( 'shishkalovd@gmail.com' );
//            $message->setTo( $user->email );
            $message->send();
        }

        return $this->goBack('security');

    }

    public function actionUnsetTwoFactor()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        $unsetTwoFactor = new UnSetTwoFactorForm();

        if (Yii::$app->request->isAjax) {

            Yii::$app->response->format = Response::FORMAT_JSON;

            return ActiveForm::validate($unsetTwoFactor);
        } else {
            $unsetTwoFactor->save();

        }

        return $this->goBack('security');

    }

    public function actionSendPhone()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        $sendPhoneCode = new SendPhoneCodeForm();

        if (Yii::$app->request->isAjax) {

            Yii::$app->response->format = Response::FORMAT_JSON;

            return ActiveForm::validate($sendPhoneCode);
        } else {
//            var_dump('PHONE'); die;
//            $sendPhoneCode->save();
            // тут отправка смс
            $user = \app\models\Users::find()->where(['id' => Yii::$app->user->identity->id])->one();
            $config = \SendinBlue\Client\Configuration::getDefaultConfiguration()->setApiKey('api-key', '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');

            $apiInstance = new \SendinBlue\Client\Api\TransactionalSMSApi(
                new GuzzleHttp\Client(),
                $config
            );

            $sendTransacSms = new \SendinBlue\Client\Model\SendTransacSms();
            $sendTransacSms['sender'] = 'denver';
            $sendTransacSms['recipient'] = '380983301919';
            $sendTransacSms['content'] = '234234';
            $sendTransacSms['type'] = 'transactional';
//            $sendTransacSms['webUrl'] = 'https://example.com/notifyUrl';
//            echo '<pre>'; var_dump($sendTransacSms); die;

            try {
//                $result = $apiInstance->sendTransacSms($sendTransacSms); 7TQPZY3A6FTLBKJPSUQHE9P4
                echo '<pre>'; var_dump($apiInstance->sendTransacSms($sendTransacSms)); die;
                print_r($result);
            } catch (\Exception $e) {
                echo 'Exception when calling TransactionalSMSApi->sendTransacSms: ', $e->getMessage(), PHP_EOL;
            }
        }

        return $this->goBack('security');

    }

    public function actionSendVerifyCode()
    {
        $content = $this->getContent();
        Yii::$app->view->params['headerContent'] = $content;
        if (Yii::$app->user->isGuest) {
            return $this->redirect([ '/login' ]);
        }
        $verifyCode = new SetTwoFactorForm();
        if ($verifyCode->load(Yii::$app->request->post())) {

            if (Yii::$app->request->isAjax) {

                Yii::$app->response->format = Response::FORMAT_JSON;

                return ActiveForm::validate($verifyCode);
            } else {
                $verifyCode->save();
            }

            return $this->goBack('security');
        }
    }

    public function actionUploadImage()
    {
        $model = new UploadForm();
        $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
        if (Yii::$app->request->isPost) {
            $model->image = UploadedFile::getInstance($model, 'image');
//            var_dump($model->image); die;

            if ($model->image && $model->validate()) {
                $path = 'images/user/' . $model->image->baseName . '.' . $model->image->extension;
                if($model->image->saveAs($path)){
                    $user->image = $path;
                    $user->save(false);
                }

            }
        }

        return $this->goBack('profile');
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

