<?php
/**
 * Created by PhpStorm.
 * User: vitarr
 * Date: 16.11.18
 * Time: 9:46
 */

namespace app\components;

use app\models\SourceMessage;
use yii\i18n\MissingTranslationEvent;

class TranslationEventHandler
{
    /**
     * @param MissingTranslationEvent $event
     */
    public static function handleMissingTranslation(MissingTranslationEvent $event)
    {
        $sourceMessage = null;
        if(\Yii::$app->cache->exists('source-message-'.$event->category.'-'.$event->message)){
            $sourceMessage = \Yii::$app->cache->get('source-message-'.$event->category.'-'.$event->message);
        }

        if(empty($sourceMessage)){
            $sourceMessage = SourceMessage::find()->where('category = :category and message = :message', [
                ':category' => $event->category,
                ':message' => $event->message,
            ])->with('messages')->one();

            \Yii::$app->cache->set('source-message-'.$event->category.'-'.$event->message,$sourceMessage);

        }
        
        if (empty($sourceMessage)) {
            $sourceMessage = new SourceMessage;
            $sourceMessage->setAttributes([
                'category' => $event->category,
                'message' => $event->message,
            ], false);
            $sourceMessage->save(false);
        }

        $sourceMessage->initMessages();
        $sourceMessage->saveMessages();
    }
}
