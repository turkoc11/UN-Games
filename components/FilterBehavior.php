<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\components;

use yii\behaviors\AttributeBehavior;
use yii\db\ActiveRecord;

/**
 * Class FilterBehavior
 * @package app\components
 *
 * @var $filterAttributes array
 */
class FilterBehavior extends AttributeBehavior
{

    public $notFilterAttributes = [];

    /**
     * @inheritdoc
     */
    public function events() {
        return [
            ActiveRecord::EVENT_BEFORE_VALIDATE => 'beforeValidate',
        ];
    }

    /**
     *
     */
    public function beforeValidate() {
        $attributes = $this->owner->attributes;
        foreach ( $attributes as $key => $value ) { //For all model attributes
            if( (strpos( $this->owner->$key, 'id' ) !== false
                || $this->owner->$key != 'id' && $key != 'id')
                && !in_array($key, $this->notFilterAttributes) ) {
//                $this->owner->$key = preg_replace(
//                    array(// Remove invisible content
/*                          '@<head[^>]*?>.*?</head>@siu',*/
/*                          '@<style[^>]*?>.*?</style>@siu',*/
//                          '@<script[^>]*?.*?</script>@siu',
//                          '@<noscript[^>]*?.*?</noscript>@siu',
//                    ),
//                    "", //replace above with nothing
//                    $value );

                $field = $value;
                $filtered_field = '';

                do {
                    $filtered_field = strip_tags($field);
                    $field = strip_tags($filtered_field);
                } while ($filtered_field != $field);

                $this->owner->$key = $field;
            }
        }

    }
}
