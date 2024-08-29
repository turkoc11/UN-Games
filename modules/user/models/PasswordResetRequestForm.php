<?php
/**
 * Created by PhpStorm.
 * User: rodnoy
 * Date: 07.03.2018
 * Time: 16:46
 */

namespace app\modules\user\models;

use Yii;
use yii\base\Model;
use yii\helpers\Html;

class PasswordResetRequestForm extends Model
{
    public $email;


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [ 'email', 'trim' ],
            [ 'email', 'required' ],
            [ 'email', 'email' ],
            [ 'email', 'exist',
              'targetClass' => \app\modules\main\models\Users::class,
              'filter'      => [ 'status' => 1 ],
              'message'     => Yii::t('app', 'There is no user with this email address.')
            ],
        ];
    }

    /**
     * @return array
     */
    public function attributeLabels()
    {
        return [
            'email' => Yii::t('app', 'E-mail')
        ];
    }


    /**
     * @return bool
     * @throws \yii\base\Exception
     */
    public function sendEmail()
    {
        /* @var $user Users */
        $user = Users::find()->where([
            'status'       => 1,
            'LOWER(email)' => strtolower($this->email),
        ])->one();


        if (!$user) {
            return false;
        }

        if (!Users::isPasswordResetTokenValid($user->password_reset_token)) {
            $user->generatePasswordResetToken();
            $user->save(false);
        }


        //toDo Email for PasswordReset
        return true;
    }
}