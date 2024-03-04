import qs from "qs";
import { unstable_noStore as noStore } from "next/cache";
const baseUrl = process.env.STRAPI_URL ?? "http://localhost:1337";

//NOTES: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL

import { flattenAttributes } from "@/lib/utils";

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
        }
      },
    },
  });
  return fetchData(url.href);
}

export async function getAllMusicData() {
  noStore();
  const url = new URL("/api/songs", baseUrl);
  url.search = qs.stringify({
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
  });
  return fetchData(url.href);
}
