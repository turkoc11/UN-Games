<?php
/**
 * Created by PhpStorm.
 * User: rodnoy
 * Date: 07.03.2018
 * Time: 16:50
 */

namespace app\modules\user\models;


use Yii;
use yii\base\Model;
use yii\base\InvalidParamException;

/**
 * Password reset form
 */
class ResetPasswordForm extends Model
{
    public $password;
    public $confirm_password;
    /**
     * @var \app\models\Users
     */
    private $_user;

    /**
     * Creates a form model given a token.
     *
     * @param string $token
     * @param array $config name-value pairs that will be used to initialize the object properties
     * @throws \yii\base\InvalidParamException if token is empty or not valid
     */
    public function __construct($token, $config = [])
    {
        if (empty($token) || !is_string($token)) {
            throw new InvalidParamException('Password reset token cannot be blank.');
        }

        $this->_user = Users::findByPasswordResetToken($token);
        if (!$this->_user) {
            throw new InvalidParamException('Wrong password reset token.');
        }
        parent::__construct($config);
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [ 'password', 'required' ],
            [ 'password', 'string', 'min' => 6 ],
            [
                'confirm_password',
                'compare',
                'compareAttribute' => 'password',
                'skipOnEmpty'      => false,
                'message'          => Yii::t('app', 'Passwords must match'),
            ]
        ];
    }


    /**
     * @return array
     */
    public function attributeLabels()
    {
        return [
            'password'         => Yii::t('app', 'Password'),
            'password_confirm' => Yii::t('app', 'Password Confirm'),
        ];
    }

    /**
     * @return bool
     * @throws \yii\base\Exception
     */
    public function resetPassword()
    {
        $user = $this->_user;
        $user->setPassword($this->password);
        $user->removePasswordResetToken();
        return $user->save(false);
    }
}