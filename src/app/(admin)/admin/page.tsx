export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-display-sm font-serif text-bhg-black mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: '0', change: '' },
          { label: 'Revenue', value: '$0', change: '' },
          { label: 'Products', value: '0', change: '' },
          { label: 'Customers', value: '0', change: '' },
        ].map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="text-body-sm text-bhg-gray-600 font-sans">{stat.label}</p>
            <p className="text-display-sm font-serif text-bhg-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
