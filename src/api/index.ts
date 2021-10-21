import {
  VercelRequest,
  VercelResponse
} from '@vercel/node';
import dotenv from 'dotenv';
import axios from 'axios';
import {
  ICalculate,
  IWebHook,
  ICalculateProduct,
  IItems
} from '../interfaces/webhook';

dotenv.config();

// send data for melhor envio
const sendPostalCodeAndItems = async (
  billingPostalCode: string,
  shippingPostalCode: string,
  items: IItems[]
) => {
  // console.log({
  //   billingPostalCode,
  //   shippingPostalCode
  // });
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

  // console.log(dataBody);

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'User-Agent': process.env.USER_AGENT
  };
  const url_api = process.env.URL_MELHOR_ENVIO;
  return await axios.post(`${url_api}/api/v2/me/shipment/calculate`, dataBody, {
    headers,
  });
}

export default async(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
    const rates: any = [];
    const { content }: IWebHook = req.body;
    const { billingAddressPostalCode, shippingAddressPostalCode, items } = content;
    try {
        const { data } = await sendPostalCodeAndItems(
          billingAddressPostalCode,
          shippingAddressPostalCode,
          items
        );
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
        // console.log(err);
        res.send({
          errors: [{
            key: 'error_api_melhor_envio',
            message: 'Erro ao processar na melhor envio'
          }]
        });
    }
};