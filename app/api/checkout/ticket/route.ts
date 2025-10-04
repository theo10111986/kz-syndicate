// app/api/checkout/ticket/route.ts
import { NextResponse } from "next/server";

const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD = "AS459632"; // Σωστό: η Πειραιώς θέλει το plain password, όχι MD5

export async function GET() {
  const merchantReference = "TEST-" + Date.now();
  const amount = "1.00"; // 1€ για δοκιμή
  const currencyCode = "978"; // EUR

  // ✅ ΠΡΟΣΟΧΗ: το namespace είναι "http://piraeusbank.gr/paycenter/redirection"
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <IssueNewTicket xmlns="http://piraeusbank.gr/paycenter/redirection">
      <Request>
        <Username>${USER}</Username>
        <Password>${PASSWORD}</Password>
        <MerchantId>${MERCHANT_ID}</MerchantId>
        <PosId>${POS_ID}</PosId>
        <AcquirerId>${ACQUIRER_ID}</AcquirerId>
        <MerchantReference>${merchantReference}</MerchantReference>
        <RequestType>02</RequestType>
        <ExpirePreauth>0</ExpirePreauth>
        <Amount>${amount}</Amount>
        <CurrencyCode>${currencyCode}</CurrencyCode>
        <Installments>0</Installments>
        <Bnpl>0</Bnpl>
        <Parameters></Parameters>
        <BillAddrCity>ATHENS</BillAddrCity>
        <BillAddrCountry>GR</BillAddrCountry>
        <CardholderName>KZ Syndicate</CardholderName>
        <Email>info@kzsyndicate.com</Email>
        <RecurringInd>R</RecurringInd>
        <AddressMatch>Y</AddressMatch>
        <DeliveryTimeframe>ElectronicDelivery</DeliveryTimeframe>
        <ReorderItemsInd>FirstTimeOrdered</ReorderItemsInd>
        <PreOrderPurchaseInd>MerchandiseAvailable</PreOrderPurchaseInd>
        <AuthMethod>No3DSRequestorAuthenticationOccurred</AuthMethod>
        <AccountAgeInd>MoreThan60Days</AccountAgeInd>
        <AccountChangeInd>MoreThan60Days</AccountChangeInd>
        <AccountPwdChangeInd>NoChange</AccountPwdChangeInd>
        <ShipAddressUsageInd>MoreThan60Days</ShipAddressUsageInd>
        <SuspiciousAccActivity>NoSuspiciousActivityHasBeenObserved</SuspiciousAccActivity>
      </Request>
    </IssueNewTicket>
  </soap:Body>
</soap:Envelope>`;

  const res = await fetch(SOAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": "http://piraeusbank.gr/paycenter/redirection/IssueNewTicket",
    },
    body: xml,
  });

  const text = await res.text();

  // ⚙️ Ο σωστός κόμβος είναι <TranTicket> όχι <TransTicket>
  const match = text.match(/<TranTicket>(.*?)<\/TranTicket>/);
  const ticket = match ? match[1] : null;

  return NextResponse.json({
    merchantReference,
    ticket,
    raw: text,
  });
}
