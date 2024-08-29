<?php

namespace app\models;

use Yii;
use yii\base\InvalidRouteException;
use yii\base\Model;
use app\models\VendorCodes;
use app\models\Shades;
use app\models\Provides;
use app\models\MaterialSubspecies;
use app\models\Compositions;
use app\models\Collections;
use app\models\Products;
use yii\console\ExitCode;

/**
 * Access is the model behind the user access validation.
 */
class ParserExcel extends Model
{
    public function saveData($data)
    {
        $products = new Products();       
        $product = $products->findByCode((int)$data[0][0]);

        if($product)
        {
            $model = self::setProductData($product, $data);
            if($model->validate() && $model->save())
            {
                self::saveRelation($model->id, $data);
            }
                       
        }
        else
        {
            $model = self::setProductData($products, $data);           
            if($model->validate() && $model->save())
            {
                self::saveRelation($model->id, $data);
            }
        }
       
    }

    public static function getCodes($codes)
    {
        $result = array();
        $result['country_code'] = (int)substr($codes, 0, 3);
        $result['provider_code'] = (int)substr($codes, 3, 4);
        $result['collection_code'] = (int)substr($codes, 7, 4);
        $result['material_shade_code'] = (int)substr($codes, 11, 3);
        return $result;
    }

    public static function setProductData($model, $data)
    {
        $codes = self::getCodes(strval($data[0][0]));
        $model->code = (int)$data[0][0];
        $model->country_code = $codes['country_code'];
        $model->provider_code = $codes['provider_code'];
        $model->collection_code = $codes['collection_code'];
        $model->material_shade_code = $codes['material_shade_code'];        
        $model->design = $data[0][7];
        $model->remainder = $data[0][5];
        $model->status = $data[0][8];
        $model->type = $data[0][6];
        $model->balance = $data[0][4];
        $model->weight = $data[0][18];       
        if($data[0][9]){
            $model->easy_cleaning = true;
        }else{
            $model->easy_cleaning = false;
        }
        if($data[0][10]){
            $model->water_resist = true;
        }else{
            $model->water_resist = false;
        }
        if($data[0][11]){
            $model->claw = true;
        }else{
            $model->claw = false;
        }
        if($data[0][12]){
            $model->fr = true;
        }else{
            $model->fr = false;
        }
        if($data[0][13]){
            $model->certificate = true;
        }else{
            $model->certificate = false;
        }       
        $model->martindale_test = (int)$data[0][20];
        $model->color_fastness_test = (int)$data[0][21];
        $model->peel_color_fastness_test = (int)$data[0][22];
        $model->dry_cleaning_test = (int)$data[0][23];
        $model->wet_cleaning_test = (int)$data[0][24];        
        $model->material_stretching_power = (int)$data[0][25];
        $model->binding_stretching_power = (int)$data[0][26];
        $model->material_tear_resistance = (int)$data[0][27];
        $model->binding_tear_resistance = (int)$data[0][28];
        
        if($data[0][29]){
            $model->seat = true;
        }else{
            $model->seat = false;
        }
        if($data[0][30]){
            $model->armrest = true;
        }else{
            $model->armrest = false;
        }
        if($data[0][31]){
            $model->pillow = true;
        }else{
            $model->pillow = false;
        }
        if($model->id){
            $model->updated_at = time();
        }else{
            $model->created_at = time();
        }        
        return $model;
    }

    public function saveRelation($id, $data)
    {
        if($vendorCodes = VendorCodes::findByProductId($id)){
            $vendorCodes->title = $data[0][3];
            if($vendorCodes->validate()){
                $vendorCodes->save();
            }

        }else{
            $vendorCodes = new VendorCodes();
            $vendorCodes->product_id = $id;
            $vendorCodes->title = $data[0][3];
            if($vendorCodes->validate()){
                $vendorCodes->save();
            }
        }

        if($shades = Shades::findByProductId($id)){
            $shades->title = $data[0][2];
            if($shades->validate()){
                $shades->save();
            }

        }else{
            $shades = new Shades();
            $shades->product_id = $id;
            $shades->title = $data[0][2];
            if($shades->validate() ){
                $shades->save();
            }
        }

        if($providers = Provides::findByProductId($id)){
            $providers->title = $data[0][5];
            if($providers->validate()){
                $providers->save();
            }

        }else{
            $providers = new Provides();
            $providers->product_id = $id;
            $providers->title = $data[0][5];
            if($providers->validate() ){
                $providers->save();
            }
        }
        
        if($materialSubspecies = MaterialSubspecies::findByProductId($id)){
            $materialSubspecies->title_en = $data[0][16];
            $materialSubspecies->title_uk = $data[0][15];
            if($materialSubspecies->validate()){
                $materialSubspecies->save();
            }

        }else{
            $materialSubspecies = new MaterialSubspecies();
            $materialSubspecies->product_id = $id;
            $materialSubspecies->title_en = $data[0][16];
            $materialSubspecies->title_uk = $data[0][15];
            if($materialSubspecies->validate() ){
                $materialSubspecies->save();
            }
        }

        if($composition = Compositions::findByProductId($id)){
            $composition->title = $data[0][17];
            if($composition->validate()){
                $composition->save();
            }

        }else{
            $composition = new Compositions();
            $composition->product_id = $id;
            $composition->title = $data[0][17];
            if($composition->validate() ){
                $composition->save();
            }
        }

        if($collections = Collections::findByProductId($id)){
            $collections->title = $data[0][1];
            $codes = self::getCodes(strval($data[0][0]));
            $collections->code = $codes['collection_code'];
            if($collections->validate()){
                $collections->save();
            }

        }else{
            $collections = new Collections();
            $collections->product_id = $id;
            $collections->title = $data[0][1];
            $codes = self::getCodes(strval($data[0][0]));
            $collections->code = $codes['collection_code'];
            if($collections->validate() ){
                $collections->save();
            }
        }
    }



   
}
