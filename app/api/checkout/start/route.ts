import { NextResponse } from "next/server";
import crypto from "crypto";

const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD_PLAIN = "AS459632";

function md5hex(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

export async function GET() {
  const merchantReference = "TEST-" + Date.now();
  const amount = "100";
  const currencyCode = "978";
  const passwordMd5 = md5hex(PASSWORD_PLAIN);

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <IssueNewTicket xmlns="http://www.easypay.gr/redirection">
      <AcquirerId>${ACQUIRER_ID}</AcquirerId>
      <MerchantId>${MERCHANT_ID}</MerchantId>
      <PosId>${POS_ID}</PosId>
      <Username>${USER}</Username>
      <Password>${passwordMd5}</Password>
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
      "SOAPAction": "http://www.easypay.gr/redirection/IssueNewTicket",
    },
    body: xml,
  });

  const text = await res.text();

  return new Response(text, { headers: { "Content-Type": "text/xml" } });
}
