import './globals.css'

export const metadata = {
  title: 'PDF Q&A App',
  description: 'Ask questions about your PDF documents',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}