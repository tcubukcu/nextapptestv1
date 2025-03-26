import Image from 'next/image'
import Link from 'next/link'
// import
import styles from '../app/page.module.css'
import IpAddressTable from '../app/IpAddressTable'

 function Pages() {
  return (
    <main className={styles.main}>
    <div>
      <Image
        src="/fixie.svg"
        alt="Fixie Logo"
        width={100}
        height={24}
        priority
      />
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
      />
    </div>
    <IpAddressTable />
    <div>
      For more information, see the <Link href="https://usefixie.com/vercel-static-ip">docs</Link>.
    </div>
  </main>
)
}
export default Pages;