<?php

namespace app\modules\admin\models;

class Lang extends \app\models\Lang
{

    static function defaults()
    {
        return [
            null => \Yii::t('app_model', 'All'),
            0    => \Yii::t('app_model', 'No'),
            1    => \Yii::t('app_model', 'Yes'),
        ];
    }

    public function beforeDelete()
    {
        if ($this->default) {
            $this->addError('default', \Yii::t('app_model', 'You can`t delete default language'));

            return false;
        }

        return parent::beforeDelete();
    }

    public function afterDelete()
    {
        $cache = \Yii::$app->cache;

        $cache->delete('langs');

        $langs = Lang::find()->indexBy('url')->all();
        $cache->set('langs', $langs);

        parent::afterDelete();
    }

    public function beforeSave($insert)
    {
        if (!$this->isNewRecord && $this->oldAttributes[ 'default' ] && !$this->default) {
            $this->addError('default', \Yii::t('app_model', 'You can`t disable default language'));

            return false;
        }
        $this->flag = '/images/flags/' . $this->name . '.png';

        return parent::beforeSave($insert);
    }

    public function afterSave($insert, $changedAttributes)
    {
        if ($this->default) {
            Lang::updateAll([ 'default' => 0 ], [ 'AND', [ '!=', 'id', $this->id ], [ '=', 'default', 1 ] ]);
            \Yii::$app->controller->getDefaultLang();
        }

        $cache = \Yii::$app->cache;

        $cache->delete('langs');

        $langs = Lang::find()->indexBy('url')->all();
        $cache->set('langs', $langs);

        parent::afterSave($insert, $changedAttributes);
    }

}
