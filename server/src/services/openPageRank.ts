import axios from "axios";

export interface OpenPageRankResult {
  rank: string | null;
  pageRank: number;
  pageRankInteger: number;
}

export async function getOpenPageRank(
  domain: string
): Promise<OpenPageRankResult> {
  try {
    const response = await axios.get(
      "https://openpagerank.com/api/v1.0/getPageRank",
      {
        params: {
          domains: [domain],
        },
        headers: {
          "API-OPR": process.env.OPEN_PAGERANK_API_KEY!,
        },
      }
    );

    const result = response.data?.response?.[0];

    return {
      rank: result?.rank ?? null,
      pageRank: result?.page_rank_decimal ?? 0,
      pageRankInteger: result?.page_rank_integer ?? 0,
    };
  } catch (error) {
    console.error("Open PageRank failed:", error);

    return {
      rank: null,
      pageRank: 0,
      pageRankInteger: 0,
    };
  }
}