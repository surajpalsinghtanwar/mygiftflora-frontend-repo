const Footer = () => (
  <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-4 mt-auto shadow-inner">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
      <span className="text-sm">
        &copy; {new Date().getFullYear()} The Murphy. All rights reserved.
      </span>
      <span className="text-xs">
        Powered by{' '}
        <a href="https://jhajiconsultancy.in" className="text-blue-600 hover:underline">
          jhajiconsultancy.in
        </a>
      </span>
    </div>
  </footer>
)

export default Footer
