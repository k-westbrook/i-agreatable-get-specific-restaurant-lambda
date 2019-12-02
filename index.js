var { Client } = require('pg')
const client = new Client({
  host: process.env.HOST_REFERENCE,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD_REFERENCE,
  database: process.env.DATABASE_NAME
});

client.connect();

exports.handler = async function (event) {
  try {


    let results = await client.query(`WITH CTE AS (SELECT First.restaurant_id, First.restaurant_name, Second.location_name,First.restaurant_neighborhood,First.photo_url,First.review,First.food_type,First.rating FROM public."restaurant" AS First LEFT JOIN public."restaurant_location" AS Second  ON First.restaurant_location = Second.location_id),CTE2 AS(SELECT CTE.restaurant_id, CTE.restaurant_name,CTE.location_name, Third.neighborhood_name,CTE.photo_url,CTE.review, CTE.rating, CTE.food_type FROM CTE LEFT JOIN public."restaurant_neighborhood" AS Third ON CTE.restaurant_neighborhood = Third.neighborhood_id) SELECT CTE2.restaurant_id,CTE2.restaurant_name, CTE2.location_name, CTE2.neighborhood_name, CTE2.photo_url, CTE2.review, CTE2.rating, Fourth.food_type FROM CTE2 LEFT JOIN public."restaurant_food_type" AS Fourth ON Fourth.food_type_id = CTE2.food_type WHERE CTE2.restaurant_id =${event.pathParameters.restaurantId};`);

    let response =
    {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(results.rows),
    };
    return response;

  } catch (err) {
    return err;
  }
}
