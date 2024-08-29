<?php

namespace app\modules\admin\models;

use app\modules\admin\models\Transactions;
use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;


/**
* FeedbackSearch represents the model behind the search form of `app\modules\admin\models\Feedback`.
*/
class TransactionsSearch extends Transactions
{

/**
* {@inheritdoc}
*/
public function rules()
{
    return [
        [['id'], 'integer'],
        [['email', 'game',  'status', 'amount', 'created_at'], 'safe'],
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
    $query = Transactions::find();
    $table = Transactions::tableName();



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
//            "to_char(date(to_timestamp(updated_at)), 'dd.mm.yyyy')" => $this->updated_at,
        ]);

        $query->andFilterWhere(['ilike', 'game', $this->game])
            ->andFilterWhere(['ilike', 'email', $this->email])
            ->andFilterWhere(['ilike', 'status', $this->status])
            ->andFilterWhere(['amount'=> $this->amount]);
        $query->orderBy('created_at desc');
        return $dataProvider;
    }

}
