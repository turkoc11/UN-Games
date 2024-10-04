<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\modules\admin\models\UserPrize;

/**
 * NewsSearch represents the model behind the search form about `app\modules\admin\models\News`.
 */
class UserPrizeSearch extends UserPrize
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'created_at', 'updated_at'], 'integer'],
            [['email', 'prize_name'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
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
        $query = UserPrize::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
			'pagination' => [
				'pageSize' => 50,
			],			
			'sort'=> ['defaultOrder' => ['id' => SORT_DESC]]			
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
//            'status' => $this->status,

        ]);

        $query->andFilterWhere(['like', 'prize_name', $this->prize_name])
            ->andFilterWhere(['like', 'email', $this->email]);
//            ->andFilterWhere(['like', 'amount', $this->amount]);

        return $dataProvider;
    }
}
