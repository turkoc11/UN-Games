<?php

namespace app\modules\user\models;

use Yii;
use yii\base\Model;

/**
 * LoginForm is the model behind the login form.
 */
class LoginForm extends Model
{
    public $nick_name;
    public $password;
    public $email;
    public $rememberMe = '';

    private $_user = false;
    private $user = false;


    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            // email and password are both required
            [ [ 'password' ], 'required' ],
            [ [ 'email' , 'email'], 'required'],
            [ [ 'nick_name' ], 'string', 'max' => 100 ],
            [ 'rememberMe', 'safe' ],
            // password is validated by validatePassword()
            [ 'password', 'validatePassword' ]
        ];
    }

    public function attributeLabels()
    {
        return [
//            'nick_name'    => Yii::t('app', 'Nick name'),
            'email'    => Yii::t('app', 'Email'),
            'password' => Yii::t('app', 'Password'),
        ];
    }

    /**
     * Validates the email and password.
     * This method serves as the inline validation for password.
     */
    public function validatePassword()
    {
        if (!$this->hasErrors()) {
            $user = $this->getUser();
//            var_dump($this->getUser()); die;
            if (!$user || !$user->validatePassword($this->password)) {
                $this->addError('password', Yii::t('app', 'Password is invalid'));
            } elseif ($user && $user->status == 9) {
                $this->addError('email', Yii::t('app', 'Blocked account'));
            } elseif ($user && $user->status == 0) {
                $this->addError('email', Yii::t('app', 'Account is not verified'));
            }
        }
    }

    /**
     * Logs in a user using the provided email and password.
     */
    public function login()
    {
        if ($this->validate()) {
//            var_dump(22222); die;
//            echo'<pre>'; var_dump($this->getUser()); die;
            Yii::$app->user->login($this->getUser(), $this->rememberMe ? 3600 * 24 * 30 : 0);
        }
    }

    /**
     * Finds user by [[email]]
     *
     * @return Users|null
     */
    public function getUser()
    {
        if ($this->_user === false) {
            $this->_user = Users::findByUsername($this->email);
        }

        return $this->_user;
    }

    public function codeLogin()
    {
        if ($this->validate()) {
//            var_dump(22222); die;
//            echo'<pre>'; var_dump($this->getUser()); die;
            Yii::$app->user->login($this->getUser(), $this->rememberMe ? 3600 * 24 * 30 : 0);
        }
    }
}
