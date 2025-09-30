"use client";

import { useEffect } from "react";

export default function TestCheckoutPage() {
  useEffect(() => {
    const form = document.getElementById("epay-form") as HTMLFormElement;
    if (form) form.submit();
  }, []);

  return (
    <form
      id="epay-form"
      method="POST"
      action="https://paycenter.piraeusbank.gr/redirection/pay.aspx"
    >
      <input type="hidden" name="AcquirerId" value="14" />
      <input type="hidden" name="MerchantId" value="2145101053" />
      <input type="hidden" name="PosId" value="2143820869" />
      <input type="hidden" name="User" value="TH695378" />
      <input
        type="hidden"
        name="Password"
        value="EBDCFDE8D8E87C40E12BCE06D632C5A0"
      />{" "}
      {/* MD5(AS459632) */}
      <input type="hidden" name="MerchantReference" value={"TEST-" + Date.now()} />
      <input type="hidden" name="RequestType" value="02" />
      <input type="hidden" name="CurrencyCode" value="978" />
      <input type="hidden" name="Amount" value="100" /> {/* 1.00 EUR */}
      <input type="hidden" name="Installments" value="0" />
      <input type="hidden" name="ParamBackLink" value="https://www.kzsyndicate.com/cart" />
      <input type="hidden" name="ParamSuccessURL" value="https://www.kzsyndicate.com/api/checkout/payment/success" />
      <input type="hidden" name="ParamFailureURL" value="https://www.kzsyndicate.com/api/checkout/payment/failure" />
      <noscript>
        <button type="submit">Πληρωμή Test</button>
      </noscript>
    </form>
  );
}
