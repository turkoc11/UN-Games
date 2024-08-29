<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\modules\admin\models\Feedback;

/**
* FeedbackSearch represents the model behind the search form of `app\modules\admin\models\Feedback`.
*/
class FeedbackSearch extends Feedback{

/**
* {@inheritdoc}
*/
public function rules()
{
    return [
        [['id'], 'integer'],
        [['first_name', 'last_name', 'email', 'description', 'ip', 'created_at', 'updated_at'], 'safe'],
    ];
}

/**
* {@inheritdoc}
*/
public function scenarios()
{
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
    $query = Feedback::find();
    $table = Feedback::tableName();

    // add conditions that should always apply here

    $dataProvider = new ActiveDataProvider([
        'query' => $query,
        'pagination' => ['pageSize' => 50],
    ]);

    $this->load($params);

    if (!$this->validate()) {  
        return $dataProvider;
    }

    // grid filtering conditions
    $query->andFilterWhere([
            'id' => $this->id,
            "to_char(date(to_timestamp(created_at)), 'dd.mm.yyyy')" => $this->created_at,
            "to_char(date(to_timestamp(updated_at)), 'dd.mm.yyyy')" => $this->updated_at,
        ]);

        $query->andFilterWhere(['ilike', 'name', $this->first_name])
            ->andFilterWhere(['ilike', 'email', $this->email])
            ->andFilterWhere(['ilike', 'email', $this->last_name])
            ->andFilterWhere(['ilike', 'description', $this->description])
            ->andFilterWhere(['ilike', 'ip', $this->ip]);
        $query->orderBy('created_at desc');
        return $dataProvider;
    }

}
