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

class RegistrationForm extends Model
{
    public $email;
    public $phone;
    public $nick_name;
    public $password;
    public $first_name;
    public $last_name;
    public $gender;
    public $language_id;
    public $dateofbirth;
    public $passwordConfirm;   
    public $sms_code;
    // public $reCAPTCHA;
    public $useCaptcha = false;
//    public static function tableName()
//    {
//        return 'users';
//    }

    public function rules()
    {
        $rules = [
            [['email',  'phone', 'first_name', 'last_name','password', 'passwordConfirm'], 'required'],
            ['nick_name', 'validateName'], 
//            [['sms_code'], 'required', 'message' => Yii::t('app', "SMS код було вiдправлено на ваш номер телефона")],
            [['language_id', 'gender'], 'integer'],
            [['email', 'email'], 'validateEmail'],
//            [['phone'], 'validatePhone'],
            ['dateofbirth', 'string'],
//            ['password', 'validatePassword'],
            ['password', 'string', 'min' => 6],
            ['passwordConfirm', 'compare', 'compareAttribute' => 'password', 'message' => Yii::t('app', "Не совпадает со значением поля 'Пароль'")],
            [['first_name', 'last_name'], 'string', 'max' => 100],
            
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
            $this->addError($attribute, Yii::t( 'app','Введiть SMS код'));
        }else{
            $code = SmsCode::findByNickNameAndCode($this->nick_name, $this->sms_code);
            if($code){
                return true;
            }else{
                $this->addError($attribute, Yii::t( 'app','Ви ввели невiрний SMS код'));
            }            
        }
    }

    public function validateName($attribute)
    {
        if($this->nick_name) {
            $model = Users::find()->andWhere(['nick_name' => $this->nick_name])->exists();
            if ($model) {
                $this->addError($attribute, Yii::t( 'app','Зазначене ім\'я вже існує'));
            }
        }
    }

    public function validateEmail($attribute)
    {
        if($this->email) {
            $model = Users::find()->andWhere(['email' => $this->email])->exists();
            if ($model) {
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
           
            'phone' => Yii::t('app', 'Номер телефона'),
            'first_name' => Yii::t('app', 'Имя'),
            'last_name' => Yii::t('app', 'Фамилия'),
            'email' => Yii::t('app', 'Email'),
            'nick_name' => Yii::t('app', 'Имя'),
            'password' => Yii::t('app', 'Пароль'),
            'gender'    => Yii::t('app', 'Пол'),
            'dateofbirth' => Yii::t('app', 'Дата рождения'),
            'language_id' => Yii::t('app', 'Язык'),
            'passwordConfirm' => Yii::t('app', 'Полтверждение пароля'),
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
//            var_dump($this->password); die;
            $user = new UserRegister();
            $user->email = $this->email;
            $user->first_name = $this->first_name;
            $user->last_name = $this->last_name;
            $user->phone = $this->phone;
            $user->gender = $this->gender;
            $user->dateofbirth = $this->dateofbirth;
            $user->language_id = $this->language_id;

            $user->password_hash = \Yii::$app->security->generatePasswordHash($this->password);
//            $user->phone = $this->phone;
            $user->status = 1; // ToDo another status
            $user->level = 1;
            $user->save(false);
            if (!$user->save(false)) return false;
            (new RbacService())->assign($user->id, 'user');
            $transaction->commit();

            return true;

        } catch (\Exception $e) {
            $transaction->rollBack();
            throw $e;
        }

        return false;
    }

}
