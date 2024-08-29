<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_contacts extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%contacts}}',
            [
                'id'            => $this->primaryKey(),
                'title'         => $this->string(255)->null()->defaultValue(''),                
                'description'   => $this->string(1600)->null()->defaultValue(''),
                'address'       => $this->string(1600)->null()->defaultValue(''),
                'email'         => $this->string(255),
                'phone'         => $this->string(32)->null()->defaultValue(''),
                'fax'           => $this->string(200)->null()->defaultValue(''),
                'linkedin_url'  => $this->string(200)->null()->defaultValue(''),
                'image'         => $this->string(200)->null()->defaultValue(''),
                'moving_to'     => $this->string(255)->null()->defaultValue(''),
                'created_at'    => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'    => $this->integer(32)->null()->defaultValue('0'),
                
               
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%contacts}}');
    }
}
