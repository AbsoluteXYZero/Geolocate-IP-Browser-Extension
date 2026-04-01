const APIS = [
    {
        url: 'https://ipinfo.io/json',
        normalize: (d) => ({
            browser: { userAgent: navigator.userAgent },
            geoLocation: {
                ipAddress: d.ip || '',
                countryCode: d.country || '',
                countryName: d.country || '',
                city: d.city || '',
                state: d.region || '',
                stateCode: '',
                continent: '',
                continentCode: '',
                timezone: d.timezone || '',
                latitude: d.loc ? parseFloat(d.loc.split(',')[0]) : 0,
                longitude: d.loc ? parseFloat(d.loc.split(',')[1]) : 0
            }
        })
    },
    {
        url: 'https://ipapi.co/json/',
        normalize: (d) => ({
            browser: { userAgent: navigator.userAgent },
            geoLocation: {
                ipAddress: d.ip || '',
                countryCode: d.country_code || '',
                countryName: d.country_name || '',
                city: d.city || '',
                state: d.region || '',
                stateCode: d.region_code || '',
                continent: '',
                continentCode: d.continent_code || '',
                timezone: d.timezone || '',
                latitude: d.latitude || 0,
                longitude: d.longitude || 0
            }
        })
    },
    {
        url: 'https://ipwho.is/',
        normalize: (d) => ({
            browser: { userAgent: navigator.userAgent },
            geoLocation: {
                ipAddress: d.ip || '',
                countryCode: d.country_code || '',
                countryName: d.country || '',
                city: d.city || '',
                state: d.region || '',
                stateCode: d.region_code || '',
                continent: d.continent || '',
                continentCode: d.continent_code || '',
                timezone: d.timezone?.id || '',
                latitude: d.latitude || 0,
                longitude: d.longitude || 0
            }
        })
    },
    {
        url: 'https://freeipapi.com/api/json',
        normalize: (d) => ({
            browser: { userAgent: navigator.userAgent },
            geoLocation: {
                ipAddress: d.ipAddress || '',
                countryCode: d.countryCode || '',
                countryName: d.countryName || '',
                city: d.cityName || '',
                state: d.regionName || '',
                stateCode: '',
                continent: '',
                continentCode: d.continentCode || '',
                timezone: Array.isArray(d.timeZones) ? d.timeZones[0] : '',
                latitude: d.latitude || 0,
                longitude: d.longitude || 0
            }
        })
    }
];

async function fetchWithFallback(options = {}) {
    for (const api of APIS) {
        try {
            const response = await fetch(api.url);
            if (!response.ok) continue;
            const data = await response.json();
            if (!data || (!data.ip && !data.ipAddress && !data.country && !data.country_code)) continue;
            return api.normalize(data);
        } catch (e) {
            continue;
        }
    }
    if (options.error) options.error();
    return null;
}

class GeoLocation {
    constructor() {
        this.data = {
            browser: { userAgent: '' },
            geoLocation: {
                ipAddress: '', countryCode: '', countryName: '',
                city: '', state: '', stateCode: '',
                continent: '', continentCode: '',
                timezone: '', latitude: 0, longitude: 0
            }
        };
    }

    get(key) {
        return this.data[key];
    }

    fetch(options = {}) {
        fetchWithFallback(options).then(data => {
            if (data) {
                this.data = data;
                if (options.success) options.success();
            }
        });
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.data));
    }
}

class GeoLocation6 {
    constructor() {
        this.data = {
            browser: { userAgent: '' },
            geoLocation: {
                ipAddress: '', countryCode: '', countryName: '',
                city: '', state: '', stateCode: '',
                continent: '', continentCode: '',
                timezone: '', latitude: 0, longitude: 0
            }
        };
    }

    get(key) {
        return this.data[key];
    }

    fetch(options = {}) {
        fetchWithFallback(options).then(data => {
            if (data) {
                this.data = data;
                if (options.success) options.success();
            }
        });
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.data));
    }
}
