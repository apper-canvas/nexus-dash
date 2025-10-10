const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-4 w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;