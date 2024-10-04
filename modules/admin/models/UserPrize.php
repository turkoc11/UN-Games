<?php

namespace app\modules\admin\models;


use yii\db\Exception;
use yii\db\Query;
use yii\helpers\ArrayHelper;

class UserPrize extends \app\models\UserPrize
{

    public function afterSave($insert, $changedAttributes){

        parent::afterSave($insert, $changedAttributes);

//        if (!isset($this->categories)) {
//            $this->categories = [];
//        }

//        $this->updateNewsCategoryRelations();

//        $this->updateNewsHashtagsRelations();

    }

    public static function getStatuses(){

    }



   

}
