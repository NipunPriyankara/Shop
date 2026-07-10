'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, Phone } from 'lucide-react';

interface Customer { _id: string; name: string; email: string; phone?: string; createdAt: string; }

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((d) => { setCustomers(d.customers || []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-[#c99b8f] uppercase tracking-widest mb-0.5">Manage</p>
        <h2 className="text-xl font-bold text-charcoal-dark uppercase tracking-wide">Customers</h2>
        <p className="text-charcoal-muted text-xs font-semibold mt-0.5">{customers.length} registered customers</p>
      </div>

      <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-charcoal-muted/20 mx-auto mb-3" />
            <p className="text-charcoal-muted text-xs uppercase tracking-wider font-bold">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-black/5 bg-[#faf8f6]">
                <tr>
                  {['Customer', 'Email', 'Phone', 'Joined'].map((h) => (
                    <th key={h} className="text-left text-charcoal-muted text-[10px] font-bold uppercase tracking-widest py-3.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-[#faf8f6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#f6f1eb] border border-black/5 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#c99b8f] text-sm font-bold">{customer.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-charcoal-dark text-xs font-semibold">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-charcoal-muted text-xs">
                        <Mail className="w-3.5 h-3.5" /> {customer.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-1.5 text-charcoal-muted text-xs">
                          <Phone className="w-3.5 h-3.5" /> {customer.phone}
                        </div>
                      ) : <span className="text-charcoal-muted/40 text-xs">—</span>}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted text-xs">
                      {new Date(customer.createdAt).toLocaleDateString('en-LK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
