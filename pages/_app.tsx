import '../styles/globals.css'
import '../styles/table.css'
import '../styles/inputs.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
