// app/api/checkout/start/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

// Test account (βάλε env vars σε production)
const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD_PLAIN = "AS459632";

// Helper: md5 hex
function md5hex(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

// Ενδεχόμενα SOAPAction variants που θα δοκιμάσουμε
const SOAP_ACTION_CANDIDATES = [
  "https://paycenter.piraeusbank.gr/redirection/IssueNewTicket", // από manual namespace
  "https://paycenter.piraeusbank.gr/services/tickets/IssueNewTicket", // πιθανό από error
  "http://piraeusbank.gr/redirection/IssueNewTicket",
];

async function postSoap(xml: string, soapAction: string) {
  const res = await fetch(SOAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: soapAction,
    },
    body: xml,
    // timeout? (Fetch on Node in Vercel will follow platform defaults)
  });
  const text = await res.text();
  return { status: res.status, text };
}

export async function GET() {
  try {
    // Δημιούργησε μοναδικό MerchantReference
    const merchantReference = "TEST-" + Date.now();
    const amount = "100"; // παραδείγματος χάριν = 1.00 EUR (όπως στο manual)
    const currencyCode = "978";
    const passwordMd5 = md5hex(PASSWORD_PLAIN);

    // Το XML σύμφωνα με manual (namespace = https://paycenter.piraeusbank.gr/redirection)
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <IssueNewTicket xmlns="https://paycenter.piraeusbank.gr/redirection">
      <AcquirerId>${ACQUIRER_ID}</AcquirerId>
      <MerchantId>${MERCHANT_ID}</MerchantId>
      <PosId>${POS_ID}</PosId>
      <Username>${USER}</Username>
      <Password>${passwordMd5}</Password>
      <MerchantReference>${merchantReference}</MerchantReference>
      <Amount>${amount}</Amount>
      <CurrencyCode>${currencyCode}</CurrencyCode>
      <Installments>0</Installments>
      <ExpirePreauth>0</ExpirePreauth>
      <Bnpl>0</Bnpl>
      <Parameters>TestParams</Parameters>
    </IssueNewTicket>
  </soap:Body>
</soap:Envelope>`;

    // Δοκιμάζουμε SOAPAction variants μέχρι να πάρουμε λογική απάντηση
    let lastResponse: { status: number; text: string } | null = null;
    for (const action of SOAP_ACTION_CANDIDATES) {
      const resp = await postSoap(xml, action);
      lastResponse = resp;

      // Αν δεν είναι Soap Fault που αφορά SOAPAction -> σπάμε και επιστρέφουμε αποτέλεσμα
      if (!/Server did not recognize the value of HTTP Header SOAPAction/i.test(resp.text)) {
        // Επέστρεψε raw XML ώστε να το δεις στο browser και να πάρεις TranTicket κτλ
        return new NextResponse(resp.text, {
          status: 200,
          headers: { "Content-Type": "text/xml; charset=utf-8" },
        });
      }
      // αλλιώς συνεχίζουμε να δοκιμάζουμε επόμενη τιμή SOAPAction
    }

    // Εάν όλα απέτυχαν, επέστρεψε το τελευταίο fault με οδηγίες
    return new NextResponse(
      `<error>All SOAPAction attempts failed. Last response status=${lastResponse?.status}</error>\n\n${lastResponse?.text}`,
      { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (err: any) {
    return new NextResponse(`Internal error: ${err?.message || String(err)}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}


