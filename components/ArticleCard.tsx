import { NextPage } from "next";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Card, Text } from "@nextui-org/react";
import { userInfo } from "os";

interface Props{
    article: any
}

//in order to pass in props, we need to make an interface called props

const ArticleCard: NextPage<Props> = (props) => {
    const router = useRouter()
    const { article } = props;

    function getDate() {
        let time = Date.parse(article.inserted_at);
        let date = new Date(time);
        let day = date.getDate().toString().padStart(2, "0");
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let year = date.getFullYear().toString();
            return `${month}-${day}-${year}`;
    }
    return (

        <Card
            isPressable
            css={{mb: "$10"}}
            onPress={() => router.push("/article?id=" + article.id)}
            key={article.id}
        >
            <Card.Body>
                <Text h2>{article.title}</Text>
                <Text b>Posted {getDate()}</Text>
                <Text>By: {article.user_email}</Text>
                <Text>Likes: {article.likes}</Text>
            </Card.Body>
        </Card>
    )
}

export default ArticleCard;