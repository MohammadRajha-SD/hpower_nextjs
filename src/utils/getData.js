"use server";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
};

export const getData = async (param, locale) => {
  try {
    const separator = param.includes("?") ? "&" : "?";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${param}${separator}locale=${locale}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getAllData = async (param, locale) => {
  try {
    const headers = {
      "Cache-Control": "no-cache",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "User-Agent": "PostmanRuntime/7.43.3",
    };

    // Remove the extra curly brace from the URL
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${param}?lang=${locale}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getUrl = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${param}?lang=${locale}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
