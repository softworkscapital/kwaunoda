// src/PesepayPayment.js

import React, { useState, useEffect } from 'react';
const { Pesepay } = require('pesepay')

const pesepay = new Pesepay("86fd6b75-89ea-41c5-90c5-3561bb46af0b", "be6b7b38e29549d094bf52423c1de4d2");
// pesepay.resultUrl = 'https://example.com/result';
// pesepay.returnUrl = 'https://example.com/return';

const PesepayPayment = () => {
    const [currencies, setCurrencies] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     const fetchCurrencies = async () => {
    //         const response = await fetch('https://api.pesepay.com/api/payments-engine/v1/currencies/active');
    //         const data = await response.json();
    //         setCurrencies(data);
    //         if (data.length > 0) {
    //             setSelectedCurrency(data[0].code); // Select the first currency by default
    //         }
    //     };

    //     fetchCurrencies();
    // }, []);

    // useEffect(() => {
    //     const fetchPaymentMethods = async () => {
    //         if (selectedCurrency) {
    //             const response = await fetch(`https://api.pesepay.com/api/payments-engine/v1/payment-methods/for-currency?currencyCode=${selectedCurrency}`);
    //             const data = await response.json();
    //             setPaymentMethods(data);
    //             if (data.length > 0) {
    //                 setSelectedPaymentMethod(data[0].code); // Select the first payment method by default
    //             }
    //         }
    //     };

    //     fetchPaymentMethods();
    // }, [selectedCurrency]);

    const handlePayment = async (event) => {
        event.preventDefault();
        setMessage('Processing payment...');

        const payment = pesepay.createPayment(selectedCurrency, selectedPaymentMethod, email, phone, name);
        const requiredFields = {}; // Add required fields if necessary

        try {
            const response = await pesepay.makeSeamlessPayment(payment, 'Payment for services', amount, requiredFields);
            if (response.success) {
                const referenceNumber = response.referenceNumber;
                const pollUrl = response.pollUrl;
                setMessage(`Payment successful. Reference Number: ${referenceNumber}`);
                console.log('Poll URL:', pollUrl);
                // Optionally, you can check the payment status here
            } else {
                setMessage(`Payment failed: ${response.message}`);
            }
        } catch (error) {
            console.error('Error during payment:', error);
            setMessage('An error occurred while processing the payment.');
        }
    };

    return (
        <div className="payment-container">
            <h1>Pesepay Payment</h1>
            <form onSubmit={handlePayment}>
                <label>
                    Customer Email (optional):
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Customer Phone Number (optional):
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label>
                    Customer Name (optional):
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Amount:
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </label>
                <label>
                    Select Currency:
                    <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                        {currencies.map(currency => (
                            <option key={currency.id} value={currency.code}>
                                {currency.name} ({currency.code})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Select Payment Method:
                    <select value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                        {paymentMethods.map(method => (
                            <option key={method.code} value={method.code}>
                                {method.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Pay Now</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default PesepayPayment;