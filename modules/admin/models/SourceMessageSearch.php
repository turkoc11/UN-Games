<?php

namespace app\modules\admin\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;

/**
 * SourceMessageSearch represents the model behind the search form of `app\modules\admin\models\SourceMessage`.
 */
class SourceMessageSearch extends SourceMessage
{

    const STATUS_TRANSLATED = 1;
    const STATUS_NOT_TRANSLATED = 2;

    public $status;

    public $translations;

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [ [ 'id' ], 'integer' ],
            [ 'category', 'safe' ],
            [ 'message', 'safe' ],
            [ 'status', 'safe' ],
            [ 'translations', 'string' ],
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
        $query = SourceMessage::find();
        $table = SourceMessage::tableName();

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

        if ($this->status == static::STATUS_TRANSLATED) {
            $query->translated();
        }
        if ($this->status == static::STATUS_NOT_TRANSLATED) {
            $query->notTranslated();
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id'       => $this->id,
            'category' => $this->category
        ]);

        $query->andFilterWhere([ 'ilike', 'message', $this->message ]);

        if (!empty($this->translations)) {
            $messages = Message::find()->where([ 'ilike', 'translation', $this->translations ])->all();
            $ids = ArrayHelper::getColumn($messages, 'id');
            $query->andWhere([ 'id' => $ids ]);
        }

        return $dataProvider;
    }

    public static function getStatus($id = null)
    {
        $statuses = [
            null                        => Yii::t('app_model', 'All'),
            self::STATUS_TRANSLATED     => Yii::t('app_model', 'Translated'),
            self::STATUS_NOT_TRANSLATED => Yii::t('app_model', 'Not translated'),
        ];
        if ($id !== null) {
            return ArrayHelper::getValue($statuses, $id, null);
        }

        return $statuses;
    }

}
