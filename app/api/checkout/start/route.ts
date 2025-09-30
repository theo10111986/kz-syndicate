import { NextResponse } from "next/server";
import * as crypto from "crypto";

const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

// Στοιχεία TEST ACCOUNT
const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD_PLAIN = "AS459632";

// helper για md5
function md5hex(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

// Διάλεξε σενάριο: "V1" ή "V2"
const SOAP_VERSION: "V1" | "V2" = "V2";

export async function GET() {
  const merchantReference = "TEST-" + Date.now();
  const amount = "100"; // δηλ. 1.00€
  const currencyCode = "978";
  const passwordMd5 = md5hex(PASSWORD_PLAIN);

  // Σενάριο 1 (namespace + SOAPAction όπως redirection)
  const ns1 = "http://piraeusbank.gr/redirection";
  const action1 = "http://piraeusbank.gr/redirection/IssueNewTicket";

  // Σενάριο 2 (namespace + SOAPAction όπως services/tickets)
  const ns2 = "https://paycenter.piraeusbank.gr/services/tickets/";
  const action2 = "https://paycenter.piraeusbank.gr/services/tickets/IssueNewTicket";

  const namespace = SOAP_VERSION === "V1" ? ns1 : ns2;
  const action = SOAP_VERSION === "V1" ? action1 : action2;

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <IssueNewTicket xmlns="${namespace}">
      <Request>
        <AcquirerId>${ACQUIRER_ID}</AcquirerId>
        <MerchantId>${MERCHANT_ID}</MerchantId>
        <PosId>${POS_ID}</PosId>
        <Username>${USER}</Username>
        <Password>${passwordMd5}</Password>
        <RequestType>02</RequestType>
        <CurrencyCode>${currencyCode}</CurrencyCode>
        <MerchantReference>${merchantReference}</MerchantReference>
        <Amount>${amount}</Amount>
        <Installments>0</Installments>
        <ExpirePreauth>0</ExpirePreauth>
        <Bnpl>0</Bnpl>
      </Request>
    </IssueNewTicket>
  </soap:Body>
</soap:Envelope>`;

  const res = await fetch(SOAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": action,
    },
    body: xml,
  });

  const text = await res.text();

  return new Response(text, { headers: { "Content-Type": "text/xml" } });
}


