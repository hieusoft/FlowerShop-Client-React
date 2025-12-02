import Header from "../components/ui/Header";

export default function Layout({ children }) {
  return (
    <html>
      <body className="color-bg">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}