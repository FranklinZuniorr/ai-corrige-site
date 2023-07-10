import React, { useState } from "react";
import { Button, Grid, GridColumn, Header, Icon, Item, Message } from "semantic-ui-react";
import AiCorrigeApi from "../../services/AiCorrigeApi";
import { toast } from "react-hot-toast";

const Stripe = () => {

    const [isLoadingBtnBuy, setIsLoadingBtnBuy] = useState(false);

    const stripeCheckout = async () => {

        setIsLoadingBtnBuy(true);
        const response = await AiCorrigeApi.stripeCheckout();

        if(!response.r){
            toast.error(response.data.msg);
        };

        toast.success(response.data.msg);
        setIsLoadingBtnBuy(false);
        const checkoutUrl = response.data.res.url;
        window.open(checkoutUrl);
    };

    return(
        <>
            <div className="area-stripe-buy-tickets">
                <div>
                    <Header size="large" icon="ticket" content="+10 Tickets" subheader="R$ 5.00" />
                </div>
                <div>
                    <Button loading={isLoadingBtnBuy} color="green" onClick={() => stripeCheckout()}>
                    Comprar R$ 5.00
                    </Button>
                </div>
            </div>

            <Message color="green" content="Os tickets dão acesso à geração de atividades pela inteligência artificial." />
            <Message color="blue" content="Um ticket dá direito a uma atividade, com R$ 5.00 você adquire 10 tickets = 10 atividades." />
        </>
    );
};

export default Stripe;