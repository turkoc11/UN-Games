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

class SetTwoFactorForm extends Model
{
    public $two_factor_code;


    public function rules()
    {
        $rules = [
            [['two_factor_code'], 'required'],
            ['two_factor_code', 'validateCode'],

        ];
        return $rules;
    }    


    public function validateCode($attribute)
    {
        if($this->two_factor_code) {
            $user = Users::find()->where(['two_factor_code' => $this->two_factor_code])->one();
            if(!$user) {
                $this->addError($attribute, Yii::t('app', 'Код подтверждения двухфакторной авторизации не существует'));
            }
        }
    }



    public function attributeLabels()
    {
        $label = [
           
            'two_factor_code' => Yii::t('app', 'Код для подтверждения двухфакторной авторизации'),

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
            $user->is_two_factor = true;
            $user->two_factor_code = null;
            $user->save(false);

            $transaction->commit();

            return true;

        } catch (\Exception $e) {
            $transaction->rollBack();
            throw $e;
        }

    }

}
