<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use app\components\TimeZoneBehavior;
use app\components\UserBehavior;
use yii\web\IdentityInterface;

/**
 * This is the model class for table 'users'.
 *
 * @property int $id
 * @property string $email Email
 * @property string $first_name Name
 * @property string $last_name Last Name
 * @property string $image Photo
 * @property string $auth_key Auth Key
 * @property string $email_confirm_token Email Confirm Token
 * @property string $password_hash Password Hash
 * @property string $password_reset_token Password Reset Token
 * @property string $phone phone
 * @property int $email_verified Is Email Verified
 *
 * @property int $status
 * @property int $level
 * @property int $scope
 *
 * @property int $gender Gender
 * @property int $created_at Created At
 * @property int $updated_at Updated At
 * @property int $blocked_at Blocked At
 * @property int $created_by Created By
 * @property int $updated_by Updated By
 * @property int $approved_by Approved By
 * @property int $blocked_by Blocked By
 * @property string $backup_email [varchar(255)]  Backup Email (optional)
 * @property string $city_id [integer]  City
 * @property mixed $password
 * @property string $authKey
 * @property string $country_id [integer]  Country
 * @property array $permissions
 * @property array $assignments
 */

class Users extends \yii\db\ActiveRecord implements IdentityInterface
{

    public $locale = 'ru';
    public const GENDER_WOMAN              = 1;
    public const GENDER_MAN                = 2;
    public const GENDER_ANOTHER            = 3;
    public const GENDER_EMPTY              = 0;
    /**
     * @var string
     */

