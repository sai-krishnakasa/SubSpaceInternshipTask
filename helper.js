async function getDataFromURL() {
    const url = "https://intent-kit-16.hasura.app/api/rest/blogs";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP Request error Status: ${response.status}`);
    }
  
    return response.json();
  }

module.exports = getDataFromURL;