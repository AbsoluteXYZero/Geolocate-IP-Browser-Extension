let latestGeoLocation = null;
const lp = new LocalStorageProvider();
let ipv4Error = false;
let currentIPv4 = null;
const countriesSupported = ['AD', 'BA', 'BY', 'CV', 'ET', 'GN', 'IM', 'KR', 'MD', 'MW', 'PA', 'RU', 'ST', 'TT', 'WS', 'AE', 'BB', 'BZ', 'CW', 'EU', 'GQ', 'IN', 'KW', 'ME', 'MX', 'PE', 'RW', 'SV', 'TV', 'YE', 'AF', 'BD', 'CA', 'CX', 'FI', 'GR', 'IQ', 'KY', 'MF', 'MY', 'PF', 'SA', 'SX', 'TW', 'YT', 'AG', 'BE', 'CC', 'CY', 'FJ', 'GS', 'IR', 'KZ', 'MG', 'MZ', 'PG', 'SB', 'SY', 'TZ', 'ZA', 'AI', 'BF', 'CD', 'CZ', 'FK', 'GT', 'IS', 'LA', 'MH', 'NA', 'PH', 'SC', 'SZ', 'UA', 'ZM', 'AL', 'BG', 'CF', 'DE', 'FM', 'GU', 'IS', 'IT', 'LB', 'MK', 'NC', 'PK', 'SD', 'TC', 'UG', 'ZW', 'AM', 'BH', 'CG', 'DJ', 'FO', 'GW', 'JE', 'LC', 'ML', 'NE', 'PL', 'SE', 'TD', 'US', 'AN', 'BI', 'CH', 'DK', 'FR', 'GY', 'JM', 'LI', 'MM', 'NF', 'PN', 'SG', 'TF', 'UY', 'AO', 'BJ', 'CI', 'DM', 'GA', 'HK', 'JO', 'LK', 'MN', 'NG', 'PR', 'SH', 'TG', 'UZ', 'AQ', 'BL', 'CK', 'DO', 'GB', 'HN', 'JP', 'LR', 'MO', 'NI', 'PS', 'SI', 'TH', 'VA', 'AR', 'BM', 'CL', 'DZ', 'GD', 'HR', 'KE', 'LS', 'MP', 'NL', 'PT', 'SK', 'TJ', 'VC', 'AS', 'BN', 'CM', 'EC', 'GE', 'HT', 'KG', 'LT', 'MQ', 'NO', 'PW', 'SL', 'TK', 'VE', 'AT', 'BO', 'CN', 'EE', 'GG', 'HU', 'KH', 'LU', 'MR', 'NP', 'PY', 'SM', 'TL', 'VG', 'AU', 'BR', 'CO', 'EG', 'GH', 'IC', 'KI', 'LV', 'MS', 'NR', 'QA', 'SN', 'TM', 'VI', 'AW', 'BS', 'CR', 'EH', 'GI', 'ID', 'KM', 'LY', 'MT', 'NU', 'RE', 'SO', 'TN', 'VN', 'AX', 'BT', 'CT', 'ER', 'GL', 'IE', 'KN', 'MA', 'MU', 'NZ', 'RO', 'SR', 'TO', 'VU', 'AZ', 'BW', 'CU', 'ES', 'GM', 'IL', 'KP', 'MC', 'MV', 'OM', 'RS', 'SS', 'TR', 'WF'];
const checkInterval = 4000;

function updateTitle() {
    chrome.action.setTitle({ title: currentIPv4 ? 'IPv4: ' + currentIPv4 : 'IP Address & Geolocation' });
}

async function setBadgeText(text) {
    let showText = await lp.isSet(KEY_SETTINGS_SHOW_TEXT) ? await lp.get(KEY_SETTINGS_SHOW_TEXT) : true;
    if (showText) {
        chrome.action.setBadgeText({ text: text });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

function setBadgeTextColor(color) {
    if (typeof chrome.action.setBadgeTextColor === "function") // only firefox
        chrome.action.setBadgeTextColor({ color: color });
}

function setBadgeColor(color) {
    chrome.action.setBadgeBackgroundColor({ color: color });
}

async function setIcon(country_code) {
    let showFlags = await lp.isSet(KEY_SETTINGS_SHOW_FLAGS) ? await lp.get(KEY_SETTINGS_SHOW_FLAGS) : true;
    if (country_code == "ERR" || !showFlags || !(countriesSupported.includes(country_code))) {
        chrome.action.setIcon({ path: "img/icon48.png" });
    } else {
        chrome.action.setIcon({ path: "img/flags/48/" + country_code + ".png" });
    }
}

async function checkForLocationChange(geoLocation) {
    if (latestGeoLocation == null) {
        latestGeoLocation = geoLocation;
        return;
    }

    let checkForNotifications = await lp.isSet(KEY_SETTINGS_NOTIFICATION) ? await lp.get(KEY_SETTINGS_NOTIFICATION) : true;

    if (checkForNotifications && (latestGeoLocation.get('geoLocation').ipAddress !== geoLocation.get('geoLocation').ipAddress)) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'ip_changed',
                    from: latestGeoLocation.get('geoLocation').ipAddress,
                    to: geoLocation.get('geoLocation').ipAddress
                });
            }
        });
    }

    latestGeoLocation = geoLocation;
}

async function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            ipv4Error = false;
            currentIPv4 = geoLocate.get('geoLocation').ipAddress || null;
            updateTitle();
            checkForLocationChange(geoLocate);
            var country_code = geoLocate.get('geoLocation').countryCode || 'ERR';
            setBadgeText(country_code);
            setIcon(country_code);
        },
        error: function () {
            ipv4Error = true;
            setBadgeText('ERR');
            setIcon('ERR');
        }
    });
}

async function getCurrentIP() {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
        clearTimeout(timer);
        if (!response.ok) return null;
        const data = await response.json();
        return data.ip || null;
    } catch (e) {
        return null;
    }
}

async function checkIP() {
    const ip = await getCurrentIP();
    if (!ip) return;
    if (ip !== currentIPv4) {
        await fetchGeoLocation();
    }
}

function showChromeNotification(id, title, message, contextMessage, callback) {
    chrome.notifications.create(id, { type: 'basic', iconUrl: 'img/icon128.png', title: title, message: message, contextMessage: contextMessage }, callback);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "refresh") {
        fetchGeoLocation().then(() => { sendResponse({ data: 'refreshed' }); });
    }
    return true;
});

setBadgeColor('#000000');
setBadgeTextColor('#ffffff');
setBadgeText('...');
fetchGeoLocation();

let intval;

function startInterval() {
    if (!intval) {
        intval = setInterval(checkIP, checkInterval);
    }
}

function stopInterval() {
    if (intval) {
        clearInterval(intval);
        intval = null;
    }
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkIntervalAlarm') {
        stopInterval();
        startInterval();
    }
});

chrome.runtime.onSuspend.addListener(function () {
    stopInterval();
});

chrome.runtime.onInstalled.addListener(() => {
    startInterval();
    chrome.alarms.create('checkIntervalAlarm', { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
    startInterval();
    chrome.alarms.create('checkIntervalAlarm', { periodInMinutes: 1 });
});
