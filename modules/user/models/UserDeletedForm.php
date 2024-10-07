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

class UserDeletedForm extends Model
{
    public $email;
    public $phone;
    public $nick_name;
//    public $password;
    public $first_name;
    public $last_name;
    public $gender;
    public $deleted_at;
    public $dateofbirth;

    public $useCaptcha = false;


    public function rules()
    {
        $rules = [
            [['deleted_at'], 'required'],
            ['deleted_at', 'validateDeleted'],

        ];

        // if (\Yii::$app->params['useCaptcha'] && $this->useCaptcha) {
        //     $rules[] = [['reCAPTCHA'], \himiklab\yii2\recaptcha\ReCaptchaValidator::className(), 'secret' => \Yii::$app->params['secretCaptcha']];
        // }
        return $rules;
    }    


    public function validateName($attribute)
    {
        if($this->nick_name) {
//            var_dump(Yii::$app->user->id); die;
            $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
            $model = Users::find()->where(['nick_name' => $this->nick_name])->one();
            if($model) {
                if ($model->id != $user->id) {
                    $this->addError($attribute, Yii::t('app', 'Зазначене ім\'я вже існує'));
                }
            }
        }
    }

    public function validateDeleted($attribute)
    {
        if($this->deleted_at == 0) {
//            var_dump($this->deleted_at); die;
//            if ($this->deleted_at == 0) {
                $this->addError($attribute, Yii::t('app', 'Необходимо подтвердить удаление аккаунта'));
//            }

        }
    }



    public function attributeLabels()
    {
        $label = [
           
            'deleted_at' => Yii::t('app', 'Deleted At'),

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
            $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
            $user->deleted_at = time();

            $user->save(false);

            $transaction->commit();

            return true;

        } catch (\Exception $e) {
            $transaction->rollBack();
            throw $e;
        }

        return false;
    }

}
