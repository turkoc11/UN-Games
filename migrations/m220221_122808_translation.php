<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_translation extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%translations}}',
            [
                'id'            => $this->primaryKey(),
                'trans_key'     => $this->string(255)->null()->defaultValue(''),
                'val'           => $this->string(255)->null()->defaultValue(''),
                'descr'         => $this->string(2000)->null()->defaultValue(''),                
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
                'url'           => $this->string(255)->null()->defaultValue(''),          
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%translations}}');
    }
}
