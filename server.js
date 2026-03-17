const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

const LOG_FILE = "za_filebrain.log";

// قراءة اللوق
function parseLog() {
    if (!fs.existsSync(LOG_FILE)) return [];

    const lines = fs.readFileSync(LOG_FILE, "utf-8").split("\n");
    const data = [];

    const regex = /(\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}).*?(doGet|احصل على)/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const date = match[1];
            const func = match[2];
            const hour = parseInt(date.split(" ")[1].split(":")[0]);
            data.push({ hour, func });
        }
    });

    return data;
}

// API endpoint
app.get("/api/logs", (req, res) => {
    const data = parseLog();

    const result = {};

    data.forEach(item => {
        if (!result[item.hour]) result[item.hour] = 0;
        result[item.hour]++;
    });

    res.json(result);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
