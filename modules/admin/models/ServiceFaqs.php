<?php

namespace app\modules\admin\models;


use yii\db\Exception;
use yii\db\Query;
use yii\helpers\ArrayHelper;

class ServiceFaqs extends \app\models\ServiceFaqs
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

    // private function updateNewsCategoryRelations(){

    //     // - get existing category list for news
    //     $categories_existing = ArrayHelper::getColumn(Category::find()
    //         ->leftJoin('news_category', 'news_category.category_id = category.id')
    //         ->where('news_id = :id', [':id' => $this->id])
    //         ->all(), 'id');

    //     // - for inserts category
    //     foreach (array_diff($this->categories, $categories_existing) as $value) {
    //         try {
    //             \Yii::$app->db->createCommand()->insert('news_category', ['news_id' => $this->id, 'category_id' => $value])->execute();
    //         }catch (Exception $e){
    //             $this->addError('category','category insert error');
    //         }
    //     }

    //     // - for delete category
    //     foreach (array_diff($categories_existing, $this->categories) as $value) {
    //         try {
    //             \Yii::$app->db->createCommand()->delete('news_category', ['news_id' => $this->id, 'category_id' => $value])->execute();
    //         }catch (Exception $e){
    //             $this->addError('category','category delete error');
    //         }
    //     }
    // }

    // private function updateNewsHashtagsRelations(){

    //     $hashtags_array = array();

    //     // - get existing hashtags list for news
    //     $hashtag_existing = ArrayHelper::getColumn(Hashtags::find()
    //         ->leftJoin('news_hashtags', 'news_hashtags.hashtag_id = hashtags.id')
    //         ->where('news_id = :id', [':id' => $this->id])
    //         ->all(), 'id');

    //     if ($this->hashtags != '') {
    //         foreach (explode(',', $this->hashtags) as $value) {
    //             $hashtag = Hashtags::findOne(['name' => $value]);
    //             if (!$hashtag) {
    //                 $model = new Hashtags();
    //                 $model->name = $value;
    //                 $model->save();
    //                 $hashtags_array[] = $model->id;
    //             } else {
    //                 $hashtags_array[] = $hashtag->id;
    //             }
    //         }
    //     }

    //     // - for inserts hashtags
    //     foreach (array_diff($hashtags_array, $hashtag_existing) as $value) {
    //         try {
    //             \Yii::$app->db->createCommand()->insert('news_hashtags', ['news_id' => $this->id, 'hashtag_id' => $value])->execute();
    //         }catch (Exception $e){
    //             $this->addError('hashtag','hashtag insert error');
    //         }
    //     }

    //     // - for delete hashtags
    //     foreach (array_diff($hashtag_existing, $hashtags_array) as $value) {
    //         try {
    //             \Yii::$app->db->createCommand()->delete('news_hashtags', ['news_id' => $this->id, 'hashtag_id' => $value])->execute();
    //         }catch (Exception $e){
    //             $this->addError('hashtag','hashtag delete error');
    //         }
    //     }
    // }

    // public function beforeSave($insert)
    // {
    //     if (parent::beforeSave($insert)) {

    //         if(!empty(\Yii::$app->request->post($this->formName())['url'])){
    //             $this->url = \Yii::$app->request->post($this->formName())['url'];
    //         }

    //         return true;
    //     }
    //     return false;
    // }

   

}
