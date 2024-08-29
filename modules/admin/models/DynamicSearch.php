<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\modules\admin\models\Dynamic;

/**
 * DynamicSearch represents the model behind the search form of `app\modules\admin\models\Dynamic`.
 */
class DynamicSearch extends Dynamic
{

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [ [ 'id', 'status', 'in_menu' ], 'integer' ],
            [ [ 'title', 'sub_title', 'url', 'image', 'short_description', 'description', 'template', 'meta_title', 'meta_description', 'meta_keyword' ], 'safe' ],
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
        $query = Dynamic::find();
        $table = Dynamic::tableName();

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
            'id'     => $this->id,
            'status' => $this->status,
        ]);

        $query->andFilterWhere([ 'ilike', 'title', $this->title ])
            ->andFilterWhere([ 'ilike', 'sub_title', $this->sub_title ])
            ->andFilterWhere([ 'ilike', 'url', $this->url ])
            ->andFilterWhere([ 'ilike', 'image', $this->image ])
            ->andFilterWhere([ 'ilike', 'short_description', $this->short_description ])
            ->andFilterWhere([ 'ilike', 'description', $this->description ])
            ->andFilterWhere([ 'ilike', 'template', $this->template ])
            ->andFilterWhere([ 'ilike', 'meta_title', $this->meta_title ])
            ->andFilterWhere([ 'ilike', 'meta_description', $this->meta_description ])
            ->andFilterWhere([ 'ilike', 'meta_keyword', $this->meta_keyword ]);

        return $dataProvider;
    }

}
