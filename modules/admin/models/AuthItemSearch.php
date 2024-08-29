<?php

namespace app\modules\admin\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;

/**
 * AuthItemSearch represents the model behind the search form of `app\modules\admin\models\AuthItem`.
 */
class AuthItemSearch extends AuthItem
{
    public $permissions;

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [ [ 'name', 'description', 'area', 'section', 'created_at', 'updated_at', 'permissions' ], 'safe' ],
            [ [ 'type', 'created_by', 'updated_by' ], 'integer' ],
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
     * @param array $where
     * @param array $and
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params, $where = [], $and = [])
    {
        $query = AuthItem::find()->where($where)->andWhere($and)->joinWith([ 'children as children' ])->distinct();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query'      => $query,
            'pagination' => [ 'pageSize' => 10 ],
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'auth_item.type'                                                  => $this->type,
            "to_char(date(to_timestamp(auth_item.created_at)), 'dd.mm.yyyy')" => $this->created_at,
            "to_char(date(to_timestamp(auth_item.updated_at)), 'dd.mm.yyyy')" => $this->updated_at,
            'auth_item.created_by'                                            => $this->created_by,
            'auth_item.updated_by'                                            => $this->updated_by,
        ]);

        if (!empty($this->permissions)) {
            $query->andWhere([ 'ilike', 'children.description', $this->permissions ]);
        }

        $query->andFilterWhere([ 'ilike', 'auth_item.name', $this->name ])
            ->andFilterWhere([ 'ilike', 'auth_item.area', $this->area ])
            ->andFilterWhere([ 'ilike', 'auth_item.section', $this->section ])
            ->andFilterWhere([ 'ilike', 'auth_item.description', $this->description ]);

        return $dataProvider;
    }

}
