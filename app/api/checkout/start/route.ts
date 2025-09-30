import { NextResponse } from "next/server";

// Test credentials (από το email της epay)
const ACQUIRER_ID = "14";
const MERCHANT_ID = "2145101053";
const POS_ID = "2143820869";
const USER = "TH695378";
const PASSWORD = "AS459632"; // Στην πράξη θα γίνει MD5 hash αν το ζητήσουν

export async function GET(req: Request) {
  // Για αρχή βάζουμε σταθερό ποσό 1,00 €
  const amount = "100"; // λεπτά (100 = 1.00€)
  const currencyCode = "978"; // EUR
  const merchantReference = "TEST-" + Date.now(); // μοναδικό ID

  // 👇 ΕΔΩ κανονικά πρέπει να καλέσεις SOAP IssueNewTicket και να πάρεις TranTicket.
  // Για αρχή βάζουμε dummy ticket ώστε να δεις το redirect flow.
  const tranTicket = "DUMMY-TICKET";

  // Φτιάχνουμε URL για redirect στο pay.aspx
  const payUrl = new URL("https://paycenter.piraeusbank.gr/redirection/pay.aspx");
  payUrl.searchParams.set("AcquirerId", ACQUIRER_ID);
  payUrl.searchParams.set("MerchantId", MERCHANT_ID);
  payUrl.searchParams.set("PosId", POS_ID);
  payUrl.searchParams.set("User", USER);
  payUrl.searchParams.set("Password", PASSWORD);
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
}
