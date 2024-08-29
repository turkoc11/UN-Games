<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_works extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%works}}',
            [
                'id'            => $this->primaryKey(),
                'title'         => $this->string(255)->null()->defaultValue(''),                
                'status'        => $this->string(255)->null()->defaultValue(''),
                'image'         => $this->string(1000)->null()->defaultValue(''),                
                'description'   => $this->string(2000)->null()->defaultValue(''), 
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),              
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%works}}');
    }
}
