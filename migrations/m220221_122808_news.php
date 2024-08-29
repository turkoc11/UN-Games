<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_news extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%news}}',
            [
                'id'            => $this->primaryKey(),
                'title'         => $this->string(255)->null()->defaultValue(''),
                'date'          => $this->integer(32)->null()->defaultValue('0'),
                'description'   => $this->string(1600)->null()->defaultValue(''),
                'status'        => $this->string(255)->null()->defaultValue(''),
                'image'         => $this->string(20)->null()->defaultValue(''),
                'type'          => $this->integer(3)->null()->defaultValue('0'),   
                'in_main'       => $this->integer(3)->null()->defaultValue('0'),              
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
                'url'           => $this->string(255)->null()->defaultValue(''),
               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%news}}');
    }
}
