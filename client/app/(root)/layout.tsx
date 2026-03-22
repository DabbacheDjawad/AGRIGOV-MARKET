import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export default function Layout({children} : Readonly<{children : React.ReactNode}>){
  return(
    <>
        <main className="w-full">
          <Navbar/>
          {children}
          <Footer />
        </main>
    </>
  )
}