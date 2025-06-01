import { PaymentHeader } from "../payment/PaymentHeader";
import { SubscriptionCards } from "../payment/Subs";
import StripeWrapper from "@/components/providers/StripeWrapper";

export default function PremiumContent() {
  return (
    <StripeWrapper>
      <PaymentHeader />
      <SubscriptionCards />
    </StripeWrapper>
  );
}
