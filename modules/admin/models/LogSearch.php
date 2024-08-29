<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\modules\admin\models\Log;

/**
* FeedbackSearch represents the model behind the search form of `app\modules\admin\models\Feedback`.
*/
class LogSearch extends Log
{

/**
* {@inheritdoc}
*/
public function rules()
{
    return [
        [['id'], 'integer'],
        [['email', 'model_name',  'model_title', 'model_id', 'action', 'created_at', 'updated_at'], 'safe'],
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
    $query = Log::find();
    $table = Log::tableName();



    $dataProvider = new ActiveDataProvider([
        'query' => $query,
        'pagination' => ['pageSize' => 20],
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

        $query->andFilterWhere(['ilike', 'model_name', $this->model_name])
            ->andFilterWhere(['ilike', 'email', $this->email])
            ->andFilterWhere(['ilike', 'model_title', $this->model_title])
            ->andFilterWhere(['ilike', 'action', $this->action]);
        $query->orderBy('created_at desc');
        return $dataProvider;
    }

}
