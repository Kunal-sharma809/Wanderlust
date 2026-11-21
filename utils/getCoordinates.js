
// Forward Geocoding

async function getCoordinates(place) {
    try {
        const url = new URL(
            "https://nominatim.openstreetmap.org/search"
        );

        url.searchParams.set("q", place);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "1");

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Wanderlust/1.0"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error("Location not found");
        }

        const location = data[0];

        return {
            type: "Point",
            coordinates: [
                Number(location.lon),
                Number(location.lat)
            ]
        };

    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error;
    }
}

module.exports = getCoordinates;