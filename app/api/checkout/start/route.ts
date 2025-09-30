import { NextResponse } from "next/server";

const SOAP_URL = "https://srv.eurobank.gr/redirection/services/tickets/issuer.asmx";

// Τα test στοιχεία που σου έδωσαν
const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD = "AS459632";

export async function GET() {
  const merchantReference = "TEST-" + Date.now(); // μοναδικό ID παραγγελίας
  const amount = "100"; // 100 λεπτά = 1,00€
  const currencyCode = "978"; // EUR

  // XML που ζητάει η τράπεζα
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
        <Password>${PASSWORD}</Password>
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

  // Στείλε το XML στην τράπεζα
  const res = await fetch(SOAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": "http://piraeusbank.gr/redirection/IssueNewTicket"
    },
    body: xml,
  });

  const text = await res.text();

  // Βρες το TranTicket μέσα στο XML
  const match = text.match(/<TranTicket>(.*?)<\/TranTicket>/);
  const tranTicket = match ? match[1] : "";

  if (!tranTicket) {
    // Αν κάτι πήγε στραβά δείξε το XML για έλεγχο
    return NextResponse.json({ error: "Δεν βρέθηκε TranTicket", raw: text });
  }

  // Redirect στο pay.aspx με το σωστό TranTicket
  const payUrl = new URL("https://paycenter.piraeusbank.gr/redirection/pay.aspx");
  payUrl.searchParams.set("AcquirerId", ACQUIRER_ID);
  payUrl.searchParams.set("MerchantId", MERCHANT_ID);
  payUrl.searchParams.set("PosId", POS_ID);
  payUrl.searchParams.set("User", USER);
  payUrl.searchParams.set("Password", PASSWORD);
  payUrl.searchParams.set("MerchantReference", merchantReference);
  payUrl.searchParams.set("Amount", amount);
  payUrl.searchParams.set("CurrencyCode", currencyCode);
  payUrl.searchParams.set("TranTicket", tranTicket);

  return NextResponse.redirect(payUrl.toString());
}

