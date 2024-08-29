<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_feedback extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%feedback}}',
            [
                'id'            => $this->primaryKey(),
                'email'         => $this->string(255)->null()->defaultValue(''),
                'name'          => $this->string(100)->null()->defaultValue(''),
                'description'   => $this->string(160)->null()->defaultValue(''),                
                'ip'            => $this->string(20)->null()->defaultValue(''),                
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%feedback}}');
    }
}
