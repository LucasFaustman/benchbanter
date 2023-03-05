import type { NextPage } from "next"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState, useEffect } from "react";
import CommentCard from "../../components/CommentCard";
import { Spacer, Text, User, Button } from "@nextui-org/react";
import { Box } from "../../components/box";

const Article: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser()
    const router = useRouter() //use supabase throughout components
    const [article,setArticle] = useState<any>({})
    const [likes,setLikes] = useState<number>(0)

    const { id } = router.query

    useEffect(() => {

        async function getArticle() {
            const {data, error} = await supabaseClient
            .from("articles")
            .select("*")
            .filter("id", "eq", id)
            .single()
            if (error) {
                console.log(error)
            } else {
                setArticle(data)
                setLikes(data.likes)
            }
        }
        if (typeof id !== undefined) {
            getArticle()
        }
    },[id, supabaseClient])

    const deleteArticle = async () => {
        try {
            const {data,error} = await supabaseClient
            .from("articles")
            .delete()
            .eq("id", id)
            if (error) throw error
            router.push("/mainFeed")
        } catch(error: any) {
            alert(error.message)
        }
    }

    const upVoteLikes = async () => {
        try {
          const { data, error } = await supabaseClient
            .from("articles")
            .update({
              likes: likes + 1
            })
            .eq("id", id);
          setLikes(prevLikes => prevLikes + 1)
          if (error) throw error;
          router.push("/article?id=" + id);
        } catch (error: any) {
          alert(error.message);
        }
      };
      
      
      
      
      
      
      
      
    return (
        <>
        {Object.keys(article).length > 0 && (
        <Box key={article.id} css={{ px: "$12", py: "$15", mt: "$12", "@xsMax": {px: "$10"}, maxWidth: "800px", margin: "0 auto" }}>

            <Text h2>{article.title}</Text>
            <Spacer y={.5}/>
            <User
                name={article.user_email?.toLowerCase()}
                size="md"
                />
            <Spacer y={1} />
            <Box>
                <p>Likes: {likes}</p>
                {user && <Button onPress={() => upVoteLikes()} color="success" auto>Upvote</Button>}
            </Box>
            <Text>
                {article.content.split('\n').map((paragraph: string) => (
                        <p style={{ marginBottom: '1rem' }}>{paragraph}</p>
                ))}
            </Text>
            {user && article.user_id === user.id ?
            <>
                <Spacer y={.5} />
                <Button size="sm" onPress={() => router.push("/editArticle?id=" + id)}>
                    Edit
                </Button>
                <Spacer y={.5} />
                <Button size="sm" color="error" onPress={() => deleteArticle()}>
                    Delete
                </Button>
            </>
            : null}
            <Spacer y={3} />
            <CommentCard />
        </Box>
        )}
        </>
    )
}

export default Article;