import qs from "qs";
import { connection } from "next/server";
import { flattenAttributes, getStrapiURL } from "@/lib/utils";

const baseUrl = getStrapiURL();
const PAGE_SIZE = 4;

function getAuthToken() {
  return null;
}

async function fetchData(url: string) {
  const authToken = getAuthToken();
  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} - ${url}`);
      return null;
    }
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function getHomePageData() {
  await connection();
  const url = new URL("/api/home-page", baseUrl);
  url.search = qs.stringify({
    populate: {
      hero: {
        populate: {
          imageBackground: {
            fields: ["url", "alternativeText"],
          },
          link: true,
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getHomeMetadata() {
  await connection();
  const url = new URL("/api/home-page", baseUrl);
  return await fetchData(url.href);
}

export async function getAllMusicData(
  currentPage: number,
  queryString: string
) {
  await connection();
  const url = new URL("/api/songs", baseUrl);
  url.search = qs.stringify({
    sort: ["createdAt:desc"],
    populate: {
      artist: {
        fields: ["name"],
      },
      image: {
        fields: ["url", "alternativeText"],
      },
      audio: {
        fields: ["url", "alternativeText"],
      },
    },
    filters: {
      $or: [
        { title: { $containsi: queryString } },
        {
          artist: {
            name: {
              $containsi: queryString,
            },
          },
        },
      ],
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage,
    },
  });
  return await fetchData(url.href);
}
