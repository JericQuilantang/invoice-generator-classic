import fs from "fs";
import puppeteer from "puppeteer";
import handlebars from "handlebars";

export default async (req, res) => {
  try {
    // Ensure req.body exists and contains the expected data
    const { invoiceNumber } = JSON.parse(req.body || "{}");
    const invoiceNumbers = invoiceNumber || 0;
    const { HeaderItem } = JSON.parse(req.body || "{}");
    const HeaderItems = HeaderItem || "Item";
    const { HeaderQuantity } = JSON.parse(req.body || "{}");
    const HeaderQuantities = HeaderQuantity || "Quantity";
    const { HeaderRate } = JSON.parse(req.body || "{}");
    const HeaderRates = HeaderRate || "Rate";
    const { HeaderAmount } = JSON.parse(req.body || "{}");
    const HeaderAmounts = HeaderAmount || "Amount";
    const { invoiceName } = JSON.parse(req.body || "{}");
    const invoiceNames = invoiceName || "INVOICE";
    const { invoiceFrom } = JSON.parse(req.body || "{}");
    const invoiceFroms = invoiceFrom || "";
    const { billToHeader } = JSON.parse(req.body || "{}");
    const billToHeaders = billToHeader || "Bill To";
    const { billToText } = JSON.parse(req.body || "{}");
    const billToTexts = billToText || "";
    const { shipToHeader } = JSON.parse(req.body || "{}");
    const shipToHeaders = shipToHeader || "Ship To";
    const { shipToText } = JSON.parse(req.body || "{}");
    const shipToTexts = shipToText || "";
    const { inputDate } = JSON.parse(req.body || "{}");
    const inputDates = inputDate || "Date";
    const { formattedDate } = JSON.parse(req.body || "{}");
    const formattedDates = formattedDate || "";
    const { paymentTerms } = JSON.parse(req.body || "{}");
    const paymentTerm = paymentTerms || "Payment Terms";
    const { paymentTermsText } = JSON.parse(req.body || "{}");
    const paymentTermsTexts = paymentTermsText || "";
    const { dueDate } = JSON.parse(req.body || "{}");
    const dueDates = dueDate || "Due Date";
    const { formattedDate2 } = JSON.parse(req.body || "{}");
    const formattedDates2 = formattedDate2 || "";
    const { poNumber } = JSON.parse(req.body || "{}");
    const poNumbers = poNumber || "PO Number";
    const { poNumberText } = JSON.parse(req.body || "{}");
    const poNumberTexts = poNumberText || "";
    const { balanceDue } = JSON.parse(req.body || "{}");
    const balanceDues = balanceDue || "0.00";
    const { balanceDueText } = JSON.parse(req.body || "{}");
    const balanceDueTexts = balanceDueText || "Balance Due";
    const { subtotalText } = JSON.parse(req.body || "{}");
    const subtotalTexts = subtotalText || "Subtotal";
    const { subtotalAmount } = JSON.parse(req.body || "{}");
    const subtotalAmounts = subtotalAmount || "0.00";
    const { discountText } = JSON.parse(req.body || "{}");
    const discountTexts = discountText || "Discount";
    const { discountValue } = JSON.parse(req.body || "{}");
    const discountValues = discountValue || "";
    const { taxText } = JSON.parse(req.body || "{}");
    const taxTexts = taxText || "Tax";
    const { taxValue } = JSON.parse(req.body || "{}");
    const taxValues = taxValue || "";
    const { shippingText } = JSON.parse(req.body || "{}");
    const shippingTexts = shippingText || "Shipping";
    const { shippingValue } = JSON.parse(req.body || "{}");
    const shippingValues = shippingValue || "";
    const { totalText } = JSON.parse(req.body || "{}");
    const totalTexts = totalText || "Total";
    const { totalAmount } = JSON.parse(req.body || "{}");
    const totalAmounts = totalAmount || "0.00";
    const { amtPaidText } = JSON.parse(req.body || "{}");
    const amtPaidTexts = amtPaidText || "Amount Paid";
    const { amtPaidValue } = JSON.parse(req.body || "{}");
    const amtPaidValues = amtPaidValue || "";
    const { note } = JSON.parse(req.body || "{}");
    const notes = note || "";
    const { noteText } = JSON.parse(req.body || "{}");
    const noteTexts = noteText || "Note";
    const { terms } = JSON.parse(req.body || "{}");
    const termss = terms || "";
    const { termsText } = JSON.parse(req.body || "{}");
    const termsTexts = termsText || "Terms";
    const { showDollar } = JSON.parse(req.body || "{}");
    const showDollars = showDollar || false;
    const { showDollar2 } = JSON.parse(req.body || "{}");
    const showDollars2 = showDollar2 || false;
    const { inputs } = JSON.parse(req.body || "{}");
    const inputss = inputs || [];
    const { image } = JSON.parse(req.body || "{}");
    const imageSrc = image || "";
    const { fileName } = JSON.parse(req.body || "{}");
    const fileNames = fileName || "";
    const taxAmount = (subtotalAmounts * taxValues) / 100;
    const discountAmount = (subtotalAmounts * discountValues) / 100;

    // Read the HTML template file
    const file = fs.readFileSync("./invoice-template.html", "utf8");

    // Compile the template with Handlebars
    const template = handlebars.compile(file);
    const html = template({
      invoiceNumbers,
      HeaderItems,
      HeaderQuantities,
      HeaderRates,
      HeaderAmounts,
      invoiceNames,
      invoiceFroms,
      billToHeaders,
      billToTexts,
      shipToHeaders,
      shipToTexts,
      inputDates,
      formattedDates,
      paymentTerm,
      paymentTermsTexts,
      dueDates,
      formattedDates2,
      poNumbers,
      poNumberTexts,
      balanceDues,
      balanceDueTexts,
      subtotalTexts,
      subtotalAmounts,
      discountTexts,
      discountValues,
      taxTexts,
      taxValues,
      shippingTexts,
      shippingValues,
      totalTexts,
      totalAmounts,
      amtPaidTexts,
      amtPaidValues,
      noteTexts,
      notes,
      termss,
      termsTexts,
      showDollars,
      showDollars2,
      inputss: inputss,
      imageSrc,
      fileNames,
      taxAmount,
      discountAmount,
    });

    // Launch Puppeteer and create a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the compiled HTML template as the page's content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF from the page

    const pdf = await page.pdf({ printBackground: true });

    // Close the browser
    await browser.close();

    // Send the PDF back to the client
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (err) {
    // Log the error and send an error response
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
