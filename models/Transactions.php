<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "dynamic".
 *
 * @property int $id
 * @property int $amount
 * @property string $email email
 * @property string $transactionl email
 * @property integer $created_at

 */

class Transactions extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'transactions';
    }

    public function behaviors()
    {
        return [
            FilterBehavior::class,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [[ 'email' , 'status', 'transaction', 'amount', 'game'], 'required'],
            [['id', 'created_at'], 'integer'],
            [['email'], 'email'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),
            'email' =>  Yii::t('app_model', 'Email'),
            'status' =>  Yii::t('app_model', 'Transaction Status'),
            'amount' =>  Yii::t('app_model', 'Amount'),
            'game' =>  Yii::t('app_model', 'Game Title'),
            'created_at' => Yii::t('app_model', 'Created At'),
        ];
    }

    public static function transactionSave($data)
    {
        $model = new Transactions();
        $model->amount  = $data->amount/100;
        $model->email = Yii::$app->user->identity->email;
        $model->status = $data->status;
        $model->transaction = json_encode($data);
        $model->game = $data->description;
        $model->created_at = time();
        $model->save();
    }



}
