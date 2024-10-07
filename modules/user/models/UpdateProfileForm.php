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

class UpdateProfileForm extends Model
{
    public $email;
    public $phone;
//    public $nick_name;
//    public $password;
    public $first_name;
    public $last_name;
    public $gender;
    public $language_id;
    public $dateofbirth;
//    public $passwordConfirm;
//    public $sms_code;
    // public $reCAPTCHA;
    public $useCaptcha = false;
//    public static function tableName()
//    {
//        return 'users';
//    }

    public function rules()
    {
        $rules = [
            [['email',  'phone', 'first_name', 'last_name', 'language_id', 'gender', 'dateofbirth'], 'required'],
//            ['nick_name', 'validateName'],
            [['language_id', 'gender'], 'integer'],
            [['email', 'email'], 'validateEmail'],
            [['phone'], 'validatePhone'],
            ['dateofbirth', 'string'],
//            ['password', 'validatePassword'],
//            ['password', 'string', 'min' => 6],
//            ['passwordConfirm', 'compare', 'compareAttribute' => 'password', 'message' => Yii::t('app', "Не совпадает со значением поля 'Пароль'")],
//            [['first_name'], 'message' => Yii::t('app', "{attribute} is required.")],
//            [['last_name'], 'message' => Yii::t('app', "{attribute} is required.")],
            [['phone'], 'string', 'min' => 11, 'max' => 14],
        ];

        // if (\Yii::$app->params['useCaptcha'] && $this->useCaptcha) {
        //     $rules[] = [['reCAPTCHA'], \himiklab\yii2\recaptcha\ReCaptchaValidator::className(), 'secret' => \Yii::$app->params['secretCaptcha']];
        // }
        return $rules;
    }    

    public function validatePhone($attribute)
    {
        $pattern = '/^\+380\d{9}$/';
        // var_dump(preg_match($pattern, $this->phone));
        // die();
        if (!preg_match($pattern, $this->phone)) {
            $this->addError($attribute, Yii::t( 'app','Номер телефона должен вмещять 11 цифр а перед ними должен стоять "+"'));
        }
        $model = Users::find()->andWhere(['phone' => $this->phone])->exists();
        if ($model) {
            $this->addError($attribute, Yii::t( 'app','Номер телефона уже существует'));
        }
    }

    public function validateCode($attribute)
    {
        if (empty($this->sms_code)) {
            $this->addError($attribute, Yii::t( 'app','Введите SMS код'));
        }else{
            $code = SmsCode::findByNickNameAndCode($this->nick_name, $this->sms_code);
            if($code){
                return true;
            }else{
                $this->addError($attribute, Yii::t( 'app','Ви ввели не верний SMS код'));
            }            
        }
    }

    public function validateName($attribute)
    {
        if($this->nick_name) {
            $user = Users::find()->where(['id' => Yii::$app->user->id])->one();
            $model = Users::find()->andWhere(['nick_name' => $this->nick_name])->one();
            if ($model->id != $user->id ) {
                $this->addError($attribute, Yii::t( 'app','Зазначене ім\'я вже існує'));
            }
        }
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

    public function validatePassword($attribute)
    {
        //без кирилицы
        $pattern = '/[а-я]+/i';
        if (preg_match($pattern, $this->password)) {
            $this->addError($attribute, Yii::t( 'app','У паролі повинні використовуватися символи латинського алфавіту в верхньому (A-Z) або нижньому (a-z) регістрі, цифри, символи “+”, “-”, “=”'));
        }
    }

    public function attributeLabels()
    {
        $label = [
           
            'phone' => Yii::t('app', 'Phone'),
            'first_name' => Yii::t('app', 'First name'),
            'last_name' => Yii::t('app', 'Last name'),
            'email' => Yii::t('app', 'Email'),
//            'nick_name' => Yii::t('app', 'Имя'),
//            'password' => Yii::t('app', 'Пароль'),
            'gender'    => Yii::t('app', 'Gender'),
            'dateofbirth' => Yii::t('app', 'Date of birth'),
            'language_id' => Yii::t('app', 'Language'),
//            'passwordConfirm' => Yii::t('app', 'Полтверждение пароля'),
//            'sms_code' => Yii::t('app', 'Код подтверждения'),
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
            $user->email = $this->email;
            $user->first_name = $this->first_name;
            $user->last_name = $this->last_name;
            $user->phone = $this->phone;
            $user->gender = $this->gender;
            $user->dateofbirth = $this->dateofbirth;
            $user->language_id = $this->language_id;

//            $user->password_hash = \Yii::$app->security->generatePasswordHash($this->password);
////            $user->phone = $this->phone;
//            $user->status = 1; // ToDo another status
//            $user->level = 1;
            $user->save(false);
//            if (!$user->save(false)) return false;
//            (new RbacService())->assign($user->id, 'user');
            $transaction->commit();

            return true;

        } catch (\Exception $e) {
            $transaction->rollBack();
            throw $e;
        }

        return false;
    }

}