    public $password_repeat;
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'users';
    }

    public function behaviors()
    {
        return [
            FilterBehavior::class,
            TimestampBehavior::class,
            [
                'class'    => TimeZoneBehavior::class,
                'timezone' => ['created_at', 'updated_at']
            ],
            UserBehavior::class,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['email'], 'email'],
            [['balance'], 'string'],
            [['email', 'nick_name'], 'unique'],
            [
                [
                    'created_at',
                    'updated_at',
                ],
                'default',
                'value' => null
            ],
            [
                [
                    'email_verified',
                    'status',
                    'gender',
                    'created_by',
                    'updated_by',
                    'level',
                ],
                'default',
                'value' => 0
            ],
            [
                [
                    'email_verified',
                    'status',
                    'gender',
                    'created_by',
                    'updated_by',
                    'level',                    
                    'doctor_discount_limit',
                    'age',
                ],
                'integer'
            ],
            [
                [
                    'created_at',
                    'updated_at',
                    'dateofbirth',
                    'hidden_user',
                    'is_doctor',
                    'is_manager',
                    'fixed_discount',
                    'notes',
                ],
                'safe'
            ],
            [
                [
                    'first_name',
                    'last_name',
                    'image',
                    'auth_key',
                    'email_confirm_token',
                    'password_hash',
                    'password_reset_token',
                    'phone',
                    'personal_code',
                    'telegram_id',
                    'full_name',
                    'nick_name'
                    
                ],
                'string',
                'max' => 255
            ],
            [
                [                    
                    'nick_name',
                    
                ],
                'string',
                'max' => 100
            ],
            [
                [                    
                    'sms_code',
                    
                ],
                'string',
                'max' => 4
            ],
            ['password_repeat', 'compare', 'compareAttribute'=>'password_hash', 'skipOnEmpty' => false, 'message'=>"Passwords don't match" ],

        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id'                   => Yii::t('app_model', 'ID'),
            'email'                => Yii::t('app_model', 'Email'),
            'first_name'           => Yii::t('app_model', 'First Name'),
            'last_name'            => Yii::t('app_model', 'Last Name'),
            'image'                => Yii::t('app_model', 'Photo'),
            'auth_key'             => Yii::t('app_model', 'Auth Key'),
            'email_confirm_token'  => Yii::t('app_model', 'Email Confirm Token'),
            'password_hash'        => Yii::t('app_model', 'Password Hash'),
            'password'        => Yii::t('app_model', 'Password'),
            'password_reset_token' => Yii::t('app_model', 'Password Reset Token'),
            'phone'                => Yii::t('app_model', 'Phone'),
            'email_verified'       => Yii::t('app_model', 'Is Email Verified'),
            'status'               => Yii::t('app_model', 'Status'),
            'level'                => Yii::t('app_model', 'Level'),
            'gender'               => Yii::t('app_model', 'Gender'),
            'created_at'           => Yii::t('app_model', 'Created At'),
            'updated_at'           => Yii::t('app_model', 'Updated At'),
            'created_by'           => Yii::t('app_model', 'Created By'),
            'updated_by'           => Yii::t('app_model', 'Updated By'),
            'approved_by'          => Yii::t('app_model', 'Approved By'),
            'dateofbirth'          => Yii::t('app_model', 'Date of birth'),            
            'personal_code'        => Yii::t('app_model', 'Personal Code'),
            'hidden_user'          => Yii::t('app_model', 'Hidden user'),
            // 'is_doctor'            => Yii::t('app_model', 'Is doctor'),
            'fixed_discount'       => Yii::t('app_model', 'Fixed discount (%)'),
            'full_name'       => Yii::t('app_model', 'Full name'),
            'notes'       => Yii::t('app_model', 'Notes'),
            'doctor_discount_limit'       => Yii::t('app_model', 'Doctor discount limit'),
            'telegram_id'       => Yii::t('app_model', 'Telegram ID'),
            'age'       => Yii::t('app_model', 'Age'),
            'is_manager'       => Yii::t('app_model', 'Is manager'),
            'nick_name'             => Yii::t('app_model', 'Nikc name'),
            'sms_code'             => Yii::t('app_model', 'Sms code'),
            'balance'             => Yii::t('app_model', 'Balance'),
        ];
    }

    //region Users Identity

    /**
     * Finds an identity by the given ID.
     * @param string|int $id the ID to be looked for
     * @return IdentityInterface the identity object that matches the given ID.
     * Null should be returned if such an identity cannot be found
     * or the identity is not in an active state (disabled, deleted, etc.)
     */
    public static function findIdentity($id)
    {
        if(Yii::$app->cache->exists('user-'.$id)){
            $user = Yii::$app->cache->get('user-'.$id);
        } else {
            $user = static::findOne(['id' => $id, 'status' => 1]);
            Yii::$app->cache->set('user-'.$id,$user );
        }
        return $user;
    }

    /**
     * @param mixed $token
     * @param null $type
     * @return void|IdentityInterface
     * @throws NotSupportedException
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        throw new NotSupportedException('findIdentityByAccessToken is not implemented.');
    }

    /**
     * Returns an ID that can uniquely identify a user identity.
     * @return string|int an ID that uniquely identifies a user identity.
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * Returns a key that can be used to check the validity of a given identity ID.
     *
     * The key should be unique for each individual user, and should be persistent
     * so that it can be used to check the validity of the user identity.
     *
     * The space of such keys should be big enough to defeat potential identity attacks.
     *
     * This is required if [[User::enableAutoLogin]] is enabled.
     * @return string a key that is used to check the validity of a given identity ID.
     * @see validateAuthKey()
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * Validates the given auth key.
     *
     * This is required if [[User::enableAutoLogin]] is enabled.
     * @param string $authKey the given auth key
     * @return bool whether the given auth key is valid.
     * @see getAuthKey()
     */
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     *
     * @return boolean if password provided is valid for current user
     */
    public function validatePassword( $password ) {
//        var_dump($password, $this->password_hash); die;
        return Yii::$app->security->validatePassword( $password, $this->password_hash );
    }

    /**
     * @param $password
     *
     * @throws \yii\base\Exception
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates 'remember me' authentication key
     * @throws \yii\base\Exception
     */
    public function generateAuthKey()
    {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }

    /**
     * @param $token
     *
     * @return Users|null
     */
    public static function findByEmailConfirmToken($token)
    {
        return static::findOne(['email_confirm_token' => $token, 'status' => 0 ]);
    }

    /**
     * Generates email confirmation token
     * @throws \yii\base\Exception
     */
    public function generateEmailConfirmToken()
    {
        $this->email_confirm_token = Yii::$app->security->generateRandomString();
    }

    /**
     * Removes email confirmation token
     */
    public function removeEmailConfirmToken()
    {
        $this->email_confirm_token = null;
    }

    /**
     * @param $id
     * @return Users|null
     */
    public static function getUserById($id)
    {
        return static::findOne(['id' => $id]);
    }

    /**
     * Finds user by email
     *
     * @param string $email
     *
     * @return static|null
     */
    public static function findByUsername($nick_name)
    {
//        return static::find()->where(['LOWER(nick_name)' => strtolower($nick_name)])->one();
        return static::find()->where(['email' => $nick_name])->one();
    }

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     *
     * @return static|null
     */
    public static function findByPasswordResetToken($token)
    {
        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }

        return static::findOne([
            'password_reset_token' => $token
        ]);
    }

    /**
     * Finds out if password reset token is valid
     *
     * @param string $token password reset token
     *
     * @return bool
     */
    public static function isPasswordResetTokenValid($token)
    {
        if (empty($token)) {
            return false;
        }
        $timestamp = (int)substr($token, strrpos($token, '_') + 1);
        $expire    = Yii::$app->params[ 'user.passwordResetTokenExpire' ];

        return $timestamp + $expire >= time();
    }

    /**
     * Generates new password reset token
     * @throws \yii\base\Exception
     */
    public function generatePasswordResetToken()
    {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    /**
     * Removes password reset token
     */
    public function removePasswordResetToken()
    {
        $this->password_reset_token = null;
    }

    /**
     * @return array|bool|mixed
     * Get permissions by user
     */
    public function getPermissions() {

        $cache = Yii::$app->cache;
        $sys_cache = Yii::$app->controller->coreSettings->cache;

        if (!$sys_cache) $permissions = false;
        else $permissions = $cache->get('permissions_'.$this->id);

        if ($permissions === false) {
            $auth = Yii::$app->authManager;
            $permissions = ArrayHelper::getColumn($auth->getPermissionsByUser($this->id), 'name');
            $cache->set('permissions_'.$this->id, $permissions);
        }

        return $permissions;
    }

    /**
     * @return array|bool|mixed
     * Get assignments by user
     */
    public function getAssignments() {

        $cache = Yii::$app->cache;
        $sys_cache = Yii::$app->controller->coreSettings->cache;

//        if (!$sys_cache || !$cache->get('assignments_' . $this->id)) $assignments = false;
//        else
//            $assignments = $cache->get('assignments_' . $this->id);
        $assignments = false;
        $auth = Yii::$app->authManager;
//        echo '<pre>'; var_dump($auth->getRolesByUser($this->id)); die();
        if ($assignments === false) {
            $auth = Yii::$app->authManager;
            $assignments = ArrayHelper::getColumn($auth->getRolesByUser($this->id), 'name');
            $cache->set('assignments_'.$this->id, $assignments);
        }

        return $assignments;
    }

    //endregion

    //region Getters

    /**
     * @return string
     */
//    public function getFullName(): string
//    {
//        return $this->first_name . ' ' . $this->last_name;
//    }

    /**
     * @return string
     */
    public function getAvatar(): string
    {
        if (!empty($this->image) && file_exists($_SERVER[ 'DOCUMENT_ROOT' ] . '/web' . $this->image)) {
            return $this->image;
        }

        return '/images/default.jpeg';
    }

    //endregion

    static function levels()
    {
        return [            
            1 => \Yii::t('app_model', 'Super admin'),            
        ];
    }

    public function beforeSave($insert)
    {
//        if(!$this->personal_code){
//            $this->personal_code = Yii::$app->controller->generateRandomString(16);
//        }
        $this->full_name = $this->first_name . ' ' . $this->last_name;
//        $this->nick_name = $this->first_name;
        $this->dateofbirth = ($this->dateofbirth)?date('Y-m-d', strtotime(str_replace('/', '-', $this->dateofbirth))):'';
        $this->hidden_user = ($this->hidden_user)?:false;

        $this->age = date_diff(date_create($this->dateofbirth), date_create())->y;

//        $this->password_hash = ($this->password_hash)?:Yii::$app->getSecurity()->generatePasswordHash($this->password);
//        if(!empty($this->password_hash)){
////            var_dump($this->password); die;
//            $this->password_hash =  Yii::$app->getSecurity()->generatePasswordHash($this->password_hash);
//        }else{
//            $this->password_hash = $this->getOldAttribute('password_hash');
//        }
        return parent::beforeSave($insert); // TODO: Change the autogenerated stub
    }
/*
    public function afterSave($insert, $changedAttributes)
    {
        parent::afterSave($insert, $changedAttributes); // TODO: Change the autogenerated stub
    }
*/
    public static function listUsers($is_doctor = false, $is_manager = false){

        if($is_doctor && $is_manager){
            $users = ArrayHelper::map(Users::find()
                ->where(['status' => 1, 'hidden_user' => 'false'])
                ->andFilterWhere(['or', ['is_manager' => 'true'], ['is_doctor' => 'true']])
                ->orderBy('full_name')->all(), 'id', 'full_name');
        }elseif($is_doctor){
            $users = ArrayHelper::map(Users::find()->where(['status' => 1, 'is_doctor' => 'true', 'hidden_user' => 'false'])->orderBy('full_name')->all(), 'id', 'full_name');
        }elseif($is_manager) {
            $users = ArrayHelper::map(Users::find()->where(['status' => 1, 'is_manager' => 'true', 'hidden_user' => 'false'])->orderBy('full_name')->all(), 'id', 'full_name');
        }else{
            $users = ArrayHelper::map(Users::find()->where(['status' => 1, 'hidden_user' => 'false'])->orderBy('full_name')->all(), 'id', 'full_name');
        }

        return $users;
    }

    public static function getUserRole($roles)
    {
        $role = null;
        array_key_exists("developer", $roles )? $role = "developer" : '';
        array_key_exists("admin", $roles )? $role = "admin" : '';
        array_key_exists("staff_in", $roles )? $role = "staff_in" : '';
        array_key_exists("staff_ext", $roles) ? $role = "staff_ext" : '';
        array_key_exists("doctor", $roles) ? $role = "doctor": '';
        array_key_exists("user", $roles) ? $role = "user": '';
        
        return $role;
    }

    public function setPasswordHash($password)
    {
        $this->password = Yii::$app->security->generatePasswordHash($password);
    }

    public static function genderList(): array
    {
        return [
            self::GENDER_WOMAN              => Yii::t('app_model', 'Woman'),
            self::GENDER_MAN                => Yii::t('app_model', 'Man'),
//            self::GENDER_ANOTHER            => Yii::t('app_model', 'Child'),
//            self::GENDER_EMPTY              => Yii::t('app_model', 'Empty'),
        ];
    }

}



