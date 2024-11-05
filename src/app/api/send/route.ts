import { OrderReceivedMail } from "@/components/email/OrderReceivedMail";
import { Resend } from "resend";
import { EmailDataType } from "../webhooks/stripe/route";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const emailData = (await request.json()) as EmailDataType;
  console.log(emailData);

  try {
    const { data, error } = await resend.emails.send({
      from: "NeonCloud <onboarding@resend.dev>",
      to: [emailData.emailTo],
      subject: "Thanks for your order!",
      react: OrderReceivedMail({
        orderId: emailData.orderId,
        orderDate: emailData.orderDate,
        // @ts-expect-error some props not necessary
        shippingAddress: {
          shippingAdressName: emailData.shippingAdressName,
          shippingAdressCity: emailData.shippingAdressCity,
          shippingAdressCountry: emailData.shippingAdressCountry,
          shippingAdressPostalCode: emailData.shippingAdressPostalCode,
          shippingAdressStreet: emailData.shippingAdressStreet,
          shippingAdressState: emailData.shippingAdressState,
        },
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
