import Navbar from '../../../../components/navbar';
import { Metadata } from 'next';


export const metadata: Metadata = {
  metadataBase: new URL("http://www.HomelyRealtors.com"),
  keywords: ["home","sale","rent","property", "homely realtors"],
  title: {
    default: "Homely Realtors",
    template: "Homely| %s"
  },
  openGraph: {
    title: 'Client Profile',
  description: "Home of your next home 😃.",
  images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
},
twitter: {
  card: 'summary_large_image',
  title: 'Client Profile',
  description: 'Home of your next home 😃.',
  images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
}
}
export default function ClientProfileLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            <Navbar/>
            {children}
        </div>
    );
  }