<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123006_benefits_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%benefits_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'title'         => $this->string(255)->comment('Title'),
                'description'   => $this->string(255)->comment('Description'),
                'language'      => $this->string(255)->comment('Language'),
                'original_id'   => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),              

            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%benefits_lang}}');
    }
}
