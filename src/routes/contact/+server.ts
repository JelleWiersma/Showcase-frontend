/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    // Parse the JSON data manually
    const data = JSON.parse(await request.text());

    // Get the domain from an environment variable
    const domain = process.env.NODE_ENV === 'production' ? process.env.PROD_API_DOMAIN : process.env.DEV_API_DOMAIN;
    console.log(data);
    // Send a POST request to the server API
    // const response = await fetch(`${domain}/contact`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // });

    // if (!response.ok) {
    //     throw new Error('Failed to send data to the server API');
    // }

    const response = new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response;
};