import { MetadataRoute } from "next";
import { userAgent } from "next/server";

export default function robots(): MetadataRoute.Robots{

    const baseUrl = "https://homelyrealtors.com";

    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/agent", "/client"],
            disallow: []
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}