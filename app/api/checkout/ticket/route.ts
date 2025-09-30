// app/api/checkout/ticket/route.ts
import { NextResponse } from "next/server";

const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD_MD5 = "4db1f54e6f0b56080a51d99ec55d9bda"; // md5 του AS459632

export async function GET() {
  const merchantReference = "TEST-" + Date.now();
  const amount = "100"; // δηλαδή 1,00 €
  const currencyCode = "978"; // EUR

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <IssueNewTicket xmlns="http://piraeusbank.gr/redirection">
      <AcquirerId>${ACQUIRER_ID}</AcquirerId>
      <MerchantId>${MERCHANT_ID}</MerchantId>
      <PosId>${POS_ID}</PosId>
      <Username>${USER}</Username>
      <Password>${PASSWORD_MD5}</Password>
      <MerchantReference>${merchantReference}</MerchantReference>
      <Amount>${amount}</Amount>
      <CurrencyCode>${currencyCode}</CurrencyCode>
      <Installments>0</Installments>
      <TransactionType>0</TransactionType>
      <ParamBackLink>https://www.kzsyndicate.com/cart</ParamBackLink>
      <ParamSuccessURL>https://www.kzsyndicate.com/api/checkout/payment/success</ParamSuccessURL>
      <ParamFailureURL>https://www.kzsyndicate.com/api/checkout/payment/failure</ParamFailureURL>
    </IssueNewTicket>
  </soap:Body>
</soap:Envelope>`;

  const res = await fetch(SOAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": "IssueNewTicket", // 👶 μόνο αυτό
    },
    body: xml,
  });

  const text = await res.text();

  // Βρίσκουμε το TransTicket από την απάντηση
  const match = text.match(/<TransTicket>(.*?)<\/TransTicket>/);
  const ticket = match ? match[1] : null;

  return NextResponse.json({
    merchantReference,
    ticket,
    raw: text, // όλο το XML για debugging
  });
}


