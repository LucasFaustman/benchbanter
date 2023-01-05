import type { NextPage } from "next"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState, useEffect } from "react";
import { Text } from "@nextui-org/react";
import ArticleCard from "../../components/ArticleCard";
import { Box } from "../../components/box";

const Mainfeed: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser()
    const router = useRouter() //use supabase throughout components
    const [articles,setArticles] = useState<string[]>([])


    useEffect(() => {
        const getArticles = async () => {
            try {
                const {data,error} = await supabaseClient
                .from("articles")
                .select("*")
                .limit(10)
                if (data != null) {
                    setArticles(data)
                }
            } catch(error: any) {
                alert(error.message)
            }
        }
        getArticles();
    },[])

   
    return (
        <Box css={{ px: "$12", py: "$15", mt: "$12", "@xsMax": {px: "$10"}, maxWidth: "800px", margin: "0 auto" }}>
            <Text h2>Main Feed</Text>
            <Text size="$lg" css={{my: "$8"}}>
                Check out articles here
            </Text>
            {articles.map((article) => (
                <ArticleCard article={article} />
            ))}
        </Box>
    )
}

export default Mainfeed;