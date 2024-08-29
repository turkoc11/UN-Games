<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\modules\admin\models\Users;

/**
 * UsersSearch represents the model behind the search form of `app\modules\admin\models\Users`.
 */
class UsersSearch extends Users
{

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [ [ 'id', 'email_verified', 'status', 'gender', 'created_by', 'updated_by' ], 'integer' ],
            [ [ 'email', 'first_name', 'last_name', 'image', 'auth_key', 'nick_name', 'email_confirm_token', 'password_hash', 'password_reset_token', 'phone', 'created_at', 'updated_at' ], 'safe' ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * @param $params
     * @param array $where
     * @return ActiveDataProvider
     * @throws \yii\db\Exception
     */
    public function search($params, $where = [])
    {
        $query = Users::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'totalCount' => (int)$query->count(),            
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_ASC
                ]
            ]
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id'                                                     => $this->id,
            'email_verified'                                         => $this->email_verified,
            'status'                                                 => $this->status,
            'gender'                                                 => $this->gender,
            "to_char(date(to_timestamp(created_at)), 'dd.mm.yyyy')"  => $this->created_at,
            "to_char(date(to_timestamp(updated_at)), 'dd.mm.yyyy')"  => $this->updated_at,          
            'created_by'                                             => $this->created_by,
            'updated_by'                                             => $this->updated_by,           
        ]);

        $query->andFilterWhere([ 'ilike', 'email', $this->email ])
            ->andFilterWhere([ 'ilike', 'first_name', $this->first_name ])
            ->andFilterWhere([ 'ilike', 'nick_name', $this->nick_name ])
            ->andFilterWhere([ 'ilike', 'last_name', $this->last_name ])
            ->andFilterWhere([ 'ilike', 'image', $this->image ])
            ->andFilterWhere([ 'ilike', 'auth_key', $this->auth_key ])
            ->andFilterWhere([ 'ilike', 'email_confirm_token', $this->email_confirm_token ])
            ->andFilterWhere([ 'ilike', 'password_hash', $this->password_hash ])
            ->andFilterWhere([ 'ilike', 'password_reset_token', $this->password_reset_token ])
            ->andFilterWhere([ 'ilike', 'phone', $this->phone ]);

        return $dataProvider;
    }

}
