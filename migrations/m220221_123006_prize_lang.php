<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123006_prize_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%prize_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'name'         => $this->string(255)->comment('Title'),
                'description'   => $this->string(2000)->null()->defaultValue(''),
                'language'      => $this->string(255)->comment('Language'),
                'original_id'   => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),              

            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%prize_lang}}');
    }
}
