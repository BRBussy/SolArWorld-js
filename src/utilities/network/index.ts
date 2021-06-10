export async function downloadBlob(url: string, headers?: Headers): Promise<Blob> {
    const response = await fetch(
        url,
        {
            headers: headers,
            method: 'GET',
            mode: 'cors'
        },
    );

    console.log(response)

    return await response.blob();
}