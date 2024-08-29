<?php

namespace app\components;

/**
 * Created by PhpStorm.
 * User: bodun
 * Date: 12.11.2018
 * Time: 14:12
 */

use Yii;
use yii\behaviors\AttributeBehavior;
use yii\db\ActiveRecord;

class TimeZoneBehavior extends AttributeBehavior
{
    public $timezone = ['created_at', 'updated_at'];

    public $offset = 7200;

    /**
     * @inheritdoc
     */
    public function events()
    {
        return [
            ActiveRecord::EVENT_AFTER_FIND    => 'afterFind',
            ActiveRecord::EVENT_BEFORE_UPDATE => 'beforeSave',
            ActiveRecord::EVENT_BEFORE_INSERT => 'beforeSave',
        ];
    }

    /**
     * Handle 'afterFind' event of the owner.
     */
    public function afterFind()
    {
        return;

        if (isset(Yii::$app->user) && property_exists(Yii::$app->user, 'isGuest') && !Yii::$app->user->isGuest) {
            $this->offset = Yii::$app->user->identity->timezone;
        }
        $attributes = $this->owner->attributes;

        foreach ($this->timezone as $value) {
            if (isset($attributes[ $value ]) && !empty($attributes[ $value ]) && $attributes[ $value ] != 0) {
                $this->owner->$value = intval($attributes[ $value ] + ($this->offset));
            }
        }
    }

    public function beforeSave()
    {
        return;
        if (isset(Yii::$app->user) && property_exists(Yii::$app->user, 'isGuest') && !Yii::$app->user->isGuest) {
            $this->offset = Yii::$app->user->identity->timezone;
        }
        $attributes = $this->owner->attributes;

        foreach ($this->timezone as $value) {
            if (isset($attributes[ $value ]) && !empty($attributes[ $value ]) && $attributes[ $value ] != 0) {
                $this->owner->$value = intval($attributes[ $value ] - ($this->offset));
            }
        }
    }

}
