#!/usr/bin/env node

const os = require('node:os');

const networkInterfaces = os.networkInterfaces();

const getNetworkAddress = () => {
    for (const interfaceDetails of Object.values(networkInterfaces)) {
        if (!interfaceDetails)
            continue;
        for (const details of interfaceDetails) {
            const { address, family, internal } = details;
            if (family === "IPv4" && !internal)
                return address;
        }
    }
};

module.exports = {
    getNetworkAddress
}