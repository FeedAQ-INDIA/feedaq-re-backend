require("dotenv").config();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');


const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const commonRoute = require("./src/routes/common.route.js");
const authRoute = require("./src/routes/auth.route.js");
const app = express();
const port = process.env.PORT || 8080;
const db = require("./src/entity");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("./google_oauth.js");
require("./microsoft_oauth.js");
const logger = require('./src/config/winston.config.js')
const {seed} = require("./src/controller/DummyInsert");
const multer = require("multer");
const sharp = require("sharp");
const axios = require("axios");


const swaggerOptions = {
    definition: {
        openapi: "3.1.0", info: {
            title: "FeedAQ Academy",
            version: "0.1.0",
            description: "This is made with Express and documented with Swagger",
            license: {
                name: "MIT", url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "FeedAQ", url: "https://gcs.feedaq.com", email: "info@email.com",
            },
        }, servers: [{
            url: "http://localhost:3000",
        },],
    }, apis: ["./src/routes/common.route.js", "./server.js", "./src/controller/*.js", "./src/model/*.js",],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));

app.use(cors({
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN, // Update this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
}));
app.use(cookieParser());
app.use(bodyParser.json());

// db.Agent.sync({ alter: true });

// db.sequelize.sync({alter:true}).then(() => {
//     console.log("Drop and re-sync db.");
// });


// app.use(function (req, res, next) {
//     // console.log("Req type : " + req.method + ' : ' + req)
//     res.setHeader("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
// });

app.use(commonRoute);
app.use(authRoute);



// Supabase configuration
const SUPABASE_URL = "https://your-project-id.supabase.co";  // Replace
const SUPABASE_API_KEY = "your-service-role-key";            // Replace
const BUCKET_NAME = "your-bucket-name";                      // Replace

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload multiple files
app.post("/upload", upload.array("files", 10), async (req, res) => {
    try {
        const uploadedUrls = [];

        for (const file of req.files) {
            const { buffer, originalname, mimetype } = file;
            const ext = path.extname(originalname);
            const nameWithoutExt = path.basename(originalname, ext);
            const fileId = Math.random();
            const filename = `${fileId}-${nameWithoutExt}${ext}`;

            let fileBuffer = buffer;
            let contentType = mimetype;

            // Compress if image
            if (mimetype.startsWith("image/")) {
                fileBuffer = await sharp(buffer)
                    .resize({ width: 1024 })
                    .jpeg({ quality: 70 })
                    .toBuffer();
                contentType = "image/jpeg";
            }

            const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filename}`;

            const response = await axios.put(uploadUrl, fileBuffer, {
                headers: {
                    Authorization: `Bearer ${SUPABASE_API_KEY}`,
                    "Content-Type": contentType,
                    "x-upsert": "true",
                },
            });

            if (response.status !== 200) {
                throw new Error(`Failed to upload: ${originalname}`);
            }

            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
            uploadedUrls.push({ name: originalname, url: publicUrl });
        }

        res.json({ success: true, files: uploadedUrls });
    } catch (error) {
        console.error("Upload error:", error.message);
        res.status(500).json({ error: "Upload failed" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});

// seed();

// seedDatabase();