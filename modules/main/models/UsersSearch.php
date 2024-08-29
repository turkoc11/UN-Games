<?php

namespace app\modules\main\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Users;

/**
 * UsersSearch represents the model behind the search form of `app\models\Users`.
 */
class UsersSearch extends Users
{

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'status','doctor_id','gender'], 'integer'],
            [['full_name','dateofbirth'], 'safe'],

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
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Users::find();
        $table = Users::tableName();

// add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => ['pageSize' => 100],
        ]);

        $this->load($params);

        if (!$this->validate()) {
// uncomment the following line if you do not want to return any records when validation fails
// $query->where('0=1');
            return $dataProvider;
        }

// grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'status' => $this->status,
            
            'gender' => $this->gender,
            'dateofbirth' => $this->dateofbirth,
            'hidden_user' => false,
        ]);
//        var_dump($this->is_doctor);die();
        // if(isset($this->is_doctor) && $this->is_doctor !== ''){
        //     $query->andFilterWhere([
        //         'is_doctor' => (bool)$this->is_doctor,
        //     ]);
        // }

        $query->andFilterWhere(['ilike', 'full_name', $this->full_name]);

        return $dataProvider;
    }

}
