<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\modules\admin\models\Settings;

/**
 * SettingsSearch represents the model behind the search form of `app\modules\admin\models\Settings`.
 */
class SettingsSearch extends Settings
{

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [ [ 'id', 'maintenance', 'cache' ], 'integer' ],
            [ [ 'title', 'logo', 'copy', 'description', 'keywords', 'head_scripts', 'body_scripts', 'end_scripts' ], 'safe' ],
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
        $query = Settings::find();
        $table = Settings::tableName();

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
            'id'          => $this->id,
            'maintenance' => $this->maintenance,
            'cache'       => $this->cache,
        ]);

        $query->andFilterWhere([ 'ilike', 'title', $this->title ])
            ->andFilterWhere([ 'ilike', 'logo', $this->logo ])
            ->andFilterWhere([ 'ilike', 'copy', $this->copy ])
            ->andFilterWhere([ 'ilike', 'description', $this->description ])
            ->andFilterWhere([ 'ilike', 'keywords', $this->keywords ])
            ->andFilterWhere([ 'ilike', 'head_scripts', $this->head_scripts ])
            ->andFilterWhere([ 'ilike', 'body_scripts', $this->body_scripts ])
            ->andFilterWhere([ 'ilike', 'end_scripts', $this->end_scripts ]);

        return $dataProvider;
    }

}
