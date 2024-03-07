import qs from "qs";
import { unstable_noStore as noStore } from "next/cache";
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
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // or return null;
  }
}

export async function getHomePageData() {
  noStore();
  const url = new URL("/api/home-page", baseUrl);
  url.search = qs.stringify({
    populate: {
      hero: {
        populate: {
          imageAvatar: {
            fields: ["url", "alternativeText"],
          },
          imageBackground: {
            fields: ["url", "alternativeText"],
          },
        },
      },
    },
  });

  return await fetchData(url.href);
}

export async function getHomeMetadata() {
  noStore();
  const url = new URL("/api/home-page", baseUrl);
  return await fetchData(url.href);
}

export async function getAllMusicData(
  currentPage: number,
  queryString: string
) {
  noStore();
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
