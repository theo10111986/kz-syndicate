const SOAP_URL = "https://paycenter.piraeusbank.gr/services/tickets/issuer.asmx";

const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <IssueNewTicket xmlns="https://paycenter.piraeusbank.gr/redirection">
      ...
    </IssueNewTicket>
  </soap:Body>
</soap:Envelope>`;

const res = await fetch(SOAP_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "SOAPAction": "https://paycenter.piraeusbank.gr/redirection/IssueNewTicket",
  },
  body: xml,
});

