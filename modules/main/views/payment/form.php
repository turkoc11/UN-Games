<?php
//var_dump($model); die;
//use Yii;
$paymentIntent = $model->paymentIntents->create(
    [
        'amount' => $sum,
        'currency' => 'usd',
        'automatic_payment_methods' => ['enabled' => true],
        'description'   => $product
//        'locale' => 'en'
    ]
)
?>

<body>
    <main>
        <h1>
            Введите информацию о платёжных данных
        </h1>
        <form id="payment-form" lang="en">
            <div id="payment-element">

            </div>
            <button>Pay</button>
            <div id="error-messages"></div>
        </form>
    </main>
<script  src="https://js.stripe.com/v3"></script>
<script>
    const stripe = Stripe('<?=Yii::$app->params['stripe']['publicKey']?>', {})
    const elements = stripe.elements({
        clientSecret: '<?=$paymentIntent->client_secret ?>'
        // locale: 'en'
    })
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')
    const form = document.getElementById('payment-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams:{
                return_url: 'http://ungames.company/payment/create'
            }
        })

        if(error) {
            const messages = document.getElementById('error-messages')
            messages.innerText = error.message;
        }
    })
</script>
</body>


<style>
#payment-form button{
    border-radius: 8px;
    background: #DC7000;
    padding-left: 13.5px;
    padding-right: 13.5px;
    padding-top: 8px;
    padding-bottom: 9px;
    font-size: 13px;
    text-transform: uppercase;
    color: #fff;
    font-weight: 400;
    line-height: 19.5px;
    text-align: center;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 120px;
    margin-top: 20px;
    justify-content: center;
}

h1{
    font-size: 33px;
    font-weight: 600;
    line-height: 59.56px;
    text-align: center;
}

@media (max-width:768px){
    h1{
        font-size: 20px;
        line-height: 28px;
    }
}
</style>