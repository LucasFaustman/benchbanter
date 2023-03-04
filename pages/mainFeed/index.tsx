import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState, useEffect } from "react";
import { Text, Button } from "@nextui-org/react";
import ArticleCard from "../../components/ArticleCard";
import { Box } from "../../components/box";

const Mainfeed: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter(); //use supabase throughout components
  const [articles, setArticles] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 7;

  useEffect(() => {
    const getArticles = async (page: number, pageSize: number) => {
      try {
        const { data, error } = await supabaseClient
          .from("articles")
          .select("*")
          .range((page - 1) * pageSize, page * pageSize - 1)
          .order("inserted_at", { ascending: false });
        if (data != null) {
          setArticles(data);
        }
      } catch (error: any) {
        alert(error.message);
      }
    };
    getArticles(page, PAGE_SIZE);
  }, [page, supabaseClient]);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const isLastPage = articles.length < PAGE_SIZE; // Check if on last page based on number of articles and page size


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
      <Text h2>Main Feed</Text>
      <Text size="$lg" css={{ my: "$8" }}>
        Check out articles here
      </Text>
      {articles.map((article, i) => (
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
};

export default Mainfeed;