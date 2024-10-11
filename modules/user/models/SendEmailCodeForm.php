<?php

namespace app\modules\user\models;

// use app\modules\api\v1\services\ApiService;
use app\modules\user\models\Users;
use app\modules\user\services\RbacService;
use app\modules\user\models\SmsCode;
use app\models\UserRegister;
// use app\modules\users\models\UserStatus;
use Yii;
use yii\base\Model;

class SendEmailCodeForm extends Model
{
    public $email;

    public $useCaptcha = false;


    public function rules()
    {
        $rules = [
//            [['email'], 'required'],
//            ['nick_name', 'validateEmail'],

        ];

        // if (\Yii::$app->params['useCaptcha'] && $this->useCaptcha) {
        //     $rules[] = [['reCAPTCHA'], \himiklab\yii2\recaptcha\ReCaptchaValidator::className(), 'secret' => \Yii::$app->params['secretCaptcha']];
        // }
        return $rules;
    }



    public function attributeLabels()
    {
        $label = [
           
            'email' => Yii::t('app', 'Email'),

        ];
        return $label;
    }


    public function load($data, $formName = null)
    {
        return parent::load($data, $formName);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function save()
    {        
        if (!$this->validate()) return false;

        $transaction = Yii::$app->db->beginTransaction();

        try {
            $code = rand(100000,999999);
            $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
//            var_dump($user); die;
            $user->is_phone = false;
            $user->is_email = true;
            $user->two_factor_code = $code;
            $user->save(false);

            $transaction->commit();

            return true;

        } catch (\Exception $e) {
            $transaction->rollBack();
            throw $e;
        }

    }

}
