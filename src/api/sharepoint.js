import axios from "axios";
import { useAuth } from "../auth/useAuth";
import { sharepointApiConfig } from "../auth/authConfig";

const siteUrl = process.env.REACT_APP_SP_SITE_URL;

export const getListItems = async (token, listName) => {
  const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  });
  return response.data.d.results;
};

export const getListItemById = async (accessToken, listName, itemId) => {
  try {
    const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json;odata=verbose",
      },
    });

    return response.data.d;
  } catch (error) {
    console.error("Error fetching SharePoint data:", error);
    throw error;
  }
};

const getListMetadataType = async (listName, accessToken) => {
  const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json;odata=verbose",
    },
  });
  return response.data.d.ListItemEntityTypeFullName;
};

export const uploadFileToItemSP = async (
  accessToken,
  listName,
  itemId,
  file
) => {
  try {
    const fileName = encodeURIComponent(file.name);
    const url = `${siteUrl}/_api/web/lists/getByTitle('${listName}')/items(${itemId})/AttachmentFiles/add(FileName='${fileName}')`;

    const response = await axios.post(url, file, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json;odata=verbose",
        "Content-Type": file.type, // File MIME type
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading attachment:", error);
    throw error;
  }
};

export const addInitiatorData = async (accessToken, listName, itemData) => {
  try {
    const { Attachments, ...itemDataWithoutAttachemnt } = itemData;
    const type = await getListMetadataType(listName, accessToken);
    const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;
    const response = await axios.post(
      url,
      {
        // __metadata: { type: `SP.Data.${listName}ListItem` },
        __metadata: { type: type },

        ...itemDataWithoutAttachemnt,
        InitiatorAddedData: true,
        FileName: Attachments ? Attachments.name : "",
        FormId: crypto.randomUUID(),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      }
    );

    console.log(response);

    const itemId = response.data.d.Id;
    if (Attachments) {
      await uploadFileToItemSP(accessToken, listName, itemId, Attachments);
    }
    console.log("every thing ok in services");
    return response.data.d;
  } catch (error) {
    console.error("Error adding SharePoint list item:", error);
    throw error;
  }
};

export const addReviewer1Data = async (
  accessToken,
  listName,
  itemId,
  itemData
) => {
  try {
    const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;
    const type = await getListMetadataType(listName, accessToken);
    console.log("item data in updating function", itemData);

    const response = await axios.patch(
      url,
      {
        __metadata: { type: type },
        Reviewer1Name: itemData.Reviewer1Name,
        Reviewer1Email: itemData.Reviewer1Email,
        Reviewer1Comments: itemData.Reviewer1Comments,
        Reviewer1AddedDate: new Date().toISOString(),
        Reviewer1AddedData: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "IF-MATCH": "*", // Ensures update even if item is modified
        },
      }
    );

    console.log("item updated successfully: ", response);
    return response.status;
  } catch (error) {
    console.error("Error updating SharePoint list item:", error);
    throw error;
  }
};

export const addReviewer2Data = async (
  accessToken,
  listName,
  itemId,
  itemData
) => {
  try {
    const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;
    const type = await getListMetadataType(listName, accessToken);
    console.log("item data in updating function", itemData);

    const response = await axios.patch(
      url,
      {
        __metadata: { type: type },
        Reviewer2Name: itemData.Reviewer2Name,
        Reviewer2Email: itemData.Reviewer2Email,
        Reviewer2Comments: itemData.Reviewer2Comments,
        Reviewer2AddedDate: new Date().toISOString(),
        Reviewer2AddedData: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "IF-MATCH": "*", // Ensures update even if item is modified
        },
      }
    );

    return response.status;
  } catch (error) {
    console.error("Error updating SharePoint list item:", error);
    throw error;
  }
};

export const addApproverData = async (
  accessToken,
  listName,
  itemId,
  itemData
) => {
  try {
    const url = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;
    const type = await getListMetadataType(listName, accessToken);
    console.log("item data in updating function", itemData);

    const response = await axios.patch(
      url,
      {
        __metadata: { type: type },
        ApproverName: itemData.ApproverName,
        ApproverEmail: itemData.ApproverEmail,
        ApproverComments: itemData.ApproverComments,
        ApproverAddedDate: new Date().toISOString(),
        ApproverAddedData: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "IF-MATCH": "*", // Ensures update even if item is modified
        },
      }
    );

    console.log("item updated successfully: ", response);
    return response.status;
  } catch (error) {
    console.error("Error updating SharePoint list item:", error);
    throw error;
  }
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
