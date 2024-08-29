<?php

use yii\db\Schema;
use yii\db\Migration;

class m220221_122808_benefits extends Migration
{
    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->createTable(
            '{{%benefits}}',
            [
                'id'                        => $this->primaryKey(),
                'title'                     => $this->string(255)->null()->defaultValue(''),
                'expertise_title'           => $this->string(255)->null()->defaultValue(''),
                'faq_title'           => $this->string(255)->null()->defaultValue(''),
                'structuring_title'           => $this->string(255)->null()->defaultValue(''),
                'strategic_title'           => $this->string(255)->null()->defaultValue(''),
                'ongoing_title'           => $this->string(255)->null()->defaultValue(''),
                'what_we_do_title'           => $this->string(255)->null()->defaultValue(''),
                'status'                    => $this->string(255)->null()->defaultValue(''),
                'expertise_status'          => $this->string(255)->null()->defaultValue(''),
                'strategic_status'          => $this->string(255)->null()->defaultValue(''),
                'ongoing_status'          => $this->string(255)->null()->defaultValue(''),
                'faq_status'          => $this->string(255)->null()->defaultValue(''),
                'what_we_do_status'          => $this->string(255)->null()->defaultValue(''),
                'structuring_status'          => $this->string(255)->null()->defaultValue(''),
                'description'               => $this->string(1000)->null()->defaultValue(''),
                'image'               => $this->string(1000)->null()->defaultValue(''),
                'ongoing_image'               => $this->string(1000)->null()->defaultValue(''),
                'strategic_image'               => $this->string(1000)->null()->defaultValue(''),
                'expertise_description'     => $this->string(1000)->null()->defaultValue(''),
                'ongoing_description'     => $this->string(1000)->null()->defaultValue(''),
                'strategic_description'     => $this->string(1000)->null()->defaultValue(''),
                'what_we_do_description'     => $this->string(1000)->null()->defaultValue(''),
                'structuring_description'     => $this->string(1000)->null()->defaultValue(''),
                'link'                      => $this->string(1000)->null()->defaultValue(''),
                'position'                  => $this->integer(3)->null()->defaultValue(0),
                'created_at'                => $this->integer(32)->null()->defaultValue('0'),
                'updated_at'                => $this->integer(32)->null()->defaultValue('0'),
                
            ]
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%benefits}}');
    }
}
