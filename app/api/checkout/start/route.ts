// app/api/checkout/start/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

// Test credentials (όσα σου έστειλαν)
const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD_PLAIN = "AS459632"; // original password (θα το κάνουμε MD5)

function md5hex(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

export async function GET(req: Request) {
  try {
    const merchantReference = "TEST-" + Date.now(); // μοναδικό για κάθε δοκιμή
    const amount = "100"; // 100 = 1.00 EUR (όπως στο manual)
    const currencyCode = "978"; // EUR

    // Password στο ticketing πρέπει να είναι MD5 (σύμφωνα με manual)
    const passwordMd5 = md5hex(PASSWORD_PLAIN);

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
        "SOAPAction": "http://piraeusbank.gr/redirection/IssueNewTicket",
      },
      body: xml,
    });

    const text = await res.text();

    // Αν θέλεις προσωρινό debug: επιστρέφουμε το XML
    // (αν έχεις επιτυχία, θα περιέχει <ResultCode>0</ResultCode> και <TranTicket>...</TranTicket>)
    if (!res.ok) {
      return new Response(text, { status: 502, headers: { "Content-Type": "text/xml" } });
    }

    // Βγάλε TranTicket από το XML
    const match = text.match(/<TranTicket>(.*?)<\/TranTicket>/);
    const tranTicket = match ? match[1] : "";

    if (!tranTicket) {
      // Επιστρέφουμε το XML για να το δεις — θα περιέχει ResultCode και πιθανή αιτία
      return new Response(text, { status: 200, headers: { "Content-Type": "text/xml" } });
    }

    // Όλα καλά -> κάνουμε redirect στο pay.aspx με το TranTicket
    const payUrl = new URL("https://paycenter.piraeusbank.gr/redirection/pay.aspx");
    payUrl.searchParams.set("AcquirerId", ACQUIRER_ID);
    payUrl.searchParams.set("MerchantId", MERCHANT_ID);
    payUrl.searchParams.set("PosId", POS_ID);
    payUrl.searchParams.set("User", USER);
    payUrl.searchParams.set("Password", passwordMd5); // συνήθως στέλνουν το MD5 εδώ
    payUrl.searchParams.set("LanguageCode", "el-GR");
    payUrl.searchParams.set("MerchantReference", merchantReference);
    payUrl.searchParams.set("ParamBackLink", "https://www.kzsyndicate.com/cart");
    payUrl.searchParams.set("ParamSuccessURL", "https://www.kzsyndicate.com/api/checkout/payment/success");
    payUrl.searchParams.set("ParamFailureURL", "https://www.kzsyndicate.com/api/checkout/payment/failure");
    payUrl.searchParams.set("CurrencyCode", currencyCode);
    payUrl.searchParams.set("Amount", amount);
    payUrl.searchParams.set("TransactionType", "0");
    payUrl.searchParams.set("Installments", "0");
    payUrl.searchParams.set("TranTicket", tranTicket);

    return NextResponse.redirect(payUrl.toString());
  } catch (err: any) {
    // Επιστρέφουμε το error για να το δεις στα logs / browser
    return new Response(String(err?.message || err), { status: 500 });
  }
}
