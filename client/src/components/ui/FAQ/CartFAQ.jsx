// components/CartFAQ.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const cartFAQ = [
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are processed securely.',
  },
  {
    question: 'Can I modify my order after placing it?',
    answer:
      "You can modify your order within 1 hour of placement. Contact support at support@stickerstore.com or use the 'Edit Order' option in your account.",
  },
  {
    question: 'How do I know if my order is confirmed?',
    answer:
      "You'll receive a confirmation email with your order details within minutes of placing it. Check your spam folder if you don\'t see it.",
  },
  {
    question: 'What are the shipping costs?',
    answer:
      'Shipping costs depend on your location and order size. View the total at checkout or check our shipping page for details.',
  },
  {
    question: 'Can I combine multiple orders to save on shipping?',
    answer:
      "Unfortunately, we cannot combine orders after they're placed. Consider adding all items to one cart before checking out.",
  },
];

export default function CartFAQ() {
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold">
        Frequetly asked questions
      </h2>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Accordion
          type="single"
          collapsible
          className="w-full rounded-md border"
        >
          {cartFAQ.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="px-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground px-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
