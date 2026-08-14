import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: "Are all products 100% original and authentic?",
      a: "Yes, absolutely! We source all our products directly from certified brand distributors and authorized retailers in the UK, USA, and South Korea. We strictly guarantee 100% authenticity on every single item."
    },
    {
      q: "How can I pay for my order?",
      a: "We offer Cash on Delivery (COD) island-wide, as well as direct bank transfer. You can pay comfortably when your parcel arrives at your doorstep."
    },
    {
      q: "How long does delivery take?",
      a: "Delivery to Colombo and suburbs takes 1-2 business days. For outstation areas across Sri Lanka, delivery takes 2-4 business days."
    },
    {
      q: "What is your delivery fee?",
      a: "We offer FREE delivery for all orders with a total of Rs. 5,000 or above. For orders under Rs. 5,000, a flat island-wide delivery fee of Rs. 350 applies."
    },
    {
      q: "How do I choose the right skincare routine for my skin type?",
      a: "Each product page has skin-type tags and usage guidance. You can also message our beauty consultants on WhatsApp at +94 70 229 9696 for personalized advice based on your skin concerns."
    },
    {
      q: "Can I cancel or change my order?",
      a: "If you need to modify or cancel your order, please reach out to us via WhatsApp or email as soon as possible before your package is dispatched."
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Help & Support</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">Frequently Asked Questions</h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Find answers to the most common questions about our products, delivery, and orders.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                <h3 className="font-bold text-gray-900 flex items-start gap-3 text-base sm:text-lg mb-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
