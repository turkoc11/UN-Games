<?php

namespace app\components\widgets;

use yii\helpers\Html;

/**
 * @inheritdoc
 */
class DataColumn extends \yii\grid\DataColumn
{
    /**
     * @var string
     * additional content for label if sorting was enabled
     */
    public $sortLinkAddOn = '';

    /**
     * {@inheritdoc}
     */
    protected function renderHeaderCellContent()
    {
        if ($this->header !== null || $this->label === null && $this->attribute === null) {
            return parent::renderHeaderCellContent();
        }

        $label = $this->getHeaderCellLabel();
        if ($this->encodeLabel) {
            $label = Html::encode($label);
        }

        if ($this->attribute !== null && $this->enableSorting &&
            ($sort = $this->grid->dataProvider->getSort()) !== false && $sort->hasAttribute($this->attribute)) {
            return $sort->link($this->attribute, array_merge($this->sortLinkOptions, ['label' => $label . $this->sortLinkAddOn]));
        }

        return $label;
    }
}
