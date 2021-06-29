import express from 'express';
import { ICalculate, ICalculateProduct, IItems, IWebHook } from '../interfaces/webhook';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get('/', (req, res) => {
  res.send('hello world!');
});

// receive webhook here
app.post("/hook", async (req, res) => {
  const rates: any = [];
  const { content }: IWebHook = req.body;
  const { billingAddressPostalCode, shippingAddressPostalCode, items } = content;
  try {
    const { data } = await sendPostalCodeAndItems(billingAddressPostalCode, shippingAddressPostalCode, items);
    data.forEach((item: any) => {
      if (!item.error) {
        rates.push({ 
          cost: item.price, 
          description: `${item.company.name} - ${item.name.replace('.', '')}`, 
          guaranteedDaysToDelivery: item.delivery_time,
        });
      }
    });
    // response for snipcart
    res.send({ rates });
  }
  catch (err) {
    console.log(err);
  }
});

// send data for melhor envio
const sendPostalCodeAndItems = (billingPostalCode: string, shippingPostalCode: string, items: IItems[]) => {
  console.log({
    billingPostalCode,
    shippingPostalCode
  })
  const token: string | undefined = process.env.TOKEN_MELHOR_ENVIO;
  const products: ICalculateProduct[] = [];
  items.forEach((item) => {
    products.push({
      id: item.id,
      weight: item.weight,
      width: item.width,
      height: item.height,
      length: item.length,
      insurance_value: (item.unitPrice * item.quantity),
      quantity: item.quantity,
    });
  });
  const dataBody: ICalculate = {
    from: {
      postal_code: billingPostalCode,
    },
    to: {
      postal_code: shippingPostalCode
    },
    products,
  };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'User-Agent': process.env.USER_AGENT
  };
  const url_api = process.env.URL_MELHOR_ENVIO;
  return axios.post(`${url_api}/api/v2/me/shipment/calculate`, dataBody, {
    headers,
  });
}

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});