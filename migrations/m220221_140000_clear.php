<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_140000_clear extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        \app\components\Sequence::refresh();
        Yii::$app->cache->flush();
    }

    public function safeDown()
    {
        \app\components\Sequence::refresh();
        Yii::$app->cache->flush();
    }
}
