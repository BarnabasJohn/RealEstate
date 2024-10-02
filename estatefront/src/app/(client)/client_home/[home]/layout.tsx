import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Client',
    openGraph: {
        title: 'Client Home',
      description: "Home of your next home 😃.",
      images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Client Home',
        description: 'Home of your next home 😃.',
        images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
    }
    }
}

export default function ClientProfileLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            {children}
        </div>
    );
  }