<?php
/**
 * Created by PhpStorm.
 * User: vitarr
 * Date: 16.11.18
 * Time: 16:01
 */

namespace app\models;

use Yii;
use yii\db\ActiveQuery;

class SourceMessageQuery extends ActiveQuery
{
    public function notTranslated()
    {
        $messageTableName = Message::tableName();
        $query = Message::find()->joinWith('sourceMessage')->select($messageTableName . '.id')->addSelect('source_message.message');
        $i = 0;
        foreach (Yii::$app->controller->langs as $language) {
            $language = $language->local;
            if ($i === 0) {
                $query->andWhere($messageTableName . '.language = :language and ' . $messageTableName . '.translation is not null and ' . $messageTableName . '.translation != message', [':language' => $language]);
            } else {
                $query->innerJoin($messageTableName . ' t' . $i, 't' . $i . '.id = ' . $messageTableName . '.id and t' . $i . '.language = :language and t' . $i . '.translation is not null and t' . $i . '.translation != message', [':language' => $language]);
            }
            $i++;
        }
        $ids = $query->indexBy('id')->all();
        $this->andWhere(['not in', 'id', array_keys($ids)]);

        return $this;
    }

    public function translated()
    {
        $messageTableName = Message::tableName();
        $query = Message::find()->joinWith('sourceMessage')->select($messageTableName . '.id')->addSelect('source_message.message');
        $i = 0;
        foreach (Yii::$app->controller->langs as $language) {
            $language = $language->local;
            if ($i === 0) {
                $query->andWhere($messageTableName . '.language = :language and ' . $messageTableName . '.translation is not null and ' . $messageTableName . '.translation != message', [':language' => $language]);
            } else {
                $query->innerJoin($messageTableName . ' t' . $i, 't' . $i . '.id = ' . $messageTableName . '.id and t' . $i . '.language = :language and t' . $i . '.translation is not null  and t' . $i . '.translation != message', [':language' => $language]);
            }
            $i++;
        }
        $ids = $query->indexBy('id')->all();
        $this->andWhere(['in', 'id', array_keys($ids)]);

        return $this;
    }
}
