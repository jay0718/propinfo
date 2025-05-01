import CompareTable from '@/components/compare/CompareTable';

const Compare = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Compare Prop Trading Firms
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
          Side-by-side comparison of trading conditions, fees, and features to find your perfect match.
        </p>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-neutral-200 p-6">
        <CompareTable />
      </div>
      
      <div className="mt-12 bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h2 className="text-xl font-semibold mb-4">How to Use the Comparison Tool</h2>
        <ul className="space-y-3 text-neutral-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mr-3">1</span>
            <span>Select firms from the dropdown to add them to your comparison</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mr-3">2</span>
            <span>Review the key metrics side-by-side to evaluate differences</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mr-3">3</span>
            <span>Click "View Details" on any firm to get more comprehensive information</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mr-3">4</span>
            <span>Use the X button to remove firms from your comparison</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Compare;
