import axios from "axios";
import { useAuth } from "../auth/useAuth";
import { sharepointApiConfig } from "../auth/authConfig";

export const getListItems = async (token, listName) => {
  const siteUrl = process.env.REACT_APP_SP_SITE_URL;
  const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  });
  return response.data.d.results;
};

/*
const getSharePointApi = (token) => {
  const instance = axios.create({
    baseURL: sharepointApiConfig.endpoint,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return {
    getSite: async () => {
      try {
        const response = await instance.get("/");
        return response.data;
      } catch (error) {
        console.error("Error fetching site:", error);
        throw error;
      }
    },
    getLists: async () => {
      try {
        const response = await instance.get("/lists");
        return response.data.value;
      } catch (error) {
        console.error("Error fetching lists:", error);
        throw error;
      }
    },
    getListItems: async (listId) => {
      try {
        const response = await instance.get(`/lists/${listId}/items`);
        return response.data.value;
      } catch (error) {
        console.error("Error fetching list items:", error);
        throw error;
      }
    },
  };
};

export default getSharePointApi;*/
