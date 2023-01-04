import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Card, Grid, Text, Textarea, Button, Spacer, User} from "@nextui-org/react";
import { userInfo } from "os";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { MongoServerSelectionError } from "mongodb";

//in order to pass in props, we need to make an interface called props

const CommentCard = () => {

    const supabaseClient = useSupabaseClient();
    const user = useUser()
    const router = useRouter() //use supabase throughout components

    const { id } = router.query

    const [comments,setComments] = useState<any>([])
    const [error, setError] = useState<any>('')

    useEffect(() => {
        async function getComments() {
            const {data, error} = await supabaseClient
            .from("comments")
            .select("*")
            .filter("post_id", "eq", id)
            .limit(5)
            if (error) {
                setError(error.message)
            } else {
                setComments(data)
            }
        }
        if (typeof id !== undefined) {
            getComments()
        }
    },[id])

    const intitialState = {
        comment: ""
    }

    const [commentData, setCommentData] = useState(intitialState)

    const handleCommentChange = (e: any) => {
        setCommentData({...commentData, [e.target.name] : e.target.value})
    }
    const createComment = async () => {
        try {
            const { data,error } = await supabaseClient
                .from("comments")
                .insert({
                    body: commentData.comment,
                    user_email: user?.email?.toLowerCase(),
                    user_id: user?.id,
                    post_id: id
                })
                .single()
            if (error) setError(error)
            router.reload()
            setCommentData(intitialState)
        } catch(error:any) {
           setError(error.message)
        } 

    }

    const deleteComment = async (commentId: any) => {
        try {
            const {data,error} = await supabaseClient
            .from("comments")
            .delete()
            .eq("id", commentId)
            if (error) setError(error)
            setComments((prevComments: any) => prevComments.filter((comment: any) => comment.id !== commentId))
        } catch(error: any) {
            setError(error.message)
        }
    }
    return (
        <Grid.Container gap={2}>
            <Text h3>Comments</Text>
            <Spacer y={1} />
            <Grid.Container gap={2}>
                {comments.map((c: any) => (
                    <Grid xs={12} key={c.id}>
                        <Card css={{ mw: "400px" }}>
                            <Card.Header>
                            <User
                                name={c.user_email?.toLowerCase()}
                                size="sm"
                                />
                            </Card.Header>
                            <Card.Body>
                                <Text>{c.body}</Text>
                            </Card.Body>
                            <Card.Footer>
                            {user && c.user_id === user.id ?
                                <Button shadow color="error" auto onPress={() => deleteComment(c.id)}>
                                    Delete
                                </Button>
                                : null}
                            </Card.Footer>
                        </Card>
                    </Grid>

                ))}
            </Grid.Container>
            {user && <Grid.Container>
                <Text h5>Post a Comment</Text>
                    <Grid xs={12}>
                        <Textarea 
                        name="comment" 
                        aria-label="comment"
                        placeholder="Comment..."
                        fullWidth={true}
                        rows={1}
                        size="xl"
                        onChange={handleCommentChange}
                        />
                    </Grid>
                {commentData.comment && <Button onPress={createComment}>Post Comment</Button>}
                        {error && <Text>{error}</Text>}
            </Grid.Container>}
      </Grid.Container>
    )
}

export default CommentCard