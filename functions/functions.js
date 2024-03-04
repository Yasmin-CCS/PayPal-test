import fetch from "node-fetch";
import "dotenv/config";

// Getting the credentials saved in .env
const { CLIENT_ID, CLIENT_SECRET } = process.env;

// Getting the Token
const getToken = async () => {
  try {
    // Concatenating the keys and encrypting
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`
    ).toString("base64");
    // Sending to PayPal
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
    });

    // Storing the entire response in the constant tokens
    const tokens = await response.json();
    // Separating the access token used in the functions
    return tokens.access_token;

  } catch (error) {
    console.error(error);
  }
};

async function handleResponse(response) {
  try {
    // Storing the response JSON and the HTTP status in constants
    const jsonResponse = await response.json();
    const httpStatusCode = await response.status;
 
    return {
      // returning the values
      jsonResponse: jsonResponse,
      httpStatusCode: httpStatusCode
    };
  } catch (error) {
    // Storing the error message in a constant
    const errorMessage = await response.text();
    // Showing the error
    throw new Error(errorMessage);
  }
}

const createOrder = async (body) => {
  // Getting the Token
  const accessToken = await getToken();
  // Defining the sending URL
  const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;

  // Send to Paypal
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  // Calling the handleResponse function to parse the information
  return handleResponse(response);
};

const captureOrder = async (orderID) => {
    // Getting the Token
  const accessToken = await getToken();
    // Defining the sending URL
  const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;
  // Performing the sending
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

 // Calling the handleResponse function to parse the information
  return handleResponse(response);
};

// Exporting createOrder and captureOrder to be able to call them on the server
export { createOrder, captureOrder };


