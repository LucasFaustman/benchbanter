import type { NextPage } from "next"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";


const CreateArticle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser()
    const router = useRouter() //use supabase throughout components

    const intitialState = {
        title: "",
        content: ""
    }

    const [articleData, setArticleData] = useState(intitialState)

    const handleChange = (e: any) => {
        setArticleData({...articleData, [e.target.name] : e.target.value})
    }

    const createArticle = async () => {
        try {
            const { data,error } = await supabaseClient
                .from("articles")
                .insert({
                    title: articleData.title,
                    content: articleData.content,
                    user_email: user?.email?.toLowerCase(),
                    user_id: user?.id
                })
                .single()
            if (error) throw error
            setArticleData(intitialState)
            router.push("/mainFeed")
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
          />
      </Grid>
      <Grid xs={12}>
          Posting as {user?.email}
      </Grid>
      <Button onPress={createArticle}>Create Article</Button>
  </Grid.Container>
    )
}

export default CreateArticle;

export const getServerSideProps = withPageAuth({ redirectTo: "/login"})