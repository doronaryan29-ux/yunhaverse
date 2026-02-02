const Footer = () => (
  <footer className="border-t border-pink-100 bg-white/80 py-10">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 text-center">
      <div className="flex justify-center gap-4 text-xl text-rose-500">
        <a
          href="https://www.facebook.com/yunhaverseph"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white shadow"
        >
          <i className="fab fa-facebook-f" />
        </a>
        <a
          href="https://x.com/YunhaversePH"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter/X"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white shadow"
        >
          <i className="fab fa-twitter" />
        </a>
        <a
          href="https://www.instagram.com/yunhaverseph"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white shadow"
        >
          <i className="fab fa-instagram" />
        </a>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>For inquiries and collaborations, send your 💌 at:</p>
        <p className="text-base font-semibold text-slate-800">bangyunhaph@gmail.com</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500">
        <a href="about.php" className="hover:text-rose-500">
          About Us
        </a>
        <a href="privacy.php" className="hover:text-rose-500">
          Privacy Policy
        </a>
        <a href="terms.php" className="hover:text-rose-500">
          Terms of Service
        </a>
        <a href="contact.php" className="hover:text-rose-500">
          Contact Us
        </a>
      </div>

      <div className="text-xs text-slate-400">
        <p>&copy; 2026 YUNHAverse PH. All rights reserved.</p>
        <p>Made with ❤️ by the YUNHAverse PH Team</p>
      </div>
    </div>
  </footer>
)

export default Footer
