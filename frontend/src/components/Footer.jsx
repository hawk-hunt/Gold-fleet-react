export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-900">Gold Fleet</p>
            <p className="text-xs text-gray-600 mt-1">Professional Fleet Management System</p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-yellow-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-yellow-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-yellow-600 transition-colors">Support</a>
          </div>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Gold Fleet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
