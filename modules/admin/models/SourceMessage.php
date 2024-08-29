<?php

namespace app\modules\admin\models;

/**
 * This is the extended class class of model [[\app\models\SourceMessage]].
 *
 * @see \app\models\SourceMessage
 *
 * @property Message[] $newMessages
 */
class SourceMessage extends \app\models\SourceMessage
{
    public $newMessages = [];

    public function rules()
    {
        $rules = parent::rules();
        $rules = array_merge($rules, [
            [ [ 'message', 'category' ], 'required' ],
            [ 'newMessages', 'safe' ],
        ]);

        return $rules;
    }

    public function beforeDelete()
    {
        foreach ($this->messages as $message) {
            $message->delete();
        }

        return parent::beforeDelete();
    }

}
