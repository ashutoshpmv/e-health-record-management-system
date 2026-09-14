const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        throw new Error("ENCRYPTION_KEY is missing in .env");
    }

    if (!/^[0-9a-fA-F]{64}$/.test(key)) {
        throw new Error(
            "ENCRYPTION_KEY must be exactly 64 hexadecimal characters"
        );
    }

    const buffer = Buffer.from(key, "hex");

    if (buffer.length !== KEY_LENGTH) {
        throw new Error("ENCRYPTION_KEY must be 32 bytes");
    }

    return buffer;
};

const encrypt = (text) => {
    if (text === undefined || text === null || text === "") {
        return text;
    }

    const key = getEncryptionKey();

    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(String(text), "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
        iv: iv.toString("base64"),
        content: encrypted,
        authTag: authTag.toString("base64")
    });
};

const decrypt = (encryptedData) => {
    if (
        encryptedData === undefined ||
        encryptedData === null ||
        encryptedData === ""
    ) {
        return encryptedData;
    }

    try {
        const key = getEncryptionKey();

        const data =
            typeof encryptedData === "string"
                ? JSON.parse(encryptedData)
                : encryptedData;

        const iv = Buffer.from(data.iv, "base64");
        const authTag = Buffer.from(data.authTag, "base64");

        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            key,
            iv
        );

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(
            data.content,
            "base64",
            "utf8"
        );

        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error.message);

        return "[Unable to decrypt]";
    }
};

module.exports = {
    encrypt,
    decrypt
};