<?php
$user = $this->params['headerContent']['user'];
$transactions = $this->params['headerContent']['transactions'];
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="profile-styles.css">
</head>
<body>
<div class="profile-wrapper">
    <div class="sidebar-profile">
        <div class="sidebar-navigation">
            <a href="" class="sidebar-link">
                <img src="" alt="" class="company-logo-sidebar">
            </a>
            <a href="profile" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Profile information')?></div>
            </a>
            <a href="security" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Security')?></div>
            </a>
            <a href="privacy" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Privacy')?></div>
            </a>
            <a href="transactions" class="sidebar-link">
                <img src="" alt="" class="link-icon">
                <div class="link-text"><?php echo Yii::t('app', 'Transactions history')?></div>
            </a>
        </div>
    </div>

    <div class="profile-main-wrapper">
        <h1 class="profile-head-text">
            <?php echo Yii::t('app', 'Транзакции')?>
        </h1>

        <div class="profile-elems">
            <div class="transactions-head-text">
                <?php echo Yii::t('app', 'Здесь можно ознакомиться с историей транзакций (покупками игр), совершенных в UNgames studios, а так-же с бонусами, которые вы получите за вложенную сумму')?>

            </div>

            <div class="transactions-button-container">
                <div class="transactions-button-table"><?php echo Yii::t('app', 'Транзакции')?></div>
                <div class="transactions-button-bonuses"><?php echo Yii::t('app', 'Бонусы')?></div>
            </div>
            <table class="transactions-table active">
                <tr class="transactions-table-head">
                    <th>Дата</th>
                    <th>Номер транзации</th>
                    <th>Сумма</th>
                </tr>
                <?php if(!empty($transactions)) {?>
                    <?php foreach ($transactions as $transaction) {?>
                <tr class="transactions-table-elem">

                    <td><?php echo date('d.m.Y',$transaction->created_at) ?></td>
                    <td><?php echo $transaction->id ?></td>
                    <td><?php echo $transaction->amount ?></td>
                    <?php }?>
                </tr>
                <?php }?>
            </table>

            <div class="transactions-bonuses-information">
                <div class="bonuses-text"><?php echo Yii::t('app', 'На данный момент ваша сумма вложений составляет')?> <span class="sum-money"><?php echo $user->balance ?>$</span>. <?php echo Yii::t('app', 'На шкале ниже вы можете узнать, сколько осталось до следующей награды')?></div>
                <?php if(!empty($prizes)) {?>
                        <?php if(isset($prizes['nextprize']['percent'])) {?>
                <progress class="progress-bar" max="100" value="<?php echo $prizes['nextprize']['percent']?>"></progress>
                    <?php }?>
                <div class="bonuses-bonus"><?php echo Yii::t('app', 'На данный момент ваша награда')?> <span class="bonus-current"><?php echo $prizes['prize']['name']?></span>. <?php echo Yii::t('app', 'Ваша следующая награда-')?> <span class="bonus-next"><?php echo $prizes['nextprize']['name']?></span></div>
                <?php }?>
            </div>
        </div>
    </div>
</div>
</body>
</html>

<script>
    let buttonTransaction = document.querySelector('.transactions-button-table')
    let buttonBonuses = document.querySelector('.transactions-button-bonuses')
    let transactionsContainer = document.querySelector('.transactions-table')
    let bonusesContainer = document.querySelector('.transactions-bonuses-information')

    buttonTransaction.addEventListener('click',function(){
        transactionsContainer.classList.add('active');
        bonusesContainer.classList.remove('active')
    })
    buttonBonuses.addEventListener('click',function(){
        transactionsContainer.classList.remove('active');
        bonusesContainer.classList.add('active')
    })
</script>
