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

class SendChangePasswordForm extends Model
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


    public function validateEmail($attribute)
    {
        if($this->email) {
            $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
            $model = Users::find()->where(['email' => $this->email])->one();
            if ($model->id != $user->id ) {
                $this->addError($attribute, Yii::t( 'app','Такой Email уже существует'));
            }
        }
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
            $code = Yii::$app->controller->generateRandomString(16);
            $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
            $user->personal_code = $code;
            $user->save(false);

            $transaction->commit();

            return true;

        } catch (\Exception $e) {
            $transaction->rollBack();
            throw $e;
        }

    }

}
