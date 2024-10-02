import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Agent',
        openGraph: {
            title: 'Agent',
          description: "Join the property experts 😃.",
          images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Agent',
            description: 'Join the property experts 😃.',
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