import "./App.css";
import "./invoice.css";
import "./pico.min.css";
import "./index.css";

import formObj from "./form.json";
import dioceses from "./dioceses.json";
import * as React from "react";
import { useState } from "react";

const formProps: Record<
  string,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = {
  "Contact Phone": {
    type: "tel",
    required: true,
  },
  "Contact Email": {
    type: "email",
    required: true,
  },
  "Contact Name": {
    required: true,
  },
  Diocese: {
    required: true,
  },
};

const quotas = [
  { price: 200, entries: 10 },
  { price: 400, entries: 20 },
  { price: 700, entries: 30 },
  { price: 1000, entries: 40 },
  { price: 1300, entries: 50 },
  { price: 1600, entries: 60 },
  { price: 3000, entries: 70 },
];

const currencyFormat = new Intl.NumberFormat("us-EN", {
  style: "currency",
  currency: "USD",
});

function Address() {
  return (
    <address>
      <b>National Catholic Forensic League</b>
      <br />
      c/o Greg Cunningham
      <br />
      P.O. Box 133
      <br />
      Hingham, MA 02043
    </address>
  );
}

function App() {
  const [invoice, setInvoice] = useState<{
    diocese: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    invoiceNumber: string;
    quota: string;
  } | null>(null);
  const topForms = formObj.fields;

  async function handleSubmit(data: FormData) {
    const u = new URLSearchParams();
    for (const [k, v] of data) {
      u.set(k, String(v));
    }
    await fetch(
      `https://docs.google.com/forms/d/${formObj.action}/formResponse`,
      {
        method: "POST",
        mode: "no-cors",
        body: u.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    setInvoice({
      diocese: (data.get(`entry.${topForms[0].widgets[0].id}`) as string) ?? "",
      contactName:
        (data.get(`entry.${topForms[1].widgets[0].id}`) as string) ?? "",
      contactPhone:
        (data.get(`entry.${topForms[2].widgets[0].id}`) as string) ?? "",
      contactEmail:
        (data.get(`entry.${topForms[3].widgets[0].id}`) as string) ?? "",
      invoiceNumber:
        (data.get(`entry.${topForms[4].widgets[0].id}`) as string) ?? "",
      quota: (data.get(`entry.${topForms[5].widgets[0].id}`) as string) ?? "",
    });
  }

  if (invoice) {
    return (
      <div className="invoice-box">
        <div>
          <table>
            <tbody>
              <tr className="top">
                <td colSpan={2}>
                  <table>
                    <tbody>
                      <tr>
                        <td className="title">
                          <img
                            src="https://www.ncflnationals.org/uploads/7/3/2/8/7328308/published/ncfl.png"
                            alt="National Catholic Forensic League"
                            style={{ width: "100%", maxWidth: "125px" }}
                          />
                        </td>

                        <td>
                          Invoice: <span>{invoice.invoiceNumber}</span>
                          <br />
                          Created:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "long",
                          }).format(new Date())}
                          <br />
                          Due: <time dateTime="2026-12-20">Dec 20, 2026</time>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr className="information">
                <td colSpan={2}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <Address />
                        </td>
                        <td>
                          <strong>Diocese</strong> {invoice.diocese}
                          <br />
                          <strong>Contact Name:</strong> {invoice.contactName}
                          <br />
                          <strong>Phone</strong> {invoice.contactPhone}
                          <br />
                          <strong>Email Address:</strong> {invoice.contactEmail}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr className="heading">
                <td>Payment Method</td>

                <td>&nbsp;</td>
              </tr>

              <tr className="details">
                <td colSpan={2}>
                  Please make all checks payable to the National Catholic
                  Forensic League.
                </td>
              </tr>

              <tr className="heading">
                <td>Item</td>

                <td>Price</td>
              </tr>
              <tr className="item">
                <td>League Membership: {invoice.quota} entries</td>
                <td>
                  {currencyFormat.format(
                    quotas.find((q) => q.entries === Number(invoice.quota))
                      ?.price ?? 0,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <main className="container">
      <h1>{formObj.title}</h1>
      <form action={handleSubmit}>
        <input type="hidden" name="fvv" value={1} />
        <input type="hidden" name="fbzx" value={formObj.fbzx} />
        <input type="hidden" name="pageHistory" value="0" />
        <p>
          <label>
            {topForms[0].label}
            <input
              name={`entry.${topForms[0].widgets[0].id}`}
              id={`${topForms[0].id}`}
              required={true}
              autoComplete="off"
              list="diocese"
            />
            <datalist id="diocese">
              {dioceses.map((d) => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </datalist>
          </label>
        </p>
        <p key={topForms[1].id}>
          <label>
            {topForms[1].label}{" "}
            <input
              id={`${topForms[1].id}`}
              name={`entry.${topForms[1].widgets[0].id}`}
              {...(formProps[topForms[1].label] ?? {})}
            />
          </label>
        </p>
        <p key={topForms[2].id}>
          <label>
            {topForms[2].label}{" "}
            <input
              id={`${topForms[2].id}`}
              name={`entry.${topForms[2].widgets[0].id}`}
              {...(formProps[topForms[2].label] ?? {})}
            />
          </label>
        </p>
        <p key={topForms[3].id}>
          <label>
            {topForms[3].label}{" "}
            <input
              id={`${topForms[3].id}`}
              name={`entry.${topForms[3].widgets[0].id}`}
              {...(formProps[topForms[3].label] ?? {})}
            />
          </label>
        </p>
        <input
          type="hidden"
          id={`${topForms[4].id}`}
          name={`entry.${topForms[4].widgets[0].id}`}
          value={`INV-${new Date().toISOString().slice(2, 4) + new Date().toISOString().slice(5, 7) + Math.floor(100000 + Math.random() * 900000)}`}
          {...(formProps[topForms[4].label] ?? {})}
        />
        <fieldset>
          <legend>Quota Selection</legend>
          {quotas.map((q, i) => (
            <label key={i}>
              <input
                type="radio"
                name={`entry.${topForms[5].widgets[0].id}`}
                value={q.entries}
                required
              />
              {q.entries} entries for {currencyFormat.format(q.price)} (no more
              than {q.entries / 10} entries per event)
            </label>
          ))}
        </fieldset>
        <div>
          <p>Mail all checks to:</p>
          <Address />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

export default App;
