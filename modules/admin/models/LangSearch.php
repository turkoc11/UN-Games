<?php

namespace app\modules\admin\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;

/**
 * LangSearch represents the model behind the search form of `app\modules\admin\models\Lang`.
 */
class LangSearch extends Lang
{

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [ [ 'id', 'default' ], 'integer' ],
            [ [ 'flag', 'url', 'local', 'name', 'created_at', 'updated_at', 'code' ], 'safe' ],
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
        $query = Lang::find();
        $table = Lang::tableName();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id'                                                    => $this->id,
            'default'                                               => $this->default,
            "to_char(date(to_timestamp(created_at)), 'dd.mm.yyyy')" => $this->created_at,
            "to_char(date(to_timestamp(updated_at)), 'dd.mm.yyyy')" => $this->updated_at,
        ]);

        $query->andFilterWhere([ 'ilike', 'flag', $this->flag ])
            ->andFilterWhere([ 'ilike', 'url', $this->url ])
            ->andFilterWhere([ 'ilike', 'local', $this->local ])
            ->andFilterWhere([ 'ilike', 'name', $this->name ])
            ->andFilterWhere([ 'ilike', 'code', $this->code ]);

        return $dataProvider;
    }

}
