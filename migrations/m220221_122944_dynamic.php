<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122944_dynamic extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%dynamic}}',
            [
                'id'                => $this->primaryKey(),
                'title'             => $this->string(255)->null()->defaultValue('')->comment('Page Title'),
                'sub_title'         => $this->string(255)->null()->defaultValue('')->comment('Page Sub Title'),
                'url'               => $this->string(255)->null()->defaultValue('')->comment('Page Link'),
                'image'             => $this->string(512)->null()->defaultValue('')->comment('Page Image'),
                'short_description' => $this->text()->null()->defaultValue('')->comment('Page Preview Description'),
                'description'       => $this->text()->null()->defaultValue('')->comment('Page Description'),
                'status'            => $this->integer(32)->null()->defaultValue('0')->comment('Visible Status'),
                'template'          => $this->string(255)->null()->defaultValue('')->comment('Page Template'),
                'meta_title'        => $this->string(255)->null()->defaultValue('')->comment('Meta Title'),
                'meta_description'  => $this->string(1000)->null()->defaultValue('')->comment('Meta Description'),
                'meta_keyword'      => $this->string(512)->null()->defaultValue('')->comment('Meta Keyword'),
                'content_image'     => $this->string(1000)->null()->defaultValue('')->comment('Content image'),
                'columns'           => $this->integer()->null()->defaultValue('0'),
                'created_at'        => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'        => $this->integer(32)->null()->defaultValue('0'),
                'created_by'        => $this->integer(32)->null()->defaultValue('0'),
                'updated_by'        => $this->integer(32)->null()->defaultValue('0'),
                'latitude'          => $this->string(255),
                'longitude'         => $this->string(255),
            ]
        );

    }

    public function safeDown()
    {
        $this->dropTable('{{%dynamic}}');
    }
}
