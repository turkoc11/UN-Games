<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_123006_meta_tags_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%meta_tags_lang}}',
            [
                'id'            => $this->primaryKey()->comment('ID'),
                'title'         => $this->string(255)->comment('Title'),               
                'description'   => $this->string(2000)->null()->defaultValue(''),  
                'keywords'      => $this->string(255)->null()->defaultValue(''), 
                'og__image'     => $this->string(255)->null()->defaultValue(''),              
                'language'      => $this->string(255)->comment('Language'),
                'original_id'   => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),              

            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%meta_tags_lang}}');
    }
}
