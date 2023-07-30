# ice-cloud

🍦 This Full Stack (CRUD) project, simulates a Back Office of an ice cream parlor chain,<br/>
with Machine Learning supervises the transactions to generate sales predictions.

The project demonstrates the use of the following technologies:

🟤 **Client side (Front end):** React, Bootstrap, Chart.js, Font Awesome, and more...<br/>
🔵 **Server side (Back end):** Node.js, Express, SQL, NoSQL (MongoDB), and more...<br/>
🟢 **Architectural design patterns:** Model View Controller, and more...<br/>
🟠 **Machine Learning:** BigML

Code: https://github.com/YitshakS/ice-cloud/tree/main<br/>
Client: https://YitshakS.github.io/ice-cloud<br/>
Server: http://ice-cloud.tikshoret.net<br/>
Demo video: https://youtu.be/tb1q-Ou0TH4?t=2

---

In order to run this entire project on your PC or server, you need to create an ".env" file in the "server" folder, copy the following content into it, and fill in the missing fields:

```
IMS_GOV_IL_AUTHORIZATION=

BIGML_USERNAME=
BIGML_API_KEY=
BIGML_LOG_FILE=/tmp/bigml.log

MONGODB_URL=
MONGODB_COLLECTION_BRANCHES=branches
MONGODB_COLLECTION_FLAVORS=flavors
MONGODB_COLLECTION_ML=ml
MONGODB_COLLECTION_TRANSACTIONS=transactions

MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_HOST=
MYSQL_DATABASE=
```

In order to run the "client" folder on your server as production, update the ".env.production" file in the "client" folder at your server address.
