<?php

namespace app\modules\user\models;

use yii\base\InvalidParamException;
use yii\base\Model;
use Yii;

class ConfirmEmailForm extends Model
{
    /**
     * @var Users
     */
    private $_user;

    /**
     * Creates a form model given a token.
     *
     * @param  string $token
     * @param  array $config
     * @throws \yii\base\InvalidParamException if token is empty or not valid
     */
    public function __construct($token, $config = [])
    {
        if (empty($token) || !is_string($token)) {
            throw new InvalidParamException('Missing verification code.');
        }

        $this->_user = \app\models\Users::findByEmailConfirmToken($token);

        if (!$this->_user) {
            throw new InvalidParamException('Invalid token.');
        }
        parent::__construct($config);
    }

    /**
     * Resets password.
     *
     * @return boolean if password was reset.
     */
    public function confirmEmail()
    {
        $user = $this->_user;
        $user->status = 1;
        $user->email_verified = 1;
        $user->removeEmailConfirmToken();

        Yii::$app->user->login($user, 0);

        return $user->save(false);
    }
}