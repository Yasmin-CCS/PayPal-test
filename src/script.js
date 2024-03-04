window.paypal
  .Buttons({
    style: {
      layout: 'horizontal',
      color: 'gold',
      shape: 'pill',
      label: 'paypal',
      disableMaxWidth: true 
    },
    async createOrder() {
      try {
        // Collecting the values placed in the input
        var inputFirstName = document.getElementById('first_name').value;
        var inputLastName = document.getElementById('last_name').value;
        var inputEmail = document.getElementById('email').value;
        var inputPhone = document.getElementById('phone').value;
        var inputAddressLine1 = document.getElementById('address_line_1').value;
        var inputAddressLine2 = document.getElementById('address_line_2').value;
        var inputAdminArea1 = document.getElementById('admin_area_1').value;
        var inputAdminArea2 = document.getElementById('admin_area_2').value;
        var inputPostalCode = document.getElementById('postal_code').value;
        var inputCountryCode = document.getElementById('country_code').value;
        // Joining the names 
        var name = (`${inputFirstName} ${inputLastName}`)

        // Building the body for sending to the server
        const orderBody = {
          intent: "CAPTURE",
          payment_source: {
            paypal: {
              experience_context: {
                shipping_preference: "SET_PROVIDED_ADDRESS"
              },
              name: {
                given_name: inputFirstName,
                surname: inputLastName
              },
              email_address: inputEmail,
              phone: {
                phone_number: {
                  national_number: inputPhone
                }
              }
            },
          },
          purchase_units: [{
            amount: {
              currency_code: "USD",
              value: "1",
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: "1"
                }
              }
            },
            items: [{
              name: "Smartphone",
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: "1"
              }
            }],
            shipping: {
              name: {
                full_name: name
              },
              address: {
                address_line_1: inputAddressLine1,
                address_line_2: inputAddressLine2,
                admin_area_1: inputAdminArea1,
                admin_area_2: inputAdminArea2,
                postal_code: inputPostalCode,
                country_code: inputCountryCode
              }
            }
          }],

        };

        // Sending to the server
        const sendOrderServer = await fetch("/createorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderBody)
        }
        )

        const orderData = await sendOrderServer.json();

        return orderData.id;

      } catch (error) {
        console.error(error);
      }
    },

    async onApprove(data) {
      try {
        // Sending to the server
        const sendOrderIdServer = await fetch(`/captureorder/${data.orderID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });


        const orderData = await sendOrderIdServer.json();
        // Capturing the transaction
        if (orderData.purchase_units[0].payments.captures) {
          const transaction = orderData.purchase_units[0].payments.captures[0];
          // If the transaction.id exists, show the thank you message
          if (transaction.id) {
            transactionId(`${transaction.id}`)
            document.getElementById('thankYouMessage').style.display = 'flex';
          }
        } else {
          document.getElementById('thankYouMessage').style.display = 'none';
        }

      } catch (error) {
        console.error(error);
      }
    },
  })
  .render("#paypal-button-container");

// Putting the transaction id into the element with the id="transactionId"
function transactionId(transactionId) {
  const container = document.getElementById("transactionId");
  container.innerHTML = transactionId;
}