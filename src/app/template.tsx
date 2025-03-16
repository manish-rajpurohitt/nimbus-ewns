export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.documentElement.classList.remove("js-loading");'
        }}
      />
    </>
  );
}
