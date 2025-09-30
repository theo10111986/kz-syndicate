"use client";

import { useEffect } from "react";

// MD5 password που μας έδωσαν (AS459632)
const PASSWORD_MD5 = "4db1f54e6f0b56080a51d99ec55d9bda";

export default function TestCheckoutPage() {
  useEffect(() => {
    const form = document.getElementById("epay-form") as HTMLFormElement;
    if (form) {
      form.submit(); // κάνει αυτόματα submit όταν μπει στη σελίδα
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Δοκιμαστική Πληρωμή</h1>
      <form
        id="epay-form"
        method="POST"
        action="https://paycenter.piraeusbank.gr/redirection/pay.aspx"
      >
        <input type="hidden" name="AcquirerId" value="14" />
<input type="hidden" name="MerchantId" value="2145101053" />
<input type="hidden" name="PosId" value="2143820869" />
<input type="hidden" name="User" value="TH695378" />
<input type="hidden" name="Password" value="4db1f54e6f0b56080a51d99ec55d9bda" />
<input type="hidden" name="MerchantReference" value="TEST-<μοναδικό νούμερο>" />
<input type="hidden" name="RequestType" value="02" />
<input type="hidden" name="CurrencyCode" value="978" />
<input type="hidden" name="Amount" value="100" />
<input type="hidden" name="Installments" value="0" />
<input type="hidden" name="ParamBackLink" value="https://www.kzsyndicate.com/cart" />
<input type="hidden" name="ParamSuccessURL" value="https://www.kzsyndicate.com/api/checkout/payment/success" />
<input type="hidden" name="ParamFailureURL" value="https://www.kzsyndicate.com/api/checkout/payment/failure" />

        />

        <noscript>
          <button type="submit">Συνέχεια στην πληρωμή</button>
        </noscript>
      </form>
    </div>
  );
}


