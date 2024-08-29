<?php

namespace app\models;

use app\components\FilterBehavior;
use Yii;

/**
 * This is the model class for table "message".
 *
 * @property int $id
 * @property string $language
 * @property string $translation
 *
 * @property SourceMessage $sourceMessage
 */
class Message extends \yii\db\ActiveRecord
{

    /**
     * @return string
     */
    public static function tableName()
    {
        return 'message';
    }

    public function behaviors()
    {
        return [
            FilterBehavior::class,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['language'], 'required'],
            [['translation'], 'string'],
            [['language'], 'string', 'max' => 16],
            [['id'], 'exist', 'skipOnError' => true, 'targetClass' => SourceMessage::class, 'targetAttribute' => ['id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app_model', 'ID'),
            'language' => Yii::t('app_model', 'Language'),
            'translation' => Yii::t('app_model', 'Translation'),
        ];
    }

    public function getSourceMessage()
    {
        return $this->hasOne(SourceMessage::class, ['id' => 'id']);
    }

    public function afterSave($insert, $changedAttributes)
    {

        $this->updateCache();

        parent::afterSave($insert, $changedAttributes);
    }

    public function afterDelete()
    {
        $this->updateCache(false);

        parent::afterDelete();
    }

    /**
     * @param bool $set
     */
    public function updateCache($set = true){

        $i18n = Yii::$app->i18n->translations['app*'];

        if (is_array($i18n)) {

            $translation = $this->translation;
            $language = $this->language;

            $source = $this->sourceMessage->message;
            $category = $this->sourceMessage->category;

            $class = $i18n['class'];
            $cache_duration = $i18n['cachingDuration'];
            $enable_cache = $i18n['enableCaching'];

            if ($enable_cache) {

                $key = [$class, $category, $language];
                $messages = Yii::$app->cache->get($key);
                $messages[$source] = $translation;

                Yii::$app->cache->delete($key);
                if ($set) Yii::$app->cache->set($key, $messages, $cache_duration);

            }

        }

    }

}
