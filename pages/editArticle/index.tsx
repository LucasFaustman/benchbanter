import type { NextPage } from "next"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";


const EditArticle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser()
    const router = useRouter() //use supabase throughout components

    const { id } = router.query

    const intitialState = {
        title: "",
        content: ""
    }

    const [articleData, setArticleData] = useState(intitialState)

    const handleChange = (e: any) => {
        setArticleData({...articleData, [e.target.name] : e.target.value})
    }

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
                setArticleData(data)
            }
        }
        if (typeof id !== undefined) {
            getArticle()
        }
    },[id, articleData, supabaseClient])


    

    const editArticle = async () => {
        try {
            const { data,error } = await supabaseClient
                .from("articles")
                .update({
                    title: articleData.title,
                    content: articleData.content
                })
                .eq("id",id)
            if (error) throw error
            router.push("/article?id=" + id)
        } catch(error:any) {
            alert(error.message)
        }

    }
    return (
  <Grid.Container gap={1}>
      <Text h3>Title</Text>
      <Grid xs={12}>
          <Textarea 
          name="title" 
          aria-label="title"
          placeholder="Article Title"
          fullWidth={true}
          rows={1}
          size="xl"
          onChange={handleChange}
          initialValue={articleData.title}
          />
      </Grid>
      <Text h3>Article Text</Text>
      <Grid xs={12}>
          <Textarea 
          name="content" 
          aria-label="content"
          placeholder="Article Content"
          fullWidth={true}
          rows={6}
          size="xl"
          onChange={handleChange}
          initialValue={articleData.content}
          />
      </Grid>
      <Grid xs={12}>
          Editing as {user?.email}
      </Grid>
      <Button onPress={editArticle}>Update Article</Button>
  </Grid.Container>
    )
}

export default EditArticle;

export const getServerSideProps = withPageAuth({ redirectTo: "/login"})