<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122945_dynamic_lang extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%dynamic_lang}}',
            [
                'id'                => $this->primaryKey(),
                'title'             => $this->string(255)->null()->defaultValue('')->comment('Page Title'),
                'sub_title'         => $this->string(255)->null()->defaultValue('')->comment('Page Sub Title'),
                'short_description' => $this->text()->null()->defaultValue('')->comment('Page Preview Description'),
                'description'       => $this->text()->null()->defaultValue('')->comment('Page Description'),
                'meta_title'        => $this->string(255)->null()->defaultValue('')->comment('Meta Title'),
                'meta_description'  => $this->string(1000)->null()->defaultValue('')->comment('Meta Description'),
                'meta_keyword'      => $this->string(255)->null()->defaultValue('')->comment('Meta Keyword'),
                'language'          => $this->string(512)->null()->defaultValue('')->comment('Language'),
                'original_id'       => $this->integer(32)->null()->defaultValue('0')->comment('Original ID'),
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%dynamic_lang}}');
    }
}
