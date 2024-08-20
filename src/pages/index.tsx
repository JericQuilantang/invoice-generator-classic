import { Inter } from "next/font/google";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Repeat,
  DollarSign,
  MessageSquareText,
  X,
  DownloadIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { fi } from "date-fns/locale";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputs, setInputs] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const addInput = () => {
    const newInput = {
      id: inputs.length + 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setInputs([...inputs, newInput]);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newInputs = [...inputs];
    newInputs[index].quantity = value;
    newInputs[index].amount = value * newInputs[index].rate;
    setInputs(newInputs);
  };

  const handleRateChange = (index: number, value: number) => {
    const newInputs = [...inputs];
    newInputs[index].rate = value;
    newInputs[index].amount = value * newInputs[index].quantity;
    setInputs(newInputs);
  };

  // Calculate subtotal and total amounts

  const [HeaderItem, setHeaderItems] = useState("Item");
  const [HeaderQuantity, setHeaderQuantity] = useState("Quantity");
  const [HeaderRate, setHeaderRate] = useState("Rate");
  const [HeaderAmount, setHeaderAmount] = useState("Amount");
  const [discount, setDiscount] = useState(true);
  const [tax, setTax] = useState(false);
  const [shipping, setShipping] = useState(true);
  const handleShippingChange = () => {
    setShipping(!shipping);
  };
  const handleTaxChange = () => {
    setTax(!tax);
  };
  const handleDiscountChange = () => {
    setDiscount(!discount);
  };

  const [discountValue, setDiscountValue] = useState(0);
  const [taxValue, setTaxValue] = useState(0);
  const [shippingValue, setShippingValue] = useState(0);
  const [amtPaidValue, setAmtPaidValue] = useState(0);

  const [showDollar, setShowDollar] = useState(false);

  const [showDollar2, setShowDollar2] = useState(false);

  const handleRepeatClick = () => {
    setShowDollar(!showDollar);
  };
  const handleRepeatClick2 = () => {
    setShowDollar2(!showDollar2);
  };
  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotalAmount, setsubTotalAmount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);

  const calculateTotal = useCallback(() => {
    const subtotal = inputs.reduce((acc, current) => acc + current.amount, 0);
    let total = subtotal;

    // Apply discount if enabled
    if (discountValue > 0) {
      total -= showDollar ? discountValue : subtotal * (discountValue / 100);
    }

    // Apply tax if enabled
    if (taxValue > 0) {
      total += showDollar2 ? taxValue : subtotal * (taxValue / 100);
    }

    // Apply shipping if enabled
    if (shippingValue > 0) {
      total += shippingValue;
    }

    // Apply amount paid
    setsubTotalAmount(subtotal);
    setTotalAmount(total);

    let balance = total - amtPaidValue;
    setBalanceDue(balance);
  }, [
    inputs,
    discountValue,
    taxValue,
    shippingValue,
    amtPaidValue,
    showDollar,
    showDollar2,
  ]);

  useEffect(() => {
    calculateTotal();
  }, [
    calculateTotal, // Now included
    inputs,
    discount,
    tax,
    shipping,
    discountValue,
    taxValue,
    shippingValue,
    amtPaidValue,
    showDollar,
    showDollar2,
  ]);

  const [date, setDate] = useState<Date>();
  const [date2, setDate2] = useState<Date>();

  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");
  const handleImageChange = () => {
    setImage("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // get values for each input
  const [invoiceNumber, setInvoiceNumber] = useState(0);
  const [invoiceName, setInvoiceName] = useState("INVOICE");
  const [invoiceFrom, setInvoiceFrom] = useState("");
  const [billToHeader, setBillToHeader] = useState("Bill To");
  const [billToText, setBillToText] = useState("");
  const [shipToHeader, setShipToHeader] = useState("Ship To");
  const [shipToText, setShipToText] = useState("");
  const [inputDate, setInputDate] = useState("Date");
  const formattedDate = date ? format(date, "PPP") : "";
  const [paymentTerms, setPaymentTerms] = useState("Payment Terms");
  const [paymentTermsText, setPaymentTermsText] = useState("");
  const [dueDate, setDueDate] = useState("Due Date");
  const formattedDate2 = date2 ? format(date2, "PPP") : "";
  const [poNumber, setPoNumber] = useState("PO Number");
  const [poNumberText, setPoNumberText] = useState("");
  const [balanceDueText, setBalanceDueText] = useState("Balance Due");
  const [subtotalText, setSubtotalText] = useState("Subtotal");
  const [discountText, setDiscountText] = useState("Discount");
  const [taxText, setTaxText] = useState("Tax");
  const [shippingText, setShippingText] = useState("Shipping");
  const [totalText, setTotalText] = useState("Total");
  const [amtPaidText, setAmtPaidText] = useState("Amount Paid");
  const [note, setNote] = useState("");
  const [noteText, setNoteText] = useState("Notes");
  const [terms, setTerms] = useState("");
  const [termsText, setTermsText] = useState("Terms and Conditions");

  // container function to generate the Invoice
  const generateInvoice = (e: { preventDefault: () => void }) => {
    // Check if the textareas are empty
    if (invoiceFrom.trim() === "" || billToText.trim() === "") {
      alert("Please fill in the required fields before generating the invoice");
      return;
    }
    e.preventDefault();
    // send a post request with the name to our API endpoint
    const fetchData = async () => {
      const data = await fetch("/api/generate-invoice", {
        method: "POST",
        body: JSON.stringify({
          invoiceNumber,
          HeaderItem,
          HeaderQuantity,
          HeaderRate,
          HeaderAmount,
          invoiceName,
          invoiceFrom,
          billToHeader,
          billToText,
          shipToHeader,
          shipToText,
          inputDate,
          formattedDate,
          paymentTerms,
          paymentTermsText,
          dueDate,
          formattedDate2,
          poNumber,
          poNumberText,
          balanceDue,
          balanceDueText,
          subtotalText,
          subtotalAmount,
          discountText,
          discountValue,
          taxText,
          taxValue,
          shippingText,
          shippingValue,
          totalText,
          totalAmount,
          amtPaidText,
          amtPaidValue,
          note,
          noteText,
          terms,
          termsText,
          showDollar,
          showDollar2,
          inputs,
          image,
          fileName,
        }),
      });
      // convert the response into an array Buffer
      return data.arrayBuffer();
    };

    // convert the buffer into an object URL
    const saveAsPDF = async () => {
      const buffer = await fetchData();
      const blob = new Blob([buffer], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoice #" + invoiceNumber + ".pdf";
      link.click();
    };

    saveAsPDF();
  };
  return (
    <main className=" bg-white my-10 sm:max-md:my-2 rounded-sm border-[#E5E5E5] border-[1px] border-r-[#E5E5E5] border-r-[3px] border-b-[#E5E5E5] border-b-[3px] w-full">
      <section id="top" className=" ">
        <div className="w-[100%] h-auto p-5 ">
          <div className="lg:flex lg:justify-between lg:px-3 md:max-lg:flex md:max-lg:flex-row-reverse md:max-lg:justify-between md:max-lg:gap-10 sm:max-md:flex sm:max-md:flex-col sm:max-md:gap-10">
            <div className="h-full sm:max-md:w-full sm:max-md:flex-2 ">
              <div className="flex flex-col gap-4 sm:max-md:gap-3 ">
                <div className=" flex gap-2 items-center h-36 w-52 text-gray-400 font-light text-xl hover:text-gray-500 sm:max-md:h-16">
                  {image ? (
                    <div className=" w-[80%] h-full  relative overflow-hidden">
                      <Image
                        src={image}
                        alt={fileName}
                        className="h-full w-full object-cover rounded-sm "
                        width={100}
                        height={100}
                      />
                      <Button
                        size={"sm"}
                        className="absolute top-1 left-1 h-5 w-5 p-0 text-center bg-[#3a3a3a] hover:bg-[#009E74] hover:text-white rounded-sm"
                        onClick={handleImageChange}
                      >
                        <X className="h-[14px] w-full" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => inputRef.current?.click()}
                      className="h-[100%] w-[100%] flex justify-center items-center hover:cursor-pointer bg-[#fafafa] border border-input hover:bg-[#f6f6f6]"
                    >
                      <div>+ Add Your Logo</div>
                    </div>
                  )}
                </div>

                <Input
                  type="file"
                  ref={inputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={({ target: { files } }) => {
                    if (files && files[0]) {
                      const fr = new FileReader();
                      fr.onload = () => {
                        const img = new window.Image();
                        img.onload = () => {
                          const MAX_HEIGHT = 720;
                          let width = img.width;
                          let height = img.height;
                          let ratio = 1;

                          if (height > MAX_HEIGHT) {
                            ratio = MAX_HEIGHT / height;
                            width = Math.floor(width * ratio);
                            height = MAX_HEIGHT;
                          }

                          const canvas = document.createElement("canvas");
                          canvas.width = width;
                          canvas.height = height;

                          const ctx = canvas.getContext("2d");

                          if (!ctx) {
                            console.error("Canvas context is not supported");
                            return;
                          }

                          ctx.drawImage(img, 0, 0, width, height);

                          const compressedImageData = canvas.toDataURL(
                            "image/jpeg",
                            0.7
                          );
                          setImage(compressedImageData);
                          setFileName(files[0].name);
                        };

                        img.src = fr.result as string;
                      };

                      fr.readAsDataURL(files[0] as File); // Read file as data URL
                    }
                  }}
                />

                <div className="hidden gap-2 sm:max-md:flex sm:max-md:flex-col">
                  <div className="flex justify-end md:max-lg:justify-start sm:max-md:justify-start">
                    <Input
                      defaultValue="INVOICE"
                      value={invoiceName}
                      onChange={(e) => setInvoiceName(e.target.value)}
                      className=" capitalize text-right text-5xl h-auto max-w-[60%] min-w-auto border-none hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] focus-visible:cursor-text sm:max-md:text-left sm:max-md:p-1"
                    />
                  </div>
                  <div className="flex justify-end sm:max-md:justify-start">
                    <div className="flex">
                      <div className="relative w-full flex justify-end">
                        <p className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                          #
                        </p>
                        <Input
                          id="invoiceNumber"
                          type="number"
                          value={invoiceNumber}
                          onChange={(e) =>
                            setInvoiceNumber(parseInt(e.target.value) || 0)
                          }
                          className="w-auto pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Textarea
                  placeholder="Who is this invoice from? (required)"
                  value={invoiceFrom}
                  onChange={(e) => setInvoiceFrom(e.target.value)}
                  className=" w-full"
                  required
                />
                <div className="flex gap-6 w-full sm:max-md:flex-wrap sm:max-md:gap-3 ">
                  <div className="grid w-full gap-1">
                    <Input
                      defaultValue={"Bill To"}
                      value={billToHeader}
                      onChange={(e) => setBillToHeader(e.target.value)}
                      className="border-none text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                    />
                    <Textarea
                      placeholder="Who is this invoice to? (required)"
                      value={billToText}
                      onChange={(e) => setBillToText(e.target.value)}
                      className=" w-full "
                    />
                  </div>
                  <div className="grid w-full gap-1">
                    <Input
                      defaultValue={"Ship To"}
                      value={shipToHeader}
                      onChange={(e) => setShipToHeader(e.target.value)}
                      className="border-none text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                    />
                    <Textarea
                      placeholder="(optional)"
                      value={shipToText}
                      onChange={(e) => setShipToText(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full grid gap-10 md:max-lg:w-1/2 sm:max-md:w-full sm:max-md:flex sm:max-md:flex-col ">
              <div className="flex flex-col gap-2 sm:max-md:hidden">
                <div className="flex justify-end md:max-lg:justify-start sm:max-md:justify-start">
                  <Input
                    defaultValue="INVOICE"
                    value={invoiceName}
                    onChange={(e) => setInvoiceName(e.target.value)}
                    className=" capitalize text-right text-5xl h-auto max-w-[60%] min-w-auto border-none hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] focus-visible:cursor-text sm:max-md:text-left sm:max-md:p-1"
                  />
                </div>
                <div className="flex justify-end sm:max-md:justify-start">
                  <div className="flex">
                    <div className="relative w-full flex justify-end">
                      <p className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                        #
                      </p>
                      <Input
                        id="invoiceNumber"
                        type="number"
                        value={invoiceNumber}
                        onChange={(e) =>
                          setInvoiceNumber(parseInt(e.target.value) || 0)
                        }
                        className="w-auto pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid justify-end gap-1 md:max-lg:justify-start  ">
                <div className="flex gap-2 sm:max-md:flex-wrap ">
                  <Input
                    defaultValue={"Date"}
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className=" text-right border-none w-auto sm:max-md:w-1/2 text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] "
                  />

                  <Popover>
                    <PopoverTrigger className="sm:max-md:p-0" asChild>
                      <Button
                        variant={"outline3"}
                        className={cn(
                          "w-full justify-start text-left font-normal sm:max-md:w-[125px] sm:max-md:overflow-hidden",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 sm:max-md:mr-0 sm:max-md:ml-0 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2 sm:max-md:flex-wrap">
                  <Input
                    defaultValue={"Payment Terms"}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className=" text-right border-none w-auto sm:max-md:w-1/2 text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                  />
                  <Input
                    value={paymentTermsText}
                    onChange={(e) => setPaymentTermsText(e.target.value)}
                    className="text-right w-auto sm:max-md:text-left sm:max-md:w-[125px]"
                  />
                </div>
                <div className="flex gap-2 sm:max-md:flex-wrap">
                  <Input
                    defaultValue={"Due Date"}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className=" text-right border-none w-auto sm:max-md:w-1/2 text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                  />
                  <Popover>
                    <PopoverTrigger className="sm:max-md:p-0" asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal sm:max-md:w-[125px] sm:max-md:overflow-hidden    ",
                          !date2 && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 sm:max-md:mr-0 h-4 w-4" />
                        {date2 ? (
                          format(date2, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date2}
                        onSelect={setDate2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2 sm:max-md:flex-wrap sm:max-md:mb-5">
                  <Input
                    defaultValue={"PO Number"}
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className=" text-right border-none w-auto sm:max-md:w-1/2 text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                  />
                  <Input
                    value={poNumberText}
                    onChange={(e) => setPoNumberText(e.target.value)}
                    className="text-right w-auto sm:max-md:text-left sm:max-md:w-[125px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="middle">
        <div className="w-full h-auto p-5 sm:max-md:p-2">
          <div className="px-3">
            <Table>
              <TableHeader className="">
                <TableRow className="bg-[#132144]  hover:bg-[#132144] sm:max-md:hidden">
                  <TableHead className="w-[50%] text-white rounded-l-lg">
                    <Input
                      className="bg-inherit border-none focus-visible:ring-0"
                      value={HeaderItem}
                      onChange={(e) => {
                        setHeaderItems(e.target.value);
                      }}
                    ></Input>
                  </TableHead>
                  <TableHead className="text-white ">
                    <Input
                      className="bg-inherit border-none focus-visible:ring-0"
                      value={HeaderQuantity}
                      onChange={(e) => {
                        setHeaderQuantity(e.target.value);
                      }}
                    ></Input>
                  </TableHead>
                  <TableHead className="text-white">
                    <Input
                      className="bg-inherit border-none focus-visible:ring-0"
                      value={HeaderRate}
                      onChange={(e) => {
                        setHeaderRate(e.target.value);
                      }}
                    ></Input>
                  </TableHead>
                  <TableHead className="text-white ">
                    <Input
                      className="bg-inherit border-none focus-visible:ring-0 text-center"
                      value={HeaderAmount}
                      onChange={(e) => {
                        setHeaderAmount(e.target.value);
                      }}
                    ></Input>
                  </TableHead>
                  <TableHead className="rounded-r-lg"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="sm:max-md:border sm:max-md:border-input    ">
                {inputs.map((input, index) => (
                  <TableRow
                    className="bg-white  hover:bg-white sm:max-md:block sm:max-md:flex-col sm:max-md:p-2    "
                    key={index}
                  >
                    <TableCell className="hidden p-0 px-2 text-right sm:max-md:text-left sm:max-md:flex">
                      <span className="hidden m-auto text-muted-foreground sm:max-md:inline-block">
                        Amount:
                      </span>
                      <Input
                        className="text-center border-none text-[#777777] focus-visible:outline-none focus-visible:ring-0 sm:max-md:text-left"
                        value={"$" + input.amount.toFixed(2)}
                        readOnly
                      />
                    </TableCell>
                    <TableCell className="font-medium p-1  sm:max-md:py-0.5 sm:max-md:flex">
                      <Input
                        className=""
                        placeholder="Description of Service or product.."
                        value={input.description}
                        onChange={(e) => {
                          const newInputs = [...inputs];
                          newInputs[index].description = e.target.value;
                          setInputs(newInputs);
                        }}
                      />
                    </TableCell>
                    <TableCell className="sm:max-md:py-0.5">
                      <Input
                        className="sm:max-md:w-28"
                        type="number"
                        placeholder="1"
                        value={input.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className=" sm:max-md:w-auto sm:max-md:py-0.5 md:hidden">
                      <p className="text-muted-foreground">x</p>
                    </TableCell>
                    <TableCell className="sm:max-md:w-auto sm:max-md:py-0.5">
                      <div className="flex">
                        <div className="relative w-full flex justify-end sm:max-md:justify-normal">
                          <p className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                            $
                          </p>
                          <Input
                            className="pl-8 sm:max-md:w-28"
                            type="number"
                            placeholder="$"
                            value={input.rate}
                            onChange={(e) =>
                              handleRateChange(
                                index,
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right sm:max-md:text-left sm:max-md:hidden">
                      <span className="hidden m-auto text-muted-foreground sm:max-md:inline-block">
                        Amount:
                      </span>
                      <Input
                        className="text-center border-none text-[#777777] focus-visible:outline-none focus-visible:ring-0 sm:max-md:text-left"
                        value={"$" + input.amount.toFixed(2)}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        className="text-background bg-inherit hover:bg-inherit hover:text-[#009E74] sm:max-md:text-[#009E74] "
                        onClick={() => {
                          const newInputs = [...inputs];
                          newInputs.splice(index, 1);
                          if (newInputs.length === 0) {
                            newInputs.push({
                              id: 1,
                              description: "",
                              quantity: 1,
                              rate: 0,
                              amount: 0,
                            });
                          }
                          setInputs(newInputs);
                        }}
                      >
                        <X />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              className=" text-[#009E74] border-[#009E74] hover:bg-[#009E74] hover:text-white sm:max-md:mt-4"
              variant="outline"
              onClick={addInput}
            >
              + Line Item
            </Button>
          </div>
        </div>
      </section>
      <section id="bottom">
        <div className="w-[100%] h-auto p-5">
          <div className="flex justify-between sm:max-md:flex sm:max-md:flex-col sm:max-md:items-start">
            <div className="h-full w-[50%] px-3 sm:max-md:w-full">
              <div className="flex flex-col gap-1">
                <Input
                  defaultValue={"Notes"}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="border-none text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                />
                <Textarea
                  placeholder="Notes - any relevant information not already covered"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full "
                />

                <Input
                  defaultValue={"Terms"}
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  className="border-none text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC]"
                />
                <Textarea
                  placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full "
                />
              </div>
            </div>
            <div className="h-full w-[50%] px-3 sm:max-md:w-[100%]">
              <div className="grid justify-end gap-1 sm:max-md:mt-5">
                <div className="flex gap-2 sm:max-md:gap-1">
                  <Input
                    defaultValue={"Subtotal"}
                    value={subtotalText}
                    onChange={(e) => setSubtotalText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:px-1"
                  />
                  <Input
                    className="text-right w-[auto] border-none text-[#777777] focus-visible:outline-none focus-visible:ring-0 sm:max-md:w-[75%]"
                    value={`$${subtotalAmount.toFixed(2)}`}
                    readOnly
                  />
                </div>
                <div className={!discount ? `flex gap-2` : `hidden`}>
                  <Input
                    defaultValue={"Discount"}
                    value={discountText}
                    onChange={(e) => setDiscountText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:px-1 "
                  />
                  <div className="w-auto flex items-center">
                    <div className=" h-[96%]">
                      <div className="h-full relative">
                        <Input
                          defaultValue={"0"}
                          value={discountValue}
                          onChange={(e) =>
                            setDiscountValue(parseFloat(e.target.value) || 0)
                          }
                          className={` h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-text hover:ring-1 hover:ring-[#CCCCCC] rounded-r-none ring-[#CCCCCC] ring-1 ${
                            showDollar ? "text-left pl-8 " : "text-right pr-8"
                          }`}
                        />
                        <p
                          className={`absolute top-2 text-muted-foreground ${
                            showDollar ? "left-4" : "right-4"
                          }`}
                        >
                          {showDollar ? "$" : "%"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button
                        className="rounded-l-none bg-background text-[#71869d] hover:bg-[#71869d] hover:text-background border border-[#CCCCCC] rounded-r-md"
                        onClick={handleRepeatClick}
                      >
                        <Repeat className="h-4 font-bold" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="bg-background sm:max-md:text-[#007052] hover:bg-background hover:text-[#1f563c] px-0 "
                      onClick={handleDiscountChange}
                    >
                      <X className=" h-4 font-bold" />
                    </Button>
                  </div>
                </div>
                <div className={!tax ? `flex gap-2` : `hidden`}>
                  <Input
                    defaultValue={"Tax"}
                    value={taxText}
                    onChange={(e) => setTaxText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:px-1"
                  />
                  <div className="w-auto flex items-center">
                    <div className="h-[96%]">
                      <div className="h-full relative">
                        <Input
                          defaultValue={"0"}
                          value={taxValue}
                          onChange={(e) =>
                            setTaxValue(parseFloat(e.target.value) || 0)
                          }
                          className={` h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-text hover:ring-1 hover:ring-[#CCCCCC] rounded-r-none ring-[#CCCCCC] ring-1 ${
                            showDollar2 ? "text-left pl-8 " : "text-right pr-8"
                          }`}
                        />
                        <p
                          className={`absolute top-2 text-muted-foreground ${
                            showDollar2 ? "left-4" : "right-4"
                          }`}
                        >
                          {showDollar2 ? "$" : "%"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button
                        className="rounded-l-none bg-background text-[#71869d] hover:bg-[#71869d] hover:text-background border border-[#CCCCCC] rounded-r-md"
                        onClick={handleRepeatClick2}
                      >
                        <Repeat className="h-4 font-bold" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="bg-background sm:max-md:text-[#007052] hover:bg-background hover:text-[#1f563c] px-0"
                      onClick={handleTaxChange}
                    >
                      <X className=" h-4 font-bold" />
                    </Button>
                  </div>
                </div>
                <div className={!shipping ? `flex gap-2` : `hidden`}>
                  <Input
                    defaultValue={"Shipping"}
                    value={shippingText}
                    onChange={(e) => setShippingText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:px-1 "
                  />
                  <div className="w-auto flex items-center">
                    <div className=" h-[96%]">
                      <div className="h-full relative">
                        <Input
                          defaultValue={"0"}
                          value={shippingValue}
                          onChange={(e) =>
                            setShippingValue(parseFloat(e.target.value) || 0)
                          }
                          className="pl-8 pr-[70px] h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-text hover:ring-1 hover:ring-[#CCCCCC] rounded-r ring-[#CCCCCC]  ring-1"
                        />
                        <p className="absolute top-2 left-4 text-gray-500 ">
                          $
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="bg-background sm:max-md:text-[#007052] hover:bg-background hover:text-[#1f563c] px-0"
                      onClick={handleShippingChange}
                    >
                      <X className=" h-4 font-bold" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="link"
                    className={`text-[#009E74] hover:text-[#007052] hover:no-underline ${
                      !discount ? `hidden` : ``
                    }`}
                    onClick={handleDiscountChange}
                  >
                    + Discount
                  </Button>
                  <Button
                    variant="link"
                    className={`text-[#009E74] hover:text-[#007052] hover:no-underline ${
                      !tax ? `hidden` : ``
                    }`}
                    onClick={handleTaxChange}
                  >
                    + Tax
                  </Button>
                  <Button
                    variant="link"
                    className={`text-[#009E74] hover:text-[#007052] hover:no-underline ${
                      !shipping ? `hidden` : ``
                    }`}
                    onClick={handleShippingChange}
                  >
                    + Shipping
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    defaultValue={"Total"}
                    value={totalText}
                    onChange={(e) => setTotalText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:p-1 "
                  />
                  <Input
                    className="text-right w-auto border-none text-[#777777] focus-visible:outline-none focus-visible:ring-0 sm:max-md:w-[75%]"
                    value={`$${totalAmount.toFixed(2)}`}
                    readOnly
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    defaultValue={"Amount Paid"}
                    value={amtPaidText}
                    onChange={(e) => setAmtPaidText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:px-1"
                  />
                  <div className="relative w-auto flex justify-end sm:max-md:w-[78%]">
                    <p className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                      $
                    </p>
                    <Input
                      className="text-right w-auto sm:max-md:w-[100%]"
                      type="number"
                      defaultValue={"0"}
                      value={amtPaidValue}
                      onChange={(e) =>
                        setAmtPaidValue(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    defaultValue={"Balance Due"}
                    value={balanceDueText}
                    onChange={(e) => setBalanceDueText(e.target.value)}
                    className="text-right border-none w-full text-[#777777] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CCCCCC] hover:cursor-pointer hover:ring-1 hover:ring-[#CCCCCC] sm:max-md:px-1"
                  />
                  <Input
                    className="text-right w-auto border-none text-[#777777] focus-visible:outline-none focus-visible:ring-0 sm:max-md:w-[75%]"
                    value={`$${balanceDue.toFixed(2)}`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Button
        className="my-4 ml-auto mr-4 flex sm:max-md:m-auto sm:max-md:mb-5"
        onClick={generateInvoice}
      >
        <DownloadIcon size={14} />
        Download Invoice
      </Button>
    </main>
  );
}
