import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <ApperIcon name="AlertCircle" className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ApperIcon name="Home" className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;