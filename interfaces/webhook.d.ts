export interface IItems {
    uniqueId: string;
    token: string;
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    quantity: number;
    url: string;
    weight: number;
    description: string;
    image: string;
    customFieldsJson: string;
    stackable: boolean;
    maxQuantity: number;
    totalPrice: number;
    totalWeight: number
    shippable: boolean;
    unitPrice: number;
    width: number;
    height: number;
    length: number;
}

export interface IWebHook {
    eventName: string;
    mode: string;
    createdOn: string;
    content: {
        token: string;
        isRecurringOrder: boolean;
        isRecurringV3Order: boolean;
        parentToken: string;
        parentInvoiceNumber: number;
        subscriptionId: string;
        currency: string;
        creationDate: string;
        modificationDate: string;
        status: string;
        billingAddress: {
            fullName: string;
            firstName: string;
            name: string;
            company: string;
            address1: string;
            address2: string;
            fullAddress: string;
            city: string;
            country: string;
            postalCode: string;
            province: string;
            phone: string;
            vatNumber: string;
            hasMinimalRequiredInfo: boolean;
        };

        shippingAddress: {
            fullName: string;
            firstName: string;
            name: string;
            company: string;
            address1: string;
            address2: string;
            fullAddress: string;
            city: string;
            country: string;
            postalCode: string;
            province: string;
            phone: string;
            vatNumber: string;
            hasMinimalRequiredInfo: boolean;
        };
        
        lang: string;
        paymentMethod: string;
        email: string;
        cardHolderName: string;
        billingAddressName: string;
        billingAddressCompanyName: string;
        billingAddressAddress1: string;
        billingAddressAddress2: string;
        billingAddressCity: string;
        billingAddressCountry: string;
        billingAddressProvince: string;
        billingAddressPostalCode: string;
        billingAddressPhone: string;
        shippingAddressName: string;
        shippingAddressCompanyName: string;
        shippingAddressAddress1: string;
        shippingAddressAddress2: string;
        shippingAddressCity: string;
        shippingAddressCountry: string;
        shippingAddressProvince: string;
        shippingAddressPostalCode: string;
        shippingAddressPhone: string;
        shippingAddressSameAsBilling: string;
        finalGrandTotal: number;
        shippingAddressComplete: boolean;
        creditCardLast4Digits: string;
        shippingFees: number;
        shippingMethod: string;
        items: IItems[];
        subtotal: number;
        totalWeight: number;
        discounts: string;
        willBePaidLater: boolean;
    }
}

export interface ICalculateProduct  {
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
}

export interface ICalculate {
    from: {
        postal_code: string;
    };
    to: {
        postal_code: string;
    }
    products: ICalculateProduct[];
}
