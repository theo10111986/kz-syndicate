// app/api/checkout/start/route.ts
import { NextResponse } from "next/server";
import * as crypto from "crypto";



// --- Στοιχεία test account (βάλε εδώ τα δικά σου ή env variables) ---
const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";
// Εναλλακτικά: "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx"
const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD_PLAIN = "AS459632"; // test password (θα γίνει MD5)

// Helper: md5 hex
function md5hex(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

// Very small xml extractor (simple, for test). Για production χρησιμοποίησε XML parser.
function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    // Δέξου τιμές από body αλλά βάλε defaults για test
    const amount = String(body.amount ?? "100"); // amount σε cents ή σύμφωνα με API; σύμφωνα με manual 100 = 1.00 EUR
    const merchantReference = String(body.merchantReference ?? `TEST-${Date.now()}`);
    const currencyCode = String(body.currencyCode ?? "978"); // EUR
    const requestType = String(body.requestType ?? "02"); // αγορά
    const installments = String(body.installments ?? "0");
    const expirePreauth = String(body.expirePreauth ?? (requestType === "00" ? "30" : "0"));
    const paramBackLink = String(body.paramBackLink ?? "https://www.kzsyndicate.com/cart");
    const paramSuccessURL = String(
      body.paramSuccessURL ?? "https://www.kzsyndicate.com/api/checkout/payment/success"
    );
    const paramFailureURL = String(
      body.paramFailureURL ?? "https://www.kzsyndicate.com/api/checkout/payment/failure"
    );

    const passwordMd5 = md5hex(PASSWORD_PLAIN);

    // XML body για IssueNewTicket (όπως στο manual)
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
      <Installments>${installments}</Installments>
      <TransactionType>${requestType}</TransactionType>
      <ExpirePreauth>${expirePreauth}</ExpirePreauth>
      <Bnpl>0</Bnpl>
      <Parameters></Parameters>
      <ParamBackLink>${paramBackLink}</ParamBackLink>
      <ParamSuccessURL>${paramSuccessURL}</ParamSuccessURL>
      <ParamFailureURL>${paramFailureURL}</ParamFailureURL>
    </IssueNewTicket>
  </soap:Body>
</soap:Envelope>`;

    // --- ΣΗΜΕΙΩΣΗ για SOAPAction:
    // Κάποια endpoints απαιτούν την τιμή με εισαγωγικά. Αν πάρεις fault "did not recognize SOAPAction",
    // δοκίμασε ένα από τα άλλα variants (βλέπε σχόλια στο πάνω μέρος).
    const soapAction = '"https://paycenter.piraeusbank.gr/redirection/IssueNewTicket"';

    const resp = await fetch(SOAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: soapAction,
      },
      body: xml,
    });

    const text = await resp.text();

    if (!resp.ok) {
      // Επιστρέφουμε το raw XML λάθους για debugging
      return NextResponse.json(
        { error: "ticketing_request_failed", status: resp.status, body: text },
        { status: 500 }
      );
    }

    // Εξαγωγή ResultCode / ResultDescription / TranTicket
    const resultCode = extractTag(text, "ResultCode");
    const resultDesc = extractTag(text, "ResultDescription") ?? extractTag(text, "ResultDesc") ?? null;
    const tranTicket = extractTag(text, "TranTicket");
    const timestamp = extractTag(text, "Timestamp");
    const minutesToExpiration = extractTag(text, "MinutesToExpiration");

    // Αν δεν υπάρχει ResultCode, επιστρέφουμε raw response για debugging
    if (!resultCode) {
      return NextResponse.json(
        { error: "no_resultcode_in_response", raw: text },
        { status: 500 }
      );
    }

    if (resultCode !== "0") {
      // τεχνικό πρόβλημα στο ticketing
      return NextResponse.json(
        {
          error: "ticketing_failed",
          resultCode,
          resultDescription: resultDesc,
          raw: text,
        },
        { status: 400 }
      );
    }

    if (!tranTicket) {
      return NextResponse.json(
        { error: "no_tranticket", message: "TranTicket not returned by ticketing", raw: text },
        { status: 500 }
      );
    }

    // --- ΕΠΙΤΥΧΙΑ: Δημιουργούμε form που θα κάνει POST στο pay.aspx
    // Σημείωση: το manual δείχνει το form χωρίς TranTicket. Εφόσον το manual δεν απαιτεί TranTicket στο form,
    // δεν το συμπεριλαμβάνω. Αν χρειαστεί, πρόσθεσέ το.
    const formHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to epay (test)</title>
  </head>
  <body>
    <p>Redirecting to payment page…</p>
    <form id="epay-form" method="POST" action="https://paycenter.piraeusbank.gr/redirection/pay.aspx">
      <input type="hidden" name="AcquirerId" value="${ACQUIRER_ID}" />
      <input type="hidden" name="MerchantId" value="${MERCHANT_ID}" />
      <input type="hidden" name="PosId" value="${POS_ID}" />
      <input type="hidden" name="User" value="${USER}" />
      <input type="hidden" name="LanguageCode" value="${body.languageCode ?? "el-GR"}" />
      <input type="hidden" name="MerchantReference" value="${merchantReference}" />
      <input type="hidden" name="ParamBackLink" value="${paramBackLink}" />
      <!-- Προαιρετικά μπορείτε να στείλετε εδώ και το TranTicket αν το epay το απαιτεί στη δική σας υλοποίηση -->
      <!-- <input type="hidden" name="TranTicket" value="${tranTicket}" /> -->
      <noscript>
        <p>Παρακαλώ πατήστε το κουμπί για να συνεχίσετε.</p>
        <button type="submit">Continue to payment</button>
      </noscript>
    </form>
    <script>
      // auto submit
      document.getElementById('epay-form').submit();
    </script>
  </body>
</html>`;

    // Επιστρέφουμε το auto-posting HTML ώστε να γίνει redirect στον πάροχο
    return new NextResponse(formHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "exception", message: err.message ?? String(err) }, { status: 500 });
  }
}

