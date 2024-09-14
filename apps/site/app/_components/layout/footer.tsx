export function Footer() {
  return (
    <footer className="z-50 flex items-center justify-center gap-1 p-5" tabIndex={-1}>
      © {new Date().getFullYear()}
      <a href="https://github.com/xyhomi3" className="hover:underline">
        Omi3
      </a>
    </footer>
  );
}
