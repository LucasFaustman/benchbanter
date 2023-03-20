import type { NextPage } from "next"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ArticleCard from "../../components/ArticleCard";
import { Spacer, Text, User, Button } from "@nextui-org/react";
import { Box } from "../../components/box";

const Profile: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser()
    const router = useRouter() //use supabase throughout components
    const [profile,setProfile] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 7;
    const { id } = router.query

    useEffect(() => {
        const getProfile = async (page: number, pageSize: number) => {
          try {
            const { data, error } = await supabaseClient
              .from("articles")
              .select("*")
              .filter("user_id", "eq", id)
              .range((page - 1) * pageSize, page * pageSize - 1)
              .order("inserted_at", { ascending: false });
            if (data != null) {
              setProfile(data);
            }
          } catch (error: any) {
            alert(error.message);
          }
        };
        getProfile(page, PAGE_SIZE);
      }, [id, page, supabaseClient]);

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
      };
    
      const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
      };
      const isLastPage = profile.length < PAGE_SIZE; // Check if on last page based on number of articles and page size

      return (
        <Box
          css={{
            px: "$12",
            py: "$15",
            mt: "$12",
            "@xsMax": { px: "$10" },
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >

        <User name={profile[0]?.user_email?.toLowerCase()} size="md" />
         <Text size="$lg" css={{ my: "$8" }}>
          </Text>
          {profile.map((article: string, i : number) => (
            <ArticleCard key={i} article={article} />
          ))}
          <Box css={{ display: "flex", justifyContent: "center", my: "$8" }}>
            <Button
              disabled={page === 1}
              onClick={handlePrevPage}
              css={{ mr: "$4" }}
            >
              Previous
            </Button>
            <Button disabled={isLastPage} onClick={handleNextPage}>Next</Button>
          </Box>
        </Box>
      );
}

export default Profile;