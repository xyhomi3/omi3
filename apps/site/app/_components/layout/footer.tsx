export function Footer() {
  return (
    <footer className="z-50 flex items-center justify-center p-5">
      © {new Date().getFullYear()}
      <a href="https://github.com/xyhomi3" className="text-main">
        {' '}
        Omi3
      </a>
    </footer>
  );
}
