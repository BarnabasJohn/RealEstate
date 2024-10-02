//import { getArticles } from '@random/module'

export default async function sitemap () {
    const baseUrl = "https://homelyrealtors.com";

    // const response = await getArticles();

    // const blogPosts = response?.map((post: any) => {
    //     return {
    //         url: `${baseUrl}/blog/${post?.slug}`,
    //         lastModified: post?.created_at,
    //     };
    // });

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        //...blogPosts,
    ]
}